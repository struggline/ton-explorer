import { Address } from "@ton/core";
import { Transaction } from "../../../../generated/prisma";
import prisma from "../../../common/db/client";
import { PartialBlockId } from "../../../ton/lib/types";
import { Pagination } from "../../types";

export function prepareTransaction(transaction: Transaction) {
    return {
        ...transaction,
        opCode: transaction.opCode?.toString(),
        lt: transaction.lt.toString(),
        prevTransactionLt: transaction.prevTransactionLt.toString(),
        amount: transaction.amount.toString()
    };
}

export function getLatestPaginatedTransactions(pagination: Pagination) {
    return prisma.transaction.findMany({
        orderBy: {
            now: "desc"
        },
        skip: pagination.offset,
        take: pagination.limit
    });
}

export function getPaginatedTransactionsForBlock(blockId: PartialBlockId, pagination: Pagination) {
    return prisma.transaction.findMany({
        where: {
            block: {
                workchain: blockId.workchain,
                seqno: blockId.seqno,
                shard: blockId.shard,
                isCanonical: true
            }
        },
        orderBy: {
            now: "desc"
        },
        skip: pagination.offset,
        take: pagination.limit
    });
}

export function getPaginatedTransactionsForAccount(address: Address, pagination: Pagination) {
    return prisma.transaction.findMany({
        where: {
            account: {
                address: address.toRawString()
            }
        },
        orderBy: {
            now: "desc"
        },
        skip: pagination.offset,
        take: pagination.limit
    });
}
