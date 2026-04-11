import axios from 'axios';
import { Integration } from '../../../models/integration/integration.model.js';
import { AppError } from '../../../utils/AppErrors.js';

const githubApi = axios.create({
  baseURL: 'https://api.github.com',
  timeout: 10000,
  headers: {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  },
});

const getGithubMetadata = async (accessToken) => {
  const headers = { Authorization: `Bearer ${accessToken}` };

  const [profileResponse, reposResponse] = await Promise.all([
    githubApi.get('/user', { headers }),
    githubApi.get('/user/repos', {
      headers,
      params: {
        per_page: 100,
        sort: 'updated',
      },
    }),
  ]);

  const profile = profileResponse.data;
  const repos = reposResponse.data || [];

  return {
    login: profile?.login || null,
    avatar_url: profile?.avatar_url || null,
    html_url: profile?.html_url || null,
    repos: repos.map((repo) => ({
      id: repo.id,
      name: repo.name,
      full_name: repo.full_name,
      private: repo.private,
      default_branch: repo.default_branch,
      html_url: repo.html_url,
    })),
  };
};

export const getGithubIntegration = async (userId, provider) => {
  const data = await Integration.getIntegration({ userId, provider });

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
        external_id: integration.external_id,
        metadata: await getGithubMetadata(integration.access_token),
      }))
    );

    return {
      success: true,
      message: 'All Integration Fetched.',
      data: integrationsWithMetadata,
    };
  } catch (error) {
    console.error('GitHub Integration CRUD Error:', error.response?.data || error.message);
    throw new AppError('Failed to fetch GitHub integration metadata', 500);
  }
};
