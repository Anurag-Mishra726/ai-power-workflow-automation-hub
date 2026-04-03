import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { Braces, ChevronRight, FileText, FolderOpen, Plus, CalendarPlus, FileBraces } from 'lucide-react';
import toast from 'react-hot-toast';
import useEditorUIStore from '@/stores/workflowEditorStore';

const formatBytes = (bytes) => {
  const size = Number(bytes);

  if (!Number.isFinite(size) || size <= 0) return '0 B';

  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const unitIndex = Math.min(Math.floor(Math.log(size) / Math.log(1024)), units.length - 1);
  const value = size / 1024 ** unitIndex;

  return `${value.toFixed(value >= 10 ? 0 : 1)} ${units[unitIndex]}`;
};

const formatDate = (isoDate) => {
  if (!isoDate) return 'N/A';
  const date = new Date(isoDate);

  if (Number.isNaN(date.getTime())) return 'N/A';

  return date.toLocaleString();
};

const GOOGLE_DRIVE_FOLDER_MIME_TYPE = 'application/vnd.google-apps.folder';

const TRIGGER_EVENT_OPTIONS = [
  { value: 'file_created', label: 'File Created' },
  { value: 'file_updated', label: 'File Updated' },
  { value: 'file_deleted', label: 'File Deleted' },
  { value: 'folder_created', label: 'Folder Created' },
];

const ACTION_EVENT_GROUPS = [
  {
    label: 'Folder Actions',
    options: [
      { value: 'create_folder', label: 'Create Folder' },
      { value: 'delete_folder', label: 'Delete Folder' },
    ],
  },
  {
    label: 'File Actions',
    options: [
      { value: 'upload_file', label: 'Upload File' },
      { value: 'delete_file', label: 'Delete File' },
    ],
  },
];

// todos : on create folder event show a input to input name for that folder and on the upload file event show input to enter the url for that file or input to upload file. and in the delete file show the file name and user will select file to delete.

