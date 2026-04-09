import axios from "axios";
import { Workflow } from "../../models/workflow.model.js";
import { Integration } from "../../models/integration/integration.model.js";
//import { inngest } from "../../inngest/client.js";

const googleApi = axios.create({
  baseURL: "https://www.googleapis.com",
  timeout: 15000,
});

const getGoogleAccessToken = async (userId) => {
  const integration = await Integration.getIntegration({ userId, provider: "google" });
  return integration[0]?.access_token || null;
};

const fetchGmailData = async ( accessToken, lastChecked, senderEmail, label ) => {

  const lastCheckedSeconds = Math.floor(new Date(lastChecked).getTime() / 1000);
  let searchQuery = `after:${lastCheckedSeconds} label:${label}`;

  if (senderEmail && senderEmail.trim() !== '') {
    searchQuery += ` from:${senderEmail}`;
  }    
  console.log("Serch : ", searchQuery);
  
  const response = await googleApi.get("/gmail/v1/users/me/messages", {
    headers: { Authorization: `Bearer ${accessToken}` },
    params: {
      maxResults: 10,
      q: searchQuery,
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

const fetchDriveData = async (accessToken, lastChecked, folderId, event) => {

  const lastCheckedISO = new Date(lastChecked).toISOString();
  let queryPart = [
    `modifiedTime > '${lastCheckedISO}'` 
  ];

  if (folderId && folderId.trim() !== '') {
    queryPart.push(`'${folderId.trim()}' in parents`);
  }

  if (["file_deleted", "folder_deleted"].includes(event)) {
    queryPart.push(`trashed = true`);
  }else{
    queryPart.push(`trashed = false`);
  }

  const searchQuery = queryPart.join(' and ')
  console.log("Drive Query : ", searchQuery);
  const response = await googleApi.get("/drive/v3/files", {
    headers: { Authorization: `Bearer ${accessToken}` },
    params: {
      pageSize: 10,
      orderBy: "modifiedTime desc",
      fields: "nextPageToken, files(id, name ,mimeType, modifiedTime)",
      supportsAllDrives: true,
      includeItemsFromAllDrives: true,
      q: searchQuery,
    },
  });
  console.log("Drive API response: ", response.data);
  const files = response.data.files || [];
  console.log("Drive Polling Data : ", files);

  return files
};

const runTriggerPolling = async (trigger) => {

  const accessToken = await getGoogleAccessToken(trigger.user_id);
  const lastChecked = trigger.last_checked;
  
  let pollingResult;

  if (!accessToken) {
      return {
      triggerId: trigger.id,
      skipped: true,
      reason: "No Google integration token found.",
    };
  }

  if (trigger.trigger_type === "gmail") {
    const senderEmail = trigger.config_json?.senderEmail || null;
    const label = trigger.config_json?.label || 'INBOX';
    pollingResult = await fetchGmailData(accessToken, lastChecked, senderEmail, label);
  }

  if (trigger.trigger_type === "googleDrive") {
    const folderId = trigger.config_json?.folderId || null;
    const event = trigger.config_json?.event || null;
    pollingResult = await fetchDriveData(accessToken, lastChecked, folderId, event);
  }

  if (pollingResult) {
    // await inngest.send({
    //   name: "workflow/execute",
    //   data: {
    //     workflowId: trigger.workflow_id,
    //     initialData: {
    //       newData: pollingResult.payload,
    //       triggerType: trigger.trigger_type,
    //     },
    //   },
    // });
  }

  return {
      triggerId: trigger.id,
      pollingResult,
  };
};

export const processWorkflowPolling = async () => {

  const polling = await Workflow.getPollingTriggers();
  const now = new Date();

  for (const trigger of polling) {
    try {
        await runTriggerPolling(trigger);
        
        await Workflow.updatePollingCheckpoint({
            triggerId: trigger.id,
            lastChecked: now,
            pollInterval: 15
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
    polledTriggers: polling.length,
  };
};
