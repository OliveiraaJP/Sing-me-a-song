import { Router } from "express";
import e2eTestsController from "../controllers/e2eTestsController.js";

const e2eRouter = Router();

e2eRouter.post("/reset", e2eTestsController.reset);

export default e2eRouter;