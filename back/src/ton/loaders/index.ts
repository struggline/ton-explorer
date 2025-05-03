import { Message, MessageRelaxed, Slice } from "@ton/core";
import {
    JETTON_EXCESSES_OPCODE,
    JETTON_INTERNAL_TRANSFER_OPCODE,
    JETTON_TRANSFER_NOTIFICATION_OPCODE,
    JETTON_TRANSFER_OPCODE,
    WALLET_SIGNED_EXTERNAL
} from "../opcodes";
import { loadJettonExcessesMessageBody } from "./jetton/jetton-excesses";
import { loadJettonInternalTransferMessageBody } from "./jetton/jetton-internal-transfer";
import { loadJettonTransferMessageBody } from "./jetton/jetton-transfer";
import { loadJettonTransferNotificationMessageBody } from "./jetton/jetton-transfer-notification";
import { LoadedMessage, MessageBody } from "./types";
import { loadWalletExternalSignedMessageBody } from "./wallet/wallet-external-signed";

const opCodeLoaderMap: Record<number, (slice: Slice) => MessageBody> = {
    [JETTON_EXCESSES_OPCODE]: loadJettonExcessesMessageBody,
    [JETTON_INTERNAL_TRANSFER_OPCODE]: loadJettonInternalTransferMessageBody,
    [JETTON_TRANSFER_OPCODE]: loadJettonTransferMessageBody,
    [JETTON_TRANSFER_NOTIFICATION_OPCODE]: loadJettonTransferNotificationMessageBody,
    [WALLET_SIGNED_EXTERNAL]: loadWalletExternalSignedMessageBody
};

export function loadMessages(messages: Message[]) {
    return messages.map((m) => loadMessage(m));
}

export function loadMessage<T extends Message | MessageRelaxed>(message: T): LoadedMessage<T> | undefined {
    const opCode = message.body.beginParse().loadUint(32);

    const loader = opCodeLoaderMap[opCode];
    if (!loader) {
        console.log(`Unknown opcode: ${opCode}`);
        return undefined;
    }

    return { ...message, body: loader(message.body.beginParse()) };
}

export function verifyOpCode<T extends number>(slice: Slice, expectedOpCode: T): T {
    const op = slice.loadUint(32);

    if (op !== expectedOpCode) {
        throw new Error(`Expected opcode: ${expectedOpCode.toString(16)}. Received: ${op}`);
    }

    return op as T;
}
