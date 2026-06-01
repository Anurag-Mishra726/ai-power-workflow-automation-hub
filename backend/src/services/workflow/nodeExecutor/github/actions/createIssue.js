import Handlebars from "handlebars";
import { NonRetriableError } from "inngest";
import { Integration } from "../../../../../models/integration/integration.model.js";
import { createExecutionResult } from "../../../../../utils/executionResult.js";
import { githubApp } from "../../../../../utils/githubApp.js";

const render = (value, context) => Handlebars.compile(String(value || ""))(context).trim();

const getOwner = (config) => {
  const repository = config.repository || config.repoName;
  if (repository?.includes("/")) return repository.split("/")[0];
  return config.repositoryOwner || config.owner || config.githubAccountName;
};

const getRepo = (config) => {
  const repository = config.repository || config.repoName;
  return repository?.includes("/") ? repository.split("/")[1] : repository;
};

const getOctokit = async ({ userId, installationId }) => {
  const integration = await Integration.getIntegrationByExternalId({
    provider: "github",
    externalId: String(installationId),
  });

  if (!integration || String(integration.user_id) !== String(userId)) {
    throw new NonRetriableError("GitHub integration not found for selected account.");
  }

  return githubApp.getInstallationOctokit(Number(installationId));
};

export const handleCreateIssue = async ({ data, nodeId, context, userId }) => {
  const config = data?.config || {};
  const owner = getOwner(config);
  const repo = getRepo(config);
  const title = render(config.title, context);
  const body = render(config.description, context);
  const installationId = config.githubAccountId;
  const startTime = Date.now();

  if (!installationId || !owner || !repo || !title) {
    throw new NonRetriableError("Missing required GitHub issue fields.");
  }

  const octokit = await getOctokit({ userId, installationId });
  const response = await octokit.rest.issues.create({ owner, repo, title, body });

  return createExecutionResult({
    output: {
      nodeId,
      success: true,
      action: "create_issue",
      startTime,
      endTime: Date.now(),
      repository: `${owner}/${repo}`,
      issueNumber: response.data.number,
      issueUrl: response.data.html_url,
      data: response.data,
    },
  });
};
