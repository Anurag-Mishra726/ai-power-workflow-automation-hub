import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { 
    manualExecuteWorkflow, 
    googleFormExecuteWorkflow,
} from "../controllers/webhook.controllers.js";

const router = express.Router();

router.post("/:workflowId/execute", authMiddleware, manualExecuteWorkflow)
router.post("/google-form/:workflowId/", googleFormExecuteWorkflow);

export default router

//TODO: Check the user auth(if we can) sort structure of mannual execution and webhook execution. We can have separate controller for webhook execution and manual execution.