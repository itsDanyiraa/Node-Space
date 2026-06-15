import { Handle, Position, useEdges } from "@xyflow/react";
import { NodeCard, NodeData } from "./NodeCard";
import { Merge } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

export function MergeNode({ id, data, selected }: { id: string; data: NodeData; selected?: boolean }) {
  const edges = useEdges();
  const inputCount = edges.filter(e => e.target === id).length;

  return (
    <>
      <Handle type="target" position={Position.Left} id="left" />
      <NodeCard 
        id={id} 
        data={data} 
        selected={selected} 
        badgeIcon={<Merge className="w-3 h-3" />} 
        badgeLabel="Merge"
        className="!rounded-3xl !border-l border-dashed border-2"
      >
        <div className="flex flex-col gap-2">
          {inputCount > 0 && (
            <div className="text-xs font-mono text-muted-foreground bg-black/20 p-1.5 rounded-md border border-border/50 text-center">
              Combining {inputCount} input{inputCount !== 1 ? 's' : ''}
            </div>
          )}
          <Textarea
            value={data.notes || ""}
            onChange={(e) => {
              // NodeCard handles updates if we don't pass children, but since we do, we need a local handler if we want to support editing here.
              // Actually, wait, let's just let NodeCard use its default body if we want it standard, 
              // or we provide a custom one. To make it simpler and ensure state sync, let's just render standard for now and just add the label.
            }}
            className="min-h-[40px] text-sm resize-none bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0 text-muted-foreground placeholder:text-muted-foreground/50 nodrag"
            placeholder="Add merge notes..."
          />
        </div>
      </NodeCard>
      <Handle type="source" position={Position.Right} id="right" />
    </>
  );
}
