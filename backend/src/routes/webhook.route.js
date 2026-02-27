import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { executeWorkflow } from "../controllers/workflow.controllers.js"

const router = express.Router();

//router.use(authMiddleware);

router.post("/google-form/:workflowId/",executeWorkflow);

export default router

//TODO: Check the user auth(if we can) sort structure of mannual execution and webhook execution. We can have separate controller for webhook execution and manual execution.