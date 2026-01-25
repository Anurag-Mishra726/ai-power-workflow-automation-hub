import useWorkflowData from "@/stores/workflowDataStore";

export async function saveWorkflow() {
    try {
        const { nodes, edges, workflowId, workflowName } = useWorkflowData.getState();

        if (!workflowId || !nodes ) {
            console.error("Workflow not initialized properly:", { workflowId, nodes, edges });
            throw new Error("Workflow not initialized");
        }

        validateWorkflow(nodes);

        const payload = {
            name: workflowName,
            nodes: normalizeNodes(nodes),
            edges: normalizeEdges(edges),
        };

        return payload;

    } catch (err) {
        throw new Error(err.message || "Failed to save workflow");
    }
}

function normalizeNodes(nodes) {
  return nodes.map(({ id, type, position, data }) => ({
    id, type, position, data
  }));
}

function normalizeEdges(edges) {
  return edges.map(({ id, source, target, sourceHandle, targetHandle }) => ({
    id, source, target, sourceHandle, targetHandle
  }));
}

function validateWorkflow(nodes) {
  const hasTrigger = nodes.some(n => n.data?.isTrigger);
  if (!hasTrigger) {
    throw new Error("Workflow must have a trigger");
  }
}