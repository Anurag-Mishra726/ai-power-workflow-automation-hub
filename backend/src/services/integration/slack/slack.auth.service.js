import pool from "../../../config/db.js";
import axios from "axios";
import { Integration } from "../../../models/integration/integration.model.js";
import { AppError } from "../../../utils/AppErrors.js";

export const getSlackAuthUrl = (workflowId, userId) => {
    const base = "https://slack.com/oauth/v2/authorize";
    console.log("userId::", userId);
    const stateData = {
        workflowId: workflowId,
        userId: userId
    }

    const state = Buffer.from(JSON.stringify(stateData)).toString("base64");

    const params = new URLSearchParams({ 
        client_id: process.env.SLACK_CLIENT_ID,
        scope: process.env.SLACK_SCOPES,
        redirect_uri: process.env.SLACK_REDIRECT_URI,
        state: state
    });

    return `${base}?${params.toString()}`;
}

export const handleSlackCallback = async (code, userId) => {
    const formData = new URLSearchParams({
        client_id: process.env.SLACK_CLIENT_ID,
        client_secret: process.env.SLACK_CLIENT_SECRET_KEY,
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
    //console.log("SLACK OAUTH : ", data);

    return {
        userId: userId,
        provider: "slack",
        scope: data.scope,
        tokenType: data.token_type,
        accessToken: data.access_token,
        teamId: data.team.id,
        name: data.team.name,
    }
}

export const saveSlackIntegration = async (data) => {
    const connection = await pool.getConnection();

    console.log("From services . js",data);

    const {
        userId,
        provider,
        teamId,
        name,
        accessToken,
        scope
    } = data;

    try {
        await connection.beginTransaction();

        const result = await Integration.insertTokenProvider({userId, provider, teamId, name}, connection);
        const integrationId = result.insertId;

        await Integration.insertOAuthToken({
            integrationId, 
            accessToken, 
            refreshToken: refreshToken ?? null, 
            tokenType: tokenType ?? null, 
            scope: scope ?? null, 
            expiresAt: expiresAt ?? null, 
            last_refreshed_at: last_refreshed_at ?? null 
        }, connection);

        await connection.commit();

        return {
            success: true,
            message: "Slack Integrated Successfully"
        }

    } catch (error) {
        await connection.rollback();
        throw new AppError("Something went wong!", 500);
    } finally {
        connection.release();
    }    
}
