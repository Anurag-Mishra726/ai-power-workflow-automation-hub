import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';

export const AddNode = memo(({ data }) => {
  return (
    <div 
      onClick={data.onAdd}
      className="px-4 py-2 shadow-md rounded-md bg-black border-2 border-dashed border-gray-300 hover:border-blue-500 cursor-pointer flex items-center justify-center transition-all"
    >
      <div className="text-gray-400 font-bold">+ Add Step</div>
      <Handle type="target" position={Position.Top} className="opacity-0" />
      <Handle type="source" position={Position.Bottom} className="opacity-0" />
    </div>
  );
});