import { useForm } from 'react-hook-form';
import { Globe } from "lucide-react";
import CloseBtn from "@/components/common/CloseBtn";
import useEditorUIStore from "@/stores/workflowEditorStore";
import toast from 'react-hot-toast';

//TO DO :  make a setting only when the type is trigger disable the URL, header and body fields.

const HTTPConfig = ({selectedNode, onClose, nodeType, setNodeConfig }) => {

  const {setIsConfigSidebarClose} = useEditorUIStore();

  const { register, handleSubmit, formState: { errors } } = useForm({
      defaultValues: {
      triggerName: '',
      method: 'POST',
      url: 'https://api.flowai.com/webhook',
      headers: "",
      body: ""
      }
  });

  const onSubmit = async (data) => {
    const status = await setNodeConfig(data);
    console.log("status" , status)
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
            <h3 className="text-sm font-semibold text-zinc-200 mb-3">
              General
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs text-zinc-400 mb-1">
                  Trigger Name
                </label>
                <input
                  {...register('triggerName', { required: 'Trigger name is required' })}
                  placeholder="Incoming Webhook"
                  className="w-full rounded-md bg-zinc-900 border border-zinc-700 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                {errors.triggerName && (
                  <p className="text-xs text-red-400 mt-1">{errors.triggerName.message}</p>
                )}
              </div>
            </div>
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
                  <option value="DELETE">DELETE</option>
                </select>

              </div>
                <div>
                    <h3 className="text-sm font-semibold text-zinc-200 mb-3">
                    URL
                </h3>

                <input 
                  disabled={nodeType === 'trigger'}
                  readOnly={nodeType === 'trigger'}
                  {...register('url', { required: 'URL is required' })}
                  placeholder="https://api.flowai.com/webhook"
                  className="flex rounded-md w-full bg-zinc-900 border border-zinc-700 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                disabled={nodeType === 'trigger'}
                {...register('headers')}
                rows={4}
                placeholder={`{
  "Content-Type": "application/json"
}`}
              className="w-full rounded-md bg-zinc-900 border border-zinc-700 px-3 py-2 font-mono text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </section>

          <section>
            <h3 className="text-sm font-semibold text-zinc-200 mb-3">Body</h3>

            <textarea
                disabled={nodeType === 'trigger'}
                {...register('body')}
                rows={6}
                placeholder={`{
  "id": 123
}`}
              className="w-full rounded-md bg-zinc-900 border border-zinc-700 px-3 py-2 font-mono text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
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
