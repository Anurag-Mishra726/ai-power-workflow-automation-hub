
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
            config?.url
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

    googleForm: {
        defaultConfig: {},

        buildSummary: () => "Google Form Trigger",

        isComplete: () => true,
    }
}
