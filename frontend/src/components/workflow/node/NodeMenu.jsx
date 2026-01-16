import { useWorkflow } from "../hooks/useWorkflow";
import useEditorUIStore from "@/stores/workflowEditorStore";

const NodeMenu = ({ actions, onSelect }) => {

    const {activeNodeId, isNodeMenuOpen, closeNodeMenu} = useEditorUIStore();
    const {deletNode, onNodeMenuClick} = useWorkflow();

    if (!isNodeMenuOpen || !activeNodeId) return null;

    return (
        <div className="absolute right-0 top-6 bg-zinc-900 border rounded-md shadow-md">
        {actions.map(action => (
            <button
                key={action.key}
                disabled={action.disabled}
                onClick={(e) => {
                    e.stopPropagation()
                    onNodeMenuClick(action.key, activeNodeId)
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
