import dotenv from "dotenv";

dotenv.config();

const requiredEnvVars = [
    "PORT",
    "NODE_ENV", 
    "JWT_SECRET_KEY",
    "ENCRYPTION_SECRET",
    "DB_HOST",
    "DB_USER",
    "DB_PORT",
    "DB_PASSWORD",
    "DB_DATABASE"
];

requiredEnvVars.forEach((varName) => {
    if (!process.env[varName]) {
        throw new Error(`Environment variable ${varName} is not set.`);
    }   
});
