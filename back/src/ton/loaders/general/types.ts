import { TEXT_COMMENT_OPCODE } from "../../lib/opcodes";

export interface TextCommentMessageBody {
    op: typeof TEXT_COMMENT_OPCODE;
    comment: string;
}

export type GeneralMessageBody = TextCommentMessageBody;
