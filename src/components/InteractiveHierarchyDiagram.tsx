import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Info, ExternalLink, X, Box, CircuitBoard, Layers, ZoomIn, ChevronRight, ArrowLeft, Microchip, ArrowRight, Cpu, MemoryStick, Network, Bug, Timer, Shield, Zap, Radio, HardDrive, Clock, RotateCcw, Pin, ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

/* ── Icon mapping for leaf nodes based on name/type ── */
const getNodeIcon = (node: { name: string; type: string }) => {
  const n = node.name.toLowerCase();
  if (n.includes("cortex") || n.includes("cpu")) return Cpu;
  if (n.includes("instruction memory") || n.includes("data memory") || n.includes("boot rom") || n.includes("sram")) return MemoryStick;
  if (n.includes("address decoder") || n.includes("default slave") || n.includes("ahb") || n.includes("apb") || n.includes("bridge") || n.includes("interconnect")) return Network;
  if (n.includes("debug") || n.includes("swd")) return Bug;
  if (n.includes("timer")) return Timer;
  if (n.includes("watchdog")) return Shield;
  if (n.includes("dma")) return Zap;
  if (n.includes("uart")) return Radio;
  if (n.includes("gpio")) return Pin;
  if (n.includes("accelerator")) return Microchip;
  if (n.includes("clock") || n.includes("clk")) return Clock;
  if (n.includes("reset")) return RotateCcw;
  if (n.includes("vdd") || n.includes("vss")) return Zap;
  return Box;
};

export interface HierarchyNode {
  name: string;
  type: string;
  description?: string;
  language?: string;
  techId?: string;
  userDesigned?: boolean;
  children?: HierarchyNode[];
}

interface InteractiveHierarchyDiagramProps {
  hierarchy: HierarchyNode[];
  designName: string;
}

const layerStyles = [
  { bg: "bg-slate-100 dark:bg-slate-800/60", border: "border-slate-300 dark:border-slate-600", label: "text-slate-600 dark:text-slate-300" },
  { bg: "bg-sky-50 dark:bg-sky-900/30", border: "border-sky-300 dark:border-sky-600", label: "text-sky-700 dark:text-sky-300" },
  { bg: "bg-violet-50 dark:bg-violet-900/20", border: "border-violet-300 dark:border-violet-600", label: "text-violet-700 dark:text-violet-300" },
  { bg: "bg-emerald-50 dark:bg-emerald-900/20", border: "border-emerald-300 dark:border-emerald-600", label: "text-emerald-700 dark:text-emerald-300" },
  { bg: "bg-amber-50 dark:bg-amber-900/20", border: "border-amber-300 dark:border-amber-600", label: "text-amber-700 dark:text-amber-300" },
  { bg: "bg-rose-50 dark:bg-rose-900/20", border: "border-rose-300 dark:border-rose-600", label: "text-rose-700 dark:text-rose-300" },
];

/* ── Info Panel (removed floating version - now using bottom panel) ── */

/* ── Simple static pad square (non-interactive, just visual) ── */
const PadSquare = ({ pad }: { pad: HierarchyNode }) => (
  <div
    className="w-5 h-5 md:w-6 md:h-6 rounded-[2px] border border-amber-400 dark:border-amber-500 bg-amber-100 dark:bg-amber-900/40"
    title={pad.name}
  />
);

/* ── Leaf block ── */
const LeafBlock = ({ node, depth, isSelected, onSelect }: { node: HierarchyNode; depth: number; isSelected?: boolean; onSelect?: (node: HierarchyNode, depth: number) => void }) => {
  const s = layerStyles[Math.min(depth, layerStyles.length - 1)];
  const NodeIcon = getNodeIcon(node);
  return (
    <button
      onClick={e => { e.stopPropagation(); onSelect?.(node, depth); }}
      className={`rounded-lg border-2 ${s.border} ${s.bg} p-3 md:p-4 text-left transition-all duration-150 hover:shadow-md hover:scale-[1.02] w-full aspect-square flex flex-col items-center justify-center gap-1.5 ${
        node.userDesigned ? "!border-dashed !border-rose-400" : ""
      } ${isSelected ? "ring-2 ring-offset-2 ring-current shadow-lg scale-[1.03]" : ""}`}
    >
      <NodeIcon className={`h-5 w-5 ${s.label} shrink-0`} />
      <span className={`text-[10px] md:text-xs font-semibold ${s.label} text-center leading-tight`}>{node.name}</span>
      {node.userDesigned && (
        <span className="bg-rose-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full leading-none">USER IP</span>
      )}
    </button>
  );
};

