import express from "express";
import "./src/config/env.js"
import connectDB from "./src/config/db.js";
import cors from "cors";

import {serve} from "inngest/express";
import {inngest} from "./src/inngest/client.js";
import { helloWorld, aiTest } from "./src/inngest/functions.js";

import {gemini, perplexity} from "./src/ai/generateText.js";

import authRoutes from "./src/routes/auth.routes.js";
import profileRoutes from "./src/routes/profile.routes.js";

const app = express();
await connectDB();

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'],  
  credentials: true,  
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));


app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use("/api/inngest", serve({
    client: inngest,
    functions : [helloWorld, aiTest]
}));

app.get("/", (req, res) => {
     res.send("Welcome to the AI Power Workflow Automation Hub!");
    
});

app.post("/api/test", async (req, res) => {

    try {
        console.log("Starting Inngest................");
        const {ids} = await inngest.send({
            name: "test/hello",
            data: {
                name: req.body.name || "Anurag",
                timestamp: new Date().toISOString()
            }
        })

        console.log("IDS ------>   ", ids[0]);

        res.json({
            message: "Inngest event sent successfully",
            eventId: ids[0],
        })
    } catch (error) {
        console.log("Error : " , error);
    }

});

app.post("/api/test-ai", async (req, res) => {
    try {
        const {ids} = await inngest.send({
            name: "test/ai", 
        })
        console.log(ids);
        return res.json({
            message: "AI Test event sent successfully",
            eventId: ids[0],
        })
    } catch (error) {
        console.log(error);
    }
})

app.get("/api/test-ai", async (req, res) => {
    const text = await perplexity("what is the capital of india?");
    console.log(text);
    res.json({
        message: "Perplexity Test Successful",
        response: text,
    })
})


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