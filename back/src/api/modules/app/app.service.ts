import prisma from "../../../common/db/client";
import { JETTON_TRANSFER_OPCODE, NFT_TRANSFER_OPCODE } from "../../../ton/lib/opcodes";

export async function getStats() {
    const height = await prisma.block.findFirst({
        where: {
            workchain: -1
        },
        orderBy: {
            seqno: "desc"
        },
        select: {
            seqno: true
        }
    });

    const lastBlocksGenTime = await prisma.block.findMany({
        where: {
            workchain: -1
        },
        orderBy: {
            seqno: "desc"
        },
        select: {
            genUtime: true
        },
        take: 2
    });

    const blockTime = Math.abs(lastBlocksGenTime[0].genUtime - lastBlocksGenTime[1].genUtime);

    const transactionCount = await prisma.transaction.count();

    const tps = await prisma.$queryRaw<{ count: bigint }[]>`
        SELECT COUNT(*)
        FROM public."Transaction"
        WHERE now >= (
            SELECT now - 1
            FROM public."Transaction"
            ORDER BY now DESC
            LIMIT 1
        );
    `;

    const nftTransfers = await prisma.transaction.count({
        where: {
            opCode: NFT_TRANSFER_OPCODE
        }
    });

    const nftTpm = await prisma.$queryRaw<{ count: bigint }[]>`
        SELECT COUNT(*)
        FROM public."Transaction"
        WHERE "opCode" = ${NFT_TRANSFER_OPCODE} AND now >= (
            SELECT now - ${60}
            FROM public."Transaction"
            ORDER BY now DESC
            LIMIT 1
        );
    `;

    const jettonTransfers = await prisma.transaction.count({
        where: {
            opCode: JETTON_TRANSFER_OPCODE
        }
    });

    const jettonTpm = await prisma.$queryRaw<{ count: bigint }[]>`
        SELECT COUNT(*)
        FROM public."Transaction"
        WHERE "opCode" = ${JETTON_TRANSFER_OPCODE} AND now >= (
            SELECT now - ${60}
            FROM public."Transaction"
            ORDER BY now DESC
            LIMIT 1
        );
    `;

    const transactionGraph = await prisma.$queryRaw<{ minute: Date; count: bigint }[]>`
        SELECT 
            minute,
            SUM(count_per_minute) OVER (ORDER BY minute) AS count
        FROM (
            SELECT 
                date_trunc('minute', TO_TIMESTAMP("now")) AS minute,
                COUNT(*) AS count_per_minute
            FROM public."Transaction"
            GROUP BY minute
        ) AS per_minute
        ORDER BY minute;
    `;

    const accountGraph = await prisma.$queryRaw<{ minute: Date; count: bigint }[]>`
        SELECT 
            minute,
            SUM(count_per_minute) OVER (ORDER BY minute) AS count
        FROM (
            SELECT 
                date_trunc('minute', TO_TIMESTAMP("firstTx")) AS minute,
                COUNT(*) AS count_per_minute
            FROM public."Account"
            GROUP BY minute
        ) AS per_minute
        ORDER BY minute;
    `;

    const masterchainGraph = await prisma.$queryRaw<{ minute: Date; count: bigint }[]>`
        SELECT 
            date_trunc('minute', TO_TIMESTAMP("genUtime")) AS minute,
            COUNT(*) AS count
        FROM public."Block" 
        WHERE workchain = -1
        GROUP BY minute
        ORDER BY minute;
    `;

    const workchainGraph = await prisma.$queryRaw<{ minute: Date; count: bigint }[]>`
        SELECT 
            date_trunc('minute', TO_TIMESTAMP("genUtime")) AS minute,
            COUNT(*) AS count
        FROM public."Block" 
        WHERE workchain = 0
        GROUP BY minute
        ORDER BY minute;
    `;

    return {
        blockchainHeight: height?.seqno,
        blockTime,
        transactionCount,
        tps: Number(tps[0].count),
        nftTransfers,
        nftTpm: Number(nftTpm[0].count),
        jettonTransfers,
        jettonTpm: Number(jettonTpm[0].count),
        transactionGraph: transactionGraph.map((p) => ({ minute: p.minute, count: Number(p.count) })),
        accountGraph: accountGraph.map((p) => ({ minute: p.minute, count: Number(p.count) })),
        masterchainGraph: masterchainGraph.map((p) => ({ minute: p.minute, count: Number(p.count) })),
        workchainGraph: workchainGraph.map((p) => ({ minute: p.minute, count: Number(p.count) }))
    };
}
