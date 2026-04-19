import { processGithubInstallationWebhook } from "../../services/integration/github/githubWebhook.service.js";

export const handleGithubWebhook = async (req, res) => {
  try {
    const event = req.headers["x-github-event"];

    if (event !== "installation") {
      return res.status(200).json({
        received: true,
        ignored: true,
        reason: "Non-installation event",
      });
    }

    const result = await processGithubInstallationWebhook(req.body || {});

    return res.status(200).json({
      received: true,
      success: true,
      data: result,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to process GitHub webhook",
    });
  }
};
