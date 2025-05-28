import { Address, Cell, loadTransaction } from "@ton/core";
import { BlockID, LiteClient } from "ton-lite-client";
import { Functions, liteServer_blockTransactions, liteServer_transactionId3 } from "ton-lite-client/dist/schema";
import { logger } from "../../common/logger";
import { loadMessage } from "../loaders";
import { LoadedTransaction } from "../loaders/types";

export async function getBlockTransations(client: LiteClient, block: BlockID) {
    const transactions: LoadedTransaction[] = [];

    let incomplete = true;
    let after: liteServer_transactionId3 | undefined = undefined;

    while (incomplete) {
        const rawTransactions = await client.listBlockTransactions(block, {
            mode: after ? 0b11000111 : 0b111,
            count: 100,
            after: after
        });

        incomplete = rawTransactions.incomplete;
        const last = rawTransactions.ids[rawTransactions.ids.length - 1];

        if (incomplete && last.account && last.lt) {
            after = { kind: "liteServer.transactionId3", account: last.account, lt: last.lt };
        } else {
            if (incomplete) {
                logger.error(
                    `transactions incomplete but last tx is invalid ${block.workchain} ${block.shard} ${block.seqno}`
                );

                break;
            }
        }

        for (const tx of rawTransactions.ids) {
            if (!tx.account || !tx.lt) continue;

            const txAddr = new Address(block.workchain, tx.account);
            const fullTx = await client.getAccountTransaction(txAddr, tx.lt, block);

            const txCell = Cell.fromBoc(fullTx.transaction);
            const loadedTx = loadTransaction(txCell[0].beginParse());

            if (loadedTx.inMessage) {
                const mes = loadMessage(loadedTx.inMessage);

                transactions.push({ ...loadedTx, hash: loadedTx.hash().toString("base64"), inMessage: mes });
            }

            transactions.push({ ...loadedTx, hash: loadedTx.hash().toString("base64"), inMessage: undefined });
        }
    }

    return transactions.sort((a, b) => a.now - b.now);
}
