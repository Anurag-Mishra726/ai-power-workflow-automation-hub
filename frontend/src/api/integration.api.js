import api from "@/utils/axiox";

export const getIntegration = async (provider) => {
    const res = await api.get(`integration/${provider}/get/integration`);
    
    return res.data.data || [] ;
}