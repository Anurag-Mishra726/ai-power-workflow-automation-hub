import express from "express";
import "./src/config/env.js"
import {connectDB} from "./src/config/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";

import {serve} from "inngest/express";
import {inngest} from "./src/inngest/client.js";
import { executeWorkflow, pollWorkflowTriggers } from "./src/inngest/functions.js";
import { getSubscriptionToken } from "@inngest/realtime";
import { httpRequestChannel } from "./src/inngest/workflowStatus.js";

import {gemini, perplexity} from "./src/ai/generateText.js";

import authRoutes from "./src/routes/auth.routes.js";
import profileRoutes from "./src/routes/profile.routes.js";
import workflowRoutes from "./src/routes/workflows.routes.js";
import webhooks from "./src/routes/webhook.route.js";
import aiIntegrationRoutes from "./src/routes/aiIntegration.routes.js";

import integrationRoutes from "./src/routes/integration/integration.auth.routes.js"
import executionRoutes from "./src/routes/executions.routes.js"

const app = express();
await connectDB();

app.use(cors({
  origin: ['http://localhost:5173', 'https://linus-terrible-murray.ngrok-free.dev'],  
  credentials: true,  
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));


app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cookieParser());

app.use("/api/inngest", serve({
    client: inngest,
    functions : [executeWorkflow, pollWorkflowTriggers ]
}));

app.get("/", (req, res) => {
    res.send("Welcome to the AI Power Workflow Automation Hub!");
    // res.redirect("http://localhost:5173/workflow")
});

app.get("/api/realtime/token", async (req, res) => {
  const token = await getSubscriptionToken(inngest, {
    channel: httpRequestChannel(),
    topics: ["status"],
  });

  res.json(token);
});

app.use("/api/auth", authRoutes);
app.use("/api/workflows", workflowRoutes);
app.use("/api/webhook", webhooks);
app.use("/api/ai/integration", aiIntegrationRoutes);
app.use("/api/integration", integrationRoutes);
app.use("/api/user", profileRoutes);
app.use("/api/executions", executionRoutes);


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
});
