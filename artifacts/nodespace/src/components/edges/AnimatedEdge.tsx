import { useCallback, useState } from "react";
import { EdgeProps, getBezierPath, EdgeLabelRenderer, useReactFlow } from "@xyflow/react";
import { X } from "lucide-react";

export function AnimatedEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  selected,
}: EdgeProps) {
  const { setEdges } = useReactFlow();
  const [hovered, setHovered] = useState(false);

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    curvature: 0.4,
  });

  const onEdgeClick = useCallback(() => {
    setEdges((edges) => edges.filter((e) => e.id !== id));
  }, [id, setEdges]);

  const isActive = selected || hovered;
  const filterId = `glow-${id}`;

  return (
    <>
      {/* SVG defs: glow filter */}
      <defs>
        <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation={isActive ? "4" : "2.5"} result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Invisible wide hit-area for hover/select */}
      <path
        d={edgePath}
        fill="none"
        stroke="transparent"
        strokeWidth={20}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ cursor: "pointer" }}
      />

      {/* Outer glow layer */}
      <path
        d={edgePath}
        fill="none"
        stroke={isActive ? "#818cf8" : "#6366f1"}
        strokeWidth={isActive ? 6 : 4}
        opacity={isActive ? 0.35 : 0.2}
        filter={`url(#${filterId})`}
        style={{ pointerEvents: "none" }}
      />

      {/* Core wire */}
      <path
        d={edgePath}
        fill="none"
        stroke={isActive ? "#a5b4fc" : "#6366f1"}
        strokeWidth={isActive ? 2.5 : 2}
        opacity={isActive ? 1 : 0.75}
        style={{ pointerEvents: "none", transition: "stroke 0.2s, opacity 0.2s" }}
      />

      {/* Flowing energy particle */}
      <path
        d={edgePath}
        fill="none"
        stroke="white"
        strokeWidth={isActive ? 3 : 2}
        strokeLinecap="round"
        strokeDasharray="14 120"
        opacity={isActive ? 0.95 : 0.6}
        style={{
          pointerEvents: "none",
          animation: `nodespace-flow ${isActive ? "1.2s" : "2s"} linear infinite`,
        }}
      />

      {/* Delete button — shown on hover or select */}
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: "all",
            opacity: isActive ? 1 : 0,
            transition: "opacity 0.15s",
          }}
          className="nodrag nopan"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <button
            className="p-1 rounded-full bg-background border border-border shadow-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 hover:border-destructive/40 transition-colors"
            onClick={onEdgeClick}
            data-testid={`edge-delete-${id}`}
            title="Delete connection"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
