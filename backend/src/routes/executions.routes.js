import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { executionDetail, executionList } from "../controllers/execution.controllers.js";

const router = express.Router();

router.use(authMiddleware);
router.get("/", executionList);
router.get("/:id", executionDetail);

export default router;