/* ── Compact preview for a zoomable group ── */
const GroupPreview = ({ node, depth, onZoom, square = false, isSelected, onSelect }: {
  node: HierarchyNode; depth: number; onZoom: () => void; square?: boolean;
  isSelected?: boolean; onSelect?: (node: HierarchyNode, depth: number) => void;
}) => {
  const s = layerStyles[Math.min(depth, layerStyles.length - 1)];

  return (
    <div className={`relative ${square ? "h-full" : ""}`}>
      <button
        type="button"
        onClick={e => { e.stopPropagation(); onSelect?.(node, depth); }}
        onDoubleClick={e => { e.stopPropagation(); onZoom(); }}
        className={`rounded-xl border-2 ${s.border} ${s.bg} w-full text-left transition-all duration-200 hover:shadow-lg group cursor-pointer ${
          square ? "h-full flex flex-col" : ""
        } ${
          node.userDesigned ? "!border-dashed !border-rose-400" : ""
        } ${isSelected ? "ring-2 ring-offset-2 ring-current shadow-lg" : ""}`}
      >
        <div className="px-4 py-3 md:py-4">
          <div className="flex items-center gap-2">
            <Layers className={`h-4 w-4 ${s.label} shrink-0`} />
            <span className={`font-display font-bold text-sm md:text-base ${s.label}`}>{node.name}</span>
            {node.userDesigned && (
              <span className="bg-rose-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full leading-none">USER IP</span>
            )}
            <ZoomIn className="h-4 w-4 ml-auto text-muted-foreground/40 group-hover:text-primary transition-colors" />
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {node.children?.map(child => {
              const cs = layerStyles[Math.min(depth + 1, layerStyles.length - 1)];
              const isGroup = child.children && child.children.length > 0;
              return (
                <span key={child.name} className={`text-[10px] md:text-xs px-2 py-1 rounded-md border ${cs.border} ${cs.bg} ${cs.label} font-medium truncate max-w-[120px] ${isGroup ? "font-bold" : ""}`}>
                  {child.name}
                </span>
              );
            })}
          </div>
        </div>
      </button>
    </div>
  );
};

/* ── Zoomed-in view ── */
const ITEMS_PER_PAGE = 6;

