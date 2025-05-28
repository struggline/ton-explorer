export interface BlockId {
    workchain: number;
    shard: string;
    seqno: number;
}

export interface Block {
    id: number;
    globalId: number;
    workchain: number;
    shard: string;
    seqno: number;
    startLt: string;
    endLt: string;
    genUtime: number;
    rootHash: string;
    fileHash: string;
    version: number;
    flags: number;
    afterMerge: boolean;
    afterSplit: boolean;
    beforeSplit: boolean;
    wantMerge: boolean;
    wantSplit: boolean;
    genValidatorListHashShort: string;
    genCatchainSeqno: number;
    minRefMcSeqno: number;
    keyBlock: boolean;
    prevKeyBlockSeqno: number;
    vertSeqNo: number;

    shardBlocks?: Omit<Block, "shardBlocks">[];
}

export type Transaction = {
    id: number;
    opCode: string | null;
    address: string;
    dest: string | null;
    lt: string;
    hash: string;
    prevTransactionHash: string;
    prevTransactionLt: string;
    now: number;
    amount: string;
    inMessage: any;
    blockId: number;
    accountId: number | null;
};

export type BlockWithTxCount = Block & {
    transactionCount: number;
};

export type Account = {
    address: string;
    id: number;
    balance: string;
};

export type BlockchainStats = {
    blockchainHeight: number;
    blockTime: number;
    transactionCount: number;
    tps: number;
    nftTransfers: number;
    nftTpm: number;
    jettonTransfers: number;
    jettonTpm: number;
    transactionGraph: { minute: Date; count: number }[];
    accountGraph: { minute: Date; count: number }[];
    masterchainGraph: { minute: Date; count: number }[];
    workchainGraph: { minute: Date; count: number }[];
};
