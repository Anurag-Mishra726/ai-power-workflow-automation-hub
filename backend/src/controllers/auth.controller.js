import { signupService, loginService } from '../services/auth.service.js';

export const signup = async (req, res) => {
    try {
        const user = await signupService(req.body);
        res.cookie("token", user.token, {
            http: true,
            secure: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 *1000
        })
        res.status(201).json({
            username: user.username,
            email: user.email,
            userId: user.userId
        });
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
        console.log(req.body);
        res.cookie("token", user.token, {
            http: true,
            secure: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 *1000
        })
        res.status(200).json({
            username: user.username,
            email: user.email,
            userId: user.userId
        });
    } catch (error) {
        console.error("Login Error --> : ", error.message);
        res.status(error.statusCode || 500).json({ 
            success: false,
            message: error.message || "Internal Server Error"
        });
    }
}; 