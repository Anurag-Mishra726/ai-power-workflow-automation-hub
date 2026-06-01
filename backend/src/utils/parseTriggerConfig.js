export const parseTriggerConfig = (config) => {
  if (!config) return {};
  if (typeof config === "object") return config;
  if (typeof config === "string") {
    try {
      return JSON.parse(config);
    } catch {
      console.warn("Failed to parse trigger config_json, using empty config.");
      return {};
    }
  }
  return {};
};
