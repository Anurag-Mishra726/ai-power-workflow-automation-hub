import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import {
  Mail,
  AtSign,
  Braces,
  ChevronRight,
  CalendarPlus,
  Send,
  Trash2,
  Plus,
  Text,
  Tags,
} from 'lucide-react';
import toast from 'react-hot-toast';
import useEditorUIStore from '@/stores/workflowEditorStore';
import { GMAIL_ACTION_EVENT_OPTIONS, GMAIL_TRIGGER_EVENT_OPTIONS } from '@/components/workflow/utils/events';

const inputClass =
  'flex rounded-md w-full bg-zinc-900 border border-zinc-700 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#EA4335]/50';
const selectClass =
  'w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#EA4335]/50 appearance-none transition-all cursor-pointer hover:bg-zinc-800/50';
const errorClass = 'text-[10px] text-red-500 font-medium';

const ConfigState = ({ data, handleConnect, selectedNode, setNodeConfig }) => {
  const { setIsConfigSidebarClose } = useEditorUIStore();

  const isTriggerNode = selectedNode?.type === 'trigger';

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
      gmailAccountId: '',
      event: '',
      label: '',
      senderEmail: '',
      to: '',
      subject: '',
      body: '',
      emailId: '',
    },
  });

  const selectedConfig = selectedNode?.data?.config;

  useEffect(() => {
    if (!Array.isArray(data) || data.length === 0) return;

    const defaultLabel = data[0]?.metadata?.labels?.[0]?.id || 'INBOX';
    const defaultEvent = isTriggerNode ? GMAIL_TRIGGER_EVENT_OPTIONS[0].value : GMAIL_ACTION_EVENT_OPTIONS[0].value;

    reset({
      variable: selectedConfig?.variable || '',
      gmailAccountId: selectedConfig?.gmailAccountId || data[0]?.external_id || '',
      event: selectedConfig?.event || defaultEvent,
      label: selectedConfig?.label || defaultLabel,
      senderEmail: selectedConfig?.senderEmail || '',
      to: selectedConfig?.to || '',
      subject: selectedConfig?.subject || '',
      body: selectedConfig?.body || '',
      emailId: selectedConfig?.emailId || '',
    });
  }, [data, isTriggerNode, reset, selectedConfig]);

  const selectedEvent = watch('event');
  const selectedGmailAccountId = watch('gmailAccountId');
  const watchVariable = watch('variable') || '';

  const selectedGmailAccount = useMemo(
    () => data.find((account) => account.external_id === selectedGmailAccountId) || data[0],
    [data, selectedGmailAccountId]
  );

  const availableEmails = useMemo(
    () => selectedGmailAccount?.metadata?.recentMessages || [],
    [selectedGmailAccount]
  );

  const availableLabels = useMemo( 
    () => data[0]?.metadata?.labels || [],
    [data]
  );

  useEffect(() => {
    if (!selectedGmailAccountId && data[0]?.external_id) {
      setValue('gmailAccountId', data[0].external_id);
    }
  }, [data, selectedGmailAccountId, setValue]);

  const onSubmit = async (formData) => {
    const cleanValues = {
      ...formData,
      variable: formData.variable.trim(),
      gmailAccountId: formData.gmailAccountId,
      event: formData.event,
      label: formData.label?.trim() || '',
      senderEmail: formData.senderEmail?.trim() || '',
      to: formData.to?.trim() || '',
      subject: formData.subject?.trim() || '',
      body: formData.body?.trim() || '',
      emailId: formData.emailId?.trim() || '',
      gmailAccountName:
        selectedGmailAccount?.name || selectedGmailAccount?.metadata?.profile?.emailAddress || 'Gmail',
    };

    const status = await setNodeConfig(cleanValues);

    if (status?.success) {
      toast.success('Gmail Node Configured Successfully');
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
              maxLength: { value: 15, message: 'Max 15 chars.' },
            })}
            placeholder="eg. myGmail"
            className={inputClass}
          />
          <p className="text-[12px] mt-1 text-zinc-400">
            Reference this node&apos;s output in other nodes:{' '}
            <span className="text-white text-[13px]">{`{{${watchVariable.trim()}.output.data}}`}</span>
            <span className="text-[12px] text-zinc-400"> {' '}← Copy this syntax</span>
          </p>
          {errors.variable && <p className={errorClass}>{errors.variable.message}</p>}
        </section>

        <section className="space-y-3">
          <label className="text-sm font-bold uppercase tracking-wider text-zinc-200 flex items-center gap-2">
            <Mail size={16} /> Gmail Account
          </label>
          <div className="relative">
            <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <select {...register('gmailAccountId', { required: true })} className={selectClass}>
              {data.map((account) => (
                <option key={account.external_id} value={account.external_id}>
                  {account.name || account.metadata?.profile?.emailAddress || 'Gmail Account'}
                </option>
              ))}
            </select>
            <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 rotate-90 pointer-events-none" />
          </div>
        </section>

        <section className="space-y-3">
          <label className="text-sm font-bold uppercase tracking-wider text-zinc-200 flex items-center gap-2">
            <CalendarPlus size={16} /> Event
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <select {...register('event', { required: true })} className={selectClass}>
              {(isTriggerNode ? GMAIL_TRIGGER_EVENT_OPTIONS : GMAIL_ACTION_EVENT_OPTIONS).map((eventOption) => (
                <option key={eventOption.value} value={eventOption.value}>
                  {eventOption.label}
                </option>
              ))}
            </select>
            <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 rotate-90 pointer-events-none" />
          </div>
        </section>

        {selectedEvent === 'new_email' && (
          <section className="space-y-3">
            <label className="text-sm font-bold uppercase tracking-wider text-zinc-200 flex items-center gap-2">
              <Text size={16} /> Label (Optional)
            </label>
            <div className="relative">
              <Tags className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <select {...register('label', { required: true })} className={selectClass}>
                {availableLabels.map((label) => (
                  <option key={label.id} value={label.id}>
                    {label.id || label.name}
                  </option>
                ))}
              </select>
              <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 rotate-90 pointer-events-none" />
            </div>
          </section>
        )}

        {selectedEvent === 'email_from_sender' && (
          <section className="space-y-3">
            <label className="text-sm font-bold uppercase tracking-wider text-zinc-200 flex items-center gap-2">
              <AtSign size={16} /> Sender Email
            </label>
            <input
              {...register('senderEmail', {
                validate: (value) => {
                  if (selectedEvent !== 'email_from_sender') return true;
                  return value?.trim() ? true : 'Sender email is required.';
                },
              })}
              placeholder="sender@example.com"
              className={inputClass}
            />
            {errors.senderEmail && <p className={errorClass}>{errors.senderEmail.message}</p>}
          </section>
        )}

        {selectedEvent === 'send_email' && (
          <section className="space-y-3">
            <label className="text-sm font-bold uppercase tracking-wider text-zinc-200 flex items-center gap-2">
              <Send size={16} /> Email Inputs
            </label>
            <input
              {...register('to', {
                validate: (value) => {
                  if (selectedEvent !== 'send_email') return true;
                  return value?.trim() ? true : 'Recipient email is required.';
                },
              })}
              placeholder="To"
              className={inputClass}
            />
            {errors.to && <p className={errorClass}>{errors.to.message}</p>}

            <input
              {...register('subject', {
                validate: (value) => {
                  if (selectedEvent !== 'send_email') return true;
                  return value?.trim() ? true : 'Subject is required.';
                },
              })}
              placeholder="Subject"
              className={inputClass}
            />
            {errors.subject && <p className={errorClass}>{errors.subject.message}</p>}

            <textarea
              {...register('body', {
                validate: (value) => {
                  if (selectedEvent !== 'send_email') return true;
                  return value?.trim() ? true : 'Body is required.';
                },
              })}
              rows={6}
              placeholder="Email Body"
              className={`${inputClass} resize-none`}
            />
            {errors.body && <p className={errorClass}>{errors.body.message}</p>}
          </section>
        )}

        {selectedEvent === 'delete_email' && (
          <section className="space-y-3">
            <label className="text-sm font-bold uppercase tracking-wider text-zinc-200 flex items-center gap-2">
              <Trash2 size={16} /> Select Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <select
              {...register('emailId', {
                validate: (value) => {
                  if (selectedEvent !== 'delete_email') return true;
                  return value?.trim() ? true : 'Email ID is required.';
                },
              })}
                className={selectClass}
              >
                {availableEmails.length > 0 ? (
                  <>
                    <option value="">Select an email</option>
                    {availableEmails.map((email) => {
                      const subject = email?.subject?.trim() || 'No Subject';
                      const from = email?.from?.trim() || 'Unknown';
                      const snippet = email?.snippet?.trim();
                      const shortSnippet =
                        snippet && snippet.length > 40 ? `${snippet.slice(0, 40)}...` : snippet;

                      return (
                        <option key={email.id} value={email.id}>
                          {`${subject} — ${from}${shortSnippet ? ` | ${shortSnippet}` : ''}`}
                        </option>
                      );
                    })}
                  </>
                ) : (
                  <option value="">No emails available</option>
                )}
              </select>
              <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 rotate-90 pointer-events-none" />
            </div>
            {errors.emailId && <p className={errorClass}>{errors.emailId.message}</p>}
          </section>
        )}

        <section>
          <button
            type="button"
            onClick={handleConnect}
            className="flex items-center justify-center gap-2 bg-[#EA4335] hover:bg-[#cb3a2d] text-white text-sm font-semibold py-3 px-4 rounded-xl transition-all active:scale-[0.98] disabled:opacity-50"
          >
            <Plus size={15} className="font-bold" />
            Connect Gmail
          </button>
        </section>
      </div>

      <div className="border-t border-zinc-600 px-4 py-3 flex justify-end bg-zinc-900/50 sticky bottom-0">
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