const ZoomedView = ({ node, depth, onZoom, breadcrumb, onNavigate, selectedNode, onSelect }: {
  node: HierarchyNode;
  depth: number;
  onZoom: (node: HierarchyNode) => void;
  breadcrumb: HierarchyNode[];
  onNavigate: (index: number) => void;
  selectedNode: HierarchyNode | null;
  onSelect: (node: HierarchyNode, depth: number) => void;
}) => {
  const s = layerStyles[Math.min(depth, layerStyles.length - 1)];
  const children = node.children || [];
  const totalPages = Math.ceil(children.length / ITEMS_PER_PAGE);
  const [page, setPage] = useState(0);

  const visibleChildren = useMemo(
    () => children.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE),
    [children, page]
  );

  return (
    <motion.div
      key={node.name}
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.2 }}
      className={`rounded-xl border-2 ${s.border} ${s.bg} p-4 md:p-5 max-w-[600px] mx-auto flex flex-col ${node.userDesigned ? "!border-dashed !border-rose-400" : ""}`}
    >
      {/* Breadcrumb bar */}
      <div className="flex items-center gap-1 mb-4 flex-wrap">
        {breadcrumb.map((b, i) => {
          const isLast = i === breadcrumb.length - 1;
          const bs = layerStyles[Math.min(i, layerStyles.length - 1)];
          return (
            <span key={b.name} className="flex items-center gap-1">
              {i > 0 && <ChevronRight className="h-3 w-3 text-muted-foreground/30 shrink-0" />}
              {isLast ? (
                <span className={`text-xs font-bold ${bs.label}`}>{b.name}</span>
              ) : (
                <button
                  onClick={() => onNavigate(i)}
                  className={`text-xs font-medium ${bs.label} hover:underline transition-colors cursor-zoom-out`}
                >
                  {b.name}
                </button>
              )}
            </span>
          );
        })}
      </div>

      {/* Title */}
      <div className="flex items-center gap-2 mb-1">
        <Layers className={`h-5 w-5 ${s.label}`} />
        <h3 className={`font-display font-bold text-lg md:text-xl ${s.label}`}>{node.name}</h3>
        {node.description && (
          <button onClick={() => onSelect(node, depth)} className="p-1 rounded-md hover:bg-muted ml-auto">
            <Info className={`h-4 w-4 ${selectedNode?.name === node.name ? "text-primary" : "text-muted-foreground/40"}`} />
          </button>
        )}
      </div>

      {/* Children grid - paginated */}
      <div className="flex-1 min-h-0 mt-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={page}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.15 }}
            className="grid gap-3 h-full"
            style={{
              gridTemplateColumns: `repeat(${Math.min(visibleChildren.length, 3)}, 1fr)`,
              gridTemplateRows: `repeat(${Math.ceil(visibleChildren.length / 3)}, 1fr)`,
            }}
          >
            {visibleChildren.map(child => {
              const hasChildren = child.children && child.children.length > 0;
              if (hasChildren) {
                return (
                  <div key={child.name}>
                    <GroupPreview node={child} depth={depth + 1} onZoom={() => onZoom(child)} square isSelected={selectedNode?.name === child.name} onSelect={onSelect} />
                  </div>
                );
              }
              return <div key={child.name}><LeafBlock node={child} depth={depth + 1} isSelected={selectedNode?.name === child.name} onSelect={onSelect} /></div>;
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Pagination bar */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-4 pt-3 border-t border-border/30">
          <button
            onClick={(e) => { e.stopPropagation(); setPage(p => Math.max(0, p - 1)); }}
            disabled={page === 0}
            className="p-1.5 rounded-lg hover:bg-muted/80 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-1.5">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setPage(i); }}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === page ? `scale-125 ${s.label.replace("text-", "bg-")}` : "bg-muted-foreground/20 hover:bg-muted-foreground/40"
                }`}
              />
            ))}
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); setPage(p => Math.min(totalPages - 1, p + 1)); }}
            disabled={page === totalPages - 1}
            className="p-1.5 rounded-lg hover:bg-muted/80 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </motion.div>
  );
};

/* ── Pad ring: realistic chip layout ── */
const ChipPadRing = ({ padNode, chipNode, onZoomChip, onSelectChip, isChipSelected, onSelectPad, isPadSelected }: {
  padNode: HierarchyNode;
  chipNode: HierarchyNode;
  onZoomChip: () => void;
  onSelectChip: (node: HierarchyNode, depth: number) => void;
  isChipSelected: boolean;
  onSelectPad: (node: HierarchyNode, depth: number) => void;
  isPadSelected: boolean;
}) => {
  const pads = padNode.children || [];

  // Distribute pads evenly across 4 sides
  const total = pads.length;
  const perSide = Math.floor(total / 4);
  const remainder = total % 4;
  const topCount = perSide + (remainder > 0 ? 1 : 0);
  const rightCount = perSide + (remainder > 1 ? 1 : 0);
  const bottomCount = perSide + (remainder > 2 ? 1 : 0);
  const top = pads.slice(0, topCount);
  const right = pads.slice(topCount, topCount + rightCount);
  const bottom = pads.slice(topCount + rightCount, topCount + rightCount + bottomCount);
  const left = pads.slice(topCount + rightCount + bottomCount);

  return (
    <div className="flex items-center justify-center pt-4">
      <button
        type="button"
        onClick={() => onSelectPad(padNode, -1)}
        className={`relative rounded-2xl border-[3px] border-amber-400 dark:border-amber-500 bg-amber-50/60 dark:bg-amber-950/30 max-w-[600px] w-full overflow-hidden text-left transition-all hover:shadow-md ${
          isPadSelected ? "ring-2 ring-offset-2 ring-amber-400 shadow-lg" : ""
        }`}
      >
      {/* Outer label */}
      <div className="absolute -top-0 left-1/2 -translate-x-1/2 z-10 px-4 py-1 rounded-b-lg bg-amber-200 dark:bg-amber-800 border border-t-0 border-amber-300 dark:border-amber-600">
        <div className="flex items-center gap-2">
          <CircuitBoard className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          <span className="font-display font-bold text-sm md:text-base text-amber-700 dark:text-amber-300">{padNode.name}</span>
        </div>
      </div>

      {/* Grid: pad ring surrounding the chip, square via padding trick */}
      <div className="relative w-full" style={{ paddingBottom: "50%" }}>
        <div className="absolute inset-0 grid grid-cols-[auto_1fr_auto] grid-rows-[auto_1fr_auto] p-1 md:p-1.5">
          <div />
          <div className="flex justify-around items-end px-1 pb-1 pt-4">
            {top.map(p => <PadSquare key={p.name} pad={p} />)}
          </div>
          <div />

          <div className="flex flex-col justify-around items-end py-1 pr-1">
            {left.map(p => <PadSquare key={p.name} pad={p} />)}
          </div>

          {/* Center: the chip */}
          <div className="p-1 md:p-2">
            <div
              onClick={e => { e.stopPropagation(); onSelectChip(chipNode, 1); }}
              onDoubleClick={e => { e.stopPropagation(); onZoomChip(); }}
              className={`w-full h-full rounded-xl border-2 border-sky-300 dark:border-sky-600 bg-sky-50 dark:bg-sky-900/30 flex flex-col items-center justify-center transition-all group cursor-pointer ${
                isChipSelected ? "ring-2 ring-offset-2 ring-sky-400 shadow-lg" : ""
              }`}
            >
              <div className="flex flex-col items-center">
                <Layers className="h-5 w-5 text-sky-700 dark:text-sky-300 mb-1" />
                <span className="font-display font-bold text-sm md:text-base text-sky-700 dark:text-sky-300">{chipNode.name}</span>
              </div>
              <div className="mt-2 flex flex-wrap justify-center gap-1.5 px-3">
                {chipNode.children?.slice(0, 4).map(child => {
                  const cs = layerStyles[Math.min(2, layerStyles.length - 1)];
                  return (
                    <span key={child.name} className={`text-[10px] md:text-xs px-2 py-0.5 rounded-md border ${cs.border} ${cs.bg} ${cs.label} font-medium`}>
                      {child.name}
                    </span>
                  );
                })}
              </div>
              <ZoomIn className="mt-2 h-4 w-4 text-muted-foreground/30 group-hover:text-primary transition-colors" />
            </div>
          </div>

          <div className="flex flex-col justify-around items-start py-1 pl-1">
            {right.map(p => <PadSquare key={p.name} pad={p} />)}
          </div>

          <div />
          <div className="flex justify-around items-start px-1 pt-1">
            {bottom.map(p => <PadSquare key={p.name} pad={p} />)}
          </div>
          <div />
        </div>
      </div>
      </button>
    </div>
  );
};

/* ── Bottom Description Panel (like architecture view) ── */
const SelectedNodePanel = ({ node, depth, onClose }: { node: HierarchyNode; depth: number; onClose: () => void }) => {
  // Special amber style for pad ring (depth -1), otherwise use layerStyles
  const isPadLevel = depth < 0;
  const s = isPadLevel
    ? { bg: "bg-amber-50 dark:bg-amber-950/30", border: "border-amber-400 dark:border-amber-500", label: "text-amber-700 dark:text-amber-300" }
    : layerStyles[Math.min(depth, layerStyles.length - 1)];

  return (
    <motion.div
      key={node.name}
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.25 }}
      className="overflow-hidden"
    >
      <div className="mt-6 pt-5 border-t border-border/30">
        <div className={`rounded-xl border-2 p-5 ${s.bg} ${s.border}`}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className={`p-2.5 rounded-lg ${s.bg} ${s.label}`}>
                {node.children && node.children.length > 0
                  ? <Layers className="h-6 w-6" />
                  : <Box className="h-6 w-6" />
                }
              </div>
              <div className="min-w-0">
                <h4 className="font-display font-bold text-base">{node.name}</h4>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className={`text-sm font-medium capitalize ${s.label}`}>
                    {node.type}
                  </span>
                  {node.language && (
                    <Badge variant="secondary" className="text-xs">{node.language}</Badge>
                  )}
                </div>
              </div>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors shrink-0">
              <X className="h-4 w-4" />
            </button>
          </div>

          {node.description && (
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{node.description}</p>
          )}

          {node.userDesigned && (
            <div className="mt-3 flex items-center gap-2">
              <Microchip className="h-4 w-4 text-rose-500" />
              <span className="text-sm text-rose-600 dark:text-rose-400 font-medium">User-designed IP block</span>
            </div>
          )}

          {node.techId && (
            <div className="mt-4 pt-3 border-t border-border/30">
              <Button asChild variant="outline" size="sm" className="rounded-full">
                <Link to={`/technologies/${node.techId}`}>
                  Learn More <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

/* ── Main Component ── */
const InteractiveHierarchyDiagram = ({ hierarchy, designName }: InteractiveHierarchyDiagramProps) => {
  const padNode = hierarchy.find(n => n.name.toLowerCase().includes("pad"));
  const chipNode = hierarchy.find(n => !n.name.toLowerCase().includes("pad"));

  const [navStack, setNavStack] = useState<HierarchyNode[]>([]);
  const [selectedNode, setSelectedNode] = useState<HierarchyNode | null>(null);
  const [selectedDepth, setSelectedDepth] = useState(0);

  const zoomInto = useCallback((node: HierarchyNode) => {
    setNavStack(prev => [...prev, node]);
    setSelectedNode(null);
  }, []);

  const navigateTo = useCallback((index: number) => {
    if (index < 0) {
      setNavStack([]);
    } else {
      setNavStack(prev => prev.slice(0, index + 1));
    }
    setSelectedNode(null);
  }, []);

  const handleSelect = useCallback((node: HierarchyNode, depth: number) => {
    setSelectedNode(prev => prev?.name === node.name ? null : node);
    setSelectedDepth(depth);
  }, []);

  const currentZoomed = navStack.length > 0 ? navStack[navStack.length - 1] : null;
  // Depth offset: if padNode exists, the pad ring is depth 0, so zoomed nodes start at depth 1
  const currentDepth = padNode ? navStack.length : Math.max(navStack.length - 1, 0);

  return (
    <div className="rounded-2xl border border-border/60 bg-white dark:bg-card p-5 md:p-8">
      {currentZoomed ? (
        <div>
          <AnimatePresence mode="wait">
            <ZoomedView
              key={currentZoomed.name}
              node={currentZoomed}
              depth={currentDepth}
              onZoom={zoomInto}
              breadcrumb={padNode ? [padNode, ...navStack] : navStack}
              onNavigate={(index) => {
                // index 0 = padNode (root), index 1+ = navStack entries
                if (padNode) {
                  navigateTo(index - 1);
                } else {
                  navigateTo(index);
                }
              }}
              selectedNode={selectedNode}
              onSelect={handleSelect}
            />
          </AnimatePresence>
        </div>
      ) : !padNode || !chipNode ? (
        <div className="space-y-3">
          {hierarchy.map(node => {
            const hasChildren = node.children && node.children.length > 0;
            return hasChildren
              ? <GroupPreview key={node.name} node={node} depth={0} onZoom={() => zoomInto(node)} isSelected={selectedNode?.name === node.name} onSelect={handleSelect} />
              : <LeafBlock key={node.name} node={node} depth={0} isSelected={selectedNode?.name === node.name} onSelect={handleSelect} />;
          })}
        </div>
      ) : (
        <ChipPadRing padNode={padNode} chipNode={chipNode} onZoomChip={() => zoomInto(chipNode)} onSelectChip={handleSelect} isChipSelected={selectedNode?.name === chipNode.name} onSelectPad={handleSelect} isPadSelected={selectedNode?.name === padNode.name} />
      )}

      {/* Bottom description panel */}
      <AnimatePresence mode="wait">
        {selectedNode && (
          <SelectedNodePanel node={selectedNode} depth={selectedDepth} onClose={() => setSelectedNode(null)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default InteractiveHierarchyDiagram;
