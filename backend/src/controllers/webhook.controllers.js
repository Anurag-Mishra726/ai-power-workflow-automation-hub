import { 
    manualExecuteWorkflowService,
    httpWebhookExecuteWorkflowService,
 } from "../services/workflow/inngest/workflowEcecute.js";

export const manualExecuteWorkflow = async (req, res) => {
    try {
        const { workflowId } = req.params;
        
        if (!workflowId) {
            return res.status(400).json({
                message: "WorkflowId not found! Bad request.",
                success: false
            });
        }
        await manualExecuteWorkflowService(req.user, workflowId);
        
        return res.status(200).json({
            message: "Workflow Executed Successfully.",
            success: true,
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: error.message || "Bad Request",
            success: false
        });
    }
}

export const handleHttpWebhook = async (req, res) => {
    try {
        const { workflowId } = req.params;

        const payload = {
            method: req.method,
            headers: req.headers || {},
            query: req.query || {},
            body: req.body || {}
        };

        await httpWebhookExecuteWorkflowService(workflowId, payload);

        res.status(200).json({
            success: true,
            message: "Workflow triggered"
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: error.message || "Bad Request",
            success: false
        });
    }
}


export const handleGithubWebhook = async (req, res) => {
    try {
        const event = req.headers["x-github-event"] || req.headers["X-GitHub-Event"];
        const delivery = req.headers["x-github-delivery"] || req.headers["X-GitHub-Delivery"];
        const payload = req.body || {};

        console.log("--- GitHub Webhook Received ---");
        console.log("Event:", event);
        console.log("Delivery:", delivery);

        console.log("Repository:", payload.repository?.full_name || payload.repository?.name);
        if (payload.action) console.log("Action:", payload.action);

        if (payload.issue) {
            console.log("Issue:", {
                number: payload.issue.number,
                title: payload.issue.title,
                url: payload.issue.html_url,
            });
        }

        if (payload.head_commit) {
            console.log("Head commit:", {
                id: payload.head_commit.id,
                message: payload.head_commit.message,
                url: payload.head_commit.url,
            });
        }

        if (payload.commits && Array.isArray(payload.commits)) {
            console.log("Commits count:", payload.commits.length);
        }

        console.log("Sender:", payload.sender?.login || payload.sender?.name);
        console.log("--- End GitHub Webhook ---");

        return res.status(200).json({ received: true });
    } catch (error) {
        console.error("handleGithubWebhook error:", error);
        return res.status(500).json({ success: false });
    }
}