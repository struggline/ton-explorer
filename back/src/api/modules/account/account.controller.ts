import { Address } from "@ton/core";
import { NextFunction, Request, Response } from "express";
import { HttpError } from "../../errors";
import { addressSchema } from "../../schemas";
import { AccountAddress } from "../../types";
import { getAccountByAddr } from "./account.service";

export async function getAccount(
    req: Request<unknown, unknown, unknown, AccountAddress>,
    res: Response,
    next: NextFunction
) {
    try {
        const { address } = addressSchema.parse(req.query);

        let addr: Address | undefined;

        if (Address.isAddress(address) || Address.isFriendly(address)) {
            addr = Address.parse(address);
        } else if (Address.isRaw(address)) {
            addr = Address.parseRaw(address);
        }

        if (!addr) {
            throw new HttpError("Invalid address", 400);
        }

        const account = await getAccountByAddr(addr);

        res.json(account);
    } catch (err) {
        next(err);
    }
}
