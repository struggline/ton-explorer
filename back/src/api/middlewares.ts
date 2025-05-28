import { NextFunction, Request, Response } from "express";
import { HttpError } from "./errors";
import { ZodError } from "zod";
import { logger } from "../common/logger";

export function errorMiddleware(err: Error, req: Request, res: Response, next: NextFunction) {
    if ("statusCode" in err && typeof err.statusCode === "number" && err.statusCode >= 400 && err.statusCode < 500) {
        //Non-critical errors, maybe log somewhere
    } else {
        logger.error(err);
    }

    if (err instanceof HttpError) {
        return res.status(err.statusCode).json({
            message: err.message
        });
    } else if (err instanceof ZodError) {
        logger.warn(err);

        return res.status(400).json({
            message: "Invalid request"
        });
    } else {
        return res.status(500).json({
            message: "Something went wrong"
        });
    }
}
