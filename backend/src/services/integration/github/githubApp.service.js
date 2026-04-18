import { githubApiClient } from "../../../utils/githubApiClient.util.js";
import { generateGithubAppJwt } from "../../../utils/githubAppJwt.util.js";
import { AppError } from "../../../utils/AppErrors.js";

const githubAppHeaders = (jwt) => ({
  Authorization: `Bearer ${jwt}`,
});

const installationHeaders = (token) => ({
  Authorization: `Bearer ${token}`,
});

export const getGithubAppInstallUrl = (userId, workflowId) => {
  const stateData = Buffer.from(JSON.stringify({ userId, workflowId })).toString("base64");

  const baseInstallUrl = process.env.GITHUB_APP_INSTALL_URL
    || (process.env.GITHUB_APP_NAME
      ? `https://github.com/apps/${process.env.GITHUB_APP_NAME}/installations/new`
      : null);

  if (!baseInstallUrl) {
    throw new AppError("Missing GITHUB_APP_INSTALL_URL or GITHUB_APP_NAME for GitHub App install redirect.", 500);
  }

  const url = new URL(baseInstallUrl);
  url.searchParams.set("state", stateData);

  return url.toString();
};

export const exchangeInstallationToken = async (installationId) => {
  try {
    const appJwt = generateGithubAppJwt();

    const response = await githubApiClient.post(
      `/app/installations/${installationId}/access_tokens`,
      {},
      { headers: githubAppHeaders(appJwt) },
    );

    return {
      token: response.data?.token,
      expiresAt: response.data?.expires_at ? new Date(response.data.expires_at) : null,
    };
  } catch (error) {
    console.error("GitHub installation token exchange error:", error.response?.data || error.message);
    throw new AppError("Failed to exchange GitHub App JWT for installation token.", 500);
  }
};

export const fetchInstallationMetadata = async (installationId, installationToken) => {
  try {
    const response = await githubApiClient.get(`/app/installations/${installationId}`, {
      headers: installationHeaders(installationToken),
    });

    const data = response.data;

    return {
      installationId: data?.id ? String(data.id) : null,
      repositorySelection: data?.repository_selection || null,
      account: {
        login: data?.account?.login || null,
        type: data?.account?.type || null,
        avatarUrl: data?.account?.avatar_url || null,
        accountId: data?.account?.id ? String(data.account.id) : null,
      },
    };
  } catch (error) {
    console.error("GitHub installation metadata error:", error.response?.data || error.message);
    throw new AppError("Failed to fetch GitHub installation metadata.", 500);
  }
};

export const fetchInstallationRepositories = async (installationToken) => {
  try {
    const response = await githubApiClient.get("/installation/repositories", {
      headers: installationHeaders(installationToken),
      params: {
        per_page: 100,
      },
    });

    const repositories = response.data?.repositories || [];

    return repositories.map((repo) => ({
      id: repo.id,
      name: repo.name,
      full_name: repo.full_name,
    }));
  } catch (error) {
    console.error("GitHub repositories fetch error:", error.response?.data || error.message);
    throw new AppError("Failed to fetch repositories for GitHub installation.", 500);
  }
};
