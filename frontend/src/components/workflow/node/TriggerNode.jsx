import { Handle, Position } from "@xyflow/react";
import { TiFlowChildren } from "react-icons/ti";
import { EllipsisVertical ,CircleDot, CheckCircle, AlertCircle } from "lucide-react";
import NodeMenu from "./NodeMenu";
import useEditorUIStore from "@/stores/workflowEditorStore";
import NodeStatusSpinner from "@/components/common/NodeStatus";

import IconMap from "../utils/nodeIcon";

export const TriggerNode = ({ id ,data, type }) => {

  const setActiveNode = useEditorUIStore(s => s.setActiveNode);
  const setOpenNodeMenu = useEditorUIStore(s => s.setOpenNodeMenu);
  const setNodeType = useEditorUIStore(s => s.setNodeType);
  const {isNodeMenuOpen, activeNodeId, setIsSidebarOpen} = useEditorUIStore();

  const actions = [
    { key: "EDIT_NODE", label: "Edit" },
    { key: "DUPLICATE_NODE", label: "Duplicate" },
    { key: "DELETE_NODE", label: "Delete", disabled: true, danger: true }
  ];

  const Icon = IconMap[data.triggerType] || TiFlowChildren;

  return (
    <div className="pointer-events-auto p-2 w-44 bg-zinc-900 relative border  border-zinc-700 rounded-lg text-white flex flex-col gap-2
    hover:border-white "
      onClick={()=> {
        setActiveNode(id);
        setNodeType("trigger");
      }}
    >
      <div className="flex items-center justify-between ">

        <div className="text-white bg-white/10 text-xs border border-zinc-500 rounded-md p-1 flex items-center gap-1 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            setNodeType("trigger");
            setActiveNode(id);
            setIsSidebarOpen();
          }}
        >
          {
            data.label && data.triggerType ? (
              <>
                <span className="text-[12px] ">
                  <Icon size={12} />
                </span>
                <p>{data.label}</p>
              </>
            ) : (
              <>
                <span className="text-[12px]">
                  <TiFlowChildren size={12} />
                </span> 
                <p>Trigger</p>
              </>
            )
          }
          {/* <NodeStatusSpinner status={nodeStatus} /> */}
        </div>
       
        <button className="text-white/70 text-sm cursor-pointer absolute top-0 right-0 mr-2 mt-2 py-[3px]  hover:text-white"
          onClick={(e) => {
            e.stopPropagation(); 
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

      <div className="text-sm text-white/50 flex items-center gap-2">
        { data.summary && data.isConfigured ? (
          <>
            <span className="flex items-center gap-2 min-w-0">
              <CheckCircle size={12} className="flex-shrink-0" />
              <span className="truncate">
                {data.summary}
              </span>
            </span>
          </>
          ) : (
          <>
            <CircleDot 
              size={12} 
              className="flex-shrink-0" 
            />
            <p>Select an event to trigger the Flow.</p>
          </>
        )}
      </div>

      <Handle type="source" position={Position.Right} />
      
    </div>
  );
};

