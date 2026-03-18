import express from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { startOAuth, handleOAuthCallback } from "../../controllers/integration/OAuth/auth.integration.controller.js";

const router = express.Router();

//router.use(authMiddleware);

router.get("/oauth/:provider/connect", startOAuth);
router.get("/oauth/:provider/callback", handleOAuthCallback);

export default router;
