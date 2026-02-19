import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Info, ExternalLink, X, Box, CircuitBoard, Layers, ZoomIn, ChevronRight, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

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

/* ── Info Panel ── */
const InfoPanel = ({ node, onClose }: { node: HierarchyNode; onClose: () => void }) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 8 }}
    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 w-72 rounded-xl border border-border bg-popover text-popover-foreground shadow-xl p-4"
    onClick={e => e.stopPropagation()}
  >
    <button onClick={onClose} className="absolute top-2 right-2 p-1 rounded-md hover:bg-muted">
      <X className="h-3.5 w-3.5" />
    </button>
    <h4 className="font-display font-bold text-sm mb-1">{node.name}</h4>
    <p className="text-xs text-muted-foreground leading-relaxed">{node.description}</p>
    {node.techId && (
      <Link to={`/technologies/${node.techId}`} className="inline-flex items-center gap-1 mt-2 text-primary hover:underline text-xs font-medium">
        Learn more <ExternalLink className="h-3 w-3" />
      </Link>
    )}
  </motion.div>
);

/* ── Simple static pad square (non-interactive, just visual) ── */
const PadSquare = ({ pad }: { pad: HierarchyNode }) => (
  <div
    className="w-5 h-5 md:w-6 md:h-6 rounded-[2px] border border-slate-400 dark:border-slate-500 bg-background"
    title={pad.name}
  />
);

/* ── Leaf block ── */
const LeafBlock = ({ node, depth }: { node: HierarchyNode; depth: number }) => {
  const [showInfo, setShowInfo] = useState(false);
  const s = layerStyles[Math.min(depth, layerStyles.length - 1)];
  return (
    <div className="relative">
      <button
        onClick={e => { e.stopPropagation(); setShowInfo(v => !v); }}
        className={`rounded-lg border-2 ${s.border} ${s.bg} px-3 py-2 md:px-4 md:py-3 text-left transition-all duration-150 hover:shadow-md hover:scale-[1.02] w-full ${
          node.userDesigned ? "!border-dashed !border-rose-400" : ""
        }`}
      >
        <div className="flex items-center gap-2">
          <Box className={`h-3.5 w-3.5 ${s.label} shrink-0`} />
          <span className={`text-xs md:text-sm font-semibold ${s.label}`}>{node.name}</span>
          {node.userDesigned && (
            <span className="bg-rose-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full leading-none">USER IP</span>
          )}
          {node.description && (
            <Info className={`h-3 w-3 ml-auto shrink-0 ${showInfo ? "text-primary" : "text-muted-foreground/40"}`} />
          )}
        </div>
      </button>
      <AnimatePresence>
        {showInfo && node.description && <InfoPanel node={node} onClose={() => setShowInfo(false)} />}
      </AnimatePresence>
    </div>
  );
};

