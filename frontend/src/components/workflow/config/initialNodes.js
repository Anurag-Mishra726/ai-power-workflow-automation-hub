export const initialNodes = [
  {
    id: "firstNode",
    position: { x: 0, y: 0 },
    data: {
      isConfigured: false,
    },
    type: "trigger",
  },
  {
    id: "addNode",
    position: {x: 250, y: 28},
    data: {
      nodeRole: "ADD_NODE"
    },
    type: "addNode"
  }  
];
