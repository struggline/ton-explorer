import { Message, MessageRelaxed, OutAction } from "@ton/core";
import { JettonMessageBody } from "./jetton/types";
import { WalletMessageBody } from "./wallet/types";

export type MessageBody = JettonMessageBody | WalletMessageBody;

export type LoadedMessage<T extends Message | MessageRelaxed> = Omit<T, "body"> & { body: MessageBody };
