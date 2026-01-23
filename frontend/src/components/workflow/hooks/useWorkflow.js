import { useCallback, useState, useMemo, use } from "react";
import { initialNodes } from "../config/initialNodes";
import { initialEdges } from "../config/initialEdges";
import { nodeTypes } from "../config/nodeType";
import { nodeClickActions } from "../utils/nodeAction";
import {addEdge, applyEdgeChanges, applyNodeChanges,} from '@xyflow/react'
import useEditorUIStore from "@/stores/workflowEditorStore";
import { toast } from "react-hot-toast"; 

export const useWorkflow = () => {
    const [nodes, setNodes] = useState(initialNodes);
    const [edges, setEdges] = useState(initialEdges);

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
    const {isSidebarOpen, setIsSidebarOpen, setIsSidebarClose} = useEditorUIStore();

    const openSidebar = () => {
        setIsSidebarOpen()
    }

    const closeSideBar = () => {
        setIsSidebarClose()
    }

    const {isConfigSidebarOpen, setIsConfigSidebarOpen, setIsConfigSidebarClose} = useEditorUIStore();

    const openConfigSidebar = () => {
        console.log("Opening Config Sidebar");
        setIsConfigSidebarOpen();
    }

    const closeConfigSidebar = () => {
        setIsConfigSidebarClose();
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

    const setTriggerType = (label, icon, triggerType) => {
        setNodes((nds) => {
            const activeNode = nds.find((n) => n.id === activeNodeId);

            if (!activeNode) return nds;

            if ( triggerType === "manual" && !isFirstNode(activeNodeId, edges)) {
                queueMicrotask(() => toast.error("Manual only allowed on first node!" ,{
                    style: {
                        color: "black"
                    },
                }));
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
        openConfigSidebar,
    }), [addNode, openSidebar, openConfigSidebar]);

    const onNodeClick = useCallback((_, node) => {
        const role = node.data?.nodeRole ?? "DEFAULT";
        const nodeClickHandler = nodeClickActions[role] ?? nodeClickActions.DEFAULT;
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
        setTriggerType,
        closeSideBar,
        closeConfigSidebar,
    }

};
