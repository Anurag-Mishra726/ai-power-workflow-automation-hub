import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {User} from "../models/user.model.js";
import { AppError } from "../utils/AppErrors.js";

export const signupService = async (userData, ip) => {
    const {username, email, password} = userData;

    const existingUser = await User.findByEmail(email);

    if (existingUser) {
        throw new AppError("USER_EXIST", 409);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.createUser({
        username,
        email,
        password_hash: hashedPassword,
        signup_ip: ip
    });

    const token = jwt.sign(
        {userId: user.id , email: user.email},
        process.env.JWT_SECRET_KEY,
        {expiresIn: "7d"}
    )

    return {
        userId: user.id,
        username: user.username,
        email: user.email,
        token,
    };
};

export const loginService = async (userData) => {

    const {email, password} = userData;

    // const user = await User.findOne({email}).select("+password");

    const user = await User.findByEmail(email);
    
    if(!user){
        throw new AppError("INVALID_CREDENTIALS", 401);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if(!isPasswordValid){
        throw new Error("INVALID_CREDENTIALS", 401);
    }

    const token = jwt.sign(
        {userId: user.id , email: user.email},
        process.env.JWT_SECRET_KEY,
        {expiresIn: "7d"}
    )


    return {
        userId: user.id,
        username: user.username,
        email: user.email,
        token,
    };
}