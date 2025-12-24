import dotenv from "dotenv";

dotenv.config();

const requiredEnvVars = ["MONGODB_URI"];

requiredEnvVars.forEach((varName) => {
    if (!process.env[varName]) {
        throw new Error(`Environment variable ${varName} is not set.`);
    }   
});