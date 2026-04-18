import { Inngest } from "inngest";
import { realtimeMiddleware } from "@inngest/realtime/middleware";

export const inngest = new Inngest({
    id: "flow-ai",
    middleware: [realtimeMiddleware()],
})

export const functions = []