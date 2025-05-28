import { apiInstance } from "./apiInstance";
import type { Account, Block, BlockchainStats, BlockId, BlockWithTxCount, Transaction } from "./types";

export async function getBlock(blockId: BlockId): Promise<Block> {
    const response = await apiInstance.get(
        `/api/block?workchain=${blockId.workchain}&shard=${blockId.shard}&seqno=${blockId.seqno}`
    );

    return response.data;
}

export async function getBlocks(workchain: number, offset: number, limit: number): Promise<BlockWithTxCount[]> {
    const response = await apiInstance.get(
        `/api/block/pagination?workchain=${workchain}&offset=${offset}&limit=${limit}`
    );

    return response.data;
}

export async function getLatestTransactions(offset: number, limit: number): Promise<Transaction[]> {
    const response = await apiInstance.get(`/api/transaction/latest?offset=${offset}&limit=${limit}`);

    return response.data;
}

export async function getTransactionsForBlock(blockId: BlockId, offset: number, limit: number): Promise<Transaction[]> {
    const response = await apiInstance.get(
        `/api/transaction/for-block?workchain=${blockId.workchain}&shard=${blockId.shard}&seqno=${blockId.seqno}&offset=${offset}&limit=${limit}`
    );

    return response.data;
}

export async function getTransactionsForAccount(addr: string, offset: number, limit: number): Promise<Transaction[]> {
    const response = await apiInstance.get(
        `/api/transaction/for-account?address=${addr}&offset=${offset}&limit=${limit}`
    );

    return response.data;
}

export async function getAccount(addr: string): Promise<Account> {
    const response = await apiInstance.get(`/api/account?address=${addr}`);

    return response.data;
}

export async function getBlockchainStats(): Promise<BlockchainStats> {
    const response = await apiInstance.get(`/api/stats`);

    return response.data;
}
