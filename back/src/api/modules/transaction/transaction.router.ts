import { Router } from "express";
import { getLatestTransactions, getTransactionsForAccount, getTransactionsForBlock } from "./transaction.controller";

const transactionRouter = Router();

transactionRouter.get("/latest", getLatestTransactions);
transactionRouter.get("/for-block", getTransactionsForBlock);
transactionRouter.get("/for-account", getTransactionsForAccount);

export default transactionRouter;
