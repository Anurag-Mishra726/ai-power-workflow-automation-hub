import { useCallback, useState, useMemo } from "react";
import { initialNodes } from "../config/initialNodes";
import { initialEdges } from "../config/initialEdges";
import { nodeTypes } from "../config/nodeType";
import { nodeClickActions } from "../utils/nodeAction";
import {addEdge, applyEdgeChanges, applyNodeChanges,} from '@xyflow/react'
import useEditorUIStore from "@/stores/workflowEditorStore";

export const useWorkflow = () => {
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

    const openSidebar = useCallback( (node) => {
        console.log(node);
        setIsSidebarOpen(true);
    }, [setIsSidebarOpen]);

    const closeSideBar = () => {
        setIsSidebarOpen(false)
    }

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

    const activeNodeId = useEditorUIStore((s) => s.activeNodeId);

    const isFirstNode = (nodeId, edges) => {
        return !edges.some((e) => e.target === nodeId);
    };

    const setTriggerType = (label, icon, triggerType, showWarning) => {
        //const setWarning = useEditorUIStore.getState().setWarning;
        setNodes((nds) => {
            const activeNode = nds.find((n) => n.id === activeNodeId);
            if (!activeNode) return nds;

            if ( triggerType === "manual" && !isFirstNode(activeNodeId, edges)) {
                console.warn("Manual trigger must be the first node");
                //setWarning("Manual Trigger can only be set on the first node.");
                return nds;
            }

            return nds.map((node) =>
                node.id === activeNodeId
                    ? {
                        ...node,
                        data: {
                            ...node.data,
                            label,
                            icon,
                            isTrigger: true,
                            triggerType,
                        },
                        } : 
                node
            );
        });
    };


    const ctx = useMemo(() => ({
        addNode,
        openSidebar,
    }), [addNode, openSidebar]);

    const onNodeClick = useCallback((_, node) => {
        const role = node.data?.nodeRole ?? "DEFAULT";
        const nodeClickHandler = nodeClickActions[role] ?? nodeClickActions.DEFAULT;

        console.log(node)

        nodeClickHandler(node, ctx);
    }, [ctx]);
    

    return {
        nodes,
        setNodes,
        edges,
        nodeTypes,
        onNodesChange,
        onEdgesChange,
        onConnect,
        isSidebarOpen,
        onNodeClick,
        closeSideBar,
        setTriggerType,
    }

};
