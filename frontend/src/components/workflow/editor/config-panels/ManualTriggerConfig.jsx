import { useForm } from 'react-hook-form';
import { MousePointer, Play, Circle, X } from 'lucide-react';
import CloseBtn from '@/components/common/CloseBtn';
import { toast } from 'react-hot-toast';

const ManualTriggerConfig = ({nodeId, onClose}) => {

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    console.log('HTTP Request Form Data:', data);
    // handle backend submission here
  };

  return (
    <aside
        className="absolute top-0 right-0 h-full w-1/3 m-1 bg-[#000000] border border-zinc-700 rounded-lg text-white z-50 flex flex-col"
    >
      <div className="flex px-4 py-3 border-b-2 border-zinc-700 relative">
        <div>
            <h2 className="text-3xl font-semibold  text-zinc-100 font-mono flex items-center gap-3">
                <span className='p-2 border border-zinc-400 rounded-xl '><MousePointer size={20} /></span> Manual Trigger
            </h2>
            <p className="text-sm text-[#E5E5E5] mt-2 font-normal">Starts the workflow when you manually run it.</p>
        </div>
            <CloseBtn onClose={onClose} />
        </div>  
        <div className="flex-1 flex flex-col overflow-hidden">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(onSubmit)(e);
            }}
            className="flex-1 flex flex-col justify-between overflow-hidden"
          >
            <section className='p-4 mt-5'>
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
          <div className="border-t border-zinc-800 px-4 py-3 flex justify-end bg-zinc-900/50">
          <button
            type="submit"
            className="rounded-md bg-blue-600 px-4 py-2 text-xs font-semibold hover:bg-blue-500 active:bg-blue-700 transition-colors"
          >
            Save
          </button>
        </div>
          </form>  
        </div>      
    </aside>
  );
};

export default ManualTriggerConfig;
