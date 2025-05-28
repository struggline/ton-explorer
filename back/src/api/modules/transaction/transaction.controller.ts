import { NextFunction, Request, Response } from "express";
import { paginationSchema } from "../../schemas";
import { Pagination } from "../../types";
import {
    getLatestPaginatedTransactions,
    getPaginatedTransactionsForAccount,
    getPaginatedTransactionsForBlock,
    prepareTransaction
} from "./transaction.service";
import { GetTransactionsForAccount, GetTransactionsForBlock } from "./transaction.types";
import { getTransactionsForAccountSchema, getTransactionsForBlockSchema } from "./transaction.schema";
import { Address } from "@ton/core";
import { HttpError } from "../../errors";

export async function getLatestTransactions(
    req: Request<unknown, unknown, unknown, Pagination>,
    res: Response,
    next: NextFunction
) {
    try {
        const pagination = paginationSchema.parse(req.query);

        const transactions = await getLatestPaginatedTransactions(pagination);

        res.json(transactions.map((t) => prepareTransaction(t)));
    } catch (err) {
        next(err);
    }
}

export async function getTransactionsForBlock(
    req: Request<unknown, unknown, unknown, GetTransactionsForBlock>,
    res: Response,
    next: NextFunction
) {
    try {
        const { offset, limit, ...blockId } = getTransactionsForBlockSchema.parse(req.query);

        const transactions = await getPaginatedTransactionsForBlock(blockId, { offset, limit });

        res.json(transactions.map((t) => prepareTransaction(t)));
    } catch (err) {
        next(err);
    }
}

export async function getTransactionsForAccount(
    req: Request<unknown, unknown, unknown, GetTransactionsForAccount>,
    res: Response,
    next: NextFunction
) {
    try {
        const { offset, limit, address } = getTransactionsForAccountSchema.parse(req.query);

        let addr: Address | undefined;

        if (Address.isAddress(address) || Address.isFriendly(address)) {
            addr = Address.parse(address);
        } else if (Address.isRaw(address)) {
            addr = Address.parseRaw(address);
        }

        if (!addr) {
            throw new HttpError("Invalid address", 400);
        }

        const transactions = await getPaginatedTransactionsForAccount(addr, { offset, limit });

        res.json(transactions.map((t) => prepareTransaction(t)));
    } catch (err) {
        next(err);
    }
}
