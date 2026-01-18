import { useState } from "react";
import { Handle, Position } from "@xyflow/react";
import { EllipsisVertical, Zap, Globe, MousePointer } from "lucide-react";
import NodeMenu from "./NodeMenu";
import useEditorUIStore from "@/stores/workflowEditorStore";

export const ActionNode = ({ id, data, type }) => {

  const setActiveNode = useEditorUIStore(s => s.setActiveNode);
  const setOpenNodeMenu = useEditorUIStore(s => s.setOpenNodeMenu);
  const {isNodeMenuOpen, activeNodeId, setIsSidebarOpen} = useEditorUIStore();

  const actions = [
    { key: "EDIT_NODE", label: "Edit" },
    { key: "DUPLICATE_NODE", label: "Duplicate" },
    { key: "DELETE_NODE", label: "Delete", disabled: false, danger: true }
  ];
  
  return (
    <div className="pointer-events-auto p-2 w-40 bg-zinc-900 relative border  border-zinc-700 rounded-lg text-white flex flex-col gap-2 "
      onClick={()=> {
        setActiveNode(id);
      }}
    >
      <div className="flex items-center justify-between ">

        <div className="text-white/80 bg-white/10 text-xs border border-zinc-500 rounded-md p-1 flex items-center gap-1 cursor-pointer"
           onClick={(e) => {
            e.stopPropagation();
            setActiveNode(id);
            setIsSidebarOpen();
          }}
        >
        {
          data.label && data.icon ? (
            <>
              <span className="text-[12px] text-white">
                <data.icon size={12} />
              </span>
              <p>{data.label}</p>
            </>
          ) : (
            <>
              <span className="text-[12px] text-white">
                <Zap size={12} />
              </span> 
              <p>Action</p>
            </>
          )
        }
        </div>
        <button className="text-white/70 text-sm cursor-pointer absolute top-0 right-0 mr-2 mt-1 py-[3px]  hover:text-white"
          onClick={(e) => {
            e.stopPropagation();
            console.log("Action Menu clicked...");
            setActiveNode(id);
            setOpenNodeMenu();
          }}
        >
          <EllipsisVertical size={18} />
        </button>
        {
          isNodeMenuOpen && activeNodeId === id && (
            <NodeMenu
              actions={actions} 
              nodeId={id}
              type={type}
            />
          )
        }
      </div>

      <div className="text-sm text-white flex justify-center items-center gap-2">
        {data.label ? (
          <>
            <data.icon className="text-white/50" size={16} />
            <span className="text-white/50" >{data.label}</span>
          </>
        ) : (
          <p>Select an event to run the Flow.</p>
        )}
      </div>   

      <Handle type="source" position={Position.Right} />
      <Handle type="target" position={Position.Left}/>
    </div>
  );
};



