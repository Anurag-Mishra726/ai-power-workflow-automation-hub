import { inngest } from "../../../inngest/client.js";
import { Workflow } from "../../../models/workflow.model.js";
import { Integration } from "../../../models/integration/integration.model.js";
import { AppError } from "../../../utils/AppErrors.js";
import { parseTriggerConfig } from "../../../utils/parseTriggerConfig.js";

export const manualExecuteWorkflowService = async (userData, workflowId) => {
   try {

    const userId = userData.userId;
    console.log("user and workflow id : ", userId, workflowId);

    const workflowExists = await Workflow.exists({workflowId, userId});

    if (!workflowExists) {
        throw new AppError("Workflow Not Found! Save and try again.", 404);
    }

    await inngest.send({
        name: "workflow/execute",
        data: {
            workflowId: workflowId,
            initialData: {
                userId: userId
            }
        }
    });
    return ;

   } catch (error) {
    console.log(error);
    throw new AppError(error.message || "Something went worong!", 500);
   }
}

export const httpWebhookExecuteWorkflowService = async (workflowId, payload) => {
    try {
        console.log("Workflow : ", workflowId, "Paylad : ", payload);
        await inngest.send({
            name: "workflow/execute",
            data: {
                workflowId: workflowId,
                initialData: {
                    httpWebhook: payload
                }
            }
        });
    } catch (error) {
        console.log(error);
        throw new AppError(error.message || "Something went worong!", 500);
    }
}

const GITHUB_EVENT_ALIASES = {
    issues_opened: "issue_opened",
    issue_created: "issue_opened",
    issue_opened: "issue_opened",
    issues_closed: "issue_closed",
    issue_closed: "issue_closed",
    pull_opened: "pull_request_opened",
    pull_request_opened: "pull_request_opened",
    pull_closed: "pull_request_closed",
    pull_request_closed: "pull_request_closed",
    pull_merged: "pull_request_merged",
    pull_request_merged: "pull_request_merged",
    issue_comment_added: "issue_comment_created",
    issue_comment_created: "issue_comment_created",
    push: "push",
};

const events = ["push", "pull_request_opened", "pull_request_closed", "pull_request_merged"];

const normalizeGithubEvent = (event) => GITHUB_EVENT_ALIASES[event] || event;

const matchesGithubRepo = (triggerConfig, githubData) => {
    const triggerRepoId = triggerConfig?.repoId || triggerConfig?.repositoryId;
    const triggerRepoName = triggerConfig?.repoName || triggerConfig?.repositoryName || triggerConfig?.repository;
    const triggerEvent = normalizeGithubEvent(triggerConfig?.event);
    const webhookEvent = normalizeGithubEvent(githubData?.event);

    if (!triggerRepoId && !triggerRepoName) {
        return false;
    }

    const isCorrectEvent = triggerEvent === webhookEvent;
    const isRepoIdMatch = triggerRepoId && Number(triggerRepoId) === Number(githubData.repoId);

    if (isCorrectEvent && isRepoIdMatch) {
        const targetBranch = triggerConfig?.branch;
        if (events.includes(triggerEvent)) {
            if (targetBranch == githubData?.branch || targetBranch == githubData?.targetBranch) {
                return true;
            }
            return false;
        }
        return true;
    }
    return false;
};

export const githubWebhookExecuteWorkflowService = async (githubData) => {
    try {
        const installationId = githubData?.installationId;

        if (!installationId) {
            throw new AppError("Installation id is missing in github webhook payload.", 400);
        }

        const userIntegration = await Integration.getIntegrationByExternalId({
            provider: "github",
            externalId: String(installationId),
        });

        const userId = userIntegration?.user_id;

        if (!userId) {
            return;
        }

        const workflowTriggers = await Workflow.getGithubTriggersByUserId({ userId });
        console.log(workflowTriggers);
        const filteredTriggers = workflowTriggers.filter((trigger) => {
            const triggerConfig = parseTriggerConfig(trigger.config_json);
            const matches = matchesGithubRepo(triggerConfig, githubData);
            return matches;
        });

        await Promise.all(
            filteredTriggers.map((trigger) =>
                inngest.send({              // match the event also before sending
                    name: "workflow/execute",
                    data: {
                        workflowId: trigger.workflow_id,
                        initialData: {
                            githubWebhook: githubData,
                        },
                    },
                }),
            ),
        );
    } catch (error) {
        console.log(error);
        throw new AppError(error.message || "Something went worong!", 500);
    }
};
