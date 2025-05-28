import cors from "cors";
import express from "express";
import { errorMiddleware } from "./middlewares";
import accountRouter from "./modules/account/account.router";
import appRouter from "./modules/app/app.router";
import blockRouter from "./modules/block/block.router";
import transactionRouter from "./modules/transaction/transaction.router";
import { getStats } from "./modules/app/app.service";

const app = express();
app.use(
    cors({
        origin: "*",
        credentials: true
    })
);
app.use(express.json());

app.use("/api/", appRouter);
app.use("/api/block", blockRouter);
app.use("/api/transaction", transactionRouter);
app.use("/api/account", accountRouter);

app.use(errorMiddleware);

export default app;
