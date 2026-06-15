import { Handle, Position } from "@xyflow/react";
import { NodeCard, NodeData } from "./NodeCard";
import { Type } from "lucide-react";

export function StandardNode({ id, data, selected }: { id: string; data: NodeData; selected?: boolean }) {
  return (
    <>
      <Handle type="target" position={Position.Left} id="left" />
      <NodeCard id={id} data={data} selected={selected} badgeIcon={<Type className="w-3 h-3" />} badgeLabel="Note" />
      <Handle type="source" position={Position.Right} id="right" />
    </>
  );
}
