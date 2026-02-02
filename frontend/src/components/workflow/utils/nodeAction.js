export const nodeClickActions = {
  ADD_NODE: (node, ctx) => {
    ctx.addNode(node.id);
  },

  DEFAULT: (node, ctx) => {
    console.log(node)
    if (node.data.isTrigger) {
      ctx.openConfigSidebar();
      console.log("agdam bagdam");
      return;
    }
    ctx.openSidebar(node);
  },
};
