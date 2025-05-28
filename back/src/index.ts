import app from "./api/api";
import { scanMansterchainFromSeqno } from "./ton/indexer";

(async () => {
    console.log("\n---------------------------------------------------------------------------------------------\n");
    console.log("\n---------------------------------------------------------------------------------------------\n");

    app.listen(8080);
    // scanMansterchainFromSeqno(47924731);

    // const confRes = await fetch("https://ton.org/global.config.json");
    // const conf = await confRes.json();
    // const servers = conf.liteservers;

    // const engines: LiteEngine[] = [];
    // for (const server of servers) {
    //     engines.push(
    //         new LiteSingleEngine({
    //             host: `tcp://${intToIP(server.ip)}:${server.port}`,
    //             publicKey: Buffer.from(server.id.key, "base64")
    //         })
    //     );
    // }
    // const engine: LiteEngine = new LiteRoundRobinEngine(engines);
    // const client = new LiteClient({ engine });
    // const master = await client.getMasterchainInfo();

    // console.log(master);

    // const full = await client.getFullBlock(master.last.seqno);
    // console.log(full);
    // const address = Address.parse("UQDotGtHnpC7KNXJtld7RXhsXTVlSdzuShe5q71o5L6aHaeh");
    // const accountState = await client.getAccountState(address, master.last);

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

    // const transactions = await getBlockTransations(
    //     {
    //         seqno: 47564970,
    //         shard: "8000000000000000",
    //         workchain: -1
    //     },
    //     client
    // );

    // const block = await getBlockMetadata(
    //     {
    //         seqno: 47564970,
    //         shard: "8000000000000000",
    //         workchain: -1
    //     },
    //     client
    // );
})();
