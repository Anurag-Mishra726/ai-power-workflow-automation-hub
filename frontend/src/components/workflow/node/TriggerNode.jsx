import { useState } from "react";
import { Handle, Position } from "@xyflow/react";
import { TiFlowChildren } from "react-icons/ti";
import { EllipsisVertical } from "lucide-react";
import NodeMenu from "./NodeMenu";
import useEditorUIStore from "@/stores/workflowEditorStore";

export const TriggerNode = ({ id ,data }) => {

  const setActiveNode = useEditorUIStore(s => s.setActiveNode);

  const [open, setOpen] = useState(false);

  const actions = [
    { key: "EDIT_NODE", label: "Edit" },
    { key: "DUPLICATE_NODE", label: "Duplicate" },
    { key: "DELETE_NODE", label: "Delete", disabled: true, danger: true }
  ];

  return (
    <div className="pointer-events-auto p-2 w-40 bg-zinc-900 relative border  border-zinc-700 rounded-lg text-white flex flex-col gap-2 ">
      <div className="flex items-center justify-between ">

        <div className="text-white bg-white/10 text-xs border border-zinc-500 rounded-md p-1 flex items-center gap-1">
         <span className="text-[12px] text-white"><TiFlowChildren /></span> Trigger
        </div>
        <button className="text-white/70 text-sm cursor-pointer absolute top-0 right-0 mr-2 mt-1 py-[3px]  hover:text-white"
          onClick={(e) => {
            e.stopPropagation(); 
            setActiveNode(id);
            console.log("Trigger Menu clicked..");
            setOpen(v => !v);
          }}
        >
          <EllipsisVertical size={18} />
        </button>
        {
          open && (
            <NodeMenu
              actions={actions} 
            />
          )
        }
      </div>

      <div className=" text-sm text-white/50">
        <p>Select an event to Trigger the Flow.</p>
      </div>    

      <Handle type="source" position={Position.Right} />
    </div>
  );
};

