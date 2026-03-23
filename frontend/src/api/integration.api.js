import api from "@/utils/axiox";

export const getIntegration = async (provider) => {
    const res = api.get(`integration/${provider}/get/integration`);

    return res.data;
}