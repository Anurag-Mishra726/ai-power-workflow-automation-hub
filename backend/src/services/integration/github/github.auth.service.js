import axios from "axios";
import pool from "../../../config/db.js";
import { Integration } from "../../../models/integration/integration.model.js";
import { AppError } from "../../../utils/AppErrors.js";

export const getGithubAuthUrl = (userId, workflowId, provider) => {
    const base = "https://github.com/login/oauth/authorize";

    const stateData = {
        workflowId: workflowId,
        userId: userId,
        provider: provider,
    };

    const state = Buffer.from(JSON.stringify(stateData)).toString("base64");

    const params = new URLSearchParams({
        client_id: process.env.GITHUB_CLIENT_ID,
        redirect_uri: process.env.GITHUB_REDIRECT_URI,
        scope: process.env.GITHUB_SCOPES || "read:user user:email",
        state,
    });

    return `${base}?${params.toString()}`;
};

export const handleGithubCallback = async (code, userId) => {
    try {
        const formData = new URLSearchParams({
            client_id: process.env.GITHUB_CLIENT_ID,
            client_secret: process.env.GITHUB_CLIENT_SECRET_KEY,
            code,
            redirect_uri: process.env.GITHUB_REDIRECT_URI,
        });

        const tokenResponse = await axios.post(
            "https://github.com/login/oauth/access_token",
            formData.toString(),
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    Accept: "application/json",
                },
            }
        );

        const tokenData = tokenResponse.data;

        console.log("TokenData :", tokenData);

        if (!tokenData?.access_token) {
            throw new AppError("GitHub OAuth failed", 500);
        }

        const profileResponse = await axios.get("https://api.github.com/user", {
            headers: {
                Authorization: `Bearer ${tokenData.access_token}`,
                Accept: "application/vnd.github+json",
                "X-GitHub-Api-Version": "2022-11-28",
            },
        });

        const profile = profileResponse.data;

        console.log("Profile :", profile);

        return {
            userId,
            provider: "github",
            externalId: String(profile.id),
            name: profile.name || profile.login,
            scope: tokenData.scope || null,
            tokenType: tokenData.token_type || "bearer",
            accessToken: tokenData.access_token,
            refreshToken: tokenData.refresh_token || null,
            expiresAt: tokenData.expires_in
                ? new Date(Date.now() + tokenData.expires_in * 1000)
                : null,
            last_refreshed_at: new Date(),
        };
    } catch (error) {
        console.error("GitHub OAuth Error:", error.response?.data || error.message);
        throw new AppError("GitHub OAuth failed", 500);
    }
};

export const saveGithubIntegration = async (data) => {
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

        const result = await Integration.insertTokenProvider(
            {
                userId,
                provider,
                externalId,
                name,
            },
            connection
        );

        const integrationId = result.insertId;

        await Integration.insertOAuthToken(
            {
                integrationId,
                accessToken,
                refreshToken: refreshToken ?? null,
                tokenType: tokenType ?? null,
                scope: scope ?? null,
                expiresAt: expiresAt ?? null,
                last_refreshed_at: last_refreshed_at ?? null,
            },
            connection
        );

        await connection.commit();

        return {
            success: true,
            message: "GitHub Integrated Successfully",
        };
    } catch (error) {
        await connection.rollback();
        console.error(error.message);
        throw new AppError("Something went wong!", 500);
    } finally {
        connection.release();
    }
};
