import { Integration } from "../../../../../models/integration/integration.model.js";
import axios from "axios";
import Handlebars from "handlebars";
import { createExecutionResult } from "../../../../../utils/executionResult.js";
import { NonRetriableError } from "inngest";

const getGoogleAccessToken = async (userId, gmailAccountId) => {
    return await Integration.getIntegrationAccountToken({
        userId: userId,
        provider: "google",
        externalId: gmailAccountId,
    });
}

export const handleSendEmail = async ({ data, nodeId, context, userId }) => {
  const { to, subject, body, gmailAccountId } = data.config;

  if (!to?.trim() || !subject?.trim() || !body?.trim() || !gmailAccountId?.trim()) {
    throw new NonRetriableError("Missing required email fields.");
  }

  const accessToken = await getGoogleAccessToken(
    userId,
    gmailAccountId
  );

  if (!accessToken) {
    throw new NonRetriableError("Google integration token not found.");
  }

  const compiledTo = Handlebars.compile(to)(context);
  const compiledSubject = Handlebars.compile(subject)(context);
  const compiledBody = Handlebars.compile(body)(context);

  const rawMessage = [
    `To: ${compiledTo}`,
    `Subject: ${compiledSubject}`,
    `Content-Type: text/html; charset=utf-8`,
    `From: me`,
    "",
    compiledBody,
  ].join("\n");

  const encodedMessage = Buffer.from(rawMessage)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  const response = await axios.post(
    "https://gmail.googleapis.com/gmail/v1/users/me/messages/send",
    { raw: encodedMessage },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  return createExecutionResult({
    output: {
      nodeId,
      success: true,
      messageId: response.data.id,
      data: response.data,
    },
  });
};
