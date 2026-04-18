import { AppError } from "../../utils/AppErrors.js";
import { getGithubAppInstallUrl } from "../../services/integration/github/githubApp.service.js";
import { handleGithubAppSetupCallback } from "../../services/integration/github/github.auth.service.js";

export const startGithubAppInstall = async (req, res) => {
  try {
    const { workflowId } = req.query;
    const userId = req.user.userId;

    if (!workflowId) {
      throw new AppError("Invalid request! WorkflowId is missing!", 400);
    }

    const url = getGithubAppInstallUrl(userId, workflowId);
    return res.redirect(url);
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal Server Error!",
    });
  }
};

export const handleGithubAppSetup = async (req, res) => {
  try {
    const { installation_id: installationId, state, setup_action: setupAction } = req.query;

    if (!installationId || setupAction !== "install") {
      return res.redirect("http://localhost:5173/workflow/");
    }

    const decodedState = JSON.parse(Buffer.from(state, "base64").toString("utf-8"));
    const { workflowId, userId } = decodedState;

    await handleGithubAppSetupCallback({ installationId, userId });

    return res.redirect(`http://localhost:5173/workflow/${workflowId}`);
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal Server Error!",
    });
  }
};
