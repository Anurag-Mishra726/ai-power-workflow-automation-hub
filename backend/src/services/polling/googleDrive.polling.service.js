import axios from "axios";
//import { getSafeIsoDate } from "./polling.service.js";

const driveActivityApi = axios.create({
  baseURL: "https://driveactivity.googleapis.com",
});


export const fetchDriveData = async (accessToken, lastCheckedTime, folderId, savedEvent) => {
    
  const filterTime =  new Date(lastCheckedTime).getTime(); /* new Date(getSafeIsoDate(`${lastCheckedTime}`)).getTime() // this returns 0 ??  */;
  const allActivities = [];

  const requestBody = {
    pageSize: 50,
    consolidationStrategy: { none: {} },
  };

  if (folderId && folderId.trim() !== "") {
    requestBody.ancestorName = `items/${folderId.trim()}`;
  }

  let pageToken = null;
  
  do {
    if (pageToken) requestBody.pageToken = pageToken;

    const response = await driveActivityApi.post(
      "/v2/activity:query",
      requestBody,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const activities = response.data.activities || [];
    allActivities.push(...activities);
    pageToken = response.data.nextPageToken || null;
  } while (pageToken);
  
  const newActivities = allActivities.filter((activity) => {
    const activityTime = activity.timestamp
      ? new Date(activity.timestamp).getTime()
      : activity.timeRange?.endTime
      ? new Date(activity.timeRange.endTime).getTime()
      : 0;
    return activityTime > filterTime;
  });

  const events = newActivities.map((activity) => {
    const action = activity.primaryActionDetail || {};
    const target = activity.targets?.[0]?.driveItem || {};
    const mimeType = target.mimeType;
    const isFolder = mimeType === "application/vnd.google-apps.folder";

    let eventType = "unknown";
    if (action.create)      eventType = isFolder ? "folder_created" : "file_created";
    else if (action.delete) eventType = isFolder ? "folder_deleted" : "file_deleted";
    else if (action.rename) eventType = isFolder ? "folder_renamed" : "file_renamed";
    else if (action.edit)   eventType = "file_updated";
    else if (action.move)   eventType = isFolder ? "folder_moved"   : "file_moved";
    
    return {                      // we can add old name also here. when event is renamed
      eventType,
      fileId: target.name?.replace("items/", "") || null,
      name: target.title || null,
      time: activity.timestamp || activity.timeRange?.endTime || null,
    };
  }).filter((event) => {
    if (!savedEvent) return true; 
    
    const allowedEvents = Array.isArray(savedEvent) ? savedEvent : [savedEvent];
    return allowedEvents.includes(event.eventType);
  });

  console.log(events);
  
  return { events };
};
