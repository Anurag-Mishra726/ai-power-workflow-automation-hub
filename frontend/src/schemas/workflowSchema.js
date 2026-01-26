import {z} from "zod";

export const BaseNodeSchema = z.object({
    id: z.string(),
    type: z.enum(["trigger", "action"]),
    position: z.object({
        x: z.number(),
        y: z.number(),
    }),
    data: z.object({
        label: z.string(),
        isConfigured: z.boolean(),
        isTrigger: z.boolean(),
        triggerType: z.enum(["manual", "http"]),
        summary: z.string().optional().or(z.literal("")),
        // config: z.any(),
    }),
});

export const ManualTriggerConfig = z.object({
    triggerName: z.string().optional(),
});

export const HttpConfig = z.object({
    method: z.enum(["GET", "POST", "PUT", "PATCH", "DELETE"]),
    url: z.string(),
    triggerName: z.string().optional(),
    headers: z.string().optional(),
    body: z.string().optional(),
    }).superRefine((val, ctx) => {
    if (val.method === "GET" && val.body) {
        ctx.addIssue({
        path: ["body"],
        message: "GET request cannot have a body",
        });
    }

    if (["POST", "PUT", "PATCH"].includes(val.method) && !val.body) {
        ctx.addIssue({
        path: ["body"],
        message: "Body is required for this HTTP method",
        });
    }
});


export const WorkflowNodeSchema = BaseNodeSchema.superRefine((node, ctx) => {
    if (!node.data.isConfigured) {
        return;
    }

    if (node.data.triggerType === "manual") {
        const result = ManualTriggerConfig.safeParse(node.data.config);
        if (!result.success) {
        result.error.issues.forEach(issue =>
            ctx.addIssue(issue)
        );
        }
    }

    if (node.data.triggerType === "http") {
        const result = HttpConfig.safeParse(node.data.config);
        if (!result.success) {
        result.error.issues.forEach(issue =>
            ctx.addIssue(issue)
        );
        }
    }
});
