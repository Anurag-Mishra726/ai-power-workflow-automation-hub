
const defaultSummary = "Please Cofigure Node!";

export const nodeConfigMap = {
    manual: {
        defaultConfig: {},

        buildSummary: () => "Triggered manually",

        isComplete: () => true,
    },

    http: {
        defaultConfig: {
            method: "GET",
            variable: "",
            url: "",
            headers: "",
            body: "",
        },

    buildSummary: (config) =>
    {
        try {
            return config?.url
            ? `${config.method} ${new URL(config.url).pathname}`
            : "HTTP Request"
        } catch (error) {
            console.log(error);
            return "HTTP Request";
        }
    }// TODOs : Fix this build summary for the url (When user enters only the variable name in the url field, it breaks the summary because of URL constructor. We need to handle that case.)
    , 

    isComplete: (config) =>
        Boolean(config?.url && config?.method),
    },

    httpWebhook: {
        defaultConfig: {
            method: "ANY",
            variable: "",
            url: "",
        },

        buildSummary: (config) => {
            try {
                return config?.url
                    ? `Webhook (${config.method || "ANY"}) ${new URL(config.url).pathname}`
                    : "Webhook";
            } catch (error) {
                console.log(error);
                return "Webhook";
            }
        },

        isComplete: (config) =>
            Boolean(config?.url && config?.variable && config?.method),
    },


    googleForm: {
        defaultConfig: {},

        buildSummary: () => "Google Form Trigger",

        isComplete: () => true,
    },

    geminiAI: {
        defaultConfig: {
            variable: "",
            systemPrompt: "",
            userPrompt: "",
        },

        buildSummary: (config) => {
            return config?.userPrompt ? `AI: ${config.userPrompt.substring(0, 20)}...` : defaultSummary;
        },

        isComplete: (config) => {
            return config?.userPrompt ? true : false ;
        },
    },

    perplexityAI: {
        defaultConfig: {
            variable: "",
            systemPrompt: "",
            userPrompt: "",
        },

        buildSummary: (config) => {
            return config?.userPrompt ? `AI: ${config.userPrompt.substring(0, 20)}...` : defaultSummary;
        },

        isComplete: () => true,
    },

    openAI: {
        defaultConfig: {
            variable: "",
            systemPrompt: "",
            userPrompt: "",
        },

        buildSummary: (config) => {
            return config?.userPrompt ? `AI: ${config.userPrompt.substring(0, 20)}...` : defaultSummary;
        },

        isComplete: () => true,
    },

    slack: {

        buildSummary: (config) => {
            return config?.message ? `Msg: ${config.message.substring(0, 20)}...` : defaultSummary
        },

        isComplete: (config) => Boolean(config?.message),
    },

    gmail: {
        buildSummary: (config) => {
            return config?.event ? `Gmail: ${config.event}` : defaultSummary
        },

        isComplete: () => true,
    },

    googleDrive: {
        buildSummary: (config) => {
            return config?.event ? `Drive: ${config.event}` : defaultSummary;   // Improve the summary by showing selected event like File create or File delet now it is like 
        },

        isComplete: () => true,
    },

    github: {
        buildSummary: (config) => {
            const selected = config?.action || config?.event || config?.actionOrEvent;
            return selected ? `GitHub: ${selected}` : defaultSummary;
        },

        isComplete: (config) => Boolean(config?.repository && (config?.action || config?.event || config?.actionOrEvent)),
    },
    
}
