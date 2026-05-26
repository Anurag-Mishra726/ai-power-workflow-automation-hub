import { Integration } from '../../../models/integration/integration.model.js';
import { AppError } from '../../../utils/AppErrors.js';
import { githubApp } from '../../../utils/githubApp.js';

const getGithubMetadata = async (installationId) => {
  const parsedId = Number(installationId);
  
  if (!parsedId || isNaN(parsedId)) {
    throw new Error(`Invalid installationId: ${installationId}`);
  }

  const octokit = await githubApp.getInstallationOctokit(parsedId);

  const [installationResponse, reposResponse] = await Promise.all([
    octokit.rest.apps.getInstallation({ installation_id: parsedId }),
    octokit.rest.apps.listReposAccessibleToInstallation({ per_page: 100 }),
  ]);

  const account = installationResponse.data.account;
  const repos = reposResponse.data.repositories || [];

  return {
    login: account?.login || null,
    avatar_url: account?.avatar_url || null,
    html_url: account?.html_url || null,
    type: account?.type || null, 
    
    total_repository_count: reposResponse.data.total_count,
    
    repos: repos.map((repo) => ({
      id: repo.id,
      name: repo.name,
      owner: repo.owner?.login || null,
      full_name: repo.full_name,
      private: repo.private,
      default_branch: repo.default_branch,
      html_url: repo.html_url,
    })),
  };
};

export const getGithubIntegration = async (userId, provider) => {
  
  const data = await Integration.getIntegrationProvider({ userId, provider });
  
  if (data.length === 0) {
    return {
      success: true,
      message: 'No Integration exist.',
      data: [],
    };
  }

  try {
    const integrationsWithMetadata = await Promise.all(
      data.map(async (integration) => ({
        id: integration.id,
        name: integration.name,
        provider: integration.provider,
        external_id: integration.external_id, // This is installationId provided by GitHub
        metadata: await getGithubMetadata(integration.external_id),
      }))
    );

    return {
      success: true,
      message: 'All Integration Fetched.',
      data: integrationsWithMetadata,
    };
  } catch (error) {
    return {
      success: false,
      message: 'Failed to fetch GitHub integration metadata via Octokit',
      data: [],
    }
  }
};
