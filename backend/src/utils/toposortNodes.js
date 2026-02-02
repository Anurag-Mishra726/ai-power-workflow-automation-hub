import toposort from "toposort";

export const sortWorkflow = (workflowGraph) => {

    const { nodes, edges } = workflowGraph;

    if (!edges || edges.length === 0) {
        throw new Error("Workflow must have at least one connection");
    }

    const executableNodes = nodes.filter((n) => n.type !== "addNode");

    const nodeMap = new Map(nodes.map((n) => [n.id, n]));

    const executableEdges = edges
        .filter((e) => nodeMap.has(e.source) && nodeMap.has(e.target))
        .map((e) => [e.source, e.target]);

    let sortedIds;

    try {
        sortedIds = toposort(executableEdges);
    } catch (err) {
        throw new Error("Workflow contains a cycle");
    }

    const sortedSet = new Set(sortedIds);

    const disconnectedNodes = executableNodes.filter((n) => !sortedSet.has(n.id));

    if (disconnectedNodes.length > 0) {
        throw new Error(
        "Workflow has disconnected nodes.",
        );
    }

    const sortedNodes = sortedIds.map((id) => nodeMap.get(id));
        //console.log(sortedNodes);
    return sortedNodes;

    // Problem when there is single node (measn firstNode and placeholder node) placeholder is removed above than it throw error of no connection solve that problem.
};
