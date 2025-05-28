import { Router } from "express";
import { getBlock, getPaginatedBlocks } from "./block.controller";

const blockRouter = Router();

blockRouter.get("/", getBlock);
blockRouter.get("/pagination", getPaginatedBlocks);

export default blockRouter;
