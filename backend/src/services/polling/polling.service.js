import axios from "axios";
import { inngest } from "../../inngest/client.js";
import { Workflow } from "../../models/workflow.model.js";
import { Integration } from "../../models/integration/integration.model.js";

const googleApi = axios.create({
  baseURL: "https://www.googleapis.com",
  timeout: 15000,
});

const driveActivityApi = axios.create({
  baseURL: "https://driveactivity.googleapis.com",
});

const getSafeIsoDate = (value) => {
  if (!value) return new Date(0).toISOString();

  const normalized = value.toString().trim().replace(" ", "T").replace(/Z?$/, "Z");

  const parsedDate = new Date(normalized);
  if (Number.isNaN(parsedDate.getTime())) {
    return new Date(0).toISOString();
  }

  return parsedDate.toISOString();
};

const parseTriggerConfig = (config) => {
  if (!config) return {};
  if (typeof config === "object") return config;
  if (typeof config === "string") {
    try {
      return JSON.parse(config);
    } catch {
      console.warn("Failed to parse trigger config_json, using empty config.");
      return {};
    }
  }
  return {};
};

const getGoogleAccessToken = async (userId) => {
  const integration = await Integration.getIntegration({ userId, provider: "google" });
  return integration[0]?.access_token || null;
};

const fetchGmailData = async (accessToken, lastChecked, senderEmail, label) => {
  const lastCheckedSeconds = Math.floor(
    new Date(getSafeIsoDate(lastChecked)).getTime() / 1000
  );

  let searchQuery = `after:${lastCheckedSeconds} label:${label}`;
  if (senderEmail && senderEmail.trim() !== "") {
    searchQuery += ` from:${senderEmail}`;
  }

  const response = await googleApi.get("/gmail/v1/users/me/messages", {
    headers: { Authorization: `Bearer ${accessToken}` },
    params: { maxResults: 10, q: searchQuery },
  });

  const currentIds = (response.data.messages || []).map((m) => m.id);

  return {
    ids: currentIds,
    newLastChecked: new Date().toISOString(),
  };
};

const fetchDriveData = async (accessToken, lastCheckedTime, folderId, savedEvent) => {
  const filterTime = new Date(getSafeIsoDate(lastCheckedTime)).getTime();
  const allActivities = [];

  const requestBody = {
    pageSize: 50,
    consolidationStrategy: { none: {} },
  };

  if (folderId && folderId.trim() !== "") {
    requestBody.ancestorName = `items/${folderId.trim()}`;
  }

  let pageToken = null;
  
  do {
    if (pageToken) requestBody.pageToken = pageToken;

    const response = await driveActivityApi.post(
      "/v2/activity:query",
      requestBody,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const activities = response.data.activities || [];
    allActivities.push(...activities);
    pageToken = response.data.nextPageToken || null;
  } while (pageToken);
  
  const newActivities = allActivities.filter((activity) => {
    const activityTime = activity.timestamp
      ? new Date(activity.timestamp).getTime()
      : activity.timeRange?.endTime
      ? new Date(activity.timeRange.endTime).getTime()
      : 0;
    return activityTime > filterTime;
  });

  const events = newActivities.map((activity) => {
    const action = activity.primaryActionDetail || {};
    const target = activity.targets?.[0]?.driveItem || {};
    const mimeType = target.mimeType;
    const isFolder = mimeType === "application/vnd.google-apps.folder";

    let eventType = "unknown";
    if (action.create)      eventType = isFolder ? "folder_created" : "file_created";
    else if (action.delete) eventType = isFolder ? "folder_deleted" : "file_deleted";
    else if (action.rename) eventType = isFolder ? "folder_renamed" : "file_renamed";
    else if (action.edit)   eventType = "file_updated";
    else if (action.move)   eventType = isFolder ? "folder_moved"   : "file_moved";
    
    return {                      // we can add old name also here. when event is renamed
      eventType,
      fileId: target.name?.replace("items/", "") || null,
      name: target.title || null,
      time: activity.timestamp || activity.timeRange?.endTime || null,
    };
  }).filter((event) => {
    if (!savedEvent) return true; // no filter configured, allow all

    // Handle both string and array
    const allowedEvents = Array.isArray(savedEvent) ? savedEvent : [savedEvent];
    return allowedEvents.includes(event.eventType);
  });

  console.log(events);
  
  return { events };
};

const runTriggerPolling = async (trigger) => {
  const accessToken = await getGoogleAccessToken(trigger.user_id);

  if (!accessToken) {
    return {
      triggerId: trigger.id,
      skipped: true,
      reason: "No Google integration token found.",
    };
  }

  const lastChecked = trigger.last_checked;
  const triggerConfig = parseTriggerConfig(trigger.config_json); 

  let pollingResult;

  if (trigger.trigger_type === "gmail") {
    const senderEmail = triggerConfig?.senderEmail || null;
    const label = triggerConfig?.label || "INBOX";
    pollingResult = await fetchGmailData(accessToken, lastChecked, senderEmail, label);
  }

  if (trigger.trigger_type === "googleDrive") {
    const folderId = triggerConfig?.folderId || null;
    const savedEvent = triggerConfig?.event || null;
    pollingResult = await fetchDriveData(accessToken, lastChecked, folderId, savedEvent);
  }

  // if (pollingResult) {
  //   await inngest.send({
  //     name: "workflow/execute",
  //     data: {
  //       workflowId: trigger.workflow_id,
  //       initialData: {
  //         newData: pollingResult.payload,
  //         triggerType: trigger.trigger_type,
  //       },
  //     },
  //   });
  // }

  return {
    triggerId: trigger.id,
    pollingResult,
  };
};

export const processWorkflowPolling = async () => {
  const polling = await Workflow.getPollingTriggers();

  for (const trigger of polling) {
    const pollStartTime = new Date(); 

    try {
      const response = await runTriggerPolling(trigger);

      await Workflow.updatePollingCheckpoint({
        triggerId: trigger.id,
        pageToken: response.pollingResult?.nextPageToken || null,
        lastChecked: pollStartTime, 
        pollInterval: trigger.poll_interval || 600, 
      });
    } catch (error) {
      console.error(`Polling failed for trigger ${trigger.id}:`, error.message);
      await Workflow.updatePollingCheckpoint({
        triggerId: trigger.id,
        pageToken: null,
        lastChecked: trigger.last_checked, 
        pollInterval: trigger.poll_interval || 600,
      });
    }
  }

  return { polledTriggers: polling.length };
};
