import { NextFunction, Request, Response } from "express";
import { getStats } from "./app.service";

export async function getBlockchainStats(req: Request, res: Response, next: NextFunction) {
    try {
        const stats = await getStats();

        res.json(stats);
    } catch (err) {
        next(err);
    }
}
