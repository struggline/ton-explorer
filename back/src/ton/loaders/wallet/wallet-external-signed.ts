import { loadOutList, Slice } from "@ton/core";
import { loadMessage, verifyOpCode } from "..";
import { WALLET_SIGNED_EXTERNAL_OPCODE } from "../../lib/opcodes";
import { WalletExternalSignedMessageBody } from "./types";

export function loadWalletExternalSignedMsgBody(slice: Slice): WalletExternalSignedMessageBody {
    const op = verifyOpCode(slice, WALLET_SIGNED_EXTERNAL_OPCODE);

    const walletId = slice.loadUint(32);
    const validUntil = slice.loadUint(32);
    const seqno = slice.loadUint(32);
    const maybeRef = slice.loadBit();

    let outActions: WalletExternalSignedMessageBody["outActions"] = [];

    if (maybeRef) {
        const ref = slice.loadRef();
        const outList = loadOutList(ref.beginParse());

        for (const action of outList) {
            if (action.type === "sendMsg") {
                const msg = loadMessage(action.outMsg);

                if (!msg) continue;

                outActions.push({ ...action, outMsg: msg });
            }
        }
    }

    const extended = slice.loadBit();

    const signature = !extended ? slice.loadBuffer(slice.remainingBits / 8) : Buffer.from("");

    return {
        op,
        walletId,
        validUntil,
        seqno,
        outActions,
        signature: signature.toString("hex")
    };
}
