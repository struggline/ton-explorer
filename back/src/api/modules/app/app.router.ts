import { Router } from "express";
import { getBlockchainStats } from "./app.controller";

const appRouter = Router();

appRouter.get("/stats", getBlockchainStats);

export default appRouter;
