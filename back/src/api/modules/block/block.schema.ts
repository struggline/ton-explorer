import z from "zod";
import { paginationSchema, partialBlockIdSchema } from "../../schemas";

export const getPaginatedBlocksQuerySchema = partialBlockIdSchema
    .pick({
        workchain: true
    })
    .merge(paginationSchema);
