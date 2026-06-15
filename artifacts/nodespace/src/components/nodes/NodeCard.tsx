import { MouseEvent } from "react";
import { Trash2, Type, Merge, Box, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useReactFlow } from "@xyflow/react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export interface NodeData {
  title: string;
  notes?: string;
  color: "green" | "blue" | "yellow" | "red" | "purple";
  type: string;
  [key: string]: any;
}

const colorMap = {
  green: "border-l-[#22c55e] bg-[#22c55e]/5",
  blue: "border-l-[#3b82f6] bg-[#3b82f6]/5",
  yellow: "border-l-[#eab308] bg-[#eab308]/5",
  red: "border-l-[#ef4444] bg-[#ef4444]/5",
  purple: "border-l-[#a855f7] bg-[#a855f7]/5",
};

const badgeColorMap = {
  green: "bg-[#22c55e]/20 text-[#22c55e]",
  blue: "bg-[#3b82f6]/20 text-[#3b82f6]",
  yellow: "bg-[#eab308]/20 text-[#eab308]",
  red: "bg-[#ef4444]/20 text-[#ef4444]",
  purple: "bg-[#a855f7]/20 text-[#a855f7]",
};

interface NodeCardProps {
  id: string;
  data: NodeData;
  selected?: boolean;
  className?: string;
  badgeIcon?: React.ReactNode;
  badgeLabel?: string;
  children?: React.ReactNode;
}

export function NodeCard({ id, data, selected, className = "", badgeIcon, badgeLabel, children }: NodeCardProps) {
  const { setNodes } = useReactFlow();

  const updateData = (newData: Partial<NodeData>) => {
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === id) {
          return { ...node, data: { ...node.data, ...newData } };
        }
        return node;
      })
    );
  };

  const changeType = (newType: string) => {
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === id) {
          return { ...node, type: newType, data: { ...node.data, type: newType } };
        }
        return node;
      })
    );
  };

  const deleteNode = (e: MouseEvent) => {
    e.stopPropagation();
    setNodes((nodes) => nodes.filter((node) => node.id !== id));
  };

  return (
    <div
      className={`group relative min-w-[240px] rounded-xl border-y border-r border-l-4 border-y-border border-r-border shadow-lg backdrop-blur-sm transition-all duration-200 ${
        colorMap[data.color]
      } ${selected ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : ""} ${className}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between p-3 pb-2 gap-4">
        <div className="flex flex-col gap-2 flex-1">
          <div className="flex items-center gap-2">
            {badgeLabel && (
              <div className={`flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${badgeColorMap[data.color]}`}>
                {badgeIcon} {badgeLabel}
              </div>
            )}
          </div>
          <Input
            value={data.title}
            onChange={(e) => updateData({ title: e.target.value })}
            className="h-auto p-0 text-base font-semibold bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground nodrag"
            placeholder="Node Title..."
          />
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-muted-foreground hover:text-destructive shrink-0 nodrag"
          onClick={deleteNode}
          data-testid={`delete-node-${id}`}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Body */}
      <div className="px-3 pb-3 nodrag">
        {children !== undefined ? (
          children
        ) : (
          <Textarea
            value={data.notes || ""}
            onChange={(e) => updateData({ notes: e.target.value })}
            className="min-h-[60px] text-sm resize-none bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0 text-muted-foreground placeholder:text-muted-foreground/50 nodrag"
            placeholder="Add notes..."
          />
        )}
      </div>

      {/* Footer / Toolbar — always visible */}
      <div className="border-t border-border/50 p-2 flex items-center justify-between bg-black/10 rounded-b-xl nodrag">
        <div className="flex items-center gap-1">
          {(["green", "blue", "yellow", "red", "purple"] as const).map((color) => (
            <button
              key={color}
              onClick={() => updateData({ color })}
              className={`w-4 h-4 rounded-full border border-border transition-transform hover:scale-110 ${
                data.color === color ? "ring-2 ring-white/20 ring-offset-1 ring-offset-transparent" : ""
              } ${
                color === "green" ? "bg-[#22c55e]" : 
                color === "blue" ? "bg-[#3b82f6]" : 
                color === "yellow" ? "bg-[#eab308]" : 
                color === "red" ? "bg-[#ef4444]" : "bg-[#a855f7]"
              }`}
              title={`Set color to ${color}`}
            />
          ))}
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className={`h-6 w-6 ${data.type === 'standard' ? 'bg-primary/20 text-primary' : 'text-muted-foreground'}`} onClick={() => changeType('standard')} title="Standard Node">
            <Type className="h-3 w-3" />
          </Button>
          <Button variant="ghost" size="icon" className={`h-6 w-6 ${data.type === 'merge' ? 'bg-primary/20 text-primary' : 'text-muted-foreground'}`} onClick={() => changeType('merge')} title="Merge Node">
            <Merge className="h-3 w-3" />
          </Button>
          <Button variant="ghost" size="icon" className={`h-6 w-6 ${data.type === 'flow' ? 'bg-primary/20 text-primary' : 'text-muted-foreground'}`} onClick={() => changeType('flow')} title="Flow Node">
            <ArrowRight className="h-3 w-3" />
          </Button>
          <Button variant="ghost" size="icon" className={`h-6 w-6 ${data.type === 'group' ? 'bg-primary/20 text-primary' : 'text-muted-foreground'}`} onClick={() => changeType('group')} title="Group Node">
            <Box className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}
