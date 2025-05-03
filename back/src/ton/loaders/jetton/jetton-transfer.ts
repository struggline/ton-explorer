import { Slice } from "@ton/core";
import { verifyOpCode } from "..";
import { JETTON_TRANSFER_OPCODE } from "../../opcodes";
import { JettonTransferMessageBody } from "./types";

export function loadJettonTransferMessageBody(slice: Slice): JettonTransferMessageBody {
    const op = verifyOpCode(slice, JETTON_TRANSFER_OPCODE);

    const queryId = slice.loadUintBig(64);
    const amount = slice.loadCoins();
    const to = slice.loadAddress();
    const responseDestination = slice.loadMaybeAddress();
    const customPayload = slice.loadMaybeRef();
    const forwardAmount = slice.loadCoins();
    const eitherPayload = slice.loadBoolean();
    const forwardPayload = eitherPayload ? slice.loadRef() : slice.asCell();

    return {
        op,
        queryId,
        amount,
        destination: to,
        responseDestination,
        customPayload,
        forwardAmount,
        forwardPayload
    };
}
