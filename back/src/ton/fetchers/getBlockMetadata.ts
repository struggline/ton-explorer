import { Cell } from "@ton/core";
import { LiteClient } from "ton-lite-client";
import { PartialBlockId } from "../lib/types";
import { loadBlock } from "../loaders/block/block";

export async function getBlockMetadata(client: LiteClient, blockId: PartialBlockId) {
    const blockHeader = await client.lookupBlockByID(blockId);

    const prunedCell = Cell.fromBoc(blockHeader.headerProof)[0];
    const blockCell = prunedCell.refs[0];

    const block = loadBlock(blockCell.beginParse());

    return block;
}
