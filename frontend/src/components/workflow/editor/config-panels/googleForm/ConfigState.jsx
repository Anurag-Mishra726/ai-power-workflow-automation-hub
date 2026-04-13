import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { Braces, ChevronRight, CalendarPlus, AtSign, Plus, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import useEditorUIStore from '@/stores/workflowEditorStore';

const inputClass =
  'flex rounded-md w-full bg-zinc-900 border border-zinc-700 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#7248B9]/50';
const selectClass =
  'w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#7248B9]/50 appearance-none transition-all cursor-pointer hover:bg-zinc-800/50';

const TRIGGER_EVENT_OPTIONS = [{ value: 'new_response', label: 'New Response' }];

const ConfigState = ({ selectedNode, setNodeConfig, data, handleConnect }) => {
  const { setIsConfigSidebarClose } = useEditorUIStore();
  const isActionNode = selectedNode?.type === 'action';

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      variable: '',
      googleFormAccountId: '',
      event: 'new_response',
    },
  });

  const selectedConfig = selectedNode?.data?.config;

  useEffect(() => {
    if (!Array.isArray(data) || data.length === 0) return;

    reset({
      variable: selectedConfig?.variable || '',
      googleFormAccountId: selectedConfig?.googleFormAccountId || data[0]?.external_id || '',
      event: selectedConfig?.event || 'new_response',
    });
  }, [data, reset, selectedConfig]);

  const selectedGoogleFormAccountId = watch('googleFormAccountId');
  const watchVariable = watch('variable') || '';

  const selectedGoogleFormAccount = useMemo(
    () => data.find((account) => account.external_id === selectedGoogleFormAccountId) || data[0],
    [data, selectedGoogleFormAccountId]
  );

  const connectedUsername =
    selectedGoogleFormAccount?.name ||
    selectedGoogleFormAccount?.metadata?.profile?.emailAddress ||
    'Google Form';

  useEffect(() => {
    if (!selectedGoogleFormAccountId && data[0]?.external_id) {
      setValue('googleFormAccountId', data[0].external_id);
    }
  }, [data, selectedGoogleFormAccountId, setValue]);

  const onSubmit = async (formData) => {
    const status = await setNodeConfig({
      variable: formData.variable.trim(),
      googleFormAccountId: formData.googleFormAccountId,
      googleFormAccountName:
        selectedGoogleFormAccount?.name || selectedGoogleFormAccount?.metadata?.profile?.emailAddress || 'Google Form',
      event: formData.event,
    });

    if (status?.success) {
      toast.success('Google Form Node Configured Successfully');
      setIsConfigSidebarClose();
      return;
    }

    toast.error('Something went wrong while saving configuration.');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
        <section className="space-y-3 rounded-xl border border-zinc-800 bg-zinc-900/30 p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-300">Your Account</h3>
            <button
              type="button"
              onClick={handleConnect}
              className="inline-flex items-center gap-1 rounded-lg border border-zinc-700 px-2 py-1.5 text-xs font-medium bg-[#7248B9] text-zinc-100 hover:bg-white hover:text-black"
            >
              <Plus size={13} /> Connect Other Google Form Account
            </button>
          </div>

          <div className="rounded-xl border border-zinc-700 bg-zinc-900 p-3 space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center text-2xl bg-zinc-800 h-12 w-12 border border-white rounded-full">
                {connectedUsername.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-100">{connectedUsername}</p>
                <p className="text-xs text-emerald-400">Connected</p>
              </div>
            </div>

            <div className="relative">
              <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <select {...register('googleFormAccountId', { required: true })} className={selectClass}>
                {data.map((account) => (
                  <option key={account.external_id} value={account.external_id}>
                    {account.name || account.metadata?.profile?.emailAddress || 'Google Form Account'}
                  </option>
                ))}
              </select>
              <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 rotate-90 pointer-events-none" />
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <label className="text-sm font-bold uppercase tracking-wider text-zinc-200 flex items-center gap-2">
            <CalendarPlus size={16} /> Event
          </label>

          {isActionNode ? (
            <div className="rounded-xl border border-zinc-700 bg-zinc-900 p-3 space-y-2">
              <p className="text-sm text-red-300">No available event for action.</p>
              <p className="text-xs text-zinc-400">Google Form can only be trigger or first node.</p>
            </div>
          ) : (
            <div className="relative">
              <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <select {...register('event', { required: true })} className={selectClass}>
                {TRIGGER_EVENT_OPTIONS.map((eventOption) => (
                  <option key={eventOption.value} value={eventOption.value}>
                    {eventOption.label}
                  </option>
                ))}
              </select>
              <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 rotate-90 pointer-events-none" />
            </div>
          )}
        </section>

        {!isActionNode && (
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
              placeholder="eg. googleFormData"
              className={inputClass}
            />
            <p className="text-[12px] mt-1 text-zinc-400">
              Reference this node&apos;s output in other nodes:{' '}
              <span className="text-white text-[13px]">{`{{${watchVariable.trim()}.response.data}}`}</span>
              <span className="text-[12px] text-zinc-400"> {' '}← Copy this syntax</span>
            </p>
            {errors.variable && <p className="text-[10px] text-red-500 font-medium">{errors.variable.message}</p>}
          </section>
        )}
      </div>

      {!isActionNode && (
        <div className="border-t border-zinc-600 px-4 py-3 flex justify-end bg-zinc-900/50">
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-white text-black font-bold py-3 rounded-xl hover:bg-zinc-200 transition-colors"
          >
            Save Configuration
          </button>
        </div>
      )}
    </form>
  );
};

export default ConfigState;
