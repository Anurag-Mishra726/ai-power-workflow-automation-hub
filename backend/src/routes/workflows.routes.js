import express from "express";
import {authMiddleware} from "../middlewares/auth.middleware.js";
import { validateRequest } from "../middlewares/validate.middleware.js";
import { SaveWorkflowSchema } from "../schemas/workflow.schema.js";
import {getWorkflowId, saveWorkflow, workflowMetadata, workflowGraphData } from "../controllers/workflow.controllers.js"

const router = express.Router();

router.use(authMiddleware);

router.get("/get-id", getWorkflowId);
router.get("/metadata", workflowMetadata);
router.get("/graph", workflowGraphData);
router.post("/save", validateRequest(SaveWorkflowSchema), saveWorkflow);

export default router;  
