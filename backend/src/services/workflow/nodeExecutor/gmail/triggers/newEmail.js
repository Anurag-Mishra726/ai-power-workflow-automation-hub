import axios from "axios";
import { NonRetriableError } from "inngest";
import { Integration } from "../../../../../models/integration/integration.model.js";
import { createExecutionResult } from "../../../../../utils/executionResult.js";

const getGoogleAccessToken = async (userId, gmailAccountId) => {
  return await Integration.getIntegrationAccountToken({
    userId: userId,
    provider: "google",
    externalId: gmailAccountId,
  });
};

const extractHtmlBody = (payload) => {
  if (!payload) return "";

  if (payload.mimeType === "text/html" && payload.body?.data) {
    return Buffer.from(payload.body.data, "base64").toString("utf-8");
  }

  if (payload.parts && payload.parts.length > 0) {
    for (const part of payload.parts) {
      const result = extractHtmlBody(part);
      if (result) return result;
    }
  }

  return "";
};

export const handleNewEmailTrigger = async ({ data, nodeId, context, userId }) => {
  const { gmailAccountId } = data.config;

  if (!gmailAccountId?.trim()) {
    throw new NonRetriableError("Gmail account not configured.");
  }

  const messageId = context.triggerData;
  if (!messageId) {
    throw new NonRetriableError("Message ID missing in trigger data.");
  }

  const accessToken = await getGoogleAccessToken(userId, gmailAccountId);

  if (!accessToken) {
    throw new NonRetriableError("Google integration token not found.");
  }

  const response = await axios.get(
    `https://www.googleapis.com/gmail/v1/users/me/messages/${messageId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        format: "full",
      },
    }
  );

  const payload = response.data.payload;
  const headers = payload?.headers || [];

  const getHeader = (name) =>
    headers.find((h) => h.name === name)?.value || "";


  const body = extractHtmlBody(payload);

  const parsedEmail = {
    messageId: response.data.id,
    subject: getHeader("Subject"),
    from: getHeader("From"),
    date: getHeader("Date"),
    body, 
  };

  return createExecutionResult({
    output: {
      nodeId,
      triggered: true,
      data: parsedEmail,
      startTime: Date.now(),
    },
  });
};