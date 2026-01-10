import React, { useCallback } from "react";
import { useReactFlow, useNodeId, Handle, Position } from "@xyflow/react";
import { Plus } from "lucide-react";


export const PlaceholderNode = () => {
  // const id = useNodeId();
  // const { setNodes, setEdges } = useReactFlow();

  // const handleClick = useCallback(() => {
  //   if (!id) return;

  //   // stop any animation if needed
  //   setEdges((edges) =>
  //     edges.map((edge) =>
  //       edge.target === id ? { ...edge, animated: false } : edge
  //     )
  //   );

  //   // convert placeholder → normal node
  //   setNodes((nodes) =>
  //     nodes.map((node) =>
  //       node.id === id
  //         ? {
  //             ...node,
  //             data: { ...node.data, label: "Trigger" },
  //             type: "default",
  //           }
  //         : node
  //     )
  //   );
  // }, [id, setEdges, setNodes]);


  const handleClick = () => console.log("SideBar Open");

  return (
    <div 
    className="w-14 h-8 flex justify-center items-center border border-dashed border-zinc-500 rounded-xl 
    text-center bg-zinc-900 text-gray-500 cursor-pointer hover:border-zinc-300"
       onClick={handleClick}
    >
      <Plus size={15} className="text-zinc-400" />
      <Handle
        type="target"
        style={{ visibility: "hidden" }}
        position={Position.Top}
        isConnectable={false}
      />
      <Handle
        type="source"
        style={{ visibility: "hidden" }}
        position={Position.Bottom}
        isConnectable={false}
      />
    </div>
  );
}


export const AddNodeBtn = () => {
  return (
    <>
      <div className= "flex justify-center items-center p-1 rounded-md bg-zinc-700 hover:bg-zinc-500">
        <button className=" text-white">
          <Plus/>
        </button>
      </div>
    </>
  )
}