const ConfigState = ({ data, handleConnect, selectedNode, setNodeConfig }) => {
  const { setIsConfigSidebarClose } = useEditorUIStore();
  const isTriggerNode = selectedNode?.type === 'trigger';
  const isActionNode = selectedNode?.type === 'action';

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      variable: '',
      driveId: '',
      event: '',
      folderId: '',
      fileId: '',
    },
  });

  useEffect(() => {
    if (!Array.isArray(data) || data.length === 0) return;

    const prefilledDriveId = selectedNode?.data?.config?.driveId || data[0]?.external_id || '';
    reset({
      variable: selectedNode?.data?.config?.variable || '',
      driveId: prefilledDriveId,
      event:
        selectedNode?.data?.config?.event ||
        (isTriggerNode ? TRIGGER_EVENT_OPTIONS[0].value : ACTION_EVENT_GROUPS[0].options[0].value),
      folderId: selectedNode?.data?.config?.folderId || '',
      fileId: selectedNode?.data?.config?.fileId || '',
    });
  }, [
    data,
    isTriggerNode,
    reset,
    selectedNode?.data?.config?.driveId,
    selectedNode?.data?.config?.event,
    selectedNode?.data?.config?.fileId,
    selectedNode?.data?.config?.folderId,
    selectedNode?.data?.config?.variable,
  ]);

  const watchVariable = watch('variable') || '';
  const selectedDriveId = watch('driveId');
  const selectedFolderId = watch('folderId');
  const selectedFileId = watch('fileId');

  const selectedDrive = useMemo(() => {
    return data.find((item) => item.external_id === selectedDriveId) || data[0];
  }, [data, selectedDriveId]);

  const selectedDriveFiles = useMemo(() => selectedDrive?.metadata?.files || [], [selectedDrive?.metadata?.files]);
  const availableFolders = useMemo(
    () => selectedDriveFiles.filter((file) => file.mimeType === GOOGLE_DRIVE_FOLDER_MIME_TYPE),
    [selectedDriveFiles]
  );

  const availableFiles = useMemo(() => {
    const filesOnly = selectedDriveFiles.filter((file) => file.mimeType !== GOOGLE_DRIVE_FOLDER_MIME_TYPE);

    if (selectedFolderId) {
      return filesOnly.filter((file) => Array.isArray(file.parents) && file.parents.includes(selectedFolderId));
    }

    // When no folder is selected in action mode, treat this as "My root files" in UI.
    return filesOnly;
  }, [selectedDriveFiles, selectedFolderId]);

  useEffect(() => {
    if (!isActionNode) return;

    const selectedFileExists = availableFiles.some((file) => file.fileId === selectedFileId);
    if (!selectedFileExists) {
      setValue('fileId', availableFiles[0]?.fileId || '');
    }
  }, [availableFiles, isActionNode, selectedFileId, setValue]);

  const onSubmit = async (formData) => {
    const selectedDriveItem = data.find((item) => item.external_id === formData.driveId);

    const status = await setNodeConfig({
      ...formData,
      driveName: selectedDriveItem?.name || selectedDriveItem?.email || 'Google Drive',
    });

    if (status.success) {
      toast.success('Google Drive Node Configured Successfully');
      setIsConfigSidebarClose();
      return;
    }

    toast.error('Something went wrong while saving configuration.');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
        <section className="space-y-3">
          <label className="text-sm font-bold uppercase tracking-wider text-zinc-200 flex items-center gap-2">
            <Braces size={18} /> Variable
          </label>
          <input
            {...register('variable', {
              required: 'Variable name is required.',
              minLength: { value: 3, message: 'Min 3 chars.' },
              maxLength: { value: 15, message: 'Max 15 chars' },
            })}
            placeholder="eg. myDrive"
            className="flex rounded-md w-full bg-zinc-900 border border-zinc-700 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#1B73E8]/50"
          />
          <p className="text-[12px] mt-1 text-zinc-400">
            Reference this node&apos;s output in other nodes:{' '}
            <span className="text-white text-[13px]">{`{{${watchVariable.trim()}.output.data}}`}</span>
            <span className="text-[12px] text-zinc-400"> {' '}← Copy this syntax</span>
          </p>
          {errors.variable && <p className="text-[10px] text-red-500 font-medium">{errors.variable.message}</p>}
        </section>
        

        {/* <section className="space-y-3">
          <label className="text-sm font-bold uppercase tracking-wider text-zinc-200 flex items-center gap-2">
            <FolderOpen size={16} /> Connected Drive
          </label>
          <div className="relative">
            <FolderOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <select
              {...register('driveId', { required: true })}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B73E8]/50 appearance-none transition-all cursor-pointer hover:bg-zinc-800/50"
            >
              <option value="" disabled>Select Drive account</option>
              {data.map((drive) => (
                <option key={drive.external_id} value={drive.external_id}>
                  {drive.name || drive.email || drive.external_id}
                </option>
              ))}
            </select>
            <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 rotate-90 pointer-events-none" />
          </div>
        </section> */}

        <section className="space-y-3">
          <label className="text-sm font-bold uppercase tracking-wider text-zinc-200 flex items-center gap-2">
           <CalendarPlus size={16} /> Event
          </label>
          <div className="relative">
            <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <select
              {...register('event', { required: true })}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B73E8]/50 appearance-none transition-all cursor-pointer hover:bg-zinc-800/50"
            >
              {isTriggerNode &&
                TRIGGER_EVENT_OPTIONS.map((eventOption) => (
                  <option key={eventOption.value} value={eventOption.value}>
                    {eventOption.label}
                  </option>
                ))}

              {isActionNode &&
                ACTION_EVENT_GROUPS.map((group) => (
                  <optgroup key={group.label} label={group.label}>
                    {group.options.map((eventOption) => (
                      <option key={eventOption.value} value={eventOption.value}>
                        {eventOption.label}
                      </option>
                    ))}
                  </optgroup>
                ))}
            </select>
            <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 rotate-90 pointer-events-none" />
          </div>
        </section>

        <section className="space-y-3">
          <label className="text-sm font-bold uppercase tracking-wider text-zinc-200 flex items-center gap-2">
            <FolderOpen size={16} /> Folder (Optional)
          </label>
          <div className="relative">
            <FolderOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <select
              {...register('folderId')}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B73E8]/50 appearance-none transition-all cursor-pointer hover:bg-zinc-800/50"
            >
              <option value="">No folder selected</option>
              {availableFolders.map((folder) => (
                <option key={folder.fileId} value={folder.fileId}>
                  {folder.name || 'Untitled folder'}
                </option>
              ))}
            </select>
            <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 rotate-90 pointer-events-none" />
          </div>
          {isTriggerNode ? (
            <p className="text-xs text-zinc-400">
              {selectedFolderId
                ? 'This trigger will watch the selected folder only.'
                : 'No folder selected — this trigger will watch your entire Drive.'}
            </p>
          ) : (
            <p className="text-xs text-zinc-400">
              {selectedFolderId
                ? 'Selected folder: showing files for this folder.'
                : 'No folder selected: showing files from your Drive root view.'}
            </p>
          )}
        </section>

        {isActionNode && (
          <>
          <section className="space-y-3">
            <label className="text-sm font-bold uppercase tracking-wider text-zinc-200 flex items-center gap-2">
              <FileBraces size={16} /> File
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <select
                {...register('fileId')}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B73E8]/50 appearance-none transition-all cursor-pointer hover:bg-zinc-800/50"
              >
                {availableFiles.length === 0 ? (
                  <option value="">No files available</option>
                ) : (
                  availableFiles.map((file) => (
                    <option key={file.fileId} value={file.fileId}>
                      {file.name || 'Unnamed file'}
                    </option>
                  ))
                )}
              </select>
              <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 rotate-90 pointer-events-none" />
            </div>
          </section>

          <section className="space-y-3">
            <label className="text-sm font-bold uppercase tracking-wider text-zinc-200 flex items-center gap-2">
              <FolderOpen size={16} /> Files
            </label>
            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {availableFiles.length > 0 ? (
                availableFiles.map((file) => (
                  <div key={file.fileId} className="border border-zinc-800 rounded-lg p-3 bg-zinc-900/40">
                    <div className="flex items-center gap-2 text-zinc-100">
                      <FileText size={14} className="text-blue-400" />
                      <p className="text-sm font-medium truncate">{file.name || 'Unnamed file'}</p>
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-zinc-400">
                      <p>Type: {file.mimeType || 'N/A'}</p>
                      <p>Size: {formatBytes(file.size)}</p>
                      <p>Updated: {formatDate(file.modifiedTime)}</p>
                      <a
                        href={file.webViewLink || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 underline"
                      >
                        Open file
                      </a>
                    </div>
                  </div>
                ))
              ) : (
                <div className="border border-dashed border-zinc-700 rounded-lg p-3 text-xs text-zinc-400">
                  No files available for the selected folder.
                </div>
              )}
            </div>
          </section>
        </>
        )}

       

        <section>
          <button
            type="button"
            onClick={handleConnect}
            className="flex items-center justify-center gap-2 bg-[#1B73E8] hover:bg-[#1763c8] text-white text-sm font-semibold py-3 px-4 rounded-xl transition-all active:scale-[0.98]"
          >
            <Plus size={15} /> Connect Another Drive
          </button>
        </section>
      </div>

      <div className="border-t border-zinc-600 px-4 py-3 flex justify-end bg-zinc-900/50">
        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 bg-white text-black font-bold py-3 rounded-xl hover:bg-zinc-200 transition-colors"
        >
          Save Configuration
        </button>
      </div>
    </form>
  );
};

