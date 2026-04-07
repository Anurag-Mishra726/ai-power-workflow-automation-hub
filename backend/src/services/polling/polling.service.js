import axios from "axios";
import { Workflow } from "../../models/workflow.model.js";
import { Integration } from "../../models/integration/integration.model.js";
//import { inngest } from "../../inngest/client.js";

const googleApi = axios.create({
  baseURL: "https://www.googleapis.com",
  timeout: 15000,
});

const safeJson = (value) => {
  if (!value) return {};
  if (typeof value === "object") return value;

  try {
    return JSON.parse(value);
  } catch {
    return {};
  }
};

const getGoogleAccessToken = async (userId) => {
  const integration = await Integration.getIntegration({ userId, provider: "google" });
  return integration[0]?.access_token || null;
};

const fetchGmailDelta = async ( accessToken, lastChecked ) => {
    const lastCheckedSeconds = Math.floor(new Date(lastChecked).getTime() / 1000);

    const response = await googleApi.get("/gmail/v1/users/me/messages", {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: {
        maxResults: 10,
        q: `after:${lastCheckedSeconds} label:INBOX`,
        },
    });
    console.log("Gmail API response: ", response.data);
    const currentIds = (response.data.messages || []).map((message) => message.id);
    console.log(currentIds);

    return {
        ids: currentIds.length > 0 ? currentIds : [],
        newLastChecked: new Date().toISOString(),
    }
};

const fetchDriveDelta = async (accessToken, previousSnapshot = {}) => {
  const response = await googleApi.get("/drive/v3/files", {
    headers: { Authorization: `Bearer ${accessToken}` },
    params: {
      pageSize: 50,
      orderBy: "modifiedTime desc",
      fields: "files(id,name,mimeType,modifiedTime,webViewLink)",
      supportsAllDrives: true,
      includeItemsFromAllDrives: true,
      q: "trashed = false",
    },
  });

  const files = response.data.files || [];
  const currentMap = Object.fromEntries(
    files.map((file) => [file.id, file.modifiedTime])
  );

  const previousMap = previousSnapshot.fileMap || {};
  const changedFiles = files.filter((file) => {
    const oldModified = previousMap[file.id];
    return !oldModified || oldModified !== file.modifiedTime;
  });

  return {
    hasChanges: changedFiles.length > 0,
    payload: {
      files: changedFiles.map((file) => ({
        id: file.id,
        name: file.name,
        mimeType: file.mimeType,
        modifiedTime: file.modifiedTime,
        webViewLink: file.webViewLink || null,
      })),
    },
    nextSnapshot: { fileMap: currentMap },
  };
};

const runTriggerPolling = async (trigger) => {

    const accessToken = await getGoogleAccessToken(trigger.user_id);
    const lastChecked = trigger.lastChecked;
    let deltaResult;

    if (!accessToken) {
        return {
        triggerId: trigger.id,
        skipped: true,
        reason: "No Google integration token found.",
        configJson,
        };
    }

    if (trigger.trigger_type === "gmail") {
        deltaResult = await fetchGmailDelta(accessToken, lastChecked);
    }

    if (trigger.trigger_type === "googleDrive") {
        deltaResult = await fetchDriveDelta(accessToken);
    }

    if (deltaResult) {
        // await inngest.send({
        //   name: "workflow/execute",
        //   data: {
        //     workflowId: trigger.workflow_id,
        //     initialData: {
        //       newData: deltaResult.payload,
        //       triggerType: trigger.trigger_type,
        //     },
        //   },
        // });
        console.log(`Trigger ${trigger.id} has changes. Payload:`, deltaResult);
    }
    console.log(` hola Trigger ${trigger.id} has changes. Payload:`, deltaResult);
    return {
        triggerId: trigger.id,
        deltaResult,
    };
};

export const processWorkflowPolling = async () => {
  const dueTriggers = await Workflow.getDuePollingTriggers();
  
  const now = new Date();

  for (const trigger of dueTriggers) {
    try {
        const result = await runTriggerPolling(trigger);
        
        await Workflow.updatePollingCheckpoint({
            triggerId: trigger.id,
            configJson: result.configJson,
            lastChecked: now,
            pollInterval: trigger.poll_interval || 600,
        });
    } catch (error) {
        console.error(`Polling failed for trigger ${trigger.id}:`, error.message);
        await Workflow.updatePollingCheckpoint({
            triggerId: trigger.id,
            lastChecked: now,
            pollInterval: trigger.poll_interval || 600,
        });
    }
  }

  return {
    polledTriggers: dueTriggers.length,
  };
};
