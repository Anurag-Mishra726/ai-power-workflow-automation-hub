import { useRef } from "react";
import useEditorUIStore from "@/stores/workflowEditorStore";

const NodeMenu = ({ actions, nodeId, type }) => {

    const {closeNodeMenu, requestDeleteNode } = useEditorUIStore();

    const menuRef = useRef(null);

    const onNodeMenuClickAction = {
        EDIT_NODE: () => {
            console.log("Editing");
            closeNodeMenu();
        },
        DUPLICATE_NODE: () => {
            console.log("Duptlicating");
            closeNodeMenu();
        },
        DELETE_NODE: () => {
            handleDelete();
            closeNodeMenu();
        },
    }

    const onNodeMenuClick = (key) => {
        const handler = onNodeMenuClickAction[key];
        if (!handler) return;
        handler();
    }

    const handleDelete = () => {
        if (type === "trigger") {
            return;
        }
        requestDeleteNode(nodeId);
    }

    return (
        <div className="absolute right-0 top-6 bg-zinc-900 border rounded-md shadow-md" ref={menuRef}>
        {actions.map(action => (
            <button
                key={action.key}
                disabled={action.disabled}
                onClick={(e) => {
                    e.stopPropagation()
                    onNodeMenuClick(action.key)
                }}
                className={`block w-full px-3 py-2 text-left text-sm
                    ${action.danger ? "text-red-500" : "text-white"}
                    ${action.disabled ? "opacity-40 cursor-not-allowed" : "hover:bg-neutral-800"}`}
            >
            {action.label}
            </button>
        ))}
        </div>
    );
};

export default NodeMenu;
