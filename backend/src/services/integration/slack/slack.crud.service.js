import { Integration } from "../../../models/integration/integration.model.js";
import axios from "axios";
import { AppError } from "../../../utils/AppErrors.js";

const getSlackChannels = async (accessToken) => {
    if (!accessToken) {
        return [];
    }

    let cursor = null;
    const channels = [];

    do {
        const response = await axios.get("https://slack.com/api/conversations.list", {
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
            params: {
                types: "public_channel,private_channel",
                exclude_archived: true,
                limit: 200,
                cursor: cursor || undefined,
            }
        });

        const data = response.data;

        if (!data?.ok) {
            throw new AppError(`Failed to fetch Slack channels: ${data?.error || "Unknown error"}`, 500);
        }
        
        const fetchedChannels = (data.channels || []).map((channel) => ({
            channelId: channel.id,
            channelName: channel.name,
        }));

        channels.push(...fetchedChannels);
        cursor = data.response_metadata?.next_cursor || null;
    } while (cursor);

    return channels;
};

export const getIntegration = async(userId, provider) => {
    const data = await Integration.getIntegration({userId, provider});

    if (data.length == 0) {
        return {
            success: true,
            message: "No Integration exist."
        }
    }

    const integrationsWithChannels = await Promise.all(
        data.map(async (integration) => {
            if (provider !== "slack") {     // can we remove this if block of code ?
                return {
                    id: integration.id,
                    name: integration.name,
                    provider: integration.provider,
                    external_id: integration.external_id,
                };
            }

            const channels = await getSlackChannels(integration.access_token);
            
            return {
                id: integration.id,
                name: integration.name,
                provider: integration.provider,
                external_id: integration.external_id,
                channels,
            };
        })
    );

    return {
        success: true,
        message: "All Integration Fetched.",
        data: integrationsWithChannels
    }
}
