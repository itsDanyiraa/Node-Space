import { Node } from "@xyflow/react";

let idCounter = Date.now();

export function createNode(position: { x: number; y: number }): Node {
  idCounter++;
  return {
    id: `node-${idCounter}`,
    type: "standard",
    position,
    data: {
      title: "New Node",
      notes: "",
      color: "blue",
      type: "standard",
    },
  };
}

export function createMergeNode(position: { x: number; y: number }): Node {
  idCounter++;
  return {
    id: `node-${idCounter}`,
    type: "merge",
    position,
    data: {
      title: "Merged Idea",
      notes: "",
      color: "purple",
      type: "merge",
    },
  };
}
