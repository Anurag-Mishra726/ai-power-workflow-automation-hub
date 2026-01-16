import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const useEditorUIStore = create(
    persist(
        (set) => ({

            activeNodeId: null,
            isNodeMenuOpen: false,

            setActiveNode: (id) =>
                set({ activeNodeId: id, isNodeMenuOpen: true }),

            closeNodeMenu: () =>
                set({ isNodeMenuOpen: false }),
        })
    )
);

export default useEditorUIStore;
