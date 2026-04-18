import axios from "axios";
import { NonRetriableError } from "inngest";
import { Integration } from "../../../../../models/integration/integration.model.js";
import { createExecutionResult } from "../../../../../utils/executionResult.js";

const getAccessToken = async (userId, accountId) => {
  return Integration.getIntegrationAccountToken({
    userId,
    provider: "google",
    externalId: accountId,
  });
};

export const handleDeleteFile = async ({ data, nodeId, context, userId }) => {
  const { targetId, driveId } = data.config;

  if (!targetId || !driveId) {
    throw new NonRetriableError("Missing targetId.");
  }

  const accessToken = await getAccessToken(
    userId,
    driveId
  );

  await axios.delete(
    `https://www.googleapis.com/drive/v3/files/${targetId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return createExecutionResult({
    output: {
      nodeId,
      success: true,
      message: "File deleted",
    },
  });
};
