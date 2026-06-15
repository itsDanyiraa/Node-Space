import { Handle, Position } from "@xyflow/react";
import { NodeCard, NodeData } from "./NodeCard";
import { ArrowRight } from "lucide-react";

export function FlowNode({ id, data, selected }: { id: string; data: NodeData; selected?: boolean }) {
  return (
    <>
      <Handle type="target" position={Position.Left} id="left" />
      <div className="relative">
        <NodeCard 
          id={id} 
          data={data} 
          selected={selected} 
          badgeIcon={<ArrowRight className="w-3 h-3" />} 
          badgeLabel="Flow"
          className="border-r-[8px] border-r-primary/50"
        />
        <div className="absolute right-[-16px] top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-background rounded-full border border-border shadow-sm z-10 text-primary pointer-events-none">
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>
      <Handle type="source" position={Position.Right} id="right" />
    </>
  );
}
