import express from "express";
import "./src/config/env.js"
import connectDB from "./src/config/db.js";

const app = express();
await connectDB();

app.get("/", (req, res) => {
     res.send("Welcome to the AI Power Workflow Automation Hub!");
    
});

app.listen(5000, () => {
    console.log("Server is running on http://localhost:5000");
})