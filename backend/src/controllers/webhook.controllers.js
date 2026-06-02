import { 
    manualExecuteWorkflowService,
    httpWebhookExecuteWorkflowService,
    githubWebhookExecuteWorkflowService,
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

const formatGithubEventData = (event, body) => {
    if (event === "push") {
        return {
            event: "push",
            branch: body.ref?.replace("refs/heads/", ""),
            repoName: body.repository?.name,
            repoId: body.repository?.id,
            repoOwnerName: body.repository?.owner?.name || body.repository?.owner?.login,
            pusherName: body.pusher?.name,
            pusherEmail: body.pusher?.email,
            installationId: body.installation?.id,
            latestCommitMessage: body.head_commit?.message,
            committer: body.head_commit?.committer,
            addedFiles: body.head_commit?.added,
            removedFiles: body.head_commit?.removed,
            modifiedFiles: body.head_commit?.modified,
            senderName: body.sender?.login,
        };
    }

    if (event === "pull_request" && body.action === "opened") {
        return {
            event: "pull_request_opened",
            action: body.action,
            installationId: body.installation?.id,
            repoId: body.repository?.id,
            repoName: body.repository?.name,
            pullRequestTitle: body.pull_request?.title,
            pullRequestBody: body.pull_request?.body,
            pullRequestState: body.pull_request?.state,
            isMerged: body.pull_request?.merged,
            sourceBranch: body.pull_request?.head?.ref,
            targetBranch: body.pull_request?.base?.ref,
            authorUsername: body.pull_request?.user?.login,
            createdAt: body.pull_request?.created_at,
            senderName: body.sender?.login,
        };
    }

    if (event === "pull_request" && body.action === "closed") {
        return {
            event: body.pull_request?.merged ? "pull_request_merged" : "pull_request_closed",
            action: body.action,
            installationId: body.installation?.id,
            repoId: body.repository?.id,
            repoName: body.repository?.name,
            pullRequestTitle: body.pull_request?.title,
            isMerged: body.pull_request?.merged,
            pullRequestState: body.pull_request?.state,
            closedAt: body.pull_request?.closed_at,
            sourceBranch: body.pull_request?.head?.ref,
            targetBranch: body.pull_request?.base?.ref,
            senderName: body.sender?.login,
        };
    }

    if (event === "issues" && body.action === "opened") {
        return {
            event: "issue_opened",
            action: body.action,
            installationId: body.installation?.id,
            repoId: body.repository?.id,
            repoName: body.repository?.name,
            issueId: body.issue?.id,
            issueNumber: body.issue?.number,
            issueTitle: body.issue?.title,
            issueBody: body.issue?.body,
            issueState: body.issue?.state,
            issueCreator: body.issue?.user?.login,
            labels: body.issue?.labels,
            assignees: body.issue?.assignees,
            senderName: body.sender?.login,
            createdAt: body.issue?.created_at,
        };
    }

    if (event === "issues" && body.action === "closed") {
        return {
            event: "issue_closed",
            action: body.action,
            installationId: body.installation?.id,
            repoId: body.repository?.id,
            repoName: body.repository?.name,
            issueNumber: body.issue?.number,
            issueTitle: body.issue?.title,
            closedAt: body.issue?.closed_at,
            senderName: body.sender?.login,
            closedBy: body.sender?.login,
        };
    }

    if (event === "issue_comment" && body.action === "created") {
        return {
            event: "issue_comment_created",
            action: body.action,
            installationId: body.installation?.id,
            repoId: body.repository?.id,
            repoName: body.repository?.name,
            issueId: body.issue?.id,
            issueNumber: body.issue?.number,
            issueTitle: body.issue?.title,
            commentId: body.comment?.id,
            commentBody: body.comment?.body,
            commentAuthor: body.comment?.user?.login,
            senderName: body.sender?.login,
            commentCreatedAt: body.comment?.created_at,
        };
    }

    return null;
};


export const handleGithubWebhook = async (req, res) => {
    try {
        const event = req.headers["x-github-event"] || req.headers["X-GitHub-Event"];        
        const body = req.body || {};

        const formattedData = formatGithubEventData(event, body);

        if (!formattedData) {
            return res.status(200).json({
                received: true,
                ignored: true,
                reason: "Unsupported github event/action",
            });
        }

        await githubWebhookExecuteWorkflowService(formattedData);

        return res.status(200).json({ received: true, event: formattedData.event });
    } catch (error) {
        console.error("handleGithubWebhook error:", error);
        return res.status(500).json({ success: false });
    }
}