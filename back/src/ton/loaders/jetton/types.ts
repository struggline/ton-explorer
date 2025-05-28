import { Address, Cell } from "@ton/core";
import {
    JETTON_EXCESSES_OPCODE,
    JETTON_INTERNAL_TRANSFER_OPCODE,
    JETTON_TRANSFER_NOTIFICATION_OPCODE,
    JETTON_TRANSFER_OPCODE
} from "../../lib/opcodes";

export interface JettonExcessesMessageBody {
    op: typeof JETTON_EXCESSES_OPCODE;
    queryId: bigint;
}

export interface JettonInternalTransferMessageBody {
    op: typeof JETTON_INTERNAL_TRANSFER_OPCODE;
    queryId: bigint;
    amount: bigint;
    from: Address;
    responseAddress: Address | null;
    forwardTonAmount: bigint;
    forwardPayload: Cell | null;
}

export interface JettonTransferNotificationMessageBody {
    op: typeof JETTON_TRANSFER_NOTIFICATION_OPCODE;
    queryId: bigint;
    amount: bigint;
    sender: Address;
    forwardPayload: Cell | null;
}

export interface JettonTransferMessageBody {
    op: typeof JETTON_TRANSFER_OPCODE;
    queryId: bigint;
    amount: bigint;
    destination: Address;
    responseDestination: Address | null;
    customPayload: Cell | null;
    forwardAmount: bigint;
    forwardPayload: Cell | null;
}

export type JettonMessageBody =
    | JettonExcessesMessageBody
    | JettonInternalTransferMessageBody
    | JettonTransferNotificationMessageBody
    | JettonTransferMessageBody;
