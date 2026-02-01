import api from "@/utils/axiox";

export const saveWorkflowApi = async (data) => {
    const res = await api.post('/workflows/save', data);
    return res.data;
};

export const getWorkflowMetadata = async () => {
    const res = await api.get('/workflows/metadata');
    return res.data;
}

export const getWorkflowGraph = async (workflowId) => {
    const res = await api.get('/workflows/graph', {
        params: { workflowId }
    });
    return res.data;
}

export const generateWorkflowId = async () => {
    const res = await api.get('workflows/get-id');
    return res.data;
}