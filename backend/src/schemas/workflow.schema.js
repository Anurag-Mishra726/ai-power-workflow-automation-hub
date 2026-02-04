import {z} from "zod";

const AddNode = z.object({
    id: z.string(),
    type: z.literal("addNode"),
    position: z.object({
        x: z.number(),
        y: z.number(),
    }),
    data: z.object({
        nodeRole: z.literal("ADD_NODE"),
    }),
});

const BaseNodeSchema = z.object({
    id: z.string(),
    type: z.enum(["trigger", "action"]),
    position: z.object({
        x: z.number(),
        y: z.number(),
    }),
    data: z.object({
        isTrigger: z.boolean(),
        isConfigured: z.boolean(),
        label: z.string().optional(),
        triggerType: z.enum(["manual", "http"]).optional(),
        summary: z.string().optional().or(z.literal("")),
        config: z.any(),
    }),
});

const ManualTriggerConfig = z.object({
    isConfigured: z.boolean().default(true),
});

const HttpConfig = z.object({
    method: z.enum(["GET", "POST", "PUT", "PATCH", "DELETE"]),
    url: z.string(),
    headers: z.object().optional(),
    body: z.object().optional(),
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
    if (["POST", "PUT", "PATCH"].includes(val.method) && !val.headers) {
        ctx.addIssue({
        path: ["headers"],
        message: "Headers is required for this HTTP method",
        });
    }
});


const workflowNodeSchema = BaseNodeSchema.superRefine((node, ctx) => {
    if (!node.data.isConfigured) {
        return;
    }

    if (node.data.triggerType === "manual") {
        const result = ManualTriggerConfig.safeParse(node.data);
        if (!result.success) {
            result.error.issues.forEach(issue => {
                ctx.addIssue({
                    code: issue.code,
                    message: issue.message,
                    path: ["data", "config", ...issue.path],
                });
            });
        }
    }

    if (node.data.triggerType === "http") {
        const result = HttpConfig.safeParse(node.data.config);
        if (!result.success) {
            result.error.issues.forEach(issue => {
                ctx.addIssue({
                    code: issue.code,
                    message: issue.message,
                    path: ["data", "config", ...issue.path],
                })
            });
        }
    }
});

const AnyNodeSchema = z.discriminatedUnion("type", [workflowNodeSchema, AddNode]);

const EdgeSchema = z.object({
    id: z.string({message: "Invalid Configuration!"}),
    source: z.string({message: "Invalid Configuration!"}),
    target: z.string({message: "Invalid Configuration!"}),
    animated: z.boolean({message: "Invalid Configuration!"}).default(false),
});


export const SaveWorkflowSchema = z.object({
    workflowId: z.uuid({message: "Workflow ID is system genereted it can not be modified!"}),
    workflowName: z.string().min(3, "Workflow name is too small").max(60, "Name should be max 60 charater long.").regex(
      /^[a-zA-Z0-9- ]+$/, "Special characters are not allowed. Please use only letters, numbers, and spaces."),
    nodes: z.array(AnyNodeSchema, {message: "Workflow node is not configured!."}),
    edges: z.array(EdgeSchema),
})