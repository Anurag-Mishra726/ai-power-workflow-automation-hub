import pool from "../../../config/db.js";
import { Integration } from "../../../models/integration/integration.model.js";
import { AppError } from "../../../utils/AppErrors.js";
import { githubApp } from "../../../utils/githubApp.js";

export const getGithubAuthUrl = (userId, workflowId, provider) => {
  const base = "https://github.com/apps/flowai-app/installations/new";

  const stateData = {
    workflowId,
    userId,
    provider,
  };

  const state = Buffer.from(JSON.stringify(stateData)).toString("base64");

  const params = new URLSearchParams({
    state,
  });

  return `${base}?${params.toString()}`;    // state is not secure here and in other also so fix that in future.
};

export const handleGithubCallback = async (userId, installationId) => {

  const octokit = await githubApp.getInstallationOctokit(installationId);

  // const exist = await Integration.sameIntegrationExists({
  //   userId,
  //   provider: "github",
  //   externalId: installationId
  // });

  // if(!exist) {
  //  return {
  //     success: true,
  //     message: "GitHub already connected",
  //     alreadyConnected: true
  //   };
  // }

  const { data: installationInfo } = await octokit.rest.apps.getInstallation({
    installation_id: Number(installationId),
  });

  const accountName = installationInfo.account.login;

  await Integration.insertTokenProvider({
    userId,
    provider: "github",
    externalId: installationId,
    name: accountName
  });

  return {
    success: true,
    message: "GitHub integrated successfully",            
  };

};
