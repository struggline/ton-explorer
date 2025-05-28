import { Block } from "../../../../generated/prisma";
import prisma from "../../../common/db/client";
import { PartialBlockId } from "../../../ton/lib/types";
import { BlockWithMaybeShards, GetPaginatedBlocksQuery, SerializableBlockWithRelations } from "./block.types";

export function prepareBlock(block: BlockWithMaybeShards): SerializableBlockWithRelations {
    if (block.shardBlocks) {
        const blocks = block.shardBlocks.map((b) => prepareBlock(b));

        return {
            ...block,
            startLt: block.startLt.toString(),
            endLt: block.endLt.toString(),
            shardBlocks: blocks
        };
    } else {
        const { shardBlocks, ...rest } = block;

        return {
            ...rest,
            startLt: block.startLt.toString(),
            endLt: block.endLt.toString()
        };
    }
}

export function getBlockById(blockId: PartialBlockId) {
    return prisma.block.findUnique({
        where: {
            workchain_shard_seqno_isCanonical: {
                workchain: blockId.workchain,
                shard: blockId.shard,
                seqno: blockId.seqno,
                isCanonical: true
            }
        },
        include: {
            shardBlocks: true
        }
    });
}

export function getBlocksWithPagination(pagination: GetPaginatedBlocksQuery) {
    return prisma.block.findMany({
        where: {
            workchain: pagination.workchain
        },
        orderBy: {
            seqno: "desc"
        },
        include: {
            _count: {
                select: { transactions: true }
            }
        },
        skip: pagination.offset,
        take: pagination.limit
    });
}
