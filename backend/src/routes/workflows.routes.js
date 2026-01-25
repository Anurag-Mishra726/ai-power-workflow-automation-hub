import express from "express";
import {authMiddleware} from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/save", (req, res) => {
    console.log(req.body);
    res.json({
        message: "Workflow saved successfully!",
        success: true,
    });
});

export default router;  