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

export const GITHUB_TRIGGER_OPTIONS = [
  { value: 'push', label: 'Push' },
  { value: 'pull_request_opened', label: 'Pull Request Opened' },
  { value: 'pull_request_merged', label: 'Pull Request Merged' },
  { value: 'issue_created', label: 'Issue Created' },
  { value: 'issue_closed', label: 'Issue Closed' },
  { value: 'issue_comment_added', label: 'Issue Comment Added' },
];

export const GITHUB_ACTION_OPTIONS = [
  { value: 'create_issue', label: 'Create Issue' },
  { value: 'comment_on_issue', label: 'Comment on Issue' },
  { value: 'create_pull_request', label: 'Create Pull Request' },
  { value: 'create_file', label: 'Create File' },
  { value: 'update_file', label: 'Update File' },
]
