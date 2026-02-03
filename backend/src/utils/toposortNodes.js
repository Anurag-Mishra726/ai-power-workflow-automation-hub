import toposort from "toposort";
import { AppError } from "./AppErrors.js";

export const sortWorkflowNodes = (workflowGraph) => {

    const { nodes, edges } = workflowGraph;

    const executableNodes = nodes.filter((n) => n.type !== "addNode");

    if (executableNodes.length === 0) {
        throw new AppError("No executable nodes found");
    }

    if (executableNodes.length === 1) {
        return executableNodes; 
    }

    if (!edges || edges.length === 0) {
        throw new AppError("Workflow must have at least one connection");
    }

    const nodeMap = new Map(executableNodes.map((n) => [n.id, n]));

    const executableEdges = edges
        .filter((e) => nodeMap.has(e.source) && nodeMap.has(e.target))
        .map((e) => [e.source, e.target]);

    let sortedIds;

    try {
        sortedIds = toposort(executableEdges);
    } catch (err) {
        throw new Error("Workflow contains a cycle");
    }

    const sortedNodesIds = sortedIds.filter((id) => id !== "addNode");

    const sortedSet = new Set(sortedNodesIds);

    const disconnectedNodes = executableNodes.filter((n) => !sortedSet.has(n.id));

    if (disconnectedNodes.length > 0) {
        throw new AppError(`Workflow has ${disconnectedNodes.length} disconnected nodes.`);
    }

    const sortedNodes = sortedNodesIds.map((id) => nodeMap.get(id)).filter(Boolean);

    return sortedNodes;
};
