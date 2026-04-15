import axios from "axios";
//import { getSafeIsoDate } from "./polling.service.js";

const googleApi = axios.create({
  baseURL: "https://www.googleapis.com",
  timeout: 15000,
});


export const fetchGmailData = async (accessToken, lastChecked, senderEmail, label) => {
//   const lastCheckedSeconds = Math.floor(
//     new Date(getSafeIsoDate(lastChecked)).getTime() / 1000
//   ); this return 0 ?

  const lastCheckedSeconds = Math.floor(
    new Date(lastChecked).getTime() / 1000
  );

  let searchQuery = `after:${lastCheckedSeconds} label:${label}`;

  if (senderEmail && senderEmail.trim() !== "") {
    searchQuery += ` from:${senderEmail}`;
  }

  const response = await googleApi.get("/gmail/v1/users/me/messages", {
    headers: { Authorization: `Bearer ${accessToken}` },
    params: { maxResults: 10, q: searchQuery },
  });
  console.log("Response Gmail : ", response.data);
  const currentIds = (response.data.messages || []).map((m) => m.id);
  console.log("Gmail Messages:", currentIds);
  return {
    ids: currentIds,
    newLastChecked: new Date().toISOString(),   // Update last checked time to now to do something with it in future
  };
};
