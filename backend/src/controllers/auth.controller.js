import { success } from "zod";
import { signupService, loginService } from "../services/auth.service.js";

export const signup = async (req, res) => {
    try {
        const user = await signupService(req.body);
        res.status(201).json(user);
    } catch (error) {
        console.error("Signup Error --> : ", error.message);
        res.status(error.statusCode || 500).json({ 
            success: false,
            message: error.message || "Internal Server Error"
        });
    }
};

export const login = async (req, res) => {
    try {
        const user = await loginService(req.body);
        res.status(200).json(user);
    } catch (error) {
        console.error("Login Error --> : ", error.message);
        res.status(error.statusCode || 500).json({ 
            success: false,
            message: error.message || "Internal Server Error"
        });
    }
}; 