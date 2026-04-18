import { Integration } from "../../../models/integration/integration.model.js";
import { AppError } from "../../../utils/AppErrors.js";
import {
  exchangeInstallationToken,
  fetchInstallationMetadata,
  fetchInstallationRepositories,
} from "./githubApp.service.js";
import { upsertGithubInstallation } from "./githubWebhook.service.js";

const isTokenUsable = (expiresAt) => {
  if (!expiresAt) return false;
  const bufferMs = 60 * 1000;
  return new Date(expiresAt).getTime() - bufferMs > Date.now();
};

const getInstallationTokenForIntegration = async (userId, integration) => {
  if (integration.access_token && isTokenUsable(integration.expires_at)) {
    return {
      token: integration.access_token,
      expiresAt: new Date(integration.expires_at),
    };
  }

  const { token, expiresAt } = await exchangeInstallationToken(integration.external_id);

  await upsertGithubInstallation({
    userId,
    installationId: integration.external_id,
    accountLogin: integration.name,
    repositorySelection: integration.scope,
    installationToken: token,
    expiresAt,
  });

  return { token, expiresAt };
};

export const getGithubIntegration = async (userId, provider) => {
  const rows = await Integration.getIntegration({ userId, provider });

  if (rows.length === 0) {
    return {
      success: true,
      message: "No Integration exist.",
      data: [],
    };
  }

  try {
    const integrationsWithMetadata = await Promise.all(
      rows.map(async (integration) => {
        const { token } = await getInstallationTokenForIntegration(userId, integration);
        const installationMetadata = await fetchInstallationMetadata(integration.external_id, token);
        const repositories = await fetchInstallationRepositories(token);

        await upsertGithubInstallation({
          userId,
          installationId: integration.external_id,
          accountLogin: installationMetadata.account.login || integration.name,
          repositorySelection: installationMetadata.repositorySelection,
          installationToken: token,
          expiresAt: integration.expires_at,
        });

        return {
          id: integration.id,
          name: integration.name,
          provider: integration.provider,
          installation_id: integration.external_id,
          metadata: {
            login: installationMetadata.account.login,
            account_type: installationMetadata.account.type,
            avatar_url: installationMetadata.account.avatarUrl,
            repository_selection: installationMetadata.repositorySelection,
            repositories,
          },
        };
      }),
    );

    return {
      success: true,
      message: "All Integration Fetched.",
      data: integrationsWithMetadata,
    };
  } catch (error) {
    console.error("GitHub Integration CRUD Error:", error.response?.data || error.message);
    throw new AppError("Failed to fetch GitHub integration metadata", 500);
  }
};
