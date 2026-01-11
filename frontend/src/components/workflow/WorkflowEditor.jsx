import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Panel,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useCallback, useState, useEffect, useMemo } from "react";
import toast, { ToastBar } from "react-hot-toast";

import {PlaceholderNode, AddNodeBtn} from "./workflow-components/PlaceholderNode";
import WorkflowSidebar from "./workflow-components/WorkflowSidebar";
import { TriggerNode, ActionNode } from "./workflow-components/TriggerNode";

const nodeTypes = {
  placeholder: PlaceholderNode,
  trigger: TriggerNode,
  action: ActionNode,
};

const initialNodes = [
  {
    id: "placeholder",
    position: { x: 0, y: 0 },
    data: {},
    type: "placeholder",
  },
];


const initialEdges = [];

const WorkflowEditor = () => {

  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [hasTrigger, setHasTrigger] = useState(false);

  const onNodesChange = useCallback(
    (changes) =>
      setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    []
  );
  const onEdgesChange = useCallback(
    (changes) =>
      setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    []
  );
  const onConnect = useCallback(
    (params) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    []
  );



  const openSidebar = () => {
    if (hasTrigger) return;
    setIsSidebarOpen(true);
  };


  const createTriggerNode = (triggerType) => {
    if (hasTrigger){
      toast.error("Only one Trigger Node is allowed.")
      return;
    };

    setNodes((nds) => [
      ...nds,
      {
        id: crypto.randomUUID(),
        type: "trigger",
        position: { x: -100, y: 0 },
        data: { triggerType },
      },
    ]);

    setHasTrigger(true);
    setIsSidebarOpen(false);
  };

  const addNode = (label) => {
    setNodes((nds) => [
      ...nds,
      {
        id: crypto.randomUUID(),
        type: "action",
        position: {
          x: (Math.random() - 0.5 )*100 ,
          y: (Math.random() - 0.5 )*100 ,
        },
        data: {
          label,
        },
      },
    ]);
  };

  const nodesWithHandlers = useMemo(
    () =>
      nodes.map((n) =>
        n.type === "placeholder"
          ? { ...n, data: { onAddClick: openSidebar } }
          : n
      ),
    [nodes]
  );


  return (
    <>
    
      <div className="w-full h-full relative">  
        
        <div className={`flex-1 h-full w-full`}>
        <ReactFlow
          nodes={nodesWithHandlers}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
          className="bg-[#000000]"
          style={{ background: "#000000" }}
        >

          <Panel position="top-right">
            <AddNodeBtn onClose= {() => setIsSidebarOpen(true)} />
          </Panel>
          
          <Controls
            className="react-flow__controls "
            showInteractive={true}
            style={{
              background: "#111827",
              border: "1px solid #1f2937",
              borderRadius: "6px",
            }}
          />

          <MiniMap
            nodeColor={() => "#e0e0e0"}
            maskColor="rgba(0,0,0,0)"
            style={{ backgroundColor: "#0f0f0f", borderRadius: "6px" }}
          />

          <Background variant="dots" gap={10} size={1} />
        </ReactFlow>
        </div>
         {isSidebarOpen && (
        <WorkflowSidebar
          onSelect={createTriggerNode}
          onClose={() => setIsSidebarOpen(false)}
          onCreate={addNode}
        />
      )}
      </div>
    </>
  );
};

export default WorkflowEditor;
