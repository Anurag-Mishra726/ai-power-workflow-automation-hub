import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const useWorkflowData = create(
    persist(
        (set) => ({
            workflowName: "",
            workflowId: null,
            workflowStatus: null,
            workflowTriggerType: null,
            workflowCreatedAt: null,
            workflowUpdatedAt: null,
            nodes: [],
            edges: [],

            setWorkflowName: (name) => {
                set({workflowName: name})
            },

            setWorkflowId: (id) => {
                set({workflowId: id})
            },

            setWorkflowStatus: (status) => {
                set({workflowStatus: status});
            },

            setWorkflowTriggerType: (triggerType) => {
                set({workflowTriggerType: triggerType});
            },

            setWorkflowCreatedAt: (createdAt) => {
                set({workflowCreatedAt: createdAt});
            },

            setWorkflowUpdatedAt: (updatedAt) => {
                set({workflowUpdatedAt: updatedAt});
            },

            setNodesInStore: (updater) =>
                set((state) => ({
                    nodes: typeof updater === "function" ? updater(state.nodes) : updater,
                })),

            setEdgesInStore: (updater) => 
                set((state) => ({
                    edges: typeof updater === "function" ? updater(state.edges) : updater,
                }))
        }),
        {
            name: "workflowEditor-state",
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                workflowName: state.workflowName,
                workflowId: state.workflowId,
                nodes: state.nodes,
                edges: state.edges,
                workflowCreatedAt: state.workflowCreatedAt,
                workflowUpdatedAt: state.workflowUpdatedAt,
                workflowTriggerType: state.workflowTriggerType,
                workflowStatus: state.workflowStatus,
            })
        }
    )
);

export default useWorkflowData;