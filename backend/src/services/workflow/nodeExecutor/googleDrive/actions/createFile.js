import axios from "axios";
import FormData from "form-data";
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

export const handleCreateFile = async ({ data, nodeId, context, userId }) => {
  const { fileName, content, driveId } = data.config;       // there is no content 

  if (!fileName || !driveId) {
    throw new NonRetriableError("Missing required fields.");
  }

  const accessToken = await getAccessToken(userId, driveId);

  const form = new FormData();
  form.append(
    "metadata",
    JSON.stringify({
      name: fileName,
      mimeType: "text/plain",
    }),
    { contentType: "application/json" }
  );
  form.append("file", content || "", { contentType: "text/plain" });

  const response = await axios.post(
    "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart",
    form,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        ...form.getHeaders(),
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