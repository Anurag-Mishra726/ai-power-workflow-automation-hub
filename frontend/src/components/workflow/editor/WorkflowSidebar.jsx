import {MousePointer, Globe,X} from "lucide-react"

const WorkflowSidebar = ({ onClose, setTriggerType }) => {

  return (
    <aside
      className="absolute top-0 right-0 h-full w-1/3  m-1  bg-[#000000] border border-zinc-700 rounded-lg text-white z-50 flex flex-col "
    >
      <div className="flex px-4 py-3 border-b-2 border-zinc-700 relative">
        <div>
            <h2 className="text-3xl font-semibold  text-zinc-100 font-mono">
                Choose How to Start?
            </h2>
            <p className="text-sm text-[#E5E5E5] mt-2 font-normal">Decide how you want this automation to be kicked off.</p>
        </div>
        <div className="flex justify-center items-center absolute top-0 right-0 mt-2 mr-2 p-1 rounded-full text-white bg-zinc-500
         hover:bg-red-500 ">
            <button onClick={onClose}>
                <X size={17} />
            </button>
        </div>
        
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-5 ">
            
        <div className="flex justify-center items-center gap-4 py-2 border border-zinc-600 rounded-xl hover:border-zinc-500
         hover:bg-zinc-800 cursor-pointer"
         onClick={(e)=> {
          setTriggerType( "Mannual Trigger", MousePointer, "manual" );
          onClose();
         }}
         >
            <MousePointer />
            <div>
                <h2 className="text-xl">Manual Trigger</h2>
                <p className="text-zinc-400">Start this flow by clicking a button.</p>
            </div>
        </div>

        <div className="flex justify-center items-center gap-4 mt-5 py-2 border border-zinc-600 rounded-xl hover:border-zinc-500
         hover:bg-zinc-800 cursor-pointer"
         onClick={(e)=> {
          setTriggerType("HTTP Request", Globe, "http");
          onClose();
         }}
         >
            <Globe />
            <div>
                <h2 className="text-xl">HTTP Request</h2>
                <p className="text-zinc-400">Start this flow by clicking a button.</p>
            </div>
        </div>
        
      </div>
    </aside>
  );
};

export default WorkflowSidebar;
