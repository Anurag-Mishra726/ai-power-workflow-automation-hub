import axios from "axios";
import pool from "../../../config/db.js";
import { Integration } from "../../../models/integration/integration.model.js";
import { AppError } from "../../../utils/AppErrors.js";

const googleOauthScopes = {

  googleDrive: [
      "https://www.googleapis.com/auth/drive.readonly",
      "https://www.googleapis.com/auth/drive",
      "https://www.googleapis.com/auth/drive.file"
  ],
// http://localhost:5000/api/integration/oauth/slack/connect?workflowId=ff181be3-f56c-494f-9700-abf76491653f
  gmail: [
      "https://www.googleapis.com/auth/gmail.readonly",
      "https://www.googleapis.com/auth/gmail.send",
      "https://www.googleapis.com/auth/gmail.modify",
  ],

  googleForm: [
      "https://www.googleapis.com/auth/forms.responses.readonly",
      "https://www.googleapis.com/auth/forms.body"
  ],

  googleSheet: [
      "https://www.googleapis.com/auth/spreadsheets.readonly",
      "https://www.googleapis.com/auth/spreadsheets"
  ]
};

export const getGoogleAuthUrl = async(userId, workflowId, provider) => {
    const base = "https://accounts.google.com/o/oauth2/v2/auth";

    const stateData = {
        workflowId: workflowId,
        userId: userId,
        provider: provider
    }

    const values = await Integration.getScopes({userId, provider: "google"});    

    const previousScopes = values?.scope?.split(" ") || [];

    const newScopes = googleOauthScopes[provider];

    const finalScopes = [...new Set([...previousScopes, ...newScopes])].join(" ");

    console.log("Final Scopes : ", finalScopes);

    const state = Buffer.from(JSON.stringify(stateData)).toString("base64");

    console.log("FinalScope", finalScopes);

    const params = new URLSearchParams({ 
        client_id: process.env.GOOGLE_CLIENT_ID,
        scope: finalScopes,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI,
        response_type: "code",
        access_type: "offline",
        include_granted_scopes: "true",
        state: state
    });

    return `${base}?${params.toString()}`;
}

export const handleGoogleCallback = async (code, userId) => {
    try {
        const formData = new URLSearchParams({
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET_KEY,
            redirect_uri: process.env.GOOGLE_REDIRECT_URI,
            code: code,
            grant_type: "authorization_code"
        });

        const response = await axios.post(
            "https://oauth2.googleapis.com/token",
            formData.toString(), 
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            }
        );

        const data = response.data;
        console.log("DATA!!!!!! ", data);
        return {
            userId: userId,
            provider: "google",
            scope: data.scope,
            tokenType: data.token_type,
            accessToken: data.access_token,
            refreshToken: data.refresh_token || null,
            //expiresAt: data.expires_in || null,           sometimes returns refreshToken and someTimes not ??
        };
    } catch (err) {
        console.error("Google OAuth Error:", err.response?.data || err.message);
        throw new AppError("Google OAuth failed", 500);
    }
}

export const saveGoogleIntegration = async (data) => {
    const connection = await pool.getConnection();

    const {
        userId,
        provider,
        teamId,
        name,
        accessToken,
        tokenType,
        scope,
        refreshToken,
        expiresAt,
        last_refreshed_at,
    } = data;

    try {
        await connection.beginTransaction();
        
        const result = await Integration.insertTokenProvider({
            userId, 
            provider, 
            teamId: teamId ?? null , 
            name: name ?? null,
        }, connection);

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
            message: "Google Integrated Successfully"
        }

    } catch (error) {
        await connection.rollback();
        console.error(error.message);
        throw new AppError("Something went wong!", 500);
    } finally {
        connection.release();
    }    
}
