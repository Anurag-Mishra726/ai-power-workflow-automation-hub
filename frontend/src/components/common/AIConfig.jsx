import { useForm, useWatch } from 'react-hook-form';
import CloseBtn from "@/components/common/CloseBtn";
import useEditorUIStore from "@/stores/workflowEditorStore";
import toast from 'react-hot-toast';
import { useApiKeyExists } from '@/hooks/useIntegration';
import { AlertCircle, CircleCheckBig, Loader2 } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const AIConfig = ({ selectedNode, onClose, setNodeConfig, configParams }) => {

  const { data, isLoading, isError } = useApiKeyExists(configParams.logo);
  const {setIsConfigSidebarClose} = useEditorUIStore();

  const { register, handleSubmit, control, formState: { errors },  } = useForm({
    defaultValues: {
      variable: selectedNode?.data?.config?.variable  || '',
      systemPrompt: selectedNode?.data?.config?.systemPrompt  || '',
      userPrompt: selectedNode?.data?.config?.userPrompt || '',
    },
    mode: 'onChange'
  });

   const watchMyVariableName = useWatch({control, name: 'variable'}) || '' ;

  const onSubmit = async (data) => {
    try {
      const status = await setNodeConfig(data);
      if(status.success) toast.success(`${configParams.title} Node Configured Successfully`);
      else toast.error(`Failed to configure ${configParams.title} node. Please try again.`);
      setIsConfigSidebarClose();
    } catch (error) {
      console.error("Error configuring node:", error);
      toast.error("Failed to configure node. Please try again.");
      return;
    }
    console.log(data);
  }

  const logoMap = {
    gemini: "/gemini.svg",
    perplexity: "/perplexity.svg",
    openai: "/openai.svg"
  }

  return (
    <>
      <aside className="absolute top-0 right-0 h-full w-1/3 m-1 bg-black border border-zinc-700 rounded-lg text-white z-50 flex flex-col"> 
        <div className="flex px-4 py-3 border-b-2 border-zinc-700 relative">
          <div>
            <h2 className="text-3xl font-semibold text-zinc-100 font-mono flex items-center gap-3">
              <span className="p-2 border border-zinc-400 rounded-xl">
                <img src={logoMap[configParams.logo]} alt="AI" className='h-6 w-6' />
              </span>{" "}
              { configParams ? configParams.title : "Node Configuration"}
            </h2>
            <p className="text-sm text-[#E5E5E5] mt-2 font-normal">
              Configure setting for AI node.
            </p>
          </div>
          <CloseBtn onClose={onClose} />
        </div>

        <form onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(onSubmit)(e);
          }}
           className="flex-1 flex flex-col overflow-hidden"
        >
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
            <section>
              <h3 className="text-lg font-semibold text-zinc-200 mb-2">
                Configuration Panel : 
              </h3>
              {isLoading ? (
                <div className="flex items-center gap-2 text-zinc-500">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="text-xs">Checking configuration...</span>
                </div>

                ) : isError ? (
                  /* Actual Error (server/network issue) */
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    <p className="text-xs text-red-400">
                      Something went wrong while checking configuration. Please try again.
                    </p>
                  </div>

                ) : data?.exists ? (
                  /* API Key exists */
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                    <CircleCheckBig className="w-4 h-4 text-emerald-500" />
                    <p className="text-xs font-medium text-emerald-400">
                      API Key active and ready for {configParams.title}.
                    </p>
                  </div>

                ) : (
                  /* API Key missing */
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    <p className="text-xs text-zinc-400">
                      Please configure your API key in the
                      <NavLink to="/integrations">
                        <span className="text-white ml-1">integrations </span>
                      </NavLink>
                      page to use this feature.
                    </p>
                  </div>
                )
              }
            </section>
            <section>
              <div>
                <h3 className='text-sm font font-semibold text-zinc-200 mb-3'>Variable</h3>
                <input 
                  {...register('variable', { required: 'Variable name is required.',
                    minLength: {value: 3, message: "Min 3 chars."},
                    maxLength: {value:15, message: "Max 15 chars"}
                    })}
                  placeholder="eg.  myAiResult"
                  className={`flex rounded-md w-full bg-zinc-900 border border-zinc-700 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500 `}
                />
                <p className="text-[12px] mt-1 text-zinc-400">Reference this node's output in other nodes: {" "}
                  <span className='text-white text-[13px]'>{`{{${watchMyVariableName.trim()}.output.text}}`}</span>
                  <span className="text-[12px] text-zinc-400"> {" "} ← Copy this syntax</span>  
                </p>
                {errors.variable && (
                  <p className="text-xs text-red-400">{errors.variable.message}</p>
                )}
              </div>
            </section>
            <section>
              <div>
                  <h3 className="text-sm font-semibold text-zinc-200 mb-3">
                    System Prompt (Optional)
                  </h3>
                  <textarea
                    {...register('systemPrompt')}
                    rows={4}
                    className="w-full rounded-md bg-zinc-900 border border-zinc-700 px-3 py-2 font-mono text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <p className="text-[12px] mt-1 text-zinc-400">
                    Set the behavior for the AI model.
                  </p>
                  {errors.systemPrompt && (
                    <p className="text-xs text-red-400">{errors.systemPrompt.message}</p>
                  )}
                </div>
            </section>
            <section>
              <div>
                  <h3 className="text-sm font-semibold text-zinc-200 mb-3">
                    User Prompt (Optional)
                  </h3>

                  <textarea
                {...register('userPrompt')}
                rows={4}
                required
              className="w-full rounded-md bg-zinc-900 border border-zinc-700 px-3 py-2 font-mono text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            />

                  <p className="text-[12px] mt-1 text-zinc-400">
                    Prompt to send to AI model.
                  </p>
                  {errors.userPrompt && (
                    <p className="text-xs text-red-400">{errors.userPrompt.message}</p>
                  )}
                </div>
            </section>
            
          </div>
          <div className="border-t border-zinc-800 px-4 py-3 flex justify-end bg-zinc-900/50">
            <button
              type="submit"
              className="rounded-md bg-blue-600 px-4 py-2 text-xs font-semibold hover:bg-blue-500 active:bg-blue-700 transition-colors"
            >
              Save
            </button>
          </div>
        </form>
        
      </aside>
    </>
  )
}

export default AIConfig
