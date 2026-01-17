import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const useEditorUIStore = create(
    persist(
        (set) => ({

            activeNodeId: null,
            isNodeMenuOpen: false,
             warningMessage: null,

            setActiveNode: (id) =>
                set({ activeNodeId: id }),

            setOpenNodeMenu: () => 
                set({isNodeMenuOpen: true}),

            closeNodeMenu: () =>
                set({ isNodeMenuOpen: false }),

            setWarning: (msg) => set({ warningMessage: msg }),
            clearWarning: () => set({ warningMessage: null }),
        })
    )
);

export default useEditorUIStore;
