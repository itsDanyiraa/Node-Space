import { Handle, Position } from "@xyflow/react";
import { NodeCard, NodeData } from "./NodeCard";
import { Box } from "lucide-react";

export function GroupNode({ id, data, selected }: { id: string; data: NodeData; selected?: boolean }) {
  return (
    <>
      <Handle type="target" position={Position.Left} id="left" />
      <NodeCard 
        id={id} 
        data={data} 
        selected={selected} 
        badgeIcon={<Box className="w-3 h-3" />} 
        badgeLabel="Group"
        className="!min-w-[320px] !border-dashed border-2 bg-background/40 backdrop-blur-md shadow-2xl"
      />
      <Handle type="source" position={Position.Right} id="right" />
    </>
  );
}
