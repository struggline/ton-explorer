import { Slice } from "@ton/core";
import { JETTON_EXCESSES_OPCODE } from "../../lib/opcodes";
import { JettonExcessesMessageBody } from "./types";
import { verifyOpCode } from "..";

export function loadJettonExcessesMsgBody(slice: Slice): JettonExcessesMessageBody {
    const op = verifyOpCode(slice, JETTON_EXCESSES_OPCODE);

    let queryId = slice.loadUintBig(64);
    return {
        op,
        queryId
    };
}
