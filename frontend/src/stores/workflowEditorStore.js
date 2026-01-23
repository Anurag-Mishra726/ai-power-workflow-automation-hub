import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const useEditorUIStore = create(
    (set) => ({

        activeNodeId: null,
        isNodeMenuOpen: false,
        isSidebarOpen: false,
        isConfigSidebarOpen: false,

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
        }

    })
);

export default useEditorUIStore;
