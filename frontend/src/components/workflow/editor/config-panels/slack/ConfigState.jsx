import React, { useMemo } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import {
  Plus, 
  Hash, 
  ChevronRight,
  LayoutGrid,
  Send,
} from 'lucide-react';
import toast from 'react-hot-toast';
import useEditorUIStore from "@/stores/workflowEditorStore";

const WORKSPACES = [
  { 
    id: 'w-001', 
    name: 'Engineering Team', 
    icon: '🛠️',
    channels: [
      { id: 'c-101', name: 'general' },
      { id: 'c-102', name: 'dev-ops' },
      { id: 'c-103', name: 'frontend-logs' }
    ]
  },
  { 
    id: 'w-002', 
    name: 'Product & Design', 
    icon: '🎨',
    channels: [
      { id: 'c-201', name: 'design-critique' },
      { id: 'c-202', name: 'roadmap' }
    ]
  },
  { 
    id: 'w-003', 
    name: 'Marketing Ops', 
    icon: '📈',
    channels: [
      { id: 'c-301', name: 'social-media' },
      { id: 'c-302', name: 'campaign-alerts' }
    ]
  }
];

const ConfigState = ({handleConnect, selectedNode, setNodeConfig}) => {
       
    const {setIsConfigSidebarClose} = useEditorUIStore();
    
    const { 
        register, 
        handleSubmit, 
        watch,
        control,
        formState: { errors } 
    } = useForm({
        defaultValues: {
            variable: selectedNode?.data?.config?.variable || null ,
            workspaceId: selectedNode?.data?.config?.workspaceId ||  WORKSPACES[0].id,
            channelId: selectedNode?.data?.config?.channelId ||  WORKSPACES[0].channels[0].id,
            message: selectedNode?.data?.config?.message ||  ''
        }
    });

    const selectedWorkspaceId = watch('workspaceId');

    const watchMyVariableName = useWatch({control, name: 'variable'}) || '' ;

    const currentWorkspace = useMemo(() => 
        WORKSPACES.find(w => w.id === selectedWorkspaceId),
        [selectedWorkspaceId]
    );

    const onSubmit = async (data) => {      // if setNodeConfig gives or throws error handle it using try-catch
        console.log('Form Submitted:', data);
        const status = await setNodeConfig(data); // TODOs : make a Schema for this form.

        if(status.success) toast.success("Slack Node Configured Successfully");
        else toast.error("Something went Wrong!");

        setIsConfigSidebarClose();
    };

  return (
    <>
        <form 
            onSubmit={handleSubmit(onSubmit)}
            className="flex-1 flex flex-col overflow-hidden"
            >
            <div className='flex-1 overflow-y-auto px-4 py-4 space-y-6'>
                <section>
                    <div className="space-y-3">
                        <label className="text-sm font-bold uppercase tracking-wider text-zinc-200 flex items-center gap-2">
                            Variable
                        </label>
                        <input 
                        {...register('variable', { required: 'Variable name is required.',
                            minLength: {value: 3, message: "Min 3 chars."},
                            maxLength: {value:15, message: "Max 15 chars"}
                            })}
                        placeholder="eg.  mySlack"
                        className={`flex rounded-md w-full bg-zinc-900 border border-zinc-700 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#E01E5A]/50 `}
                        />
                        <p className="text-[12px] mt-1 text-zinc-400">Reference this node's output in other nodes: {" "}
                            <span className='text-white text-[13px]'>{`{{${watchMyVariableName.trim()}.output.data}}`}</span>
                            <span className="text-[12px] text-zinc-400"> {" "} ← Copy this syntax</span>  
                        </p>
                        {errors.variable && (
                            <p className="text-[10px] text-red-500 font-medium">{errors.variable.message}</p>
                        )}
                    </div>
                </section>
                {/* Workspace Selection */}
                <section>
                    <div className="space-y-3">
                        <label className="text-sm font-bold uppercase tracking-wider text-zinc-200 flex items-center gap-2">
                            <LayoutGrid size={15} /> Workspace
                        </label>
                        <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-lg">
                            {currentWorkspace?.icon || '🏢'}
                            </div>
                            <select 
                            {...register('workspaceId', { required: true })}
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#E01E5A]/50 appearance-none transition-all cursor-pointer hover:bg-zinc-800/50"
                            >
                            {WORKSPACES.map(ws => (
                                <option key={ws.id} value={ws.id}>{ws.name}</option>
                            ))}
                            </select>
                            <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 rotate-90 pointer-events-none" />
                        </div>
                    </div>
                </section>

                {/* Channel Selection */}
                <section>
                    <div className="space-y-3">
                        <label className="text-sm font-bold uppercase tracking-wider text-zinc-200 flex items-center gap-2">
                            <Hash size={15} /> Channel
                        </label>
                        <div className="relative">
                            <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                            <select 
                            {...register('channelId', { required: true })}
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#E01E5A]/50 appearance-none transition-all cursor-pointer hover:bg-zinc-800/50"
                            >
                            {currentWorkspace?.channels.map(ch => (
                                <option key={ch.id} value={ch.id}>#{ch.name}</option>
                            ))}
                            </select>
                            <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 rotate-90 pointer-events-none" />
                        </div>
                    </div>
                </section>         

            {/* Message Content */}
                <section>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-bold uppercase tracking-wider text-zinc-200 flex items-center gap-2">
                                <Send size={15} /> Message Content
                            </label>
                            <span className="text-[10px] text-zinc-500 font-mono">Markdown OK</span>
                        </div>
                        <textarea 
                            placeholder="Write your message here..."
                            rows={8}
                            {...register('message', { required: 'Message cannot be empty' })}
                            className={`w-full bg-zinc-900 border ${errors.message ? 'border-red-500' : 'border-zinc-800'} rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#E01E5A]/50 resize-none transition-all`}
                        />
                        {errors.message && (
                            <p className="text-[10px] text-red-500 font-medium">{errors.message.message}</p>
                        )}
                    </div>
                </section>
                <section>
                <button 
                type='button'
                  onClick={handleConnect}
                  className=" flex items-center justify-center gap-2 bg-[#E01E5A] hover:bg-[#c2184d] text-white text-sm font-semibold py-3 px-4 rounded-xl transition-all active:scale-[0.98] disabled:opacity-50"
                >
                    <Plus size={15} className='font-bold' />
                    Add Workspace
                </button>
            </section>
            </div>

            {/* Submit Button */}
            <div className="border-t border-zinc-600 px-4 py-3 flex justify-end bg-zinc-900/50">
                <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 bg-white text-black font-bold py-3 rounded-xl hover:bg-zinc-200 transition-colors"
                >
                    Save Configuration
                </button>
            </div>
        </form>
    </>
  );
}

export default ConfigState;
