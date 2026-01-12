import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Plus } from 'lucide-react';

export const AddNode = memo(({ data }) => {
  return (
    <div 
      onClick={data.onAdd}
      className="px-4 py-1 shadow-md rounded-md bg-black border-2 border-dashed border-zinc-500 hover:border-zinc-300 cursor-pointer flex items-center justify-center transition-all text-zinc-500 hover:text-white"
    >
      <div className=" flex justify-center items-center font-bold "> <span><Plus size={15}/></span> Add</div>
      <Handle type="target" position={Position.Left} className="opacity-0" />
      <Handle type="source" position={Position.Right} className="opacity-0" />
    </div>
  );
});