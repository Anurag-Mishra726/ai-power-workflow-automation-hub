import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  MarkerType 
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useCallback, useState, useEffect, useMemo } from "react";
import toast from "react-hot-toast";

import { ActionNode } from "./workflow-components/ActionNode";
import WorkflowSidebar from "./workflow-components/WorkflowSidebar";
import { TriggerNode } from "./workflow-components/TriggerNode";
import { AddNode } from "./AddNode";

// const nodeTypes = {
//   trigger: TriggerNode,
//   action: ActionNode,
//   addNode: AddNode,
// };

const initialNodes = [
  {
    id: "firstNode",
    position: { x: 0, y: 0 },
    data: {
      nodeRole: "TRIGGER"
    },
    type: "trigger",
  },
  {
    id: "addNode",
    position: {x: 300, y: 13.7},
    data: {
      nodeRole: "ADD_NODE"
    },
    type: "addNode"
  }  
];


const initialEdges = [
  { 
      id: 'e1-2', 
      source: 'firstNode', 
      target: 'addNode',
      animated: true, 
      markerEnd: { type: MarkerType.ArrowClosed } 
    }
];

  const WorkflowEditor = () => {

    const nodeTypes = useMemo(() => ({
    trigger: TriggerNode,
    action: ActionNode,
    addNode: AddNode,
  }), []);

  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

  const handleAddStep = useCallback((placeholderId) => {
    const actionNodeId = crypto.randomUUID();
    const nextPlaceholderId = crypto.randomUUID();

    setNodes((nds) => {
      const placeholderNode = nds.find((n) => n.id === placeholderId);

      const {x, y} = placeholderNode.position;

      const filteredNodes = nds.filter((n) => n.id !== placeholderId);

      return [
        ...filteredNodes,
        {
          id: actionNodeId,
          type: 'action',
          data: {},
          position: {x: x, y: y},
        },
        {
          id: nextPlaceholderId,
          type: "addNode",
          data: {
            nodeRole: "ADD_NODE"
          },
          position: {x: x + 100, y: y + 100},
        },
      ];
    });
      setEdges((eds) => {
      const updatedEdges = eds.map((e) => 
        e.target === placeholderId ? {...e, target: actionNodeId, animated: false} : e
    );

      return[
      ...updatedEdges,
      {
        id: `e-${actionNodeId}-${nextPlaceholderId}`,
        source: actionNodeId,
        target: nextPlaceholderId,
        animated: true
      },
    ];
    });
  }, [setNodes, setEdges]);

 
  // useEffect(() => {
  //   setNodes((nds) => nds.map(n => 
  //     n.id === 'addNode' ? {...n, data: { nodeRole: "ADD_NODE"}} : n
  //   ));
  // }, [handleAddStep, setNodes]);

  const deleteNode = (nodeId) => {
  setNodes((nds) => nds.filter((n) => n.id !== nodeId));

  setEdges((eds) =>
    eds.filter(
      (e) => e.source !== nodeId && e.target !== nodeId
    )
  );
};


  // const openSidebar = () => {
  //   if (hasTrigger) return;
  //   setIsSidebarOpen(true);
  // };

  return (
    <>
    
      <div className="w-full h-full relative">  
        
        <div className={`flex-1 h-full w-full`}>
        <ReactFlow

          onNodeClick={(_, node) =>{
            if(node.data.nodeRole === "ADD_NODE"){
              console.log("Holaa!!");
              handleAddStep(node.id);
            }
          }}

          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
          fitViewOptions={{ padding: 0.5 }}
          minZoom={0.5}
          maxZoom={1.2}
          className="bg-[#000000]"
          style={{ background: "#000000" }}
        >
          
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

          <Background variant="dots" gap={12} size={1} />
        </ReactFlow>
        </div>
         {/* {isSidebarOpen && (
        <WorkflowSidebar/>
      )} */}
      </div>
    </>
  );
};

export default WorkflowEditor;
