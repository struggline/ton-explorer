import { Address } from "@ton/core";
import prisma from "../../../common/db/client";

export function getAccountByAddr(addr: Address) {
    return prisma.account.findUnique({
        where: {
            address: addr.toRawString()
        }
    });
}
