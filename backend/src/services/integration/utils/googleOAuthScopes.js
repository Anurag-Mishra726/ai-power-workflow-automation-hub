export const googleOauthScopes = {

  googleDrive: [
        // Allows FlowAI to see/edit ONLY files it created (Safe & Recommended)
        "https://www.googleapis.com/auth/drive.file",
        // Needed to show a "File Picker" or folder dropdown in your UI
        "https://www.googleapis.com/auth/drive.metadata.readonly",
        // If your users need to READ files they didn't create (e.g. for an AI summary)
        "https://www.googleapis.com/auth/drive.readonly",
        // For monitoring changes across the drive (e.g. new files in a folder)
        "https://www.googleapis.com/auth/drive.activity"
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
        "https://www.googleapis.com/auth/forms.body.readonly",
        "https://www.googleapis.com/auth/spreadsheets.readonly",
      "https://www.googleapis.com/auth/spreadsheets"
  ],

  googleSheet: [
      "https://www.googleapis.com/auth/spreadsheets.readonly",
      "https://www.googleapis.com/auth/spreadsheets"
  ]
};