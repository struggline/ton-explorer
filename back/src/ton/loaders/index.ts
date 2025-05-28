import { Message, MessageRelaxed, Slice } from "@ton/core";
import {
    TEXT_COMMENT_OPCODE,
    JETTON_EXCESSES_OPCODE,
    JETTON_INTERNAL_TRANSFER_OPCODE,
    JETTON_TRANSFER_NOTIFICATION_OPCODE,
    JETTON_TRANSFER_OPCODE,
    WALLET_SIGNED_EXTERNAL_OPCODE,
    NFT_TRANSFER_OPCODE
} from "../lib/opcodes";
import { loadJettonExcessesMsgBody } from "./jetton/jetton-excesses";
import { loadJettonInternalTransferMsgBody } from "./jetton/jetton-internal-transfer";
import { loadJettonTransferMsgBody } from "./jetton/jetton-transfer";
import { loadJettonTransferNotificationMsgBody } from "./jetton/jetton-transfer-notification";
import { LoadedMessage, MessageBody } from "./types";
import { loadWalletExternalSignedMsgBody } from "./wallet/wallet-external-signed";
import { logger } from "../../common/logger";
import { loadTextComment } from "./general/loadTextComment";
import { loadNftTransferMsgBody } from "./nft/nft-transfer";

const opCodeLoaderMap: Record<number, (slice: Slice) => MessageBody> = {
    [JETTON_EXCESSES_OPCODE]: loadJettonExcessesMsgBody,
    [JETTON_INTERNAL_TRANSFER_OPCODE]: loadJettonInternalTransferMsgBody,
    [JETTON_TRANSFER_OPCODE]: loadJettonTransferMsgBody,
    [JETTON_TRANSFER_NOTIFICATION_OPCODE]: loadJettonTransferNotificationMsgBody,
    [WALLET_SIGNED_EXTERNAL_OPCODE]: loadWalletExternalSignedMsgBody,
    [TEXT_COMMENT_OPCODE]: loadTextComment,
    [NFT_TRANSFER_OPCODE]: loadNftTransferMsgBody
};

export function loadMessages(messages: Message[]) {
    return messages.map((m) => loadMessage(m));
}

export function loadMessage<T extends Message | MessageRelaxed>(message: T): LoadedMessage<T> | undefined {
    const slice = message.body.beginParse();
    if (slice.remainingBits < 32) {
        logger.info("mala");
        return;
    }
    const opCode = slice.preloadUint(32);

    const loader = opCodeLoaderMap[opCode];
    if (!loader) {
        logger.warn(`Unknown opcode: 0x${opCode.toString(16)}`, message.info.src);
        return undefined;
    }

    let body: MessageBody | undefined = undefined;

    try {
        body = loader(slice);
    } catch {
        logger.error(`failed to load message`);
    }

    return { ...message, opCode, body } as never as LoadedMessage<T>;
}

export function verifyOpCode<T extends number>(slice: Slice, expectedOpCode: T): T {
    const op = slice.loadUint(32);
    if (op !== expectedOpCode) {
        throw new Error(`Expected opcode: ${expectedOpCode.toString(16)}. Received: ${op}`);
    }

    return op as T;
}
