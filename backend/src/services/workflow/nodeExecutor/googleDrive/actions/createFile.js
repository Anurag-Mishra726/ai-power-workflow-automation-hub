import axios from "axios";
import FormData from "form-data";
import { NonRetriableError } from "inngest";
import Handlebars from "handlebars";
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
  const { fileName, content, driveId, folderId } = data.config;

  if (!fileName?.trim() || !content?.trim() || !driveId) {
    throw new NonRetriableError("Missing required fields.");
  }

  const resolvedFileName = Handlebars.compile(fileName)(context);
  const resolvedContent = Handlebars.compile(content)(context);

  if (!resolvedFileName?.trim() || !resolvedContent?.trim()) {
    throw new NonRetriableError("File name and content are required.");
  }

  const accessToken = await getAccessToken(userId, driveId);

  const metadata = {
    name: resolvedFileName,
    mimeType: "text/plain",
  };

  if (folderId) {
    metadata.parents = [folderId];
  }

  const form = new FormData();
  form.append(
    "metadata",
    JSON.stringify(metadata),
    { contentType: "application/json" }
  );
  form.append("file", resolvedContent, { contentType: "text/plain" });

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
