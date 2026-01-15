export const nodeClickActions = {
  ADD_NODE: (node, ctx) => {
    ctx.addNode(node.id);
  },

  DEFAULT: (node, ctx) => {
    ctx.setIsSidebarOpen(true);
  },
};