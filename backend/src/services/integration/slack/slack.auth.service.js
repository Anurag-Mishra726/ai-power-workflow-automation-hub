import axios from "axios";
import { AppError } from "../../../utils/AppErrors.js";

export const getSlackAuthUrl = (workflowId) => {
    const base = "https://slack.com/oauth/v2/authorize";

    const params = new URLSearchParams({
        client_id: process.env.SLACK_CLIENT_ID,
        scope: process.env.SLACK_SCOPES,
        redirect_uri: process.env.SLACK_REDIRECT_URI,
        state: workflowId
    });

    return `${base}?${params.toString()}`;
}

export const handleSlackCallback = async (code) => {
    const formData = new URLSearchParams({
        client_id: process.env.SLACK_CLIENT_ID,
        client_secret: process.env.SLACK_CLIENT_SECRET,
        code: code,
        redirect_uri: process.env.SLACK_REDIRECT_URI,
    });
    const response = await axios.post(
        "https://slack.com/api/oauth.v2.access",
        formData.toString(), 
        {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        }
    );
    
    const data = response.data;

    if (!data.ok) {
        console.error("Slack Error:", data.error);
        throw new AppError("Slack OAuth failed", 500);
    }

    const botToken = data.access_token;
    const teamId = data.team.id;
    const teamName = data.team.name; 
    console.log("SLACK OAUTH : ");
    console.log({ botToken, teamId, teamName });

    return {
        success: true
    }
}
// todos fix the call back url