export default ConfigState;


// import { useEffect, useMemo } from 'react';
// import { useForm } from 'react-hook-form';
// import { Braces, ChevronRight, FileText, FolderOpen, Plus, CalendarPlus, FileBraces } from 'lucide-react';
// import toast from 'react-hot-toast';
// import useEditorUIStore from '@/stores/workflowEditorStore';

// const GOOGLE_DRIVE_FOLDER_MIME_TYPE = 'application/vnd.google-apps.folder';

// const TRIGGER_EVENT_OPTIONS = [
//   { value: 'file_created', label: 'File Created' },
//   { value: 'file_updated', label: 'File Updated' },
//   { value: 'file_deleted', label: 'File Deleted' },
//   { value: 'folder_created', label: 'Folder Created' },
// ];

// const ACTION_EVENT_GROUPS = [
//   {
//     label: 'Folder Actions',
//     options: [
//       { value: 'create_folder', label: 'Create Folder' },
//       { value: 'delete_folder', label: 'Delete Folder' },
//     ],
//   },
//   {
//     label: 'File Actions',
//     options: [
//       { value: 'upload_file', label: 'Upload File' },
//       { value: 'delete_file', label: 'Delete File' },
//     ],
//   },
// ];

// const ConfigState = ({ data, handleConnect, selectedNode, setNodeConfig }) => {
//   const { setIsConfigSidebarClose } = useEditorUIStore();
//   const isTriggerNode = selectedNode?.type === 'trigger';
//   const isActionNode = selectedNode?.type === 'action';

