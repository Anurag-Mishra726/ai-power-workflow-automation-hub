import axios from "axios";
import Handlebars from "handlebars";
import { NonRetriableError } from "inngest";
import { Integration } from "../../../models/integration/integration.model.js";
import { createExecutionResult } from "../../../utils/executionResult.js";
import { httpRequestChannel } from "../../../inngest/workflowStatus.js";

export const slackExecutor = async ({ data, nodeId, context, userId, publish }) => {
    await publish(
        httpRequestChannel().status({
            nodeId,
            status: "loading",
        })
    );

    if (!userId) {
        await publish(
            httpRequestChannel().status({
                nodeId,
                status: "error",
            })
        );
        throw new NonRetriableError("User Id is missing.");
    }

    if (!data?.isConfigured || !data?.config?.workspaceId || !data?.config?.channelId || !data?.config?.message) {
        await publish(
            httpRequestChannel().status({
                nodeId,
                status: "error",
            })
        );
        throw new NonRetriableError("Slack node is not configured.");
    }

    const accessToken = await Integration.getIntegrationAccountToken({
        userId,
        provider: "slack",
        externalId: data.config.workspaceId,
    });

    if (!accessToken) {
        await publish(
            httpRequestChannel().status({
                nodeId,
                status: "error",
            })
        );
        throw new NonRetriableError("Slack integration token not found for selected workspace.");
    }

    const message = Handlebars.compile(data.config.message)(context);
    const startTime = Date.now();

    try {
        const isMember = await ensureBotInChannel(accessToken, data.config.channelId);

        if (!isMember) {
            throw new NonRetriableError("FlowAI is not a member of Slack!")
        }

        const response = await axios.post(
            "https://slack.com/api/chat.postMessage",
            {
                channel: data.config.channelId,
                text: message,
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
            }
        );

        if (!response.data?.ok) {
            await publish(
                httpRequestChannel().status({
                    nodeId,
                    status: "error",
                })
            );
            throw new NonRetriableError(`Slack API error: ${response.data?.error || "Unknown error"}`);
        }

        await publish(
            httpRequestChannel().status({
                nodeId,
                status: "success",
            })
        );

        return createExecutionResult({
            output: {
                nodeId,
                triggered: true,
                startTime,
                endTime: Date.now(),
                status: true,
                workspaceId: data.config.workspaceId,
                channelId: data.config.channelId,
                message,
                ts: response.data.ts,
            },
            error: null,
        });
    } catch (error) {
        await publish(
            httpRequestChannel().status({
                nodeId,
                status: "error",
            })
        );
        console.log(error.message);
        throw new NonRetriableError(error.message || "Failed to post message to Slack.");
    }
};


async function ensureBotInChannel(botToken, channelId) {
  const infoRes = await axios.get("https://slack.com/api/conversations.info", {
    headers: { Authorization: `Bearer ${botToken}` },
    params: { channel: channelId }
  });

  if (!infoRes.data.ok) {
    throw new NonRetriableError(`Slack API error: ${infoRes.data.error}`);
  }

  const isMember = infoRes.data.channel.is_member;
  if (isMember) return true;

  const joinRes = await axios.post(
    "https://slack.com/api/conversations.join",
    { channel: channelId },
    { headers: { Authorization: `Bearer ${botToken}` } }
  );

  if (!joinRes.data.ok) {
    throw new NonRetriableError(`Failed to join channel: ${joinRes.data.error}`);
  }

  return true;
}
