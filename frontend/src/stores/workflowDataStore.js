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
            workflowNodes: [],
            workflowEdges: [],

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
                    workflowNodes: typeof updater === "function" ? updater(state.workflowNodes) : updater,
                })),

            setEdgesInStore: (updater) => 
                set((state) => ({
                    workflowEdges: typeof updater === "function" ? updater(state.workflowEdges) : updater,
                })),

            clearData: () => set({
                workflowName: "",
                workflowId: null,
                workflowStatus: null,
                workflowTriggerType: null,
                workflowCreatedAt: null,
                workflowUpdatedAt: null,
                workflowNodes: [],
                workflowEdges: [],
            })
        }),
        {
            name: "workflowEditor-state",
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                workflowName: state.workflowName,
                workflowId: state.workflowId,
                workflowNodes: state.workflowNodes,
                workflowEdges: state.workflowEdges,
                workflowCreatedAt: state.workflowCreatedAt,
                workflowUpdatedAt: state.workflowUpdatedAt,
                workflowTriggerType: state.workflowTriggerType,
                workflowStatus: state.workflowStatus,
            })
        }
    )
);

export default useWorkflowData;