//   const {
//     register,
//     handleSubmit,
//     watch,
//     reset,
//     setValue,
//   } = useForm({
//     defaultValues: {
//       variable: '',
//       driveId: '',
//       event: '',
//       folderId: '',
//       fileId: '',
//       fileName: '',
//       fileUrl: '',
//       folderName: '',
//     },
//   });

//   useEffect(() => {
//     if (!Array.isArray(data) || data.length === 0) return;

//     const prefilledDriveId = selectedNode?.data?.config?.driveId || data[0]?.external_id || '';

//     reset({
//       variable: selectedNode?.data?.config?.variable || '',
//       driveId: prefilledDriveId,
//       event:
//         selectedNode?.data?.config?.event ||
//         (isTriggerNode ? TRIGGER_EVENT_OPTIONS[0].value : ACTION_EVENT_GROUPS[0].options[0].value),
//       folderId: selectedNode?.data?.config?.folderId || '',
//       fileId: selectedNode?.data?.config?.fileId || '',
//     });
//   }, [data, selectedNode, isTriggerNode, reset]);

//   const selectedEvent = watch('event');
//   const selectedFolderId = watch('folderId');
//   const selectedFileId = watch('fileId');

//   // 🔥 Event-based conditions
//   const needsFilePicker = selectedEvent === 'delete_file';
//   const needsFileInput = selectedEvent === 'upload_file';
//   const needsFolderName = selectedEvent === 'create_folder';

//   const selectedDrive = useMemo(() => {
//     return data.find((item) => item.external_id === watch('driveId')) || data[0];
//   }, [data, watch]);

//   const selectedDriveFiles = useMemo(() => selectedDrive?.metadata?.files || [], [selectedDrive]);

//   const availableFolders = useMemo(() => {
//     return selectedDriveFiles.filter((file) => file.mimeType === GOOGLE_DRIVE_FOLDER_MIME_TYPE);
//   }, [selectedDriveFiles]);

//   const availableFiles = useMemo(() => {
//     const filesOnly = selectedDriveFiles.filter((file) => file.mimeType !== GOOGLE_DRIVE_FOLDER_MIME_TYPE);

//     if (selectedFolderId) {
//       return filesOnly.filter((file) => file.parents?.includes(selectedFolderId));
//     }

//     return filesOnly;
//   }, [selectedDriveFiles, selectedFolderId]);

