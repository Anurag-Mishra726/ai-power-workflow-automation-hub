import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { Braces, ChevronRight, FileText, FolderOpen, Plus } from 'lucide-react';
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

const ConfigState = ({ data, handleConnect, selectedNode, setNodeConfig }) => {
  const { setIsConfigSidebarClose } = useEditorUIStore();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      variable: '',
      driveId: '',
    },
  });

  useEffect(() => {
    if (!Array.isArray(data) || data.length === 0) return;

    const prefilledDriveId = selectedNode?.data?.config?.driveId || data[0]?.external_id || '';
    reset({
      variable: selectedNode?.data?.config?.variable || '',
      driveId: prefilledDriveId,
    });
  }, [data, reset, selectedNode?.data?.config?.driveId, selectedNode?.data?.config?.variable]);

  const watchVariable = watch('variable') || '';
  const selectedDriveId = watch('driveId');

  const selectedDrive = useMemo(() => {
    return data.find((item) => item.external_id === selectedDriveId) || data[0];
  }, [data, selectedDriveId]);

  const selectedDriveFiles = selectedDrive?.metadata?.files || [];

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

          {selectedDrive && (
            <div className="rounded-lg border border-zinc-800 bg-zinc-900/30 p-3 text-xs text-zinc-300 space-y-1">
              <p><span className="text-zinc-500">Provider:</span> {selectedDrive.provider || 'google'}</p>
              <p><span className="text-zinc-500">External ID:</span> {selectedDrive.external_id}</p>
            </div>
          )}
        </section> */}

        <section className="space-y-3">
        <label className="text-sm font-bold uppercase tracking-wider text-zinc-200 flex items-center gap-2">
            <FolderOpen size={16} /> ALL Files
        </label>
          {/* <h4 className="text-sm font-semibold text-zinc-100">Drive Files </h4> */}
          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {selectedDriveFiles.length > 0 ? (
              selectedDriveFiles.map((file) => (
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
                No files found in backend response for this Drive account.
              </div>
            )}
          </div>
        </section>

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
