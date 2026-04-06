export const GMAIL_TRIGGER_EVENT_OPTIONS = [
  { value: 'new_email', label: 'New Email Received' },
  { value: 'email_from_sender', label: 'Email From Specific Sender' },
];

export const GMAIL_ACTION_EVENT_OPTIONS = [
  { value: 'send_email', label: 'Send Email' },
  { value: 'delete_email', label: 'Delete Email' },
];

export const GOOGLE_DRIVE_TRIGGER_EVENT_OPTIONS = [
  { value: 'file_created', label: 'File Created' },
  { value: 'file_updated', label: 'File Updated' },
  { value: 'file_deleted', label: 'File Deleted' },
  { value: 'folder_created', label: 'Folder Created' },
  { value: 'folder_deleted', label: 'Folder Deleted' },
];

export const GOOGLE_DRIVE_ACTION_EVENT_OPTIONS = [
  {
    label: 'File Actions',
    options: [
      //{ value: 'upload_file', label: 'Upload File' },
      { value: 'create_file', label: 'Create File' },
      { value: 'delete_file', label: 'Delete File' },
    ],
  },
  {
    label: 'Folder Actions',
    options: [
      { value: 'create_folder', label: 'Create Folder' },
      { value: 'delete_folder', label: 'Delete Folder' },
    ],
  },
];
