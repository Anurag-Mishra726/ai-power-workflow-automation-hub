import { create } from "zustand";

const useEditorUIStore = create(
    (set) => ({

        activeNodeId: null,
        isNodeMenuOpen: false,
        isSidebarOpen: false,
        isConfigSidebarOpen: false,
        deleteNodeRequestId: null,

        setActiveNode: (id) =>{
            set({ activeNodeId: id });
        },

        setOpenNodeMenu: () => {
            set({isNodeMenuOpen: true});
        },

        closeNodeMenu: () =>{
            set({ isNodeMenuOpen: false });
        },

        setIsSidebarOpen: () =>
            set({ isSidebarOpen: true, isConfigSidebarOpen: false }),

        setIsSidebarClose: () => {
            set({isSidebarOpen: false});
        },

        setIsConfigSidebarOpen: () => {
            set({isConfigSidebarOpen: true , isSidebarOpen: false});
        },

        setIsConfigSidebarClose: () => {
            set({isConfigSidebarOpen: false});
        },

        requestDeleteNode: (nodeId) => set({ deleteNodeRequestId: nodeId }),

        clearDeleteNodeRequest: () => set({ deleteNodeRequestId: null }),

    })
);

export default useEditorUIStore;
