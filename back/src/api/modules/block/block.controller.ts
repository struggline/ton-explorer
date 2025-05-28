import { NextFunction, Request, Response } from "express";
import { HttpError } from "../../errors";
import { getPaginatedBlocksQuerySchema } from "./block.schema";
import { getBlockById, getBlocksWithPagination, prepareBlock } from "./block.service";
import {} from "./block.types";
import { Pagination } from "../../types";
import { partialBlockIdSchema } from "../../schemas";
import { PartialBlockId } from "../../../ton/lib/types";

export async function getBlock(
    req: Request<unknown, unknown, unknown, PartialBlockId>,
    res: Response,
    next: NextFunction
) {
    try {
        const blockId = partialBlockIdSchema.parse(req.query);

        const block = await getBlockById(blockId);

        if (!block) {
            throw new HttpError("Block not found", 404);
        }

        res.json(prepareBlock(block));
    } catch (err) {
        next(err);
    }
}

export async function getPaginatedBlocks(
    req: Request<unknown, unknown, unknown, Pagination>,
    res: Response,
    next: NextFunction
) {
    try {
        const pagination = getPaginatedBlocksQuerySchema.parse(req.query);

        const blocks = await getBlocksWithPagination(pagination);

        res.json(
            blocks.map((b) => {
                const { _count, ...block } = b;

                return {
                    ...prepareBlock(block),
                    transactionCount: _count.transactions
                };
            })
        );
    } catch (err) {
        next(err);
    }
}
