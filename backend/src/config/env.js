import dotenv from "dotenv";

dotenv.config();

const requiredEnvVars = ["JWT_SECRET_KEY",
    "PORT","NODE_ENV", 
    "SENTRY_DNS",
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
