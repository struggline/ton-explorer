import { Message, MessageRelaxed, Transaction } from "@ton/core";
import { JettonMessageBody } from "./jetton/types";
import { WalletMessageBody } from "./wallet/types";
import { GeneralMessageBody } from "./general/types";
import { NftMessageBody } from "./nft/types";
import { Merge } from "ts-essentials";

export type MessageBody = JettonMessageBody | WalletMessageBody | GeneralMessageBody | NftMessageBody;

export type LoadedMessage<T extends Message | MessageRelaxed> = Merge<
    T,
    { opCode: number; body: MessageBody | undefined }
>;

export type LoadedTransaction = Merge<Transaction, { inMessage?: LoadedMessage<Message>; hash: string }>;
