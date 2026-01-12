/* import {
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
 */

/* 
import React, { useCallback } from 'react';
import { 
  ReactFlow, 
  useNodesState, 
  useEdgesState, 
  addEdge, 
  Background, 
  Controls 
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { AddNode } from './AssNode';

const nodeTypes = {
  addNode: AddNode,
};

const initialNodes = [
  { 
    id: '1', 
    type: 'input', 
    data: { label: 'Trigger: New Email' }, 
    position: { x: 250, y: 0 } ,
    style:{backGround:"black"}
  },
  { 
    id: 'add-1', 
    type: 'addNode', 
    data: { label: '+' }, 
    position: { x: 250, y: 100 } 
  },
];

const initialEdges = [{ id: 'e1-add', source: '1', target: 'add-1' }];

export default function Canvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onAddStep = useCallback((parentId) => {
    const newNodeId = `node-${Date.now()}`;
    const nextAddId = `add-${Date.now()}`;

    setNodes((nds) => {
      // 1. Find the current placeholder's position
      const placeholder = nds.find((n) => n.id === parentId);
      
      // 2. Transform placeholder into a real Action node
      const updatedNodes = nds.map((n) => 
        n.id === parentId 
          ? { ...n, type: 'default', data: { label: 'New Action' } } 
          : n
      );

      // 3. Add a NEW placeholder below it
      return [
        ...updatedNodes,
        { 
          id: nextAddId, 
          type: 'addNode', 
          data: { onAdd: () => onAddStep(nextAddId) }, 
          position: { x: placeholder.position.x, y: placeholder.position.y + 100 } 
        }
      ];
    });

    // 4. Connect the action to the new placeholder
    setEdges((eds) => [...eds, { id: `e-${parentId}-${nextAddId}`, source: parentId, target: nextAddId }]);
  }, [setNodes, setEdges]);

  // Attach the click handler to initial nodes
  React.useEffect(() => {
    setNodes((nds) => nds.map(n => 
      n.type === 'addNode' ? { ...n, data: { onAdd: () => onAddStep(n.id) }} : n
    ));
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background variant="dots" gap={12} size={1} />
        <Controls />
      </ReactFlow>
    </div>
  );
} */

import React, { useCallback } from 'react';
import { 
  ReactFlow, 
  useNodesState, 
  useEdgesState, 
  Background, 
  Controls,
  MarkerType 
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

// 1. Import your custom AddNode (the "+" button)
import { AddNode } from './AddNode';

const nodeTypes = {
  addNode: AddNode,
};

const initialNodes = [
  { 
    id: 'trigger-1', 
    type: 'input', // Using the built-in React Flow input type
    data: { label: '⚡ Trigger: Form Submitted' }, 
    position: { x: 250, y: 0 },
    style: { border: '2px solid #ff4e00', borderRadius: '8px', padding: '10px' }
  },
  { 
    id: 'placeholder-1', 
    type: 'addNode', 
    data: { label: '+' }, 
    position: { x: 275, y: 120 } 
  },
];

const initialEdges = [
  { 
    id: 'e1-2', 
    source: 'trigger-1', 
    target: 'placeholder-1',
    animated: true, // Making it animated like Zapier's "draft" state
    markerEnd: { type: MarkerType.ArrowClosed } 
  }
];

export default function ZapierCanvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const handleAddStep = useCallback((placeholderId) => {
    const actionNodeId = `action-${Date.now()}`;
    const nextPlaceholderId = `placeholder-${Date.now()}`;

    setNodes((nds) => {
      // 1. Find where the "+" button currently is
      const placeholderNode = nds.find((n) => n.id === placeholderId);
      const { x, y } = placeholderNode.position;

      // 2. Remove the "+" button and replace it with a real "Action" node
      const filteredNodes = nds.filter((n) => n.id !== placeholderId);

      return [
        ...filteredNodes,
        {
          id: actionNodeId,
          type: 'default', // React Flow's built-in default node
          data: { label: '🛠️ Action: Send Email' },
          position: { x: 250, y: y }, // Place it exactly where the "+" was
        },
        {
          id: nextPlaceholderId,
          type: 'addNode',
          data: { onAdd: () => handleAddStep(nextPlaceholderId) },
          position: { x: 275, y: y + 100 }, // Move the new "+" further down
        },
      ];
    });

    // 3. Update edges to connect the new Action to the new "+"
    setEdges((eds) => {
      // Find the edge that was pointing to the old placeholder and point it to the new Action
      const updatedEdges = eds.map((e) => 
        e.target === placeholderId ? { ...e, target: actionNodeId, animated: false } : e
      );

      return [
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

  // Connect the first placeholder click event
  React.useEffect(() => {
    setNodes((nds) => nds.map(n => 
      n.id === 'placeholder-1' ? { ...n, data: { onAdd: () => handleAddStep(n.id) }} : n
    ));
  }, [handleAddStep, setNodes]);

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#f8f9fa' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        
        colorMode='dark'
      >
        <Background color="#ccc" variant="dots" />
        <Controls />
      </ReactFlow>
    </div>
  );
}