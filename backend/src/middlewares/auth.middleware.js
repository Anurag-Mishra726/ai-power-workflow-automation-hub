import jwt from 'jsonwebtoken';
import { AppError } from '../utils/AppErrors.js';

export const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new AppError("Authorization header is missing or invalid", 401);
        }

        const token = authHeader.split(" ")[1];
        
        jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
            if (err) {
                return next(new AppError("Invalid or expired token", 401));
            }
            req.user = user;
            next();
        });

    } catch (error) {
        next(error);
    }
}