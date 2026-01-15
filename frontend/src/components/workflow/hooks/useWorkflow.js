import { useCallback, useState, useMemo } from "react";
import { initialNodes } from "../config/initialNodes";
import { initialEdges } from "../config/initialEdges";
import { nodeTypes } from "../config/nodeType";
import { nodeClickActions } from "../utils/nodeAction";
import {addEdge, applyEdgeChanges, applyNodeChanges,} from '@xyflow/react'

export const useWorkflow = () => {
    const [nodes, setNodes] = useState(initialNodes);
    const [edges, setEdges] = useState(initialEdges);

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [selectedNode, setSelectedNode] = useState(null);

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

    const addNode = useCallback((placeholderId) => {

        const actionNodeId = crypto.randomUUID();
        const nextPlaceholderId = crypto.randomUUID();

        setNodes((nds) => {
            const placeholderNode = nds.find((n) => n.id === placeholderId);

            const { x, y } = placeholderNode.position;

            const filteredNodes = nds.filter((n) => n.id !== placeholderId);

            return [
                ...filteredNodes,
                {
                    id: actionNodeId,
                    type: "action",
                    data: {},
                    position: { x: x, y: y },
                },
                {
                    id: nextPlaceholderId,
                    type: "addNode",
                    data: {
                        nodeRole: "ADD_NODE",
                    },
                    position: { x: x + 200, y: y },
                },
            ];
        });

        setEdges((eds) => {
            const updatedEdges = eds.map((e) =>
                e.target === placeholderId
                    ? { ...e, target: actionNodeId, animated: false }
                    : e
            );

            return [
                ...updatedEdges,
                {
                    id: `e-${actionNodeId}-${nextPlaceholderId}`,
                    source: actionNodeId,
                    target: nextPlaceholderId,
                    animated: true,
                },
            ];
        });
    }, [setNodes, setEdges]
    );

    const deleteNode = (nodeId) => {
        setNodes((nds) => nds.filter((n) => n.id !== nodeId));

        setEdges((eds) =>
            eds.filter(
                (e) => e.source !== nodeId && e.target !== nodeId
            )
        );
    };


    const ctx ={
        addNode,
        isSidebarOpen
    }

    const onNodeClick = useCallback((_, node) => {
        const role = node.data?.nodeRole ?? "DEFAULT";
        const handler = nodeClickActions[role] ?? nodeClickActions.DEFAULT;

        console.log(node)

        handler(node, {
            addNode,
            setIsSidebarOpen,
        });
    }, [addNode, setIsSidebarOpen]
    );


    const closeSideBar = () => {
        setIsSidebarOpen(false)
    }

    return {
        nodes,
        edges,
        nodeTypes,
        onNodesChange,
        onEdgesChange,
        onConnect,
        isSidebarOpen,
        selectedNode,
        onNodeClick,
        addNode,
        closeSideBar,
    }

};
