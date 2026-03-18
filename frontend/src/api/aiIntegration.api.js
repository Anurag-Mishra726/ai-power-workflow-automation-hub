import api from "@/utils/axiox";

export const getAllAiIntegration = async () => {
    const res = await api.get("/ai/integration/get/all/apikey");
    return res.data;
};

export const addApiKey = async (data) => {
    const res = await api.post("/ai/integration/add/apikey", data);
    return res.data;
}

export const apiKeyExists = async (provider) => {
    const res = await api.get(`/ai/integration/${provider}/apikey/exist`);
    return res.data;
}

export const getApiKey = async (provider) => {
    const res = await api.get(`/ai/integration/get/apikey/${provider}`);
    return res.data;
}

export const updateApiKey = async (data) => {
    const res = await api.put("/ai/integration/update/apikey", data);
    return res.data;
}

export const deleteApiKey = async (provider) => {
    const res = await api.delete(`/ai/integration/delete/apikey/${provider}`);
    return res.data;
}