/* ── Compact preview for a zoomable group ── */
const GroupPreview = ({ node, depth, onZoom }: { node: HierarchyNode; depth: number; onZoom: () => void }) => {
  const [showInfo, setShowInfo] = useState(false);
  const s = layerStyles[Math.min(depth, layerStyles.length - 1)];

  return (
    <div className="relative">
      <button
        onClick={onZoom}
        className={`rounded-xl border-2 ${s.border} ${s.bg} w-full text-left transition-all duration-200 hover:shadow-lg hover:scale-[1.01] group cursor-zoom-in ${
          node.userDesigned ? "!border-dashed !border-rose-400" : ""
        }`}
      >
        <div className="px-4 py-3 md:py-4">
          <div className="flex items-center gap-2">
            <Layers className={`h-4 w-4 ${s.label} shrink-0`} />
            <span className={`font-display font-bold text-sm md:text-base ${s.label}`}>{node.name}</span>
            {node.userDesigned && (
              <span className="bg-rose-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full leading-none">USER IP</span>
            )}
            <div className="ml-auto flex items-center gap-2">
              {node.description && (
                <span
                  role="button"
                  onClick={e => { e.stopPropagation(); setShowInfo(v => !v); }}
                  className="p-1 rounded-md hover:bg-muted"
                >
                  <Info className={`h-3.5 w-3.5 ${showInfo ? "text-primary" : "text-muted-foreground/40"}`} />
                </span>
              )}
              <ZoomIn className="h-4 w-4 text-muted-foreground/40 group-hover:text-primary transition-colors" />
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {node.children?.slice(0, 6).map(child => {
              const cs = layerStyles[Math.min(depth + 1, layerStyles.length - 1)];
              const isGroup = child.children && child.children.length > 0;
              return (
                <span key={child.name} className={`text-[10px] md:text-xs px-2 py-1 rounded-md border ${cs.border} ${cs.bg} ${cs.label} font-medium ${isGroup ? "font-bold" : ""}`}>
                  {child.name}
                </span>
              );
            })}
            {(node.children?.length || 0) > 6 && (
              <span className="text-[10px] md:text-xs px-2 py-1 text-muted-foreground">+{(node.children?.length || 0) - 6} more</span>
            )}
          </div>
        </div>
      </button>
      <AnimatePresence>
        {showInfo && node.description && (
          <div className="absolute z-50 top-full left-1/2 -translate-x-1/2 mt-2">
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="w-72 rounded-xl border border-border bg-popover text-popover-foreground shadow-xl p-4"
              onClick={e => e.stopPropagation()}
            >
              <button onClick={() => setShowInfo(false)} className="absolute top-2 right-2 p-1 rounded-md hover:bg-muted"><X className="h-3.5 w-3.5" /></button>
              <h4 className="font-display font-bold text-sm mb-1">{node.name}</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">{node.description}</p>
              {node.techId && (
                <Link to={`/technologies/${node.techId}`} className="inline-flex items-center gap-1 mt-2 text-primary hover:underline text-xs font-medium">
                  Learn more <ExternalLink className="h-3 w-3" />
                </Link>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ── Zoomed-in view ── */
const ZoomedView = ({ node, depth, onZoom, breadcrumb, onNavigate }: {
  node: HierarchyNode;
  depth: number;
  onZoom: (node: HierarchyNode) => void;
  breadcrumb: HierarchyNode[];
  onNavigate: (index: number) => void;
}) => {
  const [showInfo, setShowInfo] = useState(false);
  const s = layerStyles[Math.min(depth, layerStyles.length - 1)];

  return (
    <motion.div
      key={node.name}
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.2 }}
      className={`rounded-xl border-2 ${s.border} ${s.bg} p-4 md:p-5 ${node.userDesigned ? "!border-dashed !border-rose-400" : ""}`}
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
          <button onClick={() => setShowInfo(v => !v)} className="p-1 rounded-md hover:bg-muted ml-auto">
            <Info className={`h-4 w-4 ${showInfo ? "text-primary" : "text-muted-foreground/40"}`} />
          </button>
        )}
      </div>

      <AnimatePresence>
        {showInfo && node.description && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden mb-3">
            <div className="text-sm text-muted-foreground bg-background/60 border border-border/30 px-4 py-3 rounded-lg mt-2">
              {node.description}
              {node.techId && (
                <Link to={`/technologies/${node.techId}`} className="inline-flex items-center gap-1 mt-2 text-primary hover:underline text-xs font-medium">
                  Learn more <ExternalLink className="h-3 w-3" />
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Children */}
      <div className="grid gap-3 mt-4" style={{
        gridTemplateColumns: `repeat(auto-fill, minmax(${(node.children?.length || 0) <= 3 ? "200px" : "160px"}, 1fr))`
      }}>
        {node.children?.map(child => {
          const hasChildren = child.children && child.children.length > 0;
          if (hasChildren) {
            return (
              <div key={child.name} className="col-span-full md:col-span-1">
                <GroupPreview node={child} depth={depth + 1} onZoom={() => onZoom(child)} />
              </div>
            );
          }
          return <div key={child.name}><LeafBlock node={child} depth={depth + 1} /></div>;
        })}
      </div>
    </motion.div>
  );
};

/* ── Pad ring: realistic chip layout ── */
const ChipPadRing = ({ padNode, chipNode, onZoomChip }: {
  padNode: HierarchyNode;
  chipNode: HierarchyNode;
  onZoomChip: () => void;
}) => {
  const [showPadInfo, setShowPadInfo] = useState(false);
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
    <div className="relative rounded-2xl border-[3px] border-slate-400 dark:border-slate-500 bg-slate-50 dark:bg-slate-800/50 p-1 md:p-1.5 aspect-square max-w-[600px] mx-auto">
      {/* Outer label */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 border border-slate-300 dark:border-slate-600">
        <div className="flex items-center gap-1.5">
          <CircuitBoard className="h-3 w-3 text-slate-500 dark:text-slate-400" />
          <span className="font-display font-bold text-[11px] text-slate-600 dark:text-slate-300 uppercase tracking-wider">{padNode.name}</span>
          {padNode.description && (
            <button onClick={() => setShowPadInfo(v => !v)} className="p-0.5 rounded hover:bg-muted">
              <Info className={`h-3 w-3 ${showPadInfo ? "text-primary" : "text-muted-foreground/40"}`} />
            </button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showPadInfo && padNode.description && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden mt-3 mx-2 mb-1">
            <div className="text-xs text-muted-foreground bg-background/80 border border-border/30 px-3 py-2 rounded-lg">{padNode.description}</div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grid layout: pad ring surrounding the chip */}
      <div className="grid grid-cols-[auto_1fr_auto] grid-rows-[auto_1fr_auto] h-full gap-0 mt-2">
        {/* Top-left corner */}
        <div />
        {/* Top pads */}
        <div className="flex justify-around items-end px-1 pb-1">
          {top.map(p => <PadSquare key={p.name} pad={p} />)}
        </div>
        {/* Top-right corner */}
        <div />

        {/* Left pads */}
        <div className="flex flex-col justify-around items-end py-1 pr-1">
          {left.map(p => <PadSquare key={p.name} pad={p} />)}
        </div>

        {/* Center: the chip */}
        <div className="p-1.5 md:p-2 flex items-center justify-center">
          <div className="w-full h-full">
            <GroupPreview node={chipNode} depth={1} onZoom={onZoomChip} />
          </div>
        </div>

        {/* Right pads */}
        <div className="flex flex-col justify-around items-start py-1 pl-1">
          {right.map(p => <PadSquare key={p.name} pad={p} />)}
        </div>

        {/* Bottom-left corner */}
        <div />
        {/* Bottom pads */}
        <div className="flex justify-around items-start px-1 pt-1">
          {bottom.map(p => <PadSquare key={p.name} pad={p} />)}
        </div>
        {/* Bottom-right corner */}
        <div />
      </div>
    </div>
  );
};

/* ── Main Component ── */
const InteractiveHierarchyDiagram = ({ hierarchy, designName }: InteractiveHierarchyDiagramProps) => {
  const padNode = hierarchy.find(n => n.name.toLowerCase().includes("pad"));
  const chipNode = hierarchy.find(n => !n.name.toLowerCase().includes("pad"));

  const [navStack, setNavStack] = useState<HierarchyNode[]>([]);

  const zoomInto = useCallback((node: HierarchyNode) => {
    setNavStack(prev => [...prev, node]);
  }, []);

  const navigateTo = useCallback((index: number) => {
    // Navigate to a breadcrumb level (-1 = root)
    if (index < 0) {
      setNavStack([]);
    } else {
      setNavStack(prev => prev.slice(0, index + 1));
    }
  }, []);

  const currentZoomed = navStack.length > 0 ? navStack[navStack.length - 1] : null;
  const currentDepth = navStack.length;

  // Build full breadcrumb including a "root" entry
  const rootLabel = padNode ? padNode.name.replace("Pads", "").trim() || designName : designName;

  if (currentZoomed) {
    return (
      <div>
        <AnimatePresence mode="wait">
          <ZoomedView
            key={currentZoomed.name}
            node={currentZoomed}
            depth={currentDepth}
            onZoom={zoomInto}
            breadcrumb={navStack}
            onNavigate={navigateTo}
          />
        </AnimatePresence>
        {/* Bottom zoom-out buttons */}
        <div className="flex items-center gap-2 mt-3">
          <button
            onClick={() => navigateTo(navStack.length - 2)}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border-2 border-primary/20 bg-primary/5 text-primary text-sm font-semibold hover:bg-primary/10 hover:border-primary/40 transition-all"
          >
            <ArrowLeft className="h-4 w-4" />
            {navStack.length > 1 ? navStack[navStack.length - 2].name : "Chip Overview"}
          </button>
          {navStack.length > 1 && (
            <button
              onClick={() => navigateTo(-1)}
              className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border-2 border-muted-foreground/15 text-muted-foreground text-sm font-medium hover:bg-muted/50 hover:border-muted-foreground/30 transition-all"
            >
              <CircuitBoard className="h-4 w-4" />
              Top Level
            </button>
          )}
        </div>
      </div>
    );
  }

  // Root view
  if (!padNode || !chipNode) {
    return (
      <div className="space-y-3">
        {hierarchy.map(node => {
          const hasChildren = node.children && node.children.length > 0;
          return hasChildren
            ? <GroupPreview key={node.name} node={node} depth={0} onZoom={() => zoomInto(node)} />
            : <LeafBlock key={node.name} node={node} depth={0} />;
        })}
      </div>
    );
  }

  return <ChipPadRing padNode={padNode} chipNode={chipNode} onZoomChip={() => zoomInto(chipNode)} />;
};

export default InteractiveHierarchyDiagram;
