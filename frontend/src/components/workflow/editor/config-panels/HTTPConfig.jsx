import { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { Globe } from "lucide-react";
import CloseBtn from "@/components/common/CloseBtn";
import useEditorUIStore from "@/stores/workflowEditorStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { HttpConfig } from '@/schemas/workflowSchema';
import toast from 'react-hot-toast';

const HTTPConfig = ({ selectedNode, nodeType, onClose, setNodeConfig }) => {

  const {setIsConfigSidebarClose} = useEditorUIStore();

  const { register, handleSubmit, setValue, control, formState: { errors } } = useForm({
      defaultValues: {
        method: selectedNode?.data?.config?.method || 'GET',
        url: selectedNode?.data?.config?.url || 'https://api.flowai.com/webhook',
        headers: selectedNode?.data?.config?.headers || '',
        body: selectedNode?.data?.config?.body || '',
      },
      resolver: zodResolver(HttpConfig),
      mode: 'onChange'
  });

  const method = useWatch({ control, name: 'method' });

  useEffect(() => {
  if (method === "GET") {
    setValue("body", "", { shouldValidate: true });  
    setValue("headers", "", { shouldValidate: true });
  }
}, [method, setValue]);

  const isGetMethod = method === 'GET';
  const isDeleteMethod = method === 'DELETE'

  const onSubmit = async (data) => {
    const status = await setNodeConfig(data);
    if(status.success) toast.success("HTTP Node Configured Successfully");
    else toast.error("Something went Wrong!");
    setIsConfigSidebarClose();
  };

  return (
    <>
      <aside className="absolute top-0 right-0 h-full w-1/3 m-1 bg-black border border-zinc-700 rounded-lg text-white z-50 flex flex-col"> 
      <div className="flex px-4 py-3 border-b-2 border-zinc-700 relative">
        <div>
          <h2 className="text-3xl font-semibold text-zinc-100 font-mono flex items-center gap-3">
            <span className="p-2 border border-zinc-400 rounded-xl">
              <Globe size={20}  />
            </span>{" "}
            HTTP Request
          </h2>
          <p className="text-sm text-[#E5E5E5] mt-2 font-normal">
            Configure setting for HTTP Request node.
          </p>
        </div>
        <CloseBtn onClose={onClose} />
      </div>

      <form onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(onSubmit)(e);
      }} className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
          <section>
            <h3 className="text-lg font-semibold text-zinc-200 mb-2">
              Configuration Panel : 
            </h3>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-zinc-200 mb-3">
              Method
            </h3>

            <div className="space-y-5">
              <div className="flex flex-col gap-2">
                <select
                  {...register('method', { required: 'Method is required' })}
                  className="w-24 rounded-md bg-zinc-900 border border-zinc-700 px-2 py-2 text-sm text-white"
                >
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                  <option value="PUT">PUT</option>
                  <option value="PATCH">PATCH</option>
                  <option value="DELETE">DELETE</option>
                </select>
                {errors.method && (
                  <p className="text-xs text-red-400 mt-1">{errors.method.message}</p>
                )}
              </div>
                <div>
                    <h3 className="text-sm font-semibold text-zinc-200 mb-3">
                    URL
                </h3>

                <input 
                  {...register('url', { required: 'URL is required' })}
                  disabled={nodeType === 'trigger'}
                  placeholder="https://api.flowai.com/webhook"
                  className={`flex rounded-md w-full bg-zinc-900 border border-zinc-700 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500 ${ nodeType === 'trigger' && 'cursor-not-allowed' } `}
                />

              <p className="text-xs text-zinc-500">
                This endpoint will trigger the workflow
              </p>
              {errors.url && (
                <p className="text-xs text-red-400">{errors.url.message}</p>
              )}
                </div>
              
            </div>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-zinc-200 mb-3">
              Headers
            </h3>

            <textarea
                {...register('headers')}
                disabled={isGetMethod}
                rows={4}
                placeholder={`${isGetMethod ? "No Headers Required" : `{
  "Content-Type": "application/json"
}` }`}
              className="w-full rounded-md bg-zinc-900 border border-zinc-700 px-3 py-2 font-mono text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {errors.headers && (
              <p className="text-xs text-red-400 mt-1">{errors.body.message}</p>  // ✅ Add this!
            )}
          </section>

          <section>
            <h3 className="text-sm font-semibold text-zinc-200 mb-3">Body</h3>

            <textarea
                {...register('body')}
                disabled={isGetMethod}
                rows={6}
                placeholder={`${isGetMethod || isDeleteMethod ? "No Body Required" : `{
  "id": 123
}` }`}
              className="w-full rounded-md bg-zinc-900 border border-zinc-700 px-3 py-2 font-mono text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {errors.body && (
              <p className="text-xs text-red-400 mt-1">{errors.body.message}</p>  // ✅ Add this!
            )}
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
  );
};

export default HTTPConfig;
