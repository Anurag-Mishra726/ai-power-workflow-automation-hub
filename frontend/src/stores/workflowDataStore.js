import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const useWorkflowData = create(
    persist(
        (set) => ({
            workflowName: "",
            workflowId: null,
            node: [],
            edges: [],

            setWorkflowName: (name) => {
                set({workflowName: name})
            },

            setWorkflowId: (id) => {
                set({workflowId: id})
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
                edges: state.edges
            })
        }
    )
)

export default useWorkflowData;