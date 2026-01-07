import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useCallback, useState } from 'react';

const initialNodes = [

    { 
        id: 'n1', 
        position: { x: 0, y: 0 }, 
        data: { label: 'Trigger' },
        style: { background: '#0f0f0f', color: "#f3f4f6", border: "1px solid #374151" }
    },
    { 
        id: 'n2', 
        position: { x: 0, y: 100 }, 
        data: { label: 'Action' },
        style: { background: "#0f0f0f", color: "#f3f4f6", border: "1px solid #374151" }
    },
];
const initialEdges = [{ id: 'n1-n2', source: 'n1', target: 'n2' }];

export default function App() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  const onNodesChange = useCallback(
    (changes) => setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    [],
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    [],
  );
  const onConnect = useCallback(
    (params) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    [],
  );

  return (
    <>
        <div className='w-full h-full relative '>
        <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            fitView
            className='bg-[#000000]'
             style={{ background: "#000000" }}
        >
            <Controls
            className='react-flow__controls '
            showInteractive={true}
                style={{
                    background: "#111827",
                    border: "1px solid #1f2937",
                    borderRadius: "6px"
            }}/>

            <MiniMap nodeColor={() => "#e0e0e0"}
                maskColor="rgba(0,0,0,0)"
                style={{ backgroundColor: "#0f0f0f", borderRadius: "6px" 
            }}/>

            <Background variant="dots" gap={10} size={1} />
        </ReactFlow>
        </div>
    </>
  );
}
