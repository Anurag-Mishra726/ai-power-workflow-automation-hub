import pool from "../../../config/db.js";
import { Integration } from "../../../models/integration/integration.model.js";
import { AppError } from "../../../utils/AppErrors.js";
import {
  exchangeInstallationToken,
  fetchInstallationMetadata,
  fetchInstallationRepositories,
} from "./githubApp.service.js";

const resolveInternalUserId = async (payload, client) => {
  const accountId = payload?.installation?.account?.id || payload?.account?.id;

  if (!accountId) {
    throw new AppError("Unable to resolve GitHub account id from installation payload.", 400);
  }

  const mapped = await Integration.getIntegrationByProviderAndExternalId(
    { provider: "github", externalId: String(accountId) },
    client,
  );

  if (!mapped?.user_id) {
    throw new AppError(
      "GitHub account is not linked to a platform user yet. Connect GitHub from the app before installation.",
      400,
    );
  }

  return mapped.user_id;
};

export const upsertGithubInstallation = async ({
  userId,
  installationId,
  accountLogin,
  repositorySelection,
  installationToken,
  expiresAt,
}) => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const providerRow = await Integration.insertTokenProvider(
      {
        userId,
        provider: "github",
        externalId: String(installationId),
        name: accountLogin || `github-installation-${installationId}`,
      },
      connection,
    );

    await Integration.insertOAuthToken(
      {
        integrationId: providerRow.insertId,
        accessToken: installationToken || null,
        refreshToken: null,
        tokenType: "installation",
        scope: repositorySelection || null,
        expiresAt: expiresAt || null,
        last_refreshed_at: new Date(),
      },
      connection,
    );

    await connection.commit();

    return providerRow.insertId;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

export const processGithubInstallationWebhook = async (payload) => {
  const installationId = payload?.installation?.id;

  if (!installationId) {
    throw new AppError("Missing installation.id in GitHub webhook payload.", 400);
  }

  const connection = await pool.getConnection();
  let userId;

  try {
    userId = await resolveInternalUserId(payload, connection);
  } finally {
    connection.release();
  }

  const { token, expiresAt } = await exchangeInstallationToken(String(installationId));
  const metadata = await fetchInstallationMetadata(String(installationId), token);
  const repositories = await fetchInstallationRepositories(token);

  await upsertGithubInstallation({
    userId,
    installationId,
    accountLogin: metadata.account.login,
    repositorySelection: metadata.repositorySelection,
    installationToken: token,
    expiresAt,
  });

  return {
    installationId: String(installationId),
    repositorySelection: metadata.repositorySelection,
    account: metadata.account,
    repositories,
  };
};
