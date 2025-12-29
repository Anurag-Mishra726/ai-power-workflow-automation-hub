import express from "express";
import {authMiddleware} from "../middlewares/auth.middleware.js";


const router = express.Router();

router.use(authMiddleware);

router.get("/profile", (req, res) => {
    res.send("User profile data 😶‍🌫️");
})

export default router;
