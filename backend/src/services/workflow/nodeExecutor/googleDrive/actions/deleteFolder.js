
import { handleDeleteFile } from "./deleteFile.js";

export const handleDeleteFolder = async ({ data, nodeId, context, userId }) => {
  return handleDeleteFile({ data, nodeId, context, userId });
};