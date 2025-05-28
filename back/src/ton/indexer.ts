import SuperJSON from "superjson";
import { LiteClient, LiteEngine, LiteRoundRobinEngine, LiteSingleEngine } from "ton-lite-client";
import prisma from "../common/db/client";
import { getBlockMetadata } from "./fetchers/getBlockMetadata";
import { getBlockTransations } from "./fetchers/getBlockTransactions";
import { bigIntToBuffer, intToIP, toUnsignedHex64 } from "./lib/utils/data";
import { Address } from "@ton/core";
import { logger } from "../common/logger";

export async function scanMansterchainFromSeqno(seqno: number) {
    const liteClient = await setupLiteClient();

    let masterchainInfo = await liteClient.getMasterchainInfo();

    while (true) {
        const targetSeqno = masterchainInfo.last.seqno;
        // const targetSeqno = 47924732;

        for (let currentSeqno = seqno; currentSeqno < targetSeqno; currentSeqno++) {
            logger.info(`PROCESSING BLOCK ${currentSeqno}`);
            await processMasterchainBlock(liteClient, currentSeqno);
        }

        await new Promise((resolve) => setTimeout(resolve, 5000));
        masterchainInfo = await liteClient.getMasterchainInfo();
        break;
    }
}

async function setupLiteClient() {
    const confRes = await fetch("https://ton.org/global.config.json");
    const conf = await confRes.json();
    const servers = conf.liteservers;

    const engines: LiteEngine[] = [];
    for (const server of servers) {
        engines.push(
            new LiteSingleEngine({
                host: `tcp://${intToIP(server.ip)}:${server.port}`,
                publicKey: Buffer.from(server.id.key, "base64")
            })
        );
    }

    const engine: LiteEngine = new LiteRoundRobinEngine(engines);
    return new LiteClient({ engine });
}

async function processMasterchainBlock(liteClient: LiteClient, seqno: number) {
    const masterBlock = await liteClient.lookupBlockByID({
        workchain: -1,
        shard: "-9223372036854775808",
        seqno: seqno
    });
    const allShardsResponse = await liteClient.getAllShardsInfo(masterBlock.id);
    const shards = [
        { workchain: masterBlock.id.workchain, shard: masterBlock.id.shard, seqno: masterBlock.id.seqno },
        ...Object.entries(allShardsResponse.shards).flatMap(([workchain, shards]) =>
            Object.entries(shards).map(([shard, seqno]) => ({
                workchain: +workchain,
                shard,
                seqno
            }))
        )
    ];

    let masterBlockId: number = 0;

    for (const shard of shards) {
        const blockHeader = await liteClient.lookupBlockByID(shard);
        const blockMetadata = await getBlockMetadata(liteClient, blockHeader.id);

        let canonicalBlockId;
        try {
            canonicalBlockId = (
                await prisma.block.update({
                    where: {
                        workchain_shard_seqno_isCanonical: {
                            workchain: blockHeader.id.workchain,
                            shard: toUnsignedHex64(BigInt(blockHeader.id.shard)),
                            seqno: blockHeader.id.seqno,
                            isCanonical: true
                        }
                    },
                    data: {
                        isCanonical: false
                    }
                })
            ).id;
        } catch (err) {}

        const block = await prisma.block.create({
            data: {
                globalId: blockMetadata.global_id,
                workchain: blockHeader.id.workchain,
                shard: toUnsignedHex64(BigInt(blockHeader.id.shard)),
                seqno: blockHeader.id.seqno,
                rootHash: blockHeader.id.rootHash.toString("base64"),
                fileHash: blockHeader.id.fileHash.toString("base64"),
                startLt: blockMetadata.info.start_lt,
                endLt: blockMetadata.info.end_lt,
                genUtime: blockMetadata.info.gen_utime,
                version: blockMetadata.info.version,
                flags: blockMetadata.info.flags,
                afterMerge: Boolean(blockMetadata.info.after_merge),
                afterSplit: Boolean(blockMetadata.info.after_split),
                beforeSplit: Boolean(blockMetadata.info.before_split),
                wantMerge: blockMetadata.info.want_merge.value,
                wantSplit: blockMetadata.info.want_split.value,
                genValidatorListHashShort: blockMetadata.info.gen_validator_list_hash_short.toString(),
                genCatchainSeqno: blockMetadata.info.gen_catchain_seqno,
                minRefMcSeqno: blockMetadata.info.min_ref_mc_seqno,
                keyBlock: blockMetadata.info.key_block.value,
                prevKeyBlockSeqno: blockMetadata.info.prev_key_block_seqno,
                vertSeqNo: blockMetadata.info.vert_seq_no,
                masterBlock: blockHeader.id.workchain === -1 ? undefined : { connect: { id: masterBlockId } }
            }
        });

        if (canonicalBlockId) {
            await prisma.transaction.updateMany({
                where: {
                    blockId: canonicalBlockId
                },
                data: {
                    blockId: block.id
                }
            });

            await prisma.block.delete({
                where: {
                    id: canonicalBlockId
                }
            });
        }

        if (blockHeader.id.workchain === -1) {
            masterBlockId = block.id;
        }

        const blockTransactions = await getBlockTransations(liteClient, blockHeader.id);

        for (const tx of blockTransactions) {
            let acc;
            let fullAddress: Address;

            try {
                fullAddress = new Address(blockHeader.id.workchain, bigIntToBuffer(tx.address));

                acc = await prisma.account.findUnique({
                    where: {
                        address: fullAddress.toRawString()
                    }
                });

                if (!acc) {
                    const accState = await liteClient.getAccountState(fullAddress, blockHeader.id);

                    acc = await prisma.account.create({
                        data: {
                            address: fullAddress.toRawString(),
                            balance: accState.balance.coins.toString(),
                            firstTx: tx.now
                        }
                    });
                }
            } catch (err) {
                logger.error(err);
                continue;
            }

            let dest = undefined;

            if (tx.inMessage && tx.inMessage.info.dest) {
                if (tx.inMessage.info.dest instanceof Address) {
                    dest = tx.inMessage.info.dest.toRawString();
                } else {
                    dest = tx.inMessage.info.dest.toString();
                }
            }

            await prisma.transaction.create({
                data: {
                    opCode: tx.inMessage?.opCode,
                    address: fullAddress.toRawString(),
                    dest: dest,
                    lt: tx.lt,
                    hash: tx.hash,
                    prevTransactionHash: tx.prevTransactionHash.toString(),
                    prevTransactionLt: tx.prevTransactionLt,
                    now: tx.now,
                    amount: tx.inMessage && "value" in tx.inMessage?.info ? tx.inMessage.info.value.coins : 0,
                    inMessage: tx.inMessage ? SuperJSON.stringify(tx.inMessage.body) : undefined,
                    block: {
                        connect: { id: block.id }
                    },

                    account: acc
                        ? {
                              connect: {
                                  id: acc.id
                              }
                          }
                        : undefined
                }
            });
        }
    }
}
