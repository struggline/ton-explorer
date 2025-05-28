import { MarkOptional, Merge } from "ts-essentials";
import z from "zod";
import { Block, Prisma } from "../../../../generated/prisma";
import { getPaginatedBlocksQuerySchema } from "./block.schema";

export type GetPaginatedBlocksQuery = z.infer<typeof getPaginatedBlocksQuerySchema>;

const blockWithShards = Prisma.validator<Prisma.BlockDefaultArgs>()({
    include: { shardBlocks: true }
});

export type BlockWithMaybeShards = MarkOptional<Prisma.BlockGetPayload<typeof blockWithShards>, "shardBlocks">;

type SerializableBlock = Merge<
    Block,
    {
        startLt: string;
        endLt: string;
    }
>;

export type SerializableBlockWithRelations = SerializableBlock & {
    shardBlocks?: SerializableBlock[];
};
