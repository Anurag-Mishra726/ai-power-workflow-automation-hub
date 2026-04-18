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

export const handleCreateFolder = async ({ data, nodeId, context, userId }) => {
  const { folderName, driveId } = data.config;
  console.log("Folder Name : ", folderName);
  const accessToken = await getAccessToken(
    userId,
    driveId
  );

  const response = await axios.post(
    "https://www.googleapis.com/drive/v3/files",
    {
      name: folderName,
      mimeType: "application/vnd.google-apps.folder",
    },
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
      data: response.data,
    },
  });
};
