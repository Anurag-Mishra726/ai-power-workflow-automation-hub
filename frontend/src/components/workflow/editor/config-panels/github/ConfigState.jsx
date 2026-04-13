import { useEffect } from 'react';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { ChevronRight, Plus } from 'lucide-react';

import useEditorUIStore from '@/stores/workflowEditorStore';
import {
  GITHUB_ACTION_OPTIONS,
  GITHUB_TRIGGER_EVENT_OPTIONS,
  GITHUB_TRIGGER_OPTIONS,
} from '@/components/workflow/utils/events';

const inputClass =
  'flex rounded-md w-full bg-zinc-900 border border-zinc-700 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-zinc-200/40';
const selectClass =
  'w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 pl-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-300/40 appearance-none transition-all cursor-pointer hover:bg-zinc-800/50';
const errorClass = 'text-[10px] text-red-500 font-medium mt-1';

const ConfigState = ({ selectedNode, setNodeConfig, data, handleConnect }) => {
  const { setIsConfigSidebarClose } = useEditorUIStore();
  console.log("Data : ", data);
  const isTriggerNode = selectedNode?.type === 'trigger';
  
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      githubAccountId: '',
      triggerEventType: 'push',
      triggerEventAction: '',
      repository: '',
      branch: '',
      baseBranch: '',
      event: '',
      title: '',
      description: '',
      issueNumber: '',
      comment: '',
      sourceBranch: '',
      targetBranch: '',
      isDraftPr: false,
      filePath: '',
      content: '',
      commitMessage: ''
    },
  });

  const existingConfig = selectedNode?.data?.config;

  useEffect(() => {
    if (!Array.isArray(data) || data.length === 0) return;

    const safeConfig = existingConfig || {};
    const initialAccount = data.find((account) => account.external_id === safeConfig.githubAccountId) || data[0];
    const accountRepos = initialAccount?.metadata?.repos || [];
    const defaultRepo = accountRepos[0]?.name || '';
    const defaultEvent = isTriggerNode ? 'push' : GITHUB_ACTION_OPTIONS[0].value;
    const savedTriggerEvent = safeConfig.event || 'push';
    const triggerEventType = savedTriggerEvent.split('_').slice(0, -1).join('_') || savedTriggerEvent;
    const triggerEventAction = savedTriggerEvent.includes('_') ? savedTriggerEvent.split('_').at(-1) : '';
    const hasBranches = Array.isArray(accountRepos[0]?.branches) && accountRepos[0].branches.length > 0;
    const defaultBranch = hasBranches ? accountRepos[0].branches[0] : 'main';

    reset({
      githubAccountId: safeConfig.githubAccountId || data[0].external_id || '',
      triggerEventType: triggerEventType || 'push',
      triggerEventAction: triggerEventAction || '',
      repository: safeConfig.repository || defaultRepo,
      branch: safeConfig.branch || defaultBranch,
      baseBranch: safeConfig.baseBranch || 'main',
      event: safeConfig.event || defaultEvent,
      title: safeConfig.title || '',
      description: safeConfig.description || '',
      issueNumber: safeConfig.issueNumber || '',
      comment: safeConfig.comment || '',
      sourceBranch: safeConfig.sourceBranch || defaultBranch,
      targetBranch: safeConfig.targetBranch || 'main',
      isDraftPr: Boolean(safeConfig.isDraftPr),
      filePath: safeConfig.filePath || '',
      content: safeConfig.content || '',
      commitMessage: safeConfig.commitMessage || '',
    });
  } ,[reset, existingConfig, isTriggerNode, data])

  const selectedEvent = watch('event');
  const selectedGitHubAccountId = watch('githubAccountId');
  const selectedTriggerEventType = watch('triggerEventType');
  const selectedTriggerEventAction = watch('triggerEventAction');
  const selectedRepository = watch('repository');

  const selectedAccount = useMemo(() => {
    if (!Array.isArray(data) || data.length === 0) return null;
    return data.find((account) => account.external_id === selectedGitHubAccountId) || data[0];
  }, [data, selectedGitHubAccountId]);

  const connectedUsername =
    selectedAccount?.metadata?.login || selectedAccount?.name || selectedAccount?.email || 'GitHub Account';
  const connectedAvatar =
    selectedAccount?.metadata?.avatar_url ||
    'https://avatars.githubusercontent.com/u/9919?s=64&v=4';
  const repositoryOptions = useMemo(() => selectedAccount?.metadata?.repos || [], [selectedAccount]);

  const branchOptions = useMemo(() => {
    const selectedRepoData = repositoryOptions.find((repo) => repo.name === selectedRepository);
    const repoBranches = selectedRepoData?.branches || [];
    return repoBranches.length > 0 ? repoBranches : ['main'];
  }, [repositoryOptions, selectedRepository]);
  
  const triggerEventActionOptions = useMemo(
    () => GITHUB_TRIGGER_OPTIONS[selectedTriggerEventType] || [],
    [selectedTriggerEventType],
  );

  useEffect(() => {
    if (!selectedAccount) return;
    const repos = selectedAccount?.metadata?.repos || [];
    const repoNames = repos.map((repo) => repo.name);
    const currentRepo = getValues('repository');
    const nextRepo = repoNames.includes(currentRepo) ? currentRepo : repos[0]?.name || '';
    setValue('repository', nextRepo);

    const nextRepoData = repos.find((repo) => repo.name === nextRepo) || repos[0];
    const currentBranch = getValues('branch');
    const nextRepoBranches = nextRepoData?.branches || [];
    const defaultBranch = nextRepoBranches.includes(currentBranch) ? currentBranch : (nextRepoBranches[0] || 'main');
    setValue('branch', defaultBranch);
    setValue('sourceBranch', getValues('sourceBranch') || defaultBranch);
    setValue('targetBranch', getValues('targetBranch') || 'main');
  }, [selectedGitHubAccountId, selectedAccount, setValue, getValues]);

  useEffect(() => {
    if (!isTriggerNode) return;
    if (selectedTriggerEventType === 'push') {
      setValue('triggerEventAction', '');
      setValue('event', 'push');
      return;
    }

    const firstAction = triggerEventActionOptions[0]?.value || '';
    const nextAction = selectedTriggerEventAction || firstAction;
    setValue('triggerEventAction', nextAction);
    setValue('event', nextAction ? `${selectedTriggerEventType}_${nextAction}` : selectedTriggerEventType);
  }, [isTriggerNode, selectedTriggerEventType, selectedTriggerEventAction, triggerEventActionOptions, setValue]);

  const onSubmit = async (formData) => {
    const payload = {
      ...formData,
      repository: formData.repository.trim(),
      branch: formData.branch.trim(),
      baseBranch: formData.baseBranch.trim(),
      title: formData.title.trim(),
      description: formData.description.trim(),
      issueNumber: formData.issueNumber.trim(),
      comment: formData.comment.trim(),
      sourceBranch: formData.sourceBranch.trim(),
      targetBranch: formData.targetBranch.trim(),
      filePath: formData.filePath.trim(),
      content: formData.content.trim(),
      commitMessage: formData.commitMessage.trim(),
      githubAccountId: selectedAccount?.external_id || '',
      githubAccountName: connectedUsername,
      event: isTriggerNode
        ? formData.triggerEventType === 'push'
          ? 'push'
          : `${formData.triggerEventType}_${formData.triggerEventAction}`
        : '',
      action: isTriggerNode ? '' : formData.event,
    };

    const status = await setNodeConfig(payload);

    if (status?.success) {
      toast.success('GitHub node configured successfully.');
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
              className="inline-flex items-center gap-1 rounded-lg border border-zinc-700 px-2 py-1.5 text-xs font-medium text-zinc-100 hover:bg-zinc-800"
            >
              <Plus size={13} /> Connect Other GitHub Account
            </button>
          </div>

          <div className="rounded-xl border border-zinc-700 bg-zinc-900 p-3 space-y-3">
            <div className="flex items-center gap-3">
              <img src={connectedAvatar} alt={connectedUsername} className="h-9 w-9 rounded-full" />
              <div>
                <p className="text-sm font-medium text-zinc-100">{connectedUsername}</p>
                <p className="text-xs text-emerald-400">Connected</p>
              </div>
            </div>
            {/* <button
              type="button"
              // onClick={handleConnect}
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-800"
            >
              Change <PenLine size={12} />
            </button> */}
            <div className="relative">
              <select
                {...register('githubAccountId', { required: true })}
                className={selectClass}
              >
                {data?.map((account) => {
                  const label = account?.metadata?.login || account?.name || account?.email || account.external_id;
                  return (
                    <option key={account.external_id} value={account.external_id}>
                      {label}
                    </option>
                  );
                })}
              </select>
              <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 rotate-90 pointer-events-none" />
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <label className="text-sm font-bold uppercase tracking-wider text-zinc-200">
            {isTriggerNode ? 'Select Trigger Event' : 'Select Action'}
          </label>
          <div className="relative">
            <select
              {...register(isTriggerNode ? 'triggerEventType' : 'event', { required: true })}
              className={selectClass}
            >
              {(isTriggerNode ? GITHUB_TRIGGER_EVENT_OPTIONS : GITHUB_ACTION_OPTIONS).map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 rotate-90 pointer-events-none" />
          </div>
        </section>

        {isTriggerNode && triggerEventActionOptions.length > 0 && (
          <section className="space-y-3">
            <label className="text-sm font-bold uppercase tracking-wider text-zinc-200">Trigger Type</label>
            <div className="relative">
              <select {...register('triggerEventAction', { required: true })} className={selectClass}>
                {triggerEventActionOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 rotate-90 pointer-events-none" />
            </div>
          </section>
        )}

        <section className="space-y-3">
          <label className="text-sm font-bold uppercase tracking-wider text-zinc-200">Repository</label>
          <div className="relative">
            <select {...register('repository', { required: 'Repository is required.' })} className={selectClass}>
              {repositoryOptions.map((repo) => (
                <option key={repo.name} value={repo.name}>
                  {repo.name}
                </option>
              ))}
            </select>
            <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 rotate-90 pointer-events-none" />
          </div>
          {errors.repository && <p className={errorClass}>{errors.repository.message}</p>}
        </section>

        {!['create_file', 'update_file'].includes(selectedEvent) && (
          <section className="space-y-3">
            <label className="text-sm font-bold uppercase tracking-wider text-zinc-200">Branch</label>
            <div className="relative">
              <select {...register('branch')} className={selectClass}>
                {branchOptions.map((branch) => (
                  <option key={branch} value={branch}>
                    {branch}
                  </option>
                ))}
              </select>
              <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 rotate-90 pointer-events-none" />
            </div>
          </section>
        )}

        {/* {selectedEvent.startsWith('pull_request') && isTriggerNode && (
          <section className="space-y-3">
            <label className="text-sm font-bold uppercase tracking-wider text-zinc-200">Base Branch (Optional)</label>
            <input {...register('baseBranch')} placeholder="main" className={inputClass} />
          </section>
        )} */}

        {selectedEvent=== 'create_issue' && (
          <section className="space-y-3 rounded-xl border border-zinc-800 bg-zinc-900/30 p-4">
            <label className="text-sm font-bold uppercase tracking-wider text-zinc-200">Title</label>
            <input
              {...register('title', {
                validate: (value) =>
                  selectedEvent!== 'create_issue' || value.trim() ? true : 'Title is required.',
              })}
              placeholder="Issue title"
              className={inputClass}
            />
            {errors.title && <p className={errorClass}>{errors.title.message}</p>}
            <label className="text-sm font-bold uppercase tracking-wider text-zinc-200">Description</label>
            <textarea
              {...register('description')}
              rows={5}
              placeholder="Describe the issue"
              className={`${inputClass} resize-none`}
            />
          </section>
        )}

        {selectedEvent=== 'comment_on_issue' && (
          <section className="space-y-3 rounded-xl border border-zinc-800 bg-zinc-900/30 p-4">
            <label className="text-sm font-bold uppercase tracking-wider text-zinc-200">Issue Number</label>
            <input
              {...register('issueNumber', {
                validate: (value) =>
                  selectedEvent!== 'comment_on_issue' || value.trim()
                    ? true
                    : 'Issue number is required.',
              })}
              placeholder="42"
              className={inputClass}
            />
            {errors.issueNumber && <p className={errorClass}>{errors.issueNumber.message}</p>}
            <label className="text-sm font-bold uppercase tracking-wider text-zinc-200">Comment</label>
            <textarea
              {...register('comment', {
                validate: (value) =>
                  selectedEvent!== 'comment_on_issue' || value.trim() ? true : 'Comment is required.',
              })}
              rows={5}
              placeholder="Write your comment"
              className={`${inputClass} resize-none`}
            />
            {errors.comment && <p className={errorClass}>{errors.comment.message}</p>}
          </section>
        )}

        {selectedEvent=== 'create_pull_request' && (
          <section className="space-y-3 rounded-xl border border-zinc-800 bg-zinc-900/30 p-4">
            <label className="text-sm font-bold uppercase tracking-wider text-zinc-200">Title</label>
            <input
              {...register('title', {
                validate: (value) =>
                  selectedEvent!== 'create_pull_request' || value.trim()
                    ? true
                    : 'Title is required.',
              })}
              placeholder="PR title"
              className={inputClass}
            />
            {errors.title && <p className={errorClass}>{errors.title.message}</p>}
            <label className="text-sm font-bold uppercase tracking-wider text-zinc-200">Source Branch</label>
            <input
              {...register('sourceBranch', {
                validate: (value) =>
                  selectedEvent!== 'create_pull_request' || value.trim()
                    ? true
                    : 'Source branch is required.',
              })}
              placeholder="feature/new-flow"
              className={inputClass}
            />
            {errors.sourceBranch && <p className={errorClass}>{errors.sourceBranch.message}</p>}
            <label className="text-sm font-bold uppercase tracking-wider text-zinc-200">Target Branch</label>
            <input
              {...register('targetBranch', {
                validate: (value) =>
                  selectedEvent!== 'create_pull_request' || value.trim()
                    ? true
                    : 'Target branch is required.',
              })}
              placeholder="main"
              className={inputClass}
            />
            {errors.targetBranch && <p className={errorClass}>{errors.targetBranch.message}</p>}
            <label className="text-sm font-bold uppercase tracking-wider text-zinc-200">Draft Pull Request</label>
            <label className="inline-flex items-center gap-2 text-sm text-zinc-300">
              <input type="checkbox" {...register('isDraftPr')} className="h-4 w-4 rounded border-zinc-600 bg-zinc-900" />
              Create as draft
            </label>
            <label className="text-sm font-bold uppercase tracking-wider text-zinc-200">Description (Optional)</label>
            <textarea
              {...register('description')}
              rows={5}
              placeholder="PR details"
              className={`${inputClass} resize-none`}
            />
          </section>
        )}

        {['create_file', 'update_file'].includes(selectedEvent) && (
          <section className="space-y-3 rounded-xl border border-zinc-800 bg-zinc-900/30 p-4">
            <label className="text-sm font-bold uppercase tracking-wider text-zinc-200">File Path</label>
            <input
              {...register('filePath', {
                validate: (value) =>
                  !['create_file', 'update_file'].includes(selectedEvent) || value.trim()
                    ? true
                    : 'File path is required.',
              })}
              placeholder="src/workflows/config.json"
              className={inputClass}
            />
            {errors.filePath && <p className={errorClass}>{errors.filePath.message}</p>}
            <label className="text-sm font-bold uppercase tracking-wider text-zinc-200">Content</label>
            <textarea
              {...register('content', {
                validate: (value) =>
                  !['create_file', 'update_file'].includes(selectedEvent) || value.trim()
                    ? true
                    : 'Content is required.',
              })}
              rows={8}
              placeholder={`{\n  "key": "value"\n}`}
              className={`${inputClass} resize-none`}
            />
            {errors.content && <p className={errorClass}>{errors.content.message}</p>}
            <label className="text-sm font-bold uppercase tracking-wider text-zinc-200">Commit Message</label>
            <input
              {...register('commitMessage', {
                validate: (value) =>
                  !['create_file', 'update_file'].includes(selectedEvent) || value.trim()
                    ? true
                    : 'Commit message is required.',
              })}
              placeholder="chore: update workflow config"
              className={inputClass}
            />
            {errors.commitMessage && <p className={errorClass}>{errors.commitMessage.message}</p>}
            <label className="text-sm font-bold uppercase tracking-wider text-zinc-200">Branch</label>
            <div className="relative">
              <select {...register('branch', { required: true })} className={selectClass}>
                {branchOptions.map((branch) => (
                  <option key={`file-${branch}`} value={branch}>
                    {branch}
                  </option>
                ))}
              </select>
              <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 rotate-90 pointer-events-none" />
            </div>
          </section>
        )}
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
