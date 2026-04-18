import express from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { startOAuth, handleOAuthCallback } from "../../controllers/integration/OAuth/auth.integration.controller.js";
import { getIntegrationController } from "../../controllers/integration/crud/crud.integration.controller.js";

const router = express.Router();

//router.use(authMiddleware);

router.get("/oauth/:provider/connect", authMiddleware, startOAuth);
router.get("/oauth/:provider/callback", handleOAuthCallback);
router.get("/:provider/get/integration", authMiddleware ,getIntegrationController);

export default router;
