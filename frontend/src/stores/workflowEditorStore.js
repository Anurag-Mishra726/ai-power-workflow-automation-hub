import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const useEditorUIStore = create(
    (set) => ({

        activeNodeId: null,
        isNodeMenuOpen: false,
        isSidebarOpen: false,

        setIsSidebarOpen: () =>
            set({ isSidebarOpen: true }),

        setIsSidebarClose: () => {
            set({isSidebarOpen: false});
        },

        setActiveNode: (id) =>
            set({ activeNodeId: id }),

        setOpenNodeMenu: () => 
            set({isNodeMenuOpen: true}),

        closeNodeMenu: () =>
            set({ isNodeMenuOpen: false }),
    })
);

export default useEditorUIStore;
