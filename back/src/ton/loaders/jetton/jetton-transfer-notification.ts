import { Slice } from "@ton/core";
import { verifyOpCode } from "..";
import { JETTON_TRANSFER_NOTIFICATION_OPCODE } from "../../opcodes";
import { JettonTransferNotificationMessageBody } from "./types";

export function loadJettonTransferNotificationMessageBody(slice: Slice): JettonTransferNotificationMessageBody {
    const op = verifyOpCode(slice, JETTON_TRANSFER_NOTIFICATION_OPCODE);

    const queryId = slice.loadUintBig(64);
    const amount = slice.loadCoins();
    const sender = slice.loadAddress();
    const eitherPayload = slice.loadBoolean();
    const forwardPayload = eitherPayload ? slice.loadRef() : slice.asCell();

    return {
        op,
        queryId,
        amount,
        sender,
        forwardPayload
    };
}
