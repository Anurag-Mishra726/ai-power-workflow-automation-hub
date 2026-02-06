
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

        buildSummary: (config) =>{
            config?.url
                ? `${config.method} ${new URL(config.url).pathname}`
                : "HTTP Request";
        },
            

        isComplete: (config) =>
            Boolean(config?.url && config?.method),
    }
}
