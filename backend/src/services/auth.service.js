import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { AppError } from "../utils/AppErrors.js";

export const signupService = async (userData) => {
    const {username, email, password} = userData;

    const existingUser = await User.findOne({email});
    if (existingUser) {
        throw new AppError("USER_EXIST", 409);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        username,
        email,
        password: hashedPassword
    });

    const token = jwt.sign(
        {userId: user._id , email: user.email},
        process.env.JWT_SECRET_KEY,
        {expiresIn: "7d"}
    )

    return {
        userId: user._id,
        username: user.username,
        email: user.email,
        token,
    };
};

export const loginService = async (userData) => {

    const {email, password} = userData;

    const user = await User.findOne({email}).select("+password");
    
    if(!user){
        throw new AppError("INVALID_CREDENTIALS", 401);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if(!isPasswordValid){
        throw new Error("INVALID_CREDENTIALS", 401);
    }

    const token = jwt.sign(
        {userId: user._id , email: user.email},
        process.env.JWT_SECRET_KEY,
        {expiresIn: "7d"}
    )


    return {
        userId: user._id,
        username: user.username,
        email: user.email,
        token,
    };
}