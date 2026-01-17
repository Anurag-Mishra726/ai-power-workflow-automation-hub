import { useRef } from "react";
import useEditorUIStore from "@/stores/workflowEditorStore";
import { useReactFlow } from "@xyflow/react";

const NodeMenu = ({ actions, nodeId, type }) => {

    const {closeNodeMenu} = useEditorUIStore();

    const menuRef = useRef(null);
    const { deleteElements } = useReactFlow()

    const onNodeMenuClickAction = {
        EDIT_NODE: (nodeId) => {
            console.log(nodeId);
            closeNodeMenu();
        },
        DUPLICATE_NODE: (nodeId) => {
            console.log(nodeId + "hola");
            closeNodeMenu();
        },
        DELETE_NODE: (nodeId) => {
            handleDelete();
            closeNodeMenu();
        },
    }

    const onNodeMenuClick = (key, nodeId) => {
        const handler = onNodeMenuClickAction[key];
        if (!handler) return;
        handler(nodeId);
    }

    const handleDelete = () => {
        if (type === "trigger") {
            return;
        }

        deleteElements({
        nodes: [{ id: nodeId }],
        edges: [],
        });
    }

    return (
        <div className="absolute right-0 top-6 bg-zinc-900 border rounded-md shadow-md" ref={menuRef}>
        {actions.map(action => (
            <button
                key={action.key}
                disabled={action.disabled}
                onClick={(e) => {
                    e.stopPropagation()
                    onNodeMenuClick(action.key, nodeId)
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
