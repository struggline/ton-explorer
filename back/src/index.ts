import { Address, Cell, loadShardStateUnsplit, loadTransaction } from "@ton/core";
import { LiteClient, LiteEngine, LiteRoundRobinEngine, LiteSingleEngine } from "ton-lite-client";
import { loadMessage, loadMessages } from "./ton/loaders";
import { version } from "os";

function intToIP(int: number) {
    var part1 = int & 255;
    var part2 = (int >> 8) & 255;
    var part3 = (int >> 16) & 255;
    var part4 = (int >> 24) & 255;

    return part4 + "." + part3 + "." + part2 + "." + part1;
}

function bigIntToBuffer(data: bigint | undefined) {
    if (!data) {
        return Buffer.from([]);
    }
    const hexStr = data.toString(16);
    const pad = hexStr.padStart(64);
    const hashHex = Buffer.from(pad, "hex");

    return hashHex;
}

(async () => {
    console.log("\n---------------------------------------------------------------------------------------------\n");
    console.log("\n---------------------------------------------------------------------------------------------\n");

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
    const client = new LiteClient({ engine });
    const master = await client.getMasterchainInfo();

    const address = Address.parse("UQDotGtHnpC7KNXJtld7RXhsXTVlSdzuShe5q71o5L6aHaeh");
    const accountState = await client.getAccountState(address, master.last);

    // if (accountState.lastTx) {
    //     let lastTxLt = accountState.lastTx.lt.toString();
    //     let lastTxHash = bigIntToBuffer(accountState.lastTx.hash);

    //     const temp = await client.getAccountTransactions(address, lastTxLt, lastTxHash, 2);

    //     const cell = Cell.fromBoc(temp.transactions);

    //     const transactions = cell.map((c) => {
    //         const tx = loadTransaction(c.beginParse());

    //         let loadedInMessage = tx.inMessage ? loadMessage(tx.inMessage) : undefined;
    //         let loadedOutMessages = loadMessages(tx.outMessages.values());

    //         return { ...tx, inMessage: loadedInMessage, outMessages: loadedOutMessages };
    //     });
    // }

    const block = await client.getFullBlock(46976599);
    const lookup = await client.lookupBlockByID({
        seqno: master.last.seqno,
        shard: master.last.shard,
        workchain: master.last.workchain
    });
    const header = await client.getBlockHeader({
        seqno: block.shards[0].seqno,
        shard: block.shards[0].shard,
        workchain: block.shards[0].workchain,
        fileHash: block.shards[0].fileHash,
        rootHash: block.shards[0].rootHash
    });

    console.log(header);

    const cells = Cell.fromBoc(header.headerProof);

    const proofCell = cells[0];
    const cell = proofCell.refs[0];
    console.log(cell);

    const slice = cell.beginParse();

    // const infoRef = slice.loadRef();
    // const infoSlice = infoRef.beginParse();

    // const a = infoSlice.loadInt(32);
    // console.log(a);

    // const info = {
    //     version: infoSlice.loadUint(32),
    //     notMaster: infoSlice.loadBit(),
    //     afterMerge: infoSlice.loadBit(),
    //     beforeSplit: infoSlice.loadBit(),
    //     afterSplit: infoSlice.loadBit(),
    //     wantSplit: infoSlice.loadBoolean(),
    //     wantMerge: infoSlice.loadBoolean(),
    //     keyBlock: infoSlice.loadBoolean(),
    //     vertSeqnoInc: infoSlice.loadBit(),
    //     flags: infoSlice.loadUint(8)
    // };

    // console.log(header);

    // console.log(header.id.rootHash.toString("base64"));

    // console.log(id);
    // console.log(info);
})();
