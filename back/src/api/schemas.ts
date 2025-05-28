import z from "zod";

export const paginationSchema = z.object({
    offset: z.coerce.number(),
    limit: z.coerce.number()
});

export const partialBlockIdSchema = z.object({
    workchain: z.coerce.number(),
    shard: z.string(),
    seqno: z.coerce.number()
});

export const addressSchema = z.object({
    address: z.string()
});
