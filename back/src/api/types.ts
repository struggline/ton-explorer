import z from "zod";
import { addressSchema, paginationSchema } from "./schemas";

export type Pagination = z.infer<typeof paginationSchema>;

export type AccountAddress = z.infer<typeof addressSchema>;
