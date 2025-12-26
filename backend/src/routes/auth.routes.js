import express from "express";
import {authSignupSchema, authLoginSchema} from "../validations/auth.schema.js";
import {signup, login} from "../controller/auth.controller.js";
import {validateRequest} from "../middleware/validate.middleware.js";

const router = express.Router();

router.post("/signup", validateRequest(authSignupSchema), signup);
router.post("/login", validateRequest(authLoginSchema), login);

export default router; 