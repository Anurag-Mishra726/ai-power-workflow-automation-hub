import { NonRetriableError } from "inngest";
// triggers
import { handleNewFileTrigger } from "./triggers/newFile.js";
import { handleDeleteFileTrigger } from "./triggers/deleteFile.js";

// actions
import { handleCreateFile } from "./actions/createFile.js";
import { handleDeleteFile } from "./actions/deleteFile.js";
import { handleCreateFolder } from "./actions/createFolder.js";
import { handleDeleteFolder } from "./actions/deleteFolder.js";
import { createExecutionResult } from "../../../../utils/executionResult.js";

const TRIGGER_MAP = {
  file_created: handleNewFileTrigger,
  file_updated: handleNewFileTrigger,
  file_deleted: handleDeleteFileTrigger,
  folder_created: handleNewFileTrigger,
  folder_deleted: handleDeleteFileTrigger,
};

const ACTION_MAP = {
  create_file: handleCreateFile,
  delete_file: handleDeleteFile,
  create_folder: handleCreateFolder,
  delete_folder: handleDeleteFolder,
};

export const googleDriveExecutor = async ({ data, nodeId, context, userId }) => {
  try {
    if (!data.isConfigured || !data.config?.event) {
      throw new NonRetriableError("Node is not configured.");
    }

    const event = data.config.event;

    if (TRIGGER_MAP[event]) {
      return await TRIGGER_MAP[event]({ data, nodeId, context, userId });
    }

    if (ACTION_MAP[event]) {
      return await ACTION_MAP[event]({ data, nodeId, context, userId });
    }

    throw new NonRetriableError("Unsupported Drive event.");
  } catch (error) {
    console.error("Drive Executor Error:", error?.response?.data || error);

    return createExecutionResult({
        error: error?.response?.data?.error?.message || error.message || "Drive execution failed",
    });

    // throw new NonRetriableError(
    //   error?.response?.data?.error?.message ||
    //   error.message ||
    //   "Drive execution failed"
    // );
  }
};
