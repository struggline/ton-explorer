import { WALLET_SIGNED_EXTERNAL_OPCODE } from "../../lib/opcodes";

export interface WalletExternalSignedMessageBody {
    op: typeof WALLET_SIGNED_EXTERNAL_OPCODE;
    walletId: number;
    validUntil: number;
    seqno: number;
    outActions: any[];
    signature: string;
}

export type WalletMessageBody = WalletExternalSignedMessageBody;
