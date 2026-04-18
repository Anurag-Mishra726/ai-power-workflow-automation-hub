import { AppError } from "../../../utils/AppErrors.js";
import {
  exchangeInstallationToken,
  fetchInstallationMetadata,
} from "./githubApp.service.js";
import { upsertGithubInstallation } from "./githubWebhook.service.js";

export const handleGithubAppSetupCallback = async ({ installationId, userId }) => {
  if (!installationId || !userId) {
    throw new AppError("Missing installationId or userId in GitHub setup callback.", 400);
  }

  const { token, expiresAt } = await exchangeInstallationToken(String(installationId));
  const metadata = await fetchInstallationMetadata(String(installationId), token);

  await upsertGithubInstallation({
    userId,
    installationId,
    accountLogin: metadata.account.login,
    repositorySelection: metadata.repositorySelection,
    installationToken: token,
    expiresAt,
  });

  return metadata;
};
