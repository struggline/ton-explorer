import { Slice } from "@ton/core";
import { JETTON_INTERNAL_TRANSFER_OPCODE } from "../../opcodes";
import { JettonInternalTransferMessageBody } from "./types";
import { verifyOpCode } from "..";

export function loadJettonInternalTransferMessageBody(slice: Slice): JettonInternalTransferMessageBody {
    const op = verifyOpCode(slice, JETTON_INTERNAL_TRANSFER_OPCODE);

    const queryId = slice.loadUintBig(64);
    const amount = slice.loadCoins();
    const from = slice.loadAddress();
    const responseAddress = slice.loadAddress();
    const forwardTonAmount = slice.loadCoins();
    const eitherPayload = slice.loadBoolean();
    const forwardPayload = eitherPayload ? slice.loadRef() : slice.asCell();

    return {
        op,
        queryId,
        amount,
        from,
        responseAddress,
        forwardTonAmount,
        forwardPayload
    };
}
