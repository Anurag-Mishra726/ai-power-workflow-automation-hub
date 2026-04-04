import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { Braces, ChevronRight, FileText, FolderOpen, Plus, CalendarPlus } from 'lucide-react';
import toast from 'react-hot-toast';
import useEditorUIStore from '@/stores/workflowEditorStore';

const GOOGLE_DRIVE_FOLDER_MIME_TYPE = 'application/vnd.google-apps.folder';

const TRIGGER_EVENT_OPTIONS = [
  { value: 'file_created', label: 'File Created' },
  { value: 'file_updated', label: 'File Updated' },
  { value: 'file_deleted', label: 'File Deleted' },
  { value: 'folder_created', label: 'Folder Created' },
  { value: 'folder_deleted', label: 'Folder Deleted' },
];

const ACTION_EVENT_GROUPS = [
  {
    label: 'File Actions',
    options: [
      { value: 'upload_file', label: 'Upload File' },
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
      fileUrl: '',
      fileName: '',
      folderName: '',
      targetId: '',
      fileUpload: null,
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
      fileUrl: selectedNode?.data?.config?.fileUrl || '',
      fileName: selectedNode?.data?.config?.fileName || '',
      folderName: selectedNode?.data?.config?.folderName || '',
      targetId: selectedNode?.data?.config?.targetId || '',
      fileUpload: null,
    });
  }, [
    data,
    isTriggerNode,
    reset,
    selectedNode?.data?.config?.driveId,
    selectedNode?.data?.config?.event,
    selectedNode?.data?.config?.fileId,
    selectedNode?.data?.config?.fileName,
    selectedNode?.data?.config?.fileUrl,
    selectedNode?.data?.config?.folderId,
    selectedNode?.data?.config?.folderName,
    selectedNode?.data?.config?.targetId,
    selectedNode?.data?.config?.variable,
  ]);

  const selectedEvent = watch('event');
  const watchVariable = watch('variable') || '';
  const selectedDriveId = watch('driveId');
  const selectedFolderId = watch('folderId');
  const selectedTargetId = watch('targetId');

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

    return filesOnly;
  }, [selectedDriveFiles, selectedFolderId]);

  const availableDeleteTargets = useMemo(() => {
    if (selectedEvent === 'delete_folder') {
      return availableFolders;
    }

    if (selectedEvent === 'delete_file') {
      return availableFiles;
    }

    return [];
  }, [availableFiles, availableFolders, selectedEvent]);

  useEffect(() => {
    if (!isActionNode || !['delete_file', 'delete_folder'].includes(selectedEvent)) {
      setValue('targetId', '');
      return;
    }

    const selectedTargetExists = availableDeleteTargets.some((item) => item.fileId === selectedTargetId);
    if (!selectedTargetExists) {
      setValue('targetId', availableDeleteTargets[0]?.fileId || '');
    }
  }, [availableDeleteTargets, isActionNode, selectedEvent, selectedTargetId, setValue]);

  const onSubmit = async (formData) => {
    const selectedDriveItem = data.find((item) => item.external_id === formData.driveId);

    const status = await setNodeConfig({
      ...formData,
      driveName: selectedDriveItem?.name || selectedDriveItem?.email || 'Google Drive',
      fileUpload: formData?.fileUpload?.[0]?.name || '',
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
        </section>

        {isActionNode && selectedEvent === 'upload_file' && (
          <section className="space-y-3">
            <label className="text-sm font-bold uppercase tracking-wider text-zinc-200">File URL</label>
            <input
              {...register('fileUrl')}
              type="url"
              placeholder="https://example.com/my-file.pdf"
              className="flex rounded-md w-full bg-zinc-900 border border-zinc-700 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#1B73E8]/50"
            />
            <label className="text-sm font-bold uppercase tracking-wider text-zinc-200">Or Upload File</label>
            <input
              {...register('fileUpload')}
              type="file"
              className="block w-full text-sm text-zinc-300 file:mr-4 file:rounded-md file:border-0 file:bg-zinc-700 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-zinc-600"
            />
          </section>
        )}

        {isActionNode && selectedEvent === 'create_file' && (
          <section className="space-y-3">
            <label className="text-sm font-bold uppercase tracking-wider text-zinc-200">File Name</label>
            <input
              {...register('fileName', { required: 'File name is required for Create File.' })}
              type="text"
              placeholder="my-new-file.txt"
              className="flex rounded-md w-full bg-zinc-900 border border-zinc-700 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#1B73E8]/50"
            />
            {errors.fileName && <p className="text-[10px] text-red-500 font-medium">{errors.fileName.message}</p>}
          </section>
        )}

        {isActionNode && selectedEvent === 'create_folder' && (
          <section className="space-y-3">
            <label className="text-sm font-bold uppercase tracking-wider text-zinc-200">Folder Name</label>
            <input
              {...register('folderName', { required: 'Folder name is required for Create Folder.' })}
              type="text"
              placeholder="my-new-folder"
              className="flex rounded-md w-full bg-zinc-900 border border-zinc-700 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#1B73E8]/50"
            />
            {errors.folderName && <p className="text-[10px] text-red-500 font-medium">{errors.folderName.message}</p>}
          </section>
        )}

        {isActionNode && ['delete_file', 'delete_folder'].includes(selectedEvent) && (
          <section className="space-y-3">
            <label className="text-sm font-bold uppercase tracking-wider text-zinc-200 flex items-center gap-2">
              <FileText size={16} /> Select {selectedEvent === 'delete_file' ? 'File' : 'Folder'}
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <select
                {...register('targetId')}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B73E8]/50 appearance-none transition-all cursor-pointer hover:bg-zinc-800/50"
              >
                {availableDeleteTargets.length === 0 ? (
                  <option value="">No {selectedEvent === 'delete_file' ? 'files' : 'folders'} available</option>
                ) : (
                  availableDeleteTargets.map((item) => (
                    <option key={item.fileId} value={item.fileId}>
                      {item.name || (selectedEvent === 'delete_file' ? 'Unnamed file' : 'Untitled folder')}
                    </option>
                  ))
                )}
              </select>
              <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 rotate-90 pointer-events-none" />
            </div>
          </section>
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
