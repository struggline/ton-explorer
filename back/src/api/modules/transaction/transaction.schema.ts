import { addressSchema, paginationSchema, partialBlockIdSchema } from "../../schemas";

export const getTransactionsForBlockSchema = partialBlockIdSchema.merge(paginationSchema);

export const getTransactionsForAccountSchema = addressSchema.merge(paginationSchema);
