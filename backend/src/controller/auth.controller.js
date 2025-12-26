import { signupService, loginService } from "../service/auth.service.js";

export const signup = async (req, res) => {
    try {
        const user = await signupService(req.body);
        res.status(201).json(user);
    } catch (error) {
        console.error("Signup Error --> : ", error);
        res.status(400).json({ error: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const user = await loginService(req.body);
        res.status(200).json(user);
    } catch (error) {
        console.error("Login Error --> : ", error);
        res.status(400).json({ error: error.message });
    }
}; 