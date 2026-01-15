import { Handle, Position } from "@xyflow/react";
import { EllipsisVertical, Zap } from "lucide-react";



export const ActionNode = ({ data }) => {
  return (
    <div className=" p-2 w-40 bg-zinc-900 relative border  border-zinc-700 rounded-lg text-white flex flex-col gap-2 ">
      <div className="flex items-center justify-between ">

        <div className="text-white/80 bg-white/10 text-xs border border-zinc-500 rounded-md p-1 flex items-center gap-1">
          <span className="text-[12px] text-white"><Zap size={12} /></span> Action
        </div>
        <div className="text-white/70 text-sm cursor-pointer absolute top-0 right-0 mr-2 mt-1 py-[3px]  hover:text-white">
          <EllipsisVertical size={18} />
        </div>
      </div>

      <div className=" text-sm text-white/50">
        <p>Select an event to run the Flow.</p>
      </div>    

      <Handle type="source" position={Position.Right} />
      <Handle type="target" position={Position.Left}/>
    </div>
  );
};



