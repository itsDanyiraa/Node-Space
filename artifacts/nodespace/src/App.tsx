import { useCallback, useEffect, useRef, useState } from "react";
import {
  ReactFlow,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  ReactFlowProvider,
  useReactFlow,
  getNodesBounds,
  getViewportForBounds,
} from "@xyflow/react";
import { toPng } from "html-to-image";

import { StandardNode } from "@/components/nodes/StandardNode";
import { MergeNode } from "@/components/nodes/MergeNode";
import { GroupNode } from "@/components/nodes/GroupNode";
import { FlowNode } from "@/components/nodes/FlowNode";
import { AnimatedEdge } from "@/components/edges/AnimatedEdge";
import { Toolbar } from "@/components/Toolbar";
import { EmptyState } from "@/components/EmptyState";
import { OnboardingHints } from "@/components/OnboardingHints";
import { loadCanvas, saveCanvas } from "@/lib/storage";
import { createNode, createMergeNode } from "@/lib/nodeUtils";
import { Toaster } from "@/components/ui/toaster";
import { IOSInstallBanner } from "@/components/IOSInstallBanner";

const nodeTypes = {
  standard: StandardNode,
  merge: MergeNode,
  group: GroupNode,
  flow: FlowNode,
};

const edgeTypes = {
  animated: AnimatedEdge,
};

const defaultEdgeOptions = {
  type: "animated",
  animated: true,
};

const EXPORT_PADDING = 60;

function Canvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const { screenToFlowPosition, zoomIn, zoomOut, fitView } = useReactFlow();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const saveTimeout = useRef<ReturnType<typeof setTimeout>>();

  // Long-press tracking refs
  const longPressTimer = useRef<ReturnType<typeof setTimeout>>();
  const touchStartPos = useRef<{ x: number; y: number } | null>(null);
  const touchMoved = useRef(false);

  // Load initial data
  useEffect(() => {
    const { nodes: initialNodes, edges: initialEdges } = loadCanvas();
    setNodes(initialNodes);
    setEdges(initialEdges);
    setIsLoaded(true);
  }, [setNodes, setEdges]);

  // Auto-save
  useEffect(() => {
    if (!isLoaded) return;
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(() => {
      saveCanvas({ nodes, edges });
    }, 300);
    return () => clearTimeout(saveTimeout.current);
  }, [nodes, edges, isLoaded]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ ...params, type: "animated", animated: true }, eds)),
    [setEdges]
  );

  const spawnNodeAt = useCallback(
    (clientX: number, clientY: number) => {
      const position = screenToFlowPosition({ x: clientX, y: clientY });
      setNodes((nds) => [...nds, createNode(position)]);
    },
    [screenToFlowPosition, setNodes]
  );

  // Desktop: double-click on empty canvas
  const onDoubleClick = useCallback(
    (event: React.MouseEvent) => {
      if ((event.target as HTMLElement).closest(".react-flow__node")) return;
      spawnNodeAt(event.clientX, event.clientY);
    },
    [spawnNodeAt]
  );

  // Mobile: long-press on empty canvas (hold ~500ms)
  const onTouchStart = useCallback(
    (event: React.TouchEvent) => {
      if ((event.target as HTMLElement).closest(".react-flow__node")) return;
      if ((event.target as HTMLElement).closest(".react-flow__handle")) return;
      if (event.touches.length !== 1) return;

      const touch = event.touches[0];
      touchStartPos.current = { x: touch.clientX, y: touch.clientY };
      touchMoved.current = false;

      longPressTimer.current = setTimeout(() => {
        if (!touchMoved.current && touchStartPos.current) {
          spawnNodeAt(touchStartPos.current.x, touchStartPos.current.y);
        }
      }, 500);
    },
    [spawnNodeAt]
  );

  const onTouchMove = useCallback((event: React.TouchEvent) => {
    if (!touchStartPos.current) return;
    const touch = event.touches[0];
    const dx = Math.abs(touch.clientX - touchStartPos.current.x);
    const dy = Math.abs(touch.clientY - touchStartPos.current.y);
    // If finger moved more than 8px, cancel long press
    if (dx > 8 || dy > 8) {
      touchMoved.current = true;
      clearTimeout(longPressTimer.current);
    }
  }, []);

  const onTouchEnd = useCallback(() => {
    clearTimeout(longPressTimer.current);
    touchStartPos.current = null;
  }, []);

  const handleAddCenterNode = useCallback(() => {
    const position = screenToFlowPosition({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    });
    setNodes((nds) => [...nds, createNode(position)]);
  }, [screenToFlowPosition, setNodes]);

  const handleAddMergeNode = useCallback(() => {
    const position = screenToFlowPosition({
      x: window.innerWidth / 2 + 40,
      y: window.innerHeight / 2 + 40,
    });
    setNodes((nds) => [...nds, createMergeNode(position)]);
  }, [screenToFlowPosition, setNodes]);

  const handleClear = useCallback(() => {
    if (window.confirm("Are you sure you want to clear the entire canvas? This cannot be undone.")) {
      setNodes([]);
      setEdges([]);
    }
  }, [setNodes, setEdges]);

  const handleExport = useCallback(async () => {
    if (nodes.length === 0) return;
    setIsExporting(true);
    try {
      const nodesBounds = getNodesBounds(nodes);
      const imgWidth = nodesBounds.width + EXPORT_PADDING * 2;
      const imgHeight = nodesBounds.height + EXPORT_PADDING * 2;

      const viewport = getViewportForBounds(nodesBounds, imgWidth, imgHeight, 0.5, 2, EXPORT_PADDING / Math.max(imgWidth, imgHeight));

      const flowEl = document.querySelector(".react-flow__viewport") as HTMLElement | null;
      if (!flowEl) return;

      const dataUrl = await toPng(flowEl, {
        backgroundColor: "#0f1117",
        width: imgWidth,
        height: imgHeight,
        style: {
          width: `${imgWidth}px`,
          height: `${imgHeight}px`,
          transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
          transformOrigin: "top left",
        },
        pixelRatio: 2,
      });

      const link = document.createElement("a");
      link.download = `nodespace-${new Date().toISOString().slice(0, 10)}.png`;
      link.href = dataUrl;
      link.click();
    } finally {
      setIsExporting(false);
    }
  }, [nodes]);

  return (
    <div
      className="w-screen h-[100dvh] bg-background text-foreground overflow-hidden"
      onDoubleClick={onDoubleClick}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      // Prevent double-tap zoom on mobile while still allowing panning
      style={{ touchAction: "pan-x pan-y" }}
    >
      <Toolbar
        onAddNode={handleAddCenterNode}
        onAddMergeNode={handleAddMergeNode}
        onClear={handleClear}
        onZoomIn={() => zoomIn({ duration: 200 })}
        onZoomOut={() => zoomOut({ duration: 200 })}
        onFitView={() => fitView({ duration: 400, padding: 0.2 })}
        onExport={handleExport}
        isExporting={isExporting}
        nodeCount={nodes.length}
      />

      {nodes.length === 0 && <EmptyState />}

      <OnboardingHints />

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        fitView
        fitViewOptions={{ padding: 0.2, maxZoom: 1.5 }}
        minZoom={0.1}
        maxZoom={2}
        proOptions={{ hideAttribution: true }}
        className="nodespace-theme"
      >
        <Background variant="dots" gap={24} size={1} color="hsl(var(--muted-foreground) / 0.2)" />
      </ReactFlow>
    </div>
  );
}

function App() {
  return (
    <div className="dark">
      <ReactFlowProvider>
        <Canvas />
      </ReactFlowProvider>
      <IOSInstallBanner />
      <Toaster />
    </div>
  );
}

export default App;
