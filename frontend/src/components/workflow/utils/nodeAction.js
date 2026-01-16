export const nodeClickActions = {
  ADD_NODE: (node, ctx) => {
    ctx.addNode(node.id);
  },

  DEFAULT: (node, ctx) => {
    ctx.openSidebar(node);
  },
};

export const nodeMenuClickAction = {
  DELETE_NODE: (node, ctx) => {
    ctx.deleteNode(node);
  },
};