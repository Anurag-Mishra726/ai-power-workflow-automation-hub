import axios from "axios";
import jwt from "jsonwebtoken";
import pool from "../../../config/db.js";
import { Integration } from "../../../models/integration/integration.model.js";
import { AppError } from "../../../utils/AppErrors.js";
import { googleOauthScopes } from "../utils/googleOAuthScopes.js";

export const getGoogleAuthUrl = async(userId, workflowId, provider) => {
    const base = "https://accounts.google.com/o/oauth2/v2/auth";

    const stateData = {
        workflowId: workflowId,
        userId: userId,
        provider: provider
    }

    const state = Buffer.from(JSON.stringify(stateData)).toString("base64");

    const finalScopes = googleOauthScopes[provider].join(" ");

    const params = new URLSearchParams({ 
        client_id: process.env.GOOGLE_CLIENT_ID,
        scope:"openid profile email " + finalScopes,
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
        const id = jwt.decode(data.id_token);
        const externalId = id.sub;
        const name = id.name || null;                                   // if needed we can als store email: as id.email
        const expiryIn = new Date(Date.now() + data.expires_in * 1000);

        return {
            userId: userId,
            provider: "google",
            externalId: externalId,
            name: name,
            scope: data.scope,
            tokenType: data.token_type,
            accessToken: data.access_token,
            refreshToken: data.refresh_token || null,
            expiresAt: expiryIn || null,
            last_refreshed_at: new Date(),               
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
        externalId,
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
            externalId: externalId ?? null , 
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
