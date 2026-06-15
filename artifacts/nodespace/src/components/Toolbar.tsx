import { Plus, Trash2, ZoomIn, ZoomOut, Maximize, Merge, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ToolbarProps {
  onAddNode: () => void;
  onAddMergeNode: () => void;
  onClear: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitView: () => void;
  onExport: () => void;
  isExporting: boolean;
  nodeCount: number;
}

export function Toolbar({
  onAddNode,
  onAddMergeNode,
  onClear,
  onZoomIn,
  onZoomOut,
  onFitView,
  onExport,
  isExporting,
  nodeCount,
}: ToolbarProps) {
  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 p-1.5 bg-card/90 backdrop-blur-md border border-border rounded-xl shadow-lg z-50 max-w-[95vw] flex-wrap justify-center">
      <div className="px-3 font-semibold text-foreground tracking-tight select-none text-sm">
        NodeSpace
      </div>

      <div className="w-px h-5 bg-border" />

      <Button variant="secondary" size="sm" onClick={onAddNode} data-testid="button-add-node" className="gap-1.5 h-8 text-xs">
        <Plus className="w-3.5 h-3.5" /> Node
      </Button>
      <Button variant="secondary" size="sm" onClick={onAddMergeNode} data-testid="button-add-merge-node" className="gap-1.5 h-8 text-xs bg-primary/10 text-primary hover:bg-primary/20 border border-primary/30">
        <Merge className="w-3.5 h-3.5" /> Merge
      </Button>

      <div className="w-px h-5 bg-border" />

      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" onClick={onZoomOut} data-testid="button-zoom-out" title="Zoom Out" className="h-8 w-8">
          <ZoomOut className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={onFitView} data-testid="button-fit-view" title="Fit View" className="h-8 w-8">
          <Maximize className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={onZoomIn} data-testid="button-zoom-in" title="Zoom In" className="h-8 w-8">
          <ZoomIn className="w-4 h-4" />
        </Button>
      </div>

      <div className="w-px h-5 bg-border" />

      <Button
        variant="ghost"
        size="sm"
        onClick={onExport}
        disabled={isExporting || nodeCount === 0}
        data-testid="button-export-png"
        title="Export as PNG"
        className="gap-1.5 h-8 text-xs text-muted-foreground hover:text-foreground"
      >
        {isExporting
          ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
          : <Download className="w-3.5 h-3.5" />}
        {isExporting ? "Saving…" : "Export"}
      </Button>

      <div className="w-px h-5 bg-border" />

      <div className="px-2 text-xs text-muted-foreground select-none">
        {nodeCount} node{nodeCount !== 1 ? "s" : ""}
      </div>

      <div className="w-px h-5 bg-border" />

      <Button variant="ghost" size="icon" onClick={onClear} data-testid="button-clear-canvas" className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive" title="Clear Canvas">
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
}
