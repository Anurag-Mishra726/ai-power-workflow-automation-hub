import useEditorUIStore from "@/stores/workflowEditorStore";
import DefaultConfig from "../config-panels/defaultConfig/DefaultConfig";
import ManualTriggerConfig from "../config-panels/manualTrigger/ManualTriggerConfig";
import HTTPConfig from "../config-panels/http/HTTPConfig";
import GoogleFormConfig from "../config-panels/googleForm/GoogleFormConfig";
import GeminiConfig from "../config-panels/ai/gemini/GeminiConfig";
import PerplexityConfig from "../config-panels/ai/perplexity/PerplexityConfig";
import OpenAiConfig from "../config-panels/ai/openai/OpenAiConfig";
import SlackConfig from "../config-panels/slack/SlackConfig";
import GoogleDriveConfig from "../config-panels/googleDrive/GoogleDriveConfig";
import GmailConfigState from "../config-panels/gmail/GmailConfigState";
import GitHubConfig from "../config-panels/github/GitHubConfig";

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

    case "httpWebhook": 
        return <HTTPConfig selectedNode={selectedNode} onClose={onClose} nodeType={nodeType} setNodeConfig={setNodeConfig} />;
        
    case "geminiAI":
      return <GeminiConfig selectedNode={selectedNode} onClose={onClose} setNodeConfig={setNodeConfig} />;

    case "perplexityAI":
      return <PerplexityConfig selectedNode={selectedNode} onClose={onClose} setNodeConfig={setNodeConfig} />;

    case "openAI":
      return <OpenAiConfig selectedNode={selectedNode} onClose={onClose} setNodeConfig={setNodeConfig} />;

    case "slack": 
      return <SlackConfig selectedNode={selectedNode} onClose={onClose} setNodeConfig={setNodeConfig} /> ;

    case "googleForm":
        return <GoogleFormConfig selectedNode={selectedNode} onClose={onClose} setNodeConfig={setNodeConfig} />;

    case "googleDrive":
      return <GoogleDriveConfig selectedNode={selectedNode} onClose={onClose} setNodeConfig={setNodeConfig} />;

    case "gmail":
      return <GmailConfigState selectedNode={selectedNode} onClose={onClose} setNodeConfig={setNodeConfig} />;

    case "github": 
      return <GitHubConfig selectedNode={selectedNode} onClose={onClose} setNodeConfig={setNodeConfig} />;

    default: return <DefaultConfig onClose={onClose} />;
  }
};

export default ConfigSidebar;
