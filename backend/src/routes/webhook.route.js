import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
  manualExecuteWorkflow,
  googleFormExecuteWorkflow,
} from "../controllers/webhook.controllers.js";
import { handleGithubWebhook } from "../controllers/integration/github.webhook.controller.js";

const router = express.Router();

router.post("/:workflowId/execute", authMiddleware, manualExecuteWorkflow);
router.post("/google-form/:workflowId/", googleFormExecuteWorkflow);
router.post("/github", handleGithubWebhook);

export default router;
