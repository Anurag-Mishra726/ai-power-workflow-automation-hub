import axios from "axios";
import { Integration } from "../../../models/integration/integration.model.js";
import { AppError } from "../../../utils/AppErrors.js";
import { googleOauthScopes } from "../utils/googleOAuthScopes.js";

const googleApi = axios.create({
    baseURL: "https://www.googleapis.com",
    timeout: 10000,
});

const getDriveFilesMetadata = async (accessToken) => {          // TODOs : handle pagination, in the nextPageToken there is token to get the more data if the limit exceeds 50 files, also handle the case when the file is in shared drive.
    const response = await googleApi.get("/drive/v3/files", {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        params: {
            pageSize: 50,
            orderBy: "modifiedTime desc",
            fields: "files(id,name,mimeType,size,modifiedTime,webViewLink,parents)",
            supportsAllDrives: true,
            includeItemsFromAllDrives: true,
        },
    });

    return (response.data.files || []).map((file) => ({
        fileId: file.id,
        name: file.name,
        mimeType: file.mimeType,
        size: file.size || null,
        modifiedTime: file.modifiedTime,
        webViewLink: file.webViewLink || null,
        parents: file.parents || [],
    }));
};

const getGmailMetadata = async (accessToken) => {
    const headers = {
        Authorization: `Bearer ${accessToken}`,
    };

    const [profileResponse, labelsResponse, messagesResponse] = await Promise.all([
        googleApi.get("/gmail/v1/users/me/profile", { headers }),
        googleApi.get("/gmail/v1/users/me/labels", { headers }),
        googleApi.get("/gmail/v1/users/me/messages", {
        headers,
        params: {
            maxResults: 20,
        },
        }),
    ]);

    const messages = messagesResponse.data.messages || [];

    const messageDetails = await Promise.all(
        messages.map((msg) =>
        googleApi.get(`/gmail/v1/users/me/messages/${msg.id}`, {
            headers,
            params: {
            format: "metadata",
            metadataHeaders: ["Subject", "From"],
            },
        })
        )
    );

    const recentMessages = messageDetails.map((res) => {
        const headers = res.data.payload?.headers || [];

        const subject =
        headers.find((h) => h.name === "Subject")?.value || "No Subject";

        const fromRaw =
        headers.find((h) => h.name === "From")?.value || "Unknown";

        const from = fromRaw.replace(/<.*>/, "").trim();

        return {
        id: res.data.id,
        subject,
        from,
        snippet: res.data.snippet,
        };
    });

    return {
        profile: {
        emailAddress: profileResponse.data.emailAddress,
        historyId: profileResponse.data.historyId,
        messagesTotal: profileResponse.data.messagesTotal,
        threadsTotal: profileResponse.data.threadsTotal,
        },
        labels: (labelsResponse.data.labels || []).map((label) => ({
        id: label.id,
        name: label.name,
        type: label.type,
        messagesTotal: label.messagesTotal,
        messagesUnread: label.messagesUnread,
        })),
        recentMessages,
    };
};

const getGoogleFormsMetadata = async (accessToken) => {
    const response = await googleApi.get("/drive/v3/files", {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        params: {
            q: "mimeType='application/vnd.google-apps.form' and trashed=false",
            pageSize: 50,
            orderBy: "modifiedTime desc",
            fields: "files(id,name,mimeType,modifiedTime,webViewLink)",
            supportsAllDrives: true,
            includeItemsFromAllDrives: true,
        },
    });

    return (response.data.files || []).map((form) => ({
        formId: form.id,
        title: form.name,
        modifiedTime: form.modifiedTime,
        webViewLink: form.webViewLink || null,
    }));
};

const getProviderMetadata = async (provider, accessToken) => {
    //console.log(accessToken);
    if (provider === "googleDrive") {
        return {
            files: await getDriveFilesMetadata(accessToken),
        };
    }

    if (provider === "gmail") {
        return await getGmailMetadata(accessToken);
    }

    if (provider === "googleForm") {
        return {
            forms: await getGoogleFormsMetadata(accessToken),
        };
    }

    throw new AppError("Unsupported Google Provider!", 400);
};

export const getGoogleIntegration = async (userId, provider) => {
    const data = await Integration.getIntegration({ userId, provider: "google" });
    const requiredScopes = googleOauthScopes[provider].join(" ") || null;

    if (data.length === 0 || !requiredScopes) {
        return {
            success: true,
            message: "No Integration exist.",
            data: [],
        };
    }

    const authorisedScopes = data[0].scope ? data[0].scope.split(" ") : [];
    const hasRequiredScopes = requiredScopes.split(" ").every((scope) => authorisedScopes.includes(scope));

    if (!hasRequiredScopes) {
        return {
            success: false,
            message: "Insufficient permissions for the requested provider.",
            data: [],
        };
    }

    try {
        const integrationsWithMetadata = await Promise.all(
            data.map(async (integration) => ({
                id: integration.id,
                name: integration.name,
                provider: integration.provider,
                external_id: integration.external_id,
                metadata: await getProviderMetadata(provider, integration.access_token),
            }))
        );

        return {
            success: true,
            message: "All Integration Fetched.",
            data: integrationsWithMetadata,
        };
    } catch (error) {
        console.error("Google Integration CRUD Error:", error.response?.data || error.message);
        throw new AppError("Failed to fetch Google integration metadata", 500);
    }
};
