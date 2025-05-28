import { BlockID } from "ton-lite-client";

export type PartialBlockId = Pick<BlockID, "workchain" | "seqno" | "shard">;
