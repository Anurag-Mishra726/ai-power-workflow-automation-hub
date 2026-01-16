import { useCallback, useState, useMemo } from "react";
import { initialNodes } from "../config/initialNodes";
import { initialEdges } from "../config/initialEdges";
import { nodeTypes } from "../config/nodeType";
import { nodeClickActions, nodeMenuClickAction } from "../utils/nodeAction";
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

    const openSidebar = useCallback( (node) => {
        console.log(node);
        setIsSidebarOpen(true);
    }, [setIsSidebarOpen]);

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
        console.log("hii delete node");
        setNodes((nds) => nds.filter((n) => n.id !== nodeId));

        setEdges((eds) =>
            eds.filter(
                (e) => e.source !== nodeId && e.target !== nodeId
            )
        );
    };

//     const deleteNode = useCallback((nodeId) => {
//   setNodes((nds) =>
//     applyNodeChanges(
//       [{ id: nodeId, type: "remove" }],
//       nds
//     )
//   );

//   setEdges((eds) => {
//     const edgeRemovals = eds
//       .filter(e => e.source === nodeId || e.target === nodeId)
//       .map(e => ({ id: e.id, type: "remove" }));

//     return applyEdgeChanges(edgeRemovals, eds);
//   });
// }, []);

    const ctx = useMemo(() => ({
        addNode,
        openSidebar,
        deleteNode,
    }), [addNode, openSidebar, deleteNode]);

    const onNodeClick = useCallback((_, node) => {
        const role = node.data?.nodeRole ?? "DEFAULT";
        const nodeClickHandler = nodeClickActions[role] ?? nodeClickActions.DEFAULT;

        console.log(node)

        nodeClickHandler(node, ctx);
    }, [ctx]);

    const onNodeMenuClick = useCallback((key, nodeId) => {
        console.log(nodeId);
        const nodeMenuClickHandler = nodeMenuClickAction[key];
        if (!nodeMenuClickHandler) return;

        nodeMenuClickHandler(nodeId, ctx);
    }, [ctx]);


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
        onNodeMenuClick,
        addNode,
        deleteNode,
        closeSideBar,
    }

};
