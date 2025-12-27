import express from "express";
import authRoutes from "./src/routes/auth.routes.js";
import "./src/config/env.js"
import connectDB from "./src/config/db.js";

const app = express();
await connectDB();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get("/", (req, res) => {
     res.send("Welcome to the AI Power Workflow Automation Hub!");
    
});


app.use("/api/auth", authRoutes);

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