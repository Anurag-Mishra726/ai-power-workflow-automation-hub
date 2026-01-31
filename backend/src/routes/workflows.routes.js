import express from "express";
import {authMiddleware} from "../middlewares/auth.middleware.js";
import { validateRequest } from "../middlewares/validate.middleware.js";
import { SaveWorkflowSchema } from "../schemas/workflow.schema.js";
import { saveWorkflow, workflowMetadata } from "../controllers/workflow.controllers.js"

const router = express.Router();

router.use(authMiddleware);

router.get("/metadata", workflowMetadata);
router.post("/save", validateRequest(SaveWorkflowSchema), saveWorkflow);

export default router;  
