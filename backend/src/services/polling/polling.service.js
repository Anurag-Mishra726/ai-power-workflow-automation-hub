import { inngest } from "../../inngest/client.js";
import { Workflow } from "../../models/workflow.model.js";
import { Integration } from "../../models/integration/integration.model.js";
import { fetchGmailData } from "./gmail.polling.service.js";
import { fetchDriveData } from "./googleDrive.polling.service.js";
import { fetchGoogleFormData } from "./googleForm.polling.service.js";


export const getSafeIsoDate = (value) => {

  if (!value) return new Date(0).toISOString();

  const normalized = value.toString().trim().replace(" ", "T").replace(/Z?$/, "Z");

  const parsedDate = new Date(normalized);
  if (Number.isNaN(parsedDate.getTime())) {
    return new Date(0).toISOString();
  }

  return parsedDate.toISOString();
};

export const parseTriggerConfig = (config) => {
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

  if (!triggerConfig || !triggerConfig.event) {
    return {
      triggerId: trigger.id,
      skipped: true,
      message: "No event type specified in trigger config.",
    }
  }

  let pollingResult;

  // if (trigger.trigger_type === "gmail") {
  //   const senderEmail = triggerConfig?.senderEmail || null;
  //   const label = triggerConfig?.label || "INBOX";
  //   pollingResult = await fetchGmailData(accessToken, lastChecked, senderEmail, label);
  // }

  // if (trigger.trigger_type === "googleDrive") {
  //   const folderId = triggerConfig?.folderId || null;
  //   const savedEvent = triggerConfig?.event || null;
  //   pollingResult = await fetchDriveData(accessToken, lastChecked, folderId, savedEvent);
  // }

  if (trigger.trigger_type === "googleForm") {
    const formId = triggerConfig?.formId || null;
    const savedEvent = triggerConfig?.event || null;
    pollingResult = await fetchGoogleFormData(accessToken, lastChecked, formId, savedEvent);
  }

  if (pollingResult?.payload?.length > 0) {
    console.log("Inngest Payload : ", pollingResult?.payload);

    await Promise.all(
      pollingResult.payload.map((email) =>
        inngest.send({
          name: "workflow/execute",
          data: {
            workflowId: trigger.workflow_id,
            initialData: {
              triggerData: email,
              triggerType: trigger.trigger_type,
            },
          },
        })
      )
    );
  }

  console.log(pollingResult?.payload);

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
      console.error(`Polling failed for trigger ${trigger.id} and triggerType ${trigger.trigger_type} `, error);
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
