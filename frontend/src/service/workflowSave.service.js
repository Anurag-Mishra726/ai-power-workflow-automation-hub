import useWorkflowData from "@/stores/workflowDataStore";
import { WorkflowNodeSchema, WorkflowEdgeSchema, WorkflowName, WorkflowId} from "@/schemas/workflowSchema";

const normalizeWorkflowName = (name) => {
  const workflowNameResult = WorkflowName.safeParse(name);
  if (!workflowNameResult.success) {
    throw new Error(workflowNameResult.error.issues[0].message)
  }
  return workflowNameResult.data;
};

const normalizeWorkflowId = (id) => {
    const workflowIdResult = WorkflowId.safeParse(id);
     if (!workflowIdResult.success) {
      throw new Error(workflowIdResult.error.issues[0].message)
    }
    return workflowIdResult.data;
}

const normalizeWorkflowNodes = (nodes) => {
    const normalizedNodes = nodes.map(({ id, type, position, data }) => ({
      id, type, position, data
    }));

    const nodeResult = WorkflowNodeSchema.safeParse(normalizedNodes);

    if (!nodeResult.success) {
      throw new Error(nodeResult.error.issues[0].message);
    }

    return normalizedNodes;
};

const normalizeWorkflowEdges = (edges) => {
    const normalizedEdges = edges.map(({ id, source, target, animated }) => ({
      id, source, target, animated
    }));

    const edgeResult = WorkflowEdgeSchema.safeParse(normalizedEdges);

     if (!edgeResult.success) {
      throw new Error(edgeResult.error.issues[0].message);
    }

    return normalizedEdges;
};

const validateWorkflow = (nodes, edges, workflowId, workflowName) => {

      if (!nodes) throw new Error("Workflow nodes are not initialized!");
      if (!workflowName) throw new Error("Workflow name is required!");
      if (!workflowId) throw new Error("Workflow not initialized properly!");

      const hasTrigger = nodes.some(n => n.data?.isTrigger);

      if (!hasTrigger) {
        throw new Error("Workflow must have a trigger");
      }

      const payload = {
        workflowId: normalizeWorkflowId(workflowId),
        workflowName: normalizeWorkflowName(workflowName),
        nodes: normalizeWorkflowNodes(nodes),
        edges: normalizeWorkflowEdges(edges),
      };

      return payload
}


export const saveWorkflow = () => {
    try {
        const { workflowNodes, workflowEdges, workflowId, workflowName } = useWorkflowData.getState();

        const payload =  validateWorkflow(workflowNodes, workflowEdges, workflowId, workflowName)

        //console.log(payload);
       
        return payload;

    } catch (err) {
      console.error(err);
        throw new Error(err.message || "Failed to save workflow");
    }
}
