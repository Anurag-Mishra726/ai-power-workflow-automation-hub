import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { AiIntegrationSchema } from "../schemas/aiIntegration.schema.js";
import { validateRequest } from "../middlewares/validate.middleware.js";
import {
  addApiKeyController,
  getApiKeyController,
  getAllApiKeysController,
  updateApiKeyController,
  deleteApiKeyController
} from "../controllers/aiIntegration.controller.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/add/apikey", validateRequest(AiIntegrationSchema), addApiKeyController);
router.get("/get/apikey/:provider", getApiKeyController);
router.get("/get/all/apikey", getAllApiKeysController);
router.put("/update/apikey", validateRequest(AiIntegrationSchema), updateApiKeyController);
router.delete("/delete/apikey/:provider", deleteApiKeyController);

export default router;