import Handlebars from "handlebars";
import { NonRetriableError } from "inngest";
import { createExecutionResult } from "../../../../../utils/executionResult.js";
import { githubApp } from "../../../../../utils/githubApp.js";

const render = (value, context) => Handlebars.compile(String(value || ""))(context).trim();

const getOwner = (config) => {
  const repository = config.repository || config.repoName;
  if (repository?.includes("/")) return repository.split("/")[0];
  return config.githubAccountName;
};

const getRepo = (config) => {
  const repository = config.repository || config.repoName;
  return repository?.includes("/") ? repository.split("/")[1] : repository;
};

export const handleCreatePullRequest = async ({ data, nodeId, context, userId }) => {
  const config = data?.config || {};
  const owner = getOwner(config);
  const repo = getRepo(config);
  const title = render(config.title, context);
  const body = render(config.description, context);
  const head = render(config.sourceBranch, context);
  const base = render(config.targetBranch, context);
  const draft = Boolean(config.isDraftPr || config.draftPullRequest);
  const installationId = config.githubAccountId;
  const startTime = Date.now();

  if (!installationId || !owner || !repo || !title || !head || !base) {
    throw new NonRetriableError("Missing required GitHub pull request fields.");
  }

  const octokit = await githubApp.getInstallationOctokit(Number(installationId));
  const response = await octokit.rest.pulls.create({
    owner,
    repo,
    title,
    head,
    base,
    body,
    draft,
  });

  return createExecutionResult({
    output: {
      nodeId,
      success: true,
      action: "create_pull_request",
      startTime,
      endTime: Date.now(),
      repository: `${owner}/${repo}`,
      pullRequestNumber: response.data.number,
      pullRequestUrl: response.data.html_url,
      data: response.data,
    },
  });
};
