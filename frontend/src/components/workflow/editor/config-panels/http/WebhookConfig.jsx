import { useEffect, useMemo } from "react";
import { Globe, Webhook } from "lucide-react";
import CloseBtn from "@/components/common/CloseBtn";
import CopyToClipboard from "@/components/common/CopyToClipboard";
import useEditorUIStore from "@/stores/workflowEditorStore";
import useWorkflowData from "@/stores/workflowDataStore";

const WebhookConfig = ({ selectedNode, onClose, setNodeConfig }) => {
  const { setIsConfigSidebarClose } = useEditorUIStore();
  const { workflowId } = useWorkflowData();

  const systemVariable = useMemo(() => {
    const nodeSuffix = String(selectedNode?.id || "").replace(/[^a-zA-Z0-9_]/g, "").slice(0, 8);
    return `webhook_${nodeSuffix || "payload"}`;
  }, [selectedNode?.id]);

  const webhookUrl = useMemo(() => {
    if (!workflowId) return "";
    return `https://linus-terrible-murray.ngrok-free.dev/api/webhook/${workflowId}/http-webhook`;
  }, [workflowId]);

  useEffect(() => {
    if (!selectedNode?.id || !workflowId) return;

    const existingConfig = selectedNode?.data?.config || {};

    if (
      existingConfig?.method === "ANY" &&
      existingConfig?.variable === systemVariable &&
      existingConfig?.url === webhookUrl
    ) {
      return;
    }

    setNodeConfig({
      method: "ANY",
      variable: systemVariable,
      url: webhookUrl,
    });
  }, [selectedNode?.id, selectedNode?.data?.config, setNodeConfig, systemVariable, webhookUrl, workflowId]);

  return (
    <aside className="absolute top-0 right-0 h-full w-1/3 m-1 bg-black border border-zinc-700 rounded-lg text-white z-50 flex flex-col">
      <div className="flex px-4 py-3 border-b-2 border-zinc-700 relative">
        <div>
          <h2 className="text-3xl font-semibold text-zinc-100 font-mono flex items-center gap-3">
            <span className="p-2 border border-zinc-400 rounded-xl">
              <Webhook size={20} />
            </span>
            Webhook
          </h2>
          <p className="text-sm text-[#E5E5E5] mt-2 font-normal">
            This webhook is fully system-generated. Copy the details and send requests to trigger this workflow.
          </p>
        </div>
        <CloseBtn onClose={onClose} />
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
        <section>
          <h3 className="text-sm font-semibold text-zinc-200 mb-3">Variable (System-defined)</h3>
          <div className="w-full rounded-md bg-zinc-900 border border-zinc-700 px-3 py-2 text-sm text-white flex items-center justify-between gap-3">
            <span className="truncate">{`{{${systemVariable}.output.data}}`}</span>
            <CopyToClipboard text={`{{${systemVariable}.output.data}}`} />
          </div>
          <p className="text-[12px] mt-1 text-zinc-400">
            Use this variable in next nodes to access webhook payload data.
          </p>
        </section>

        <section>
          <h3 className="text-sm font-semibold text-zinc-200 mb-3">Webhook URL (System-defined)</h3>
          <div className="w-full rounded-md bg-zinc-900 border border-zinc-700 px-3 py-2 text-sm text-white flex items-center justify-between gap-3">
            <span className="truncate">{webhookUrl || "Generating webhook URL..."}</span>
            <CopyToClipboard text={webhookUrl} />
          </div>
          <p className="text-[12px] mt-1 text-zinc-400">Send requests to this URL to trigger workflow execution.</p>
        </section>

        <section>
          <h3 className="text-sm font-semibold text-zinc-200 mb-2">Method</h3>
          <div className="w-24 rounded-md bg-zinc-900 border border-zinc-700 px-3 py-2 text-sm text-white text-center">ANY</div>
        </section>

        <section className="rounded-lg border border-zinc-700 bg-zinc-900/40 p-3">
          <h4 className="text-base font-semibold flex items-center gap-2"><Webhook size={14} /> How to use</h4>
          <p className="text-sm text-zinc-300 mt-2 leading-relaxed flex flex-col gap-2">
            <span>1. Copy the webhook URL above.</span> 
            <span>2. From your app/server/client, send an HTTP request with any method (GET/POST/PUT/PATCH/DELETE) to this URL.</span> 
            <span>3. The incoming request details are available in downstream nodes via the variable shown above.</span>
          </p>
        </section>
      </div>

      <div className="border-t border-zinc-600 px-4 py-3 bg-zinc-900/50">
        <button
          type="button"
          onClick={setIsConfigSidebarClose}
          className="w-full flex items-center justify-center gap-2 bg-white text-black font-bold py-3 rounded-xl hover:bg-zinc-200 transition-colors"
        >
          Done
        </button>
      </div>
    </aside>
  );
};

export default WebhookConfig;
