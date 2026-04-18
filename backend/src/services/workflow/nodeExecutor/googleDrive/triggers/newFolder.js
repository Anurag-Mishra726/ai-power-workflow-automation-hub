import axios from "axios";
import { NonRetriableError } from "inngest";
import { Integration } from "../../../../../models/integration/integration.model.js";
import { createExecutionResult } from "../../../../../utils/executionResult.js";

const FOLDER_MIME_TYPE = "application/vnd.google-apps.folder";

const getAccessToken = async (userId, accountId) => {
  return Integration.getIntegrationAccountToken({
    userId,
    provider: "google",
    externalId: accountId,
  });
};

const fetchFolderChildren = async (folderId, accessToken) => {
  try {
    const response = await axios.get(
      "https://www.googleapis.com/drive/v3/files",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          q: `'${folderId}' in parents and trashed = false`,
          fields: "files(id,name,mimeType,webViewLink,size)",
          pageSize: 50, 
        },
      }
    );

    return response.data.files || [];
  } catch (error) {
    console.error("Error fetching folder children:", error.message);
    return [];
  }
};

export const handleFolderCreatedTrigger = async ({
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
      throw new NonRetriableError("Folder ID missing in trigger data.");
    }

    const accessToken = await getAccessToken(userId, driveId);

    if (!accessToken) {
      throw new NonRetriableError("Google Drive token not found.");
    }

    const response = await axios.get(
      `https://www.googleapis.com/drive/v3/files/${triggerData.fileId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          fields: "id,name,mimeType,webViewLink,createdTime",
        },
      }
    );

    const folder = response.data;

    if (folder.mimeType !== FOLDER_MIME_TYPE) {
      throw new NonRetriableError("Triggered item is not a folder.");
    }

    const children = await fetchFolderChildren(folder.id, accessToken);

    return createExecutionResult({
      output: {
        nodeId,
        triggered: true,
        data: {
          folderId: folder.id,
          name: folder.name,
          mimeType: folder.mimeType,
          link: folder.webViewLink,
          createdTime: folder.createdTime,

          eventType: triggerData.eventType,
          time: triggerData.time,

          children, // array of files inside folder
        },
        startTime: Date.now(),
      },
    });
  } catch (error) {
    console.error(
      "Folder Created Trigger Error:",
      error?.response?.data || error
    );

    throw new NonRetriableError(
      error?.response?.data?.error?.message ||
        error.message ||
        "Folder created trigger failed"
    );
  }
};
