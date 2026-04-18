import {channel, topic} from "@inngest/realtime";

export const httpRequestChannel = channel("http/request").addTopic(
    topic("status")
)