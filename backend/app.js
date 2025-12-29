import express from "express";
import "./src/config/env.js"
import connectDB from "./src/config/db.js";
import cors from "cors";

import authRoutes from "./src/routes/auth.routes.js";
import profileRoutes from "./src/routes/profile.routes.js";

const app = express();
await connectDB();

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'],  // React ports
  credentials: true,  // Allow cookies (matches withCredentials: true)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));


app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get("/", (req, res) => {
     res.send("Welcome to the AI Power Workflow Automation Hub!");
    
});


app.use("/api/auth", authRoutes);
app.get("/api/profile", (req, res) => {
    res.send("Profile route is working");
});
app.use("/api/user", profileRoutes);

app.use((err, req, res, next) => {
    console.log("app.js --> ", err.message);
    
    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "Internal Server Error"
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log("Server is running on http://localhost:" + PORT);
})