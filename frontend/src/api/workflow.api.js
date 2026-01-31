import api from "@/utils/axiox";

export const saveWorkflowApi = async (data) => {
    const res = await api.post('/workflows/save', data);
    return res.data;
};

export const getWorkflowMetadata = async () => {
    const res = await api.get('/workflows/metadata');
    return res.data;
}