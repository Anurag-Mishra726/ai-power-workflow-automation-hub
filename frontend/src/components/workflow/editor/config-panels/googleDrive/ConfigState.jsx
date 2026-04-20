import { useEffect, useMemo, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Braces, ChevronRight, FileText, FolderOpen, Plus, CalendarPlus, AtSign } from 'lucide-react';
import { SiGoogledrive } from "react-icons/si";

import toast from 'react-hot-toast';
import useEditorUIStore from '@/stores/workflowEditorStore';
import { GOOGLE_DRIVE_ACTION_EVENT_OPTIONS, GOOGLE_DRIVE_TRIGGER_EVENT_OPTIONS } from '@/components/workflow/utils/events';

const GOOGLE_DRIVE_FOLDER_MIME_TYPE = 'application/vnd.google-apps.folder';

const inputClass =
  'flex rounded-md w-full bg-zinc-900 border border-zinc-700 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#1B73E8]/50';

const selectClass =
  'w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B73E8]/50 appearance-none transition-all cursor-pointer hover:bg-zinc-800/50';

const errorClass = 'text-[10px] text-red-500 font-medium mt-1';

const ConfigState = ({ data, handleConnect, selectedNode, setNodeConfig }) => {
  const { setIsConfigSidebarClose } = useEditorUIStore();

  const isTriggerNode = selectedNode?.type === 'trigger';
  const isActionNode = selectedNode?.type === 'action';
  const config = selectedNode?.data?.config || {};

  const defaultEvent = config.event
    ? config.event
    : isTriggerNode
    ? GOOGLE_DRIVE_TRIGGER_EVENT_OPTIONS[0].value
    : GOOGLE_DRIVE_ACTION_EVENT_OPTIONS[0].options[0].value;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      variable: config.variable || '',
      driveId: config.driveId || (Array.isArray(data) && data[0]?.external_id) || '',
      event: defaultEvent,
      folderId: config.folderId || '',
      targetId: config.targetId || '',
      fileUrl: config.fileUrl || '',
      fileName: config.fileName || '',
      content: config.content || '',
      folderName: config.folderName || '',
      fileUpload: null,
    },
  });

  //  Re-initialize form when the selected node changes ─────────────────────
  useEffect(() => {
    if (!Array.isArray(data) || data.length === 0) return;

    const savedEvent = config.event
      ? config.event
      : isTriggerNode
      ? GOOGLE_DRIVE_TRIGGER_EVENT_OPTIONS[0].value
      : GOOGLE_DRIVE_ACTION_EVENT_OPTIONS[0].value;

    reset({
      variable: config.variable || '',
      driveId: config.driveId || data[0]?.external_id || '',
      event: savedEvent,
      folderId: config.folderId || '',
      targetId: config.targetId || '',
      fileUrl: config.fileUrl || '',
      fileName: config.fileName || '',
      content: config.content || '',
      folderName: config.folderName || '',
      fileUpload: null,
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedNode?.id, data]);

  // ─── Watch reactive fields ──────────────────────────────────────────────────
  const driveId = watch('driveId');
  const event = watch('event');
  const folderId = watch('folderId');

  // ─── Drive / file helpers ───────────────────────────────────────────────────
  const selectedDrive = useMemo(
    () => (Array.isArray(data) ? data.find((item) => item.external_id === driveId) || data[0] : null),
    [data, driveId]
  );

    const connectedUsername = selectedDrive?.name || selectedDrive?.metadata?.profile?.emailAddress || 'Gmail';
    //const connectedAvatar = selectedDrive?.metadata?.profile?.avatarUrl || '/gmail-avatar.png';

  const selectedDriveFiles = useMemo(
    () => selectedDrive?.metadata?.files || [],
    [selectedDrive]
  );

  const availableFolders = useMemo(
    () => selectedDriveFiles.filter((f) => f.mimeType === GOOGLE_DRIVE_FOLDER_MIME_TYPE),
    [selectedDriveFiles]
  );

  const availableFiles = useMemo(() => {
    const filesOnly = selectedDriveFiles.filter((f) => f.mimeType !== GOOGLE_DRIVE_FOLDER_MIME_TYPE);
    if (folderId) {
      return filesOnly.filter((f) => Array.isArray(f.parents) && f.parents.includes(folderId));
    }
    return filesOnly;
  }, [selectedDriveFiles, folderId]);

  const availableDeleteTargets = useMemo(() => {
    if (event === 'delete_folder') return availableFolders;
    if (event === 'delete_file') return availableFiles;
    return [];
  }, [event, availableFolders, availableFiles]);

  // ─── Auto-select first delete target when event changes ────────────────────
  // Uses a ref-based previous value to avoid firing on mount/reset
  const prevEventRef = useRef(event);
  useEffect(() => {
    if (event === prevEventRef.current) return;
    prevEventRef.current = event;

    if (!isActionNode || !['delete_file', 'delete_folder'].includes(event)) {
      setValue('targetId', '');
      return;
    }

    setValue('targetId', availableDeleteTargets[0]?.fileId || '');
  }, [availableDeleteTargets, event, isActionNode, setValue]);

  // ─── Submit ─────────────────────────────────────────────────────────────────
  const onSubmit = async (formData) => {
    const selectedDriveItem = Array.isArray(data)
      ? data.find((item) => item.external_id === formData.driveId)
      : null;

    const status = await setNodeConfig({
      variable: formData.variable.trim(),
      driveId: formData.driveId,
      driveName: selectedDriveItem?.name || selectedDriveItem?.email || 'Google Drive',
      event: formData.event,
      folderId: formData.folderId,
      targetId: formData.targetId,
      fileUrl: formData.fileUrl,
      fileName: formData.fileName.trim(),
      content: formData.content,
      folderName: formData.folderName.trim(),
      fileUpload: formData.fileUpload?.name || '',
    });

    if (status.success) {
      toast.success('Google Drive Node Configured Successfully');
      setIsConfigSidebarClose();
      return;
    }

    toast.error('Something went wrong while saving configuration.');
  };

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">

        <section className="space-y-3 rounded-xl border border-zinc-800 bg-zinc-900/30 p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-300">Your Account</h3>
            <button
              type="button"
              onClick={handleConnect}
              className="inline-flex items-center gap-1 rounded-lg border border-zinc-700 px-2 py-1.5 text-xs font-medium 
              bg-[#4285F4]    text-white hover:bg-white hover:text-black"
            >
              <Plus size={13} /> Connect Other Drive Account
            </button>
          </div>
        
          <div className="rounded-xl border border-zinc-700 bg-zinc-900 p-3 space-y-3">
            <div className="flex items-center gap-3">
              {/* <img src={connectedAvatar} alt={connectedUsername} className="h-9 w-9 rounded-full" />  */}
              <div className='flex items-center justify-center text-2xl bg-zinc-800 h-12 w-12 border border-white rounded-full'>
                {connectedUsername.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-100">{connectedUsername}</p>
                <p className="text-xs text-emerald-400">Connected</p>
              </div>
            </div>
        
            <div className="relative">
              <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <select {...register('driveId', { required: true })} className={selectClass}>
                {data.map((account) => (
                  <option key={account.external_id} value={account.external_id}>
                    {account.name || 'Google Drive Account'}
                  </option>
                ))}
              </select>
              <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 rotate-90 pointer-events-none" />
            </div>
          </div>
        </section>

        {/* Variable */}
        <section className="space-y-3">
          <label className="text-sm font-bold uppercase tracking-wider text-zinc-200 flex items-center gap-2">
            <Braces size={18} /> Variable
          </label>
          <input
            {...register('variable', {
              required: 'Variable name is required.',
              minLength: { value: 3, message: 'Min 3 chars.' },
              maxLength: { value: 15, message: 'Max 15 chars.' },
            })}
            placeholder="eg. myDrive"
            className={inputClass}
          />
          <p className="text-[12px] mt-1 text-zinc-400">
            Reference this node&apos;s output in other nodes:{' '}
            <span className="text-white text-[13px]">{`{{${watch('variable')?.trim()}.output.data}}`}</span>
            <span className="text-[12px] text-zinc-400"> ← Copy this syntax</span>
          </p>
          {errors.variable && <p className={errorClass}>{errors.variable.message}</p>}
        </section>

        {/* Event */}
        <section className="space-y-3">
          <label className="text-sm font-bold uppercase tracking-wider text-zinc-200 flex items-center gap-2">
            <CalendarPlus size={16} /> Event
          </label>
          <div className="relative">
            <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <select {...register('event')} className={selectClass}>
              {isTriggerNode &&
                GOOGLE_DRIVE_TRIGGER_EVENT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              {isActionNode &&
                GOOGLE_DRIVE_ACTION_EVENT_OPTIONS.map((group) => (
                  <optgroup key={group.label} label={group.label}>
                    {group.options.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </optgroup>
                ))}
            </select>
            <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 rotate-90 pointer-events-none" />
          </div>
        </section>

        {/* Folder (hidden for delete_folder) */}
        {event !== 'delete_folder' && (
          <section className="space-y-3">
            <label className="text-sm font-bold uppercase tracking-wider text-zinc-200 flex items-center gap-2">
              <FolderOpen size={16} /> Folder (Optional)
            </label>
            <div className="relative">
              <FolderOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <select {...register('folderId')} className={selectClass}>
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
        )}

        {/* Upload File */}
        {isActionNode && event === 'upload_file' && (
          <section className="space-y-3">
            <label className="text-sm font-bold uppercase tracking-wider text-zinc-200">File URL</label>
            <input
              {...register('fileUrl')}
              type="url"
              placeholder="https://example.com/my-file.pdf"
              className={inputClass}
            />
            <label className="text-sm font-bold uppercase tracking-wider text-zinc-200">Or Upload File</label>
            {/* File inputs can't be controlled by RHF value — use Controller or register with onChange */}
            <Controller
              name="fileUpload"
              control={control}
              render={({ field: { onChange } }) => (
                <input
                  type="file"
                  onChange={(e) => onChange(e.target.files?.[0] || null)}
                  className="block w-full text-sm text-zinc-300 file:mr-4 file:rounded-md file:border-0 file:bg-zinc-700 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-zinc-600"
                />
              )}
            />
          </section>
        )}

        {/* Create File */}
        {isActionNode && event === 'create_file' && (
          <section className="space-y-3">
            <label className="text-sm font-bold uppercase tracking-wider text-zinc-200">File Name</label>
            <input
              {...register('fileName', {
                validate: (val) =>
                  event !== 'create_file' || !!val?.trim() || 'File name is required for Create File.',
              })}
              type="text"
              placeholder="my-new-file.txt"
              className={inputClass}
            />
            {errors.fileName && <p className={errorClass}>{errors.fileName.message}</p>}

            <label className="text-sm font-bold uppercase tracking-wider text-zinc-200">
              File Content
            </label>
            <textarea
              {...register('content', {
                validate: (val) =>
                  event !== 'create_file' || !!val?.trim() || 'File content is required',
              })}
              rows={6}
              placeholder="Enter file content (supports variables like {{webhook.body.name}})"
              className={inputClass}
            />
            <p className="text-[12px] text-zinc-400">
              This content will be written inside the file in Google Drive.
            </p>
            {errors.content && <p className={errorClass}>{errors.content.message}</p>}
          </section>
        )}

        {/* Create Folder */}
        {isActionNode && event === 'create_folder' && (
          <section className="space-y-3">
            <label className="text-sm font-bold uppercase tracking-wider text-zinc-200">Folder Name</label>
            <input
              {...register('folderName', {
                validate: (val) =>
                  event !== 'create_folder' || !!val?.trim() || 'Folder name is required for Create Folder.',
              })}
              type="text"
              placeholder="my-new-folder"
              className={inputClass}
            />
            {errors.folderName && <p className={errorClass}>{errors.folderName.message}</p>}
          </section>
        )}

        {/* Delete File / Folder — target selector */}
        {isActionNode && ['delete_file', 'delete_folder'].includes(event) && (
          <section className="space-y-3">
            <label className="text-sm font-bold uppercase tracking-wider text-zinc-200 flex items-center gap-2">
              <FileText size={16} /> Select {event === 'delete_file' ? 'File' : 'Folder'}
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <select {...register('targetId')} className={selectClass}>
                {availableDeleteTargets.length === 0 ? (
                  <option value="">
                    No {event === 'delete_file' ? 'files' : 'folders'} available
                  </option>
                ) : (
                  availableDeleteTargets.map((item) => (
                    <option key={item.fileId} value={item.fileId}>
                      {item.name || (event === 'delete_file' ? 'Unnamed file' : 'Untitled folder')}
                    </option>
                  ))
                )}
              </select>
              <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 rotate-90 pointer-events-none" />
            </div>
          </section>
        )}
      </div>

      {/* Save */}
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
