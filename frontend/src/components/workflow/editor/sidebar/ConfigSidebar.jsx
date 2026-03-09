import useEditorUIStore from "@/stores/workflowEditorStore";
import { X } from 'lucide-react';
import ManualTriggerConfig from "../config-panels/ManualTriggerConfig";
import HTTPConfig from "../config-panels/HTTPConfig";
import GoogleFormConfig from "../config-panels/GoogleFormConfig";
import GeminiConfig from "../config-panels/GeminiConfig";
import PerplexityConfig from "../config-panels/PerplexityConfig";
import CloseBtn from "@/components/common/CloseBtn";

const ConfigSidebar = ({ nodes, onClose, setNodeConfig }) => {

    const { activeNodeId } = useEditorUIStore();

    const selectedNode = nodes.find((node) => node.id === activeNodeId);
    const nodeType = selectedNode ? selectedNode.type : null;

  if (!selectedNode || !selectedNode.data.isTrigger || activeNodeId === null) {
    onClose();
  }

  switch (selectedNode.data.triggerType) {
    case "manual":
        return <ManualTriggerConfig  onClose={onClose}  />;
    
    case "http": 
        return <HTTPConfig selectedNode={selectedNode} onClose={onClose} nodeType={nodeType} setNodeConfig={setNodeConfig} />;

    case "googleForm":
        return <GoogleFormConfig onClose={onClose} />;

    case "geminiAI":
        return <GeminiConfig selectedNode={selectedNode} onClose={onClose} setNodeConfig={setNodeConfig} />;

    case "perplexityAI":
        return <PerplexityConfig selectedNode={selectedNode} onClose={onClose} setNodeConfig={setNodeConfig} />;

    default: return ;
  }
};

export default ConfigSidebar;
