import { Slice } from "@ton/core";
import { TextCommentMessageBody } from "./types";
import { TEXT_COMMENT_OPCODE } from "../../lib/opcodes";

export function loadTextComment(slice: Slice): TextCommentMessageBody {
    const comment = slice.loadBuffer(Math.round(slice.remainingBits / 8)).toString("utf-8");

    return {
        op: TEXT_COMMENT_OPCODE,
        comment
    };
}
