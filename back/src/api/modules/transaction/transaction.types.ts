import z from "zod";
import { getTransactionsForAccountSchema, getTransactionsForBlockSchema } from "./transaction.schema";

export type GetTransactionsForBlock = z.infer<typeof getTransactionsForBlockSchema>;

export type GetTransactionsForAccount = z.infer<typeof getTransactionsForAccountSchema>;
