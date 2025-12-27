import express from "express";
import {authMiddleware} from "../middlewares/auth.middleware.js";


const router = express.Router();

router.use(authMiddleware);

router.get("/profile", (req, res) => {
    res.send("User profile data 😶‍🌫️");
})

export default router;

/* 
curl --location "http://localhost:5000/api/user/profile" --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTRmYzc2NzkwZGRkMTNmMzkzY2IyNDEiLCJlbWFpbCI6ImFudXJhZ0BleGFtcGxlLmNvbSIsImlhdCI6MTc2Njg2Mjg5NywiZXhwIjoxNzY2OTQ5Mjk3fQ.IUUYDkm-J0n-1CC40-4VkQoe9STI007Y5eDgcngQqFE' ^
--data ''

*/