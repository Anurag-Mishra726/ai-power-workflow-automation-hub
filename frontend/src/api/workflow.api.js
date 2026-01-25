import api from "@/utils/axiox";

export const saveWorkflowApi = (data) => {
    return api.post('/workflows/save', data);
};