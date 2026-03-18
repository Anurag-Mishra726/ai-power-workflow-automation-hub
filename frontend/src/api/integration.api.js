import api from "@/utils/axiox";

export const startOAuth = async (provider, workflowId) => {
    const res = api.post(`/integration/oauth/${provider}/connect`,{
        params: workflowId
    });

    return res.data;
}