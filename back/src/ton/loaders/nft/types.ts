import { Address, Cell, ExternalAddress } from "@ton/core";
import { Either, Maybe } from "./nft-transfer";
import { NFT_TRANSFER_OPCODE } from "../../lib/opcodes";

export interface NftTransferMsgBody {
    op: typeof NFT_TRANSFER_OPCODE;
    queryId: bigint;
    newOwner: Address | ExternalAddress | null;
    responseDestination: Address | ExternalAddress | null;
    customPayload: Maybe<Cell>;
    forwardAmount: bigint;
    forwardPayload: Either<Cell, Cell>;
}

export type NftMessageBody = NftTransferMsgBody;
