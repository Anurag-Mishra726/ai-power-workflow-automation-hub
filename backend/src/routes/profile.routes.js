import express from "express";
import {authMiddleware} from "../middlewares/auth.middleware.js";
import { getProfile, deleteProfile } from "../controllers/profile.controller.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/profile", getProfile);
router.delete("/profile", deleteProfile);

export default router;
