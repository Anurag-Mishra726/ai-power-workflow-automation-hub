import axios from "axios";
import jwt from "jsonwebtoken";
import pool from "../../../config/db.js";
import { Integration } from "../../../models/integration/integration.model.js";
import { AppError } from "../../../utils/AppErrors.js";

const googleOauthScopes = {

  googleDrive: [
        // Allows FlowAI to see/edit ONLY files it created (Safe & Recommended)
        "https://www.googleapis.com/auth/drive.file",
        // Needed to show a "File Picker" or folder dropdown in your UI
        "https://www.googleapis.com/auth/drive.metadata.readonly",
        // If your users need to READ files they didn't create (e.g. for an AI summary)
        "https://www.googleapis.com/auth/drive.readonly"
  ],

  gmail: [
        // For Triggers: To read email content to process it
        "https://www.googleapis.com/auth/gmail.readonly",
        // For Actions: To send automated replies or alerts
        "https://www.googleapis.com/auth/gmail.send",
        // For Organization: To add labels or move to trash after processing
        "https://www.googleapis.com/auth/gmail.modify",
        // Specifically for managing labels in triggers
        "https://www.googleapis.com/auth/gmail.labels"
  ],

  googleForm: [
        // Essential for "On Form Submit" triggers
        "https://www.googleapis.com/auth/forms.responses.readonly",
        // Allows FlowAI to read form structure/questions
        "https://www.googleapis.com/auth/forms.body.readonly"
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

    const state = Buffer.from(JSON.stringify(stateData)).toString("base64");

    const finalScopes = googleOauthScopes[provider].join(" ");

    const params = new URLSearchParams({ 
        client_id: process.env.GOOGLE_CLIENT_ID,
        scope:"openid " + finalScopes,
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
        const expiryIn = new Date(Date.now() + data.expires_in * 1000);

        console.log("DATA!!!!!! ", data);
        return {
            userId: userId,
            provider: "google",
            externalId: externalId,
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


const drive = {
    "success": true,
    "message": "All Integration Fetched.",
    "data": [
        {
            "id": 30,
            "name": null,
            "provider": "google",
            "external_id": "102130779000759217751",
            "metadata": {
                "files": [
                    {
                        "fileId": "17mKlqvHj0UsjnN9A5OB9Cyk1lCDHYtq2",
                        "name": "aictelogo.png",
                        "mimeType": "image/png",
                        "size": "22107",
                        "modifiedTime": "2026-02-05T17:06:50.000Z",
                        "webViewLink": "https://drive.google.com/file/d/17mKlqvHj0UsjnN9A5OB9Cyk1lCDHYtq2/view?usp=drivesdk"
                    },
                    {
                        "fileId": "1CSVX94bXfiCeAdrqYVG9yPV3XR9dG72l",
                        "name": "MARKSHEET-12.pdf",
                        "mimeType": "application/pdf",
                        "size": "1269243",
                        "modifiedTime": "2026-01-12T10:32:32.000Z",
                        "webViewLink": "https://drive.google.com/file/d/1CSVX94bXfiCeAdrqYVG9yPV3XR9dG72l/view?usp=drivesdk"
                    },
                    {
                        "fileId": "15Eng2dnTJ_zf4L-7h2jC9ZUGlsJK0VGy",
                        "name": "RESULT.pdf",
                        "mimeType": "application/pdf",
                        "size": "386450",
                        "modifiedTime": "2026-01-12T10:26:41.000Z",
                        "webViewLink": "https://drive.google.com/file/d/15Eng2dnTJ_zf4L-7h2jC9ZUGlsJK0VGy/view?usp=drivesdk"
                    },
                    {
                        "fileId": "1qlrDor9-S6IGC4FavVw1-BIdbdpwDweW",
                        "name": "MARKSHEET.pdf",
                        "mimeType": "application/pdf",
                        "size": "964429",
                        "modifiedTime": "2026-01-12T10:04:38.000Z",
                        "webViewLink": "https://drive.google.com/file/d/1qlrDor9-S6IGC4FavVw1-BIdbdpwDweW/view?usp=drivesdk"
                    },
                    {
                        "fileId": "15plb4UDkFo7Wx4JIeW8EyecjREDO-Ovs",
                        "name": "ID-CARD.pdf",
                        "mimeType": "application/pdf",
                        "size": "408583",
                        "modifiedTime": "2026-01-12T09:54:36.000Z",
                        "webViewLink": "https://drive.google.com/file/d/15plb4UDkFo7Wx4JIeW8EyecjREDO-Ovs/view?usp=drivesdk"
                    },
                    {
                        "fileId": "1gzfGEUJAJpmmKcQsinXj0yMVfarWLuOhLguSGSHtOE1bxG0Q8KQ8mH7EKhXjex8zBPRkbDXX",
                        "name": "ESFP-I (August 2024 Batch) A and B",
                        "mimeType": "application/vnd.google-apps.folder",
                        "size": null,
                        "modifiedTime": "2024-11-17T02:08:59.762Z",
                        "webViewLink": "https://drive.google.com/drive/folders/1gzfGEUJAJpmmKcQsinXj0yMVfarWLuOhLguSGSHtOE1bxG0Q8KQ8mH7EKhXjex8zBPRkbDXX"
                    },
                    {
                        "fileId": "1wybN9AwxR5UW83g1V2Uut6EfhvYIuDI3_aFvDQSzk67FT34ddqcQjdocK1viaJsrUeomM010",
                        "name": "Classroom",
                        "mimeType": "application/vnd.google-apps.folder",
                        "size": null,
                        "modifiedTime": "2024-11-17T02:08:59.724Z",
                        "webViewLink": "https://drive.google.com/drive/folders/1wybN9AwxR5UW83g1V2Uut6EfhvYIuDI3_aFvDQSzk67FT34ddqcQjdocK1viaJsrUeomM010"
                    },
                ]
            }
        }
    ]
}


const gmail = {
    "success": true,
    "message": "All Integration Fetched.",
    "data": [
        {
            "id": 30,
            "name": null,
            "provider": "google",
            "external_id": "102130779000759217751",
            "metadata": {
                "profile": {
                    "emailAddress": "anuragmishra1192004@gmail.com",
                    "historyId": "142652",
                    "messagesTotal": 824,
                    "threadsTotal": 802
                },
                "labels": [
                    {
                        "id": "CHAT",
                        "name": "CHAT",
                        "type": "system"
                    },
                    {
                        "id": "SENT",
                        "name": "SENT",
                        "type": "system"
                    },
                    {
                        "id": "INBOX",
                        "name": "INBOX",
                        "type": "system"
                    },
                    {
                        "id": "IMPORTANT",
                        "name": "IMPORTANT",
                        "type": "system"
                    },
                    {
                        "id": "TRASH",
                        "name": "TRASH",
                        "type": "system"
                    },
                    {
                        "id": "DRAFT",
                        "name": "DRAFT",
                        "type": "system"
                    },
                    {
                        "id": "SPAM",
                        "name": "SPAM",
                        "type": "system"
                    },
                    {
                        "id": "CATEGORY_FORUMS",
                        "name": "CATEGORY_FORUMS",
                        "type": "system"
                    },
                    {
                        "id": "CATEGORY_UPDATES",
                        "name": "CATEGORY_UPDATES",
                        "type": "system"
                    },
                    {
                        "id": "CATEGORY_PERSONAL",
                        "name": "CATEGORY_PERSONAL",
                        "type": "system"
                    },
                    {
                        "id": "CATEGORY_PROMOTIONS",
                        "name": "CATEGORY_PROMOTIONS",
                        "type": "system"
                    },
                    {
                        "id": "CATEGORY_SOCIAL",
                        "name": "CATEGORY_SOCIAL",
                        "type": "system"
                    },
                    {
                        "id": "STARRED",
                        "name": "STARRED",
                        "type": "system"
                    },
                    {
                        "id": "UNREAD",
                        "name": "UNREAD",
                        "type": "system"
                    }
                ],
                "recentMessages": [
                    {
                        "id": "19d5340c41b4467f",
                        "threadId": "19d52cf6a6fed695"
                    },
                    {
                        "id": "19d53261346a263d",
                        "threadId": "19d53261346a263d"
                    },
                    {
                        "id": "19d530fbc54fe635",
                        "threadId": "19d52cf6a6fed695"
                    },
                    {
                        "id": "19d530f8c284ad86",
                        "threadId": "19d530f8c284ad86"
                    },
                    {
                        "id": "19d52cf6a6fed695",
                        "threadId": "19d52cf6a6fed695"
                    },
                    {
                        "id": "19d51ea61da6921e",
                        "threadId": "19d51ea61da6921e"
                    },
                    {
                        "id": "19d51aac2ca200c7",
                        "threadId": "19d51aac2ca200c7"
                    },
                    {
                        "id": "19d4f2a712312852",
                        "threadId": "19d4f2a712312852"
                    },
                    {
                        "id": "19d4e79955c47093",
                        "threadId": "19d4e79955c47093"
                    },
                    {
                        "id": "19d4e3c14c25b3b7",
                        "threadId": "19d4e3c14c25b3b7"
                    },
                    {
                        "id": "19d4de00fcbd1ad2",
                        "threadId": "19d4de00fcbd1ad2"
                    },
                    {
                        "id": "19d4cc9d940af8e0",
                        "threadId": "19d4cc9d940af8e0"
                    },
                    {
                        "id": "19d4c8469bd2359b",
                        "threadId": "19d4c8469bd2359b"
                    },
                    {
                        "id": "19d4bd7de5b55a8c",
                        "threadId": "19d4bd7de5b55a8c"
                    },
                    {
                        "id": "19d4a34f3615ca47",
                        "threadId": "19d4a34f3615ca47"
                    },
                    {
                        "id": "19d4984b10ae25d7",
                        "threadId": "19d4984b10ae25d7"
                    },
                    {
                        "id": "19d49557f7104a80",
                        "threadId": "19d49557f7104a80"
                    },
                    {
                        "id": "19d48a699b888d15",
                        "threadId": "19d48a699b888d15"
                    },
                    {
                        "id": "19d475f39c2c38d0",
                        "threadId": "19d475f39c2c38d0"
                    },
                    {
                        "id": "19d44bb468858c40",
                        "threadId": "19d44bb468858c40"
                    }
                ]
            }
        }
    ]
}