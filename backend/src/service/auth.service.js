import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const signupService = async (userData) => {
    const {name, email, password} = userData;

    const existingUser = await User.findOne({email});
    if (existingUser) {
        throw new Error("User already exists!");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        name,
        email,
        password: hashedPassword
    });

    const token = jwt.sign(
        {userId: user._id , email: user.email},
        process.env.JWT_SECRET_KEY,
        {expiresIn: "1d"}
    )

    return {
        userId: user._id,
        email: user.email,
        token,
    };
};

export const loginService = async (userData) => {
    const {email, password} = userData;

    const user = await User.findOne({email});
    if(!user){
        throw new Error("Invalid credentials!");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if(!isPasswordValid){
        throw new Error("Invalid credentials!");
    }

    const token = jwt.sign(
        {userId: user._id , email: user.email},
        process.env.JWT_SECRET_KEY,
        {expiresIn: "1d"}
    )

    return {
        userId: user._id,
        email: user.email,
        token,
    };
}