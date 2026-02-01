import { useForm } from 'react-hook-form';
import { MousePointer, X } from 'lucide-react';
import CloseBtn from '@/components/common/CloseBtn';
import { toast } from 'react-hot-toast';
import useEditorUIStore from "@/stores/workflowEditorStore";

const ManualTriggerConfig = ({onClose}) => {


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
          
        </div>      
    </aside>
  );
};

export default ManualTriggerConfig;
