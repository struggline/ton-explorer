import { WALLET_SIGNED_EXTERNAL } from "../../opcodes";

export interface WalletExternalSignedMessageBody {
    op: typeof WALLET_SIGNED_EXTERNAL;
    walletId: number;
    validUntil: number;
    seqno: number;
    outActions: any[];
    signature: string;
}

export type WalletMessageBody = WalletExternalSignedMessageBody;
