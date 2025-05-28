import { Slice } from "@ton/core";
import { JETTON_INTERNAL_TRANSFER_OPCODE } from "../../lib/opcodes";
import { JettonInternalTransferMessageBody } from "./types";
import { verifyOpCode } from "..";

/*
internal_transfer query_id:uint64 amount:VarUInteger 16 from:MsgAddress response_address:MsgAddress
                  forward_ton_amount:VarUInteger 16 forward_payload:Either Cell ^Cell = InternalMsgBody
*/
export function loadJettonInternalTransferMsgBody(slice: Slice): JettonInternalTransferMessageBody {
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