//   useEffect(() => {
//     if (!needsFilePicker) return;

//     const exists = availableFiles.some((f) => f.fileId === selectedFileId);
//     if (!exists) {
//       setValue('fileId', availableFiles[0]?.fileId || '');
//     }
//   }, [availableFiles, selectedFileId, setValue, needsFilePicker]);

//   const onSubmit = async (formData) => {
//     const status = await setNodeConfig(formData);

//     if (status.success) {
//       toast.success('Configured Successfully');
//       setIsConfigSidebarClose();
//     } else {
//       toast.error('Error saving config');
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit(onSubmit)} className="flex-1 flex flex-col overflow-hidden">
//       <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">

//         {/* Variable */}
//         <section>
//           <label className="text-sm font-bold text-zinc-200 flex gap-2 items-center">
//             <Braces size={16} /> Variable
//           </label>
//           <input {...register('variable')} className="w-full bg-zinc-900 border border-zinc-700 p-2 rounded" />
//         </section>

//         {/* Event */}
//         <section>
//           <label className="text-sm font-bold text-zinc-200 flex gap-2 items-center">
//             <CalendarPlus size={16} /> Event
//           </label>
//           <select {...register('event')} className="w-full bg-zinc-900 border p-2 rounded">
//             {isTriggerNode && TRIGGER_EVENT_OPTIONS.map(e => (
//               <option key={e.value} value={e.value}>{e.label}</option>
//             ))}
//             {isActionNode && ACTION_EVENT_GROUPS.map(group => (
//               <optgroup key={group.label} label={group.label}>
//                 {group.options.map(e => (
//                   <option key={e.value} value={e.value}>{e.label}</option>
//                 ))}
//               </optgroup>
//             ))}
//           </select>
//         </section>

//         {/* Folder */}
//         <section>
//           <label className="text-sm font-bold text-zinc-200 flex gap-2 items-center">
//             <FolderOpen size={16} /> Folder
//           </label>
//           <select {...register('folderId')} className="w-full bg-zinc-900 border p-2 rounded">
//             <option value="">No Folder</option>
//             {availableFolders.map(f => (
//               <option key={f.fileId} value={f.fileId}>{f.name}</option>
//             ))}
//           </select>
//         </section>

//         {/* Create Folder */}
//         {needsFolderName && (
//           <section>
//             <label className="text-sm text-zinc-200">Folder Name</label>
//             <input {...register('folderName')} className="w-full bg-zinc-900 border p-2 rounded" />
//           </section>
//         )}

//         {/* Upload File */}
//         {needsFileInput && (
//           <>
//             <section>
//               <label className="text-sm text-zinc-200">File Name</label>
//               <input {...register('fileName')} className="w-full bg-zinc-900 border p-2 rounded" />
//             </section>
//             <section>
//               <label className="text-sm text-zinc-200">File URL</label>
//               <input {...register('fileUrl')} className="w-full bg-zinc-900 border p-2 rounded" />
//             </section>
//           </>
//         )}

//         {/* File Picker */}
//         {needsFilePicker && (
//           <section>
//             <label className="text-sm text-zinc-200 flex gap-2 items-center">
//               <FileBraces size={16} /> File
//             </label>
//             <select {...register('fileId')} className="w-full bg-zinc-900 border p-2 rounded">
//               {availableFiles.map(f => (
//                 <option key={f.fileId} value={f.fileId}>{f.name}</option>
//               ))}
//             </select>
//           </section>
//         )}

//         {/* Connect */}
//         <button type="button" onClick={handleConnect} className="bg-blue-600 p-2 rounded text-white">
//           <Plus size={14} /> Connect Drive
//         </button>
//       </div>

//       <div className="p-3 border-t border-zinc-700">
//         <button type="submit" className="w-full bg-white text-black p-2 rounded">
//           Save
//         </button>
//       </div>
//     </form>
//   );
// };

// export default ConfigState;
