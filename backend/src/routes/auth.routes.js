import express from "express";
import {authSignupSchema, authLoginSchema} from "../schemas/auth.schema.js";
import {signup, login} from "../controllers/auth.controller.js";
import {validateRequest} from "../middlewares/validate.middleware.js";

const router = express.Router();

router.post("/signup", validateRequest(authSignupSchema), signup);
router.post("/login", validateRequest(authLoginSchema), login);

export default router; 