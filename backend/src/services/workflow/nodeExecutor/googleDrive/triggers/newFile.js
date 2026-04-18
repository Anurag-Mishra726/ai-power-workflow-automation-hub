import axios from "axios";
import { NonRetriableError } from "inngest";
import { Integration } from "../../../../../models/integration/integration.model.js";
import { createExecutionResult } from "../../../../../utils/executionResult.js";
import { PDFParse } from "pdf-parse";

const MAX_FILE_SIZE = 2 * 1024 * 1024;

const SUPPORTED_MIME_TYPES = [
  "text/plain",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const getAccessToken = async (userId, accountId) => {
  return Integration.getIntegrationAccountToken({
    userId,
    provider: "google",
    externalId: accountId,
  });
};

const fetchFileContent = async (fileId, mimeType, accessToken, size) => {
  try {
    if (size && Number(size) > MAX_FILE_SIZE) {
      return null;
    }

    if (!SUPPORTED_MIME_TYPES.includes(mimeType)) {
      return null;
    }

    const response = await axios.get(
      `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        responseType: "arraybuffer",
      }
    );

    const buffer = Buffer.from(response.data);

    if (mimeType === "text/plain") {
      return buffer.toString("utf-8");
    }

    if (mimeType === "application/pdf") {
      const parser = new PDFParse({ data: buffer });
      const result = await parser.getText();
      await parser.destroy();
      return result.text;
    }

    return null;
  } catch (error) {
    console.error("File content fetch error:", error.message);
    return null;
  }
};

export const handleNewFileTrigger = async ({
  data,
  nodeId,
  context,
  userId,
}) => {
  try {
    const { driveId } = data.config;

    if (!driveId?.trim()) {
      throw new NonRetriableError("Drive account not configured.");
    }

    const triggerData = context.triggerData;

    if (!triggerData?.fileId) {
      throw new NonRetriableError("File ID missing in trigger data.");
    }

    const accessToken = await getAccessToken(userId, driveId);

    if (!accessToken) {
      throw new NonRetriableError("Google Drive token not found.");
    }

    // FETCH METADATA
    const response = await axios.get(
      `https://www.googleapis.com/drive/v3/files/${triggerData.fileId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          fields: "id,name,mimeType,webViewLink,size",
        },
      }
    );

    const file = response.data;

    //  FETCH CONTENT
    const content = await fetchFileContent(
      file.id,
      file.mimeType,
      accessToken,
      file.size
    );

    return createExecutionResult({
      output: {
        nodeId,
        triggered: true,
        data: {
          fileId: file.id,
          name: file.name,
          mimeType: file.mimeType,
          link: file.webViewLink,
          size: file.size || null,

          eventType: triggerData.eventType,
          time: triggerData.time,

          content,              // update the variable name on the frontend so user can use it in the next workflows
        },
        startTime: Date.now(),
      },
    });
  } catch (error) {
    console.error("Drive Trigger Error:", error?.response?.data || error);

    throw new NonRetriableError(
      error?.response?.data?.error?.message ||
        error.message ||
        "Drive trigger failed"
    );
  }
};
