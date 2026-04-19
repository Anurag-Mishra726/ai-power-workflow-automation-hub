import axios from "axios";

const googleFormsApi = axios.create({
  baseURL: "https://forms.googleapis.com",
  timeout: 15000,
});

export const fetchGoogleFormData = async (accessToken, lastCheckedTime, formId) => {
    const filterTime = lastCheckedTime 
        ? new Date(lastCheckedTime).toISOString() 
        : new Date(Date.now() - 5 * 60000).toISOString();

    if (!formId || formId.trim() === "") {
        return { events: [] };
    }

    const response = await googleFormsApi.get(`/v1/forms/${formId.trim()}/responses`, {
        params: {
        filter: `timestamp > ${filterTime}` 
        },
        headers: {
        Authorization: `Bearer ${accessToken}`,
        }
    });

    const responseData = response.data.responses || []

    return {
        payload: responseData,
        newLastChecked: new Date().toISOString(),   // Update last checked time to now to do something with it in future
    }         
};
