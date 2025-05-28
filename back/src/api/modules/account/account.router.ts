import { Router } from "express";
import { getAccount } from "./account.controller";

const accountRouter = Router();

accountRouter.get("/", getAccount);

export default accountRouter;
