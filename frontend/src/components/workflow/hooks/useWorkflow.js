import { useCallback, useEffect, useMemo, useState } from "react";
import { initialNodes } from "../config/initialNodes";
import { initialEdges } from "../config/initialEdges";
import { nodeTypes } from "../config/nodeType";
import { nodeConfigMap } from "../utils/nodeConfigMap";
import { nodeClickActions } from "../utils/nodeAction";
import {addEdge, applyEdgeChanges, applyNodeChanges,} from '@xyflow/react'
import useEditorUIStore from "@/stores/workflowEditorStore";
import useWorkflowData from "@/stores/workflowDataStore";
import { toast } from "react-hot-toast"; 

export const useWorkflow = () => {
    const { workflowNodes, workflowEdges } = useWorkflowData();

    const [nodes, setNodes] = useState(initialNodes);
    const [edges, setEdges] = useState(initialEdges);

    useEffect(() => {
        if (workflowNodes?.length) {
            setNodes(workflowNodes);
        }
        if (workflowEdges?.length) {
            setEdges(workflowEdges);
        }
        }, [workflowNodes, workflowEdges]);
    


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
        (params) => setEdges((edgesSnapshot) => {
            const updatedEdges = addEdge(params, edgesSnapshot);
            queueMicrotask(() => useWorkflowData.getState().setEdgesInStore(updatedEdges));
            return updatedEdges;
        }),
        []
    );

    const {isSidebarOpen, setIsSidebarOpen, setIsSidebarClose} = useEditorUIStore();

    const openSidebar = useCallback(() => {
        setIsSidebarOpen()
    }, [setIsSidebarOpen]);

    const closeSideBar = useCallback(() => {
        setIsSidebarClose()
    }, [setIsSidebarClose]);

    const { setIsConfigSidebarOpen, setIsConfigSidebarClose } = useEditorUIStore();

    const openConfigSidebar = useCallback(() => {
        console.log("Opening Config Sidebar");
        setIsConfigSidebarOpen();
    }, [setIsConfigSidebarOpen]);

    const closeConfigSidebar = useCallback(() => {
        setIsConfigSidebarClose();
    }, [setIsConfigSidebarClose]);

    const addNode = useCallback((placeholderId) => {

        const actionNodeId = crypto.randomUUID();
        const nextPlaceholderId = "lastNode";
        let updatedNodes = null;
        let updatedEdges = null;

        setNodes((nds) => {
            const placeholderNode = nds.find((n) => n.id === placeholderId);

            const { x, y } = placeholderNode.position;

            updatedNodes = [
                ...nds.filter((n) => n.id !== placeholderId),
                {
                    id: actionNodeId,
                    type: "action",
                    data: {
                        isTrigger: false,
                        isConfigured: false,
                    },
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

            queueMicrotask(() => useWorkflowData.getState().setNodesInStore(updatedNodes));
            
            return updatedNodes
        });
        

        setEdges((eds) => {
            updatedEdges =  [
                ...eds.map((e) =>
                e.target === placeholderId
                    ? { ...e, target: actionNodeId, animated: false }
                    : e
            ),
                {
                    id: `e-${actionNodeId}-${nextPlaceholderId}`,
                    source: actionNodeId,
                    target: nextPlaceholderId,
                    animated: true,
                },
            ];
            queueMicrotask(() => useWorkflowData.getState().setEdgesInStore(updatedEdges));
            return updatedEdges;
        });

        // if (updatedEdges) {
        //     useWorkflowData.getState().setEdgesInStore(updatedEdges);
        // }

    }, [setNodes, setEdges]
    );

    const activeNodeId = useEditorUIStore((s) => s.activeNodeId);
   
    const deleteNode = (deleteNodeId) => {
        console.log("deleteing.................", deleteNodeId);

        setNodes((nds) => {
            const updatedNodes = nds.filter((n) => n.id !== deleteNodeId)
            queueMicrotask(() => useWorkflowData.getState().setNodesInStore(updatedNodes));
            return updatedNodes;
        });

        setEdges((eds) => {
            const updatedEdges = eds.filter((e) => e.source !== deleteNodeId && e.target !== deleteNodeId)
            queueMicrotask(() => useWorkflowData.getState().setEdgesInStore(updatedEdges));
            return updatedEdges;
        }           
        );
    }


    const isFirstNode = (nodeId, edges) => {
        return !edges.some((e) => e.target === nodeId);
    };

    const setTriggerType = (label, triggerType) => {

       try {
            let updatedNodes;
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
                
                const configHandler = nodeConfigMap[triggerType];

                updatedNodes = nds.map((node) =>
                    node.id === activeNodeId
                        ? {
                            ...node,
                            data: {
                                label,
                                isTrigger: true,
                                isConfigured: configHandler.isComplete(),
                                triggerType,
                                summary: configHandler.buildSummary(),
                            },
                        } : 
                    node
                )
                return updatedNodes;
                
            }); 
            if (updatedNodes) {
                useWorkflowData.getState().setNodesInStore(updatedNodes);
            }
            const {workflowEdges} = useWorkflowData.getState();
            if (!workflowEdges || !workflowEdges.length )  {
                queueMicrotask(() => useWorkflowData.getState().setEdgesInStore(initialEdges));
            }
            
       } catch (error) {
            console.error("Error setting trigger type:", error);
            return ;
       }
    };

    const setNodeConfig = ( data ) => {
        //console.log(data.variable);
        try {
            let updatedNodes = null;

            setNodes((nds) => {
                updatedNodes = nds.map((node) => {
                    if(node.id !== activeNodeId) return node;

                    const configHandler = nodeConfigMap[node.data.triggerType];
                    if (!configHandler) return node;

                    const mergedConfig = {
                        ...configHandler.defaultConfig,
                        ...node.data.config,
                        ...data
                    }

                    return {
                        ...node,
                        data: {
                            ...node.data,
                            config: mergedConfig,
                            summary: configHandler.buildSummary(mergedConfig),
                            isConfigured: configHandler.isComplete(mergedConfig),
                        }
                    }
                }); 

                console.log(updatedNodes);

                return updatedNodes;

            });

            if (updatedNodes) {
                useWorkflowData.getState().setNodesInStore(updatedNodes);
            }
            
            return {success: true};

        } catch (error) {
            console.error("Error setting node config:", error);
            return {success: false, error: error};
        }
    }


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
        setEdges,
        nodeTypes,
        onNodesChange,
        onEdgesChange,
        onConnect,
        isSidebarOpen,
        onNodeClick,
        setTriggerType,
        setNodeConfig,
        closeSideBar,
        closeConfigSidebar,
        deleteNode,
    }

};
