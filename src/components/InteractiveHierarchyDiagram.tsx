import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Info, ExternalLink, X, Box, CircuitBoard, Layers, ZoomIn, ArrowLeft } from "lucide-react";
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

/* ── Pad square with tooltip ── */
const PadSquare = ({ pad }: { pad: HierarchyNode }) => {
  const [info, setInfo] = useState(false);
  return (
    <div className="relative group">
      <button
        onClick={() => setInfo(v => !v)}
        className={`w-8 h-8 md:w-9 md:h-9 rounded border-2 transition-all duration-150 hover:scale-110 hover:shadow-md ${
          pad.userDesigned
            ? "border-dashed border-rose-400 bg-rose-50 dark:bg-rose-900/30"
            : "border-slate-400 dark:border-slate-500 bg-background hover:border-sky-500 hover:bg-sky-50 dark:hover:bg-sky-900/30"
        }`}
        title={pad.name}
      />
      <div className="absolute z-40 bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 rounded bg-foreground text-background text-[10px] font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        {pad.name}
      </div>
      <AnimatePresence>
        {info && pad.description && <InfoPanel node={pad} onClose={() => setInfo(false)} />}
      </AnimatePresence>
    </div>
  );
};

/* ── Leaf block ── */
const LeafBlock = ({ node, depth }: { node: HierarchyNode; depth: number }) => {
  const [showInfo, setShowInfo] = useState(false);
  const s = layerStyles[Math.min(depth, layerStyles.length - 1)];
  return (
    <div className="relative">
      <button
        onClick={() => setShowInfo(v => !v)}
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

/* ── Compact preview box for a group (shown when not zoomed) ── */
const GroupPreview = ({ node, depth, onZoom }: { node: HierarchyNode; depth: number; onZoom: () => void }) => {
  const [showInfo, setShowInfo] = useState(false);
  const s = layerStyles[Math.min(depth, layerStyles.length - 1)];
  const childCount = node.children?.length || 0;
  const hasGroups = node.children?.some(c => c.children && c.children.length > 0);

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
                <button
                  onClick={(e) => { e.stopPropagation(); setShowInfo(v => !v); }}
                  className="p-1 rounded-md hover:bg-muted"
                >
                  <Info className={`h-3.5 w-3.5 ${showInfo ? "text-primary" : "text-muted-foreground/40"}`} />
                </button>
              )}
              <ZoomIn className={`h-4 w-4 text-muted-foreground/40 group-hover:text-primary transition-colors`} />
            </div>
          </div>
          {/* Mini preview of children */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {node.children?.slice(0, 6).map(child => {
              const cs = layerStyles[Math.min(depth + 1, layerStyles.length - 1)];
              const isGroup = child.children && child.children.length > 0;
              return (
                <span
                  key={child.name}
                  className={`text-[10px] md:text-xs px-2 py-1 rounded-md border ${cs.border} ${cs.bg} ${cs.label} font-medium ${
                    isGroup ? "font-bold" : ""
                  }`}
                >
                  {child.name}
                </span>
              );
            })}
            {childCount > 6 && (
              <span className="text-[10px] md:text-xs px-2 py-1 text-muted-foreground">+{childCount - 6} more</span>
            )}
          </div>
        </div>
      </button>
      <AnimatePresence>
        {showInfo && node.description && <InfoPanel node={node} onClose={() => setShowInfo(false)} />}
      </AnimatePresence>
    </div>
  );
};

/* ── Zoomed-in view of a group ── */
const ZoomedView = ({ node, depth, onZoom, breadcrumb, onBack }: {
  node: HierarchyNode;
  depth: number;
  onZoom: (node: HierarchyNode) => void;
  breadcrumb: HierarchyNode[];
  onBack: () => void;
}) => {
  const [showInfo, setShowInfo] = useState(false);
  const s = layerStyles[Math.min(depth, layerStyles.length - 1)];

  return (
    <motion.div
      key={node.name}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.25 }}
      className={`rounded-xl border-2 ${s.border} ${s.bg} p-4 md:p-5 ${
        node.userDesigned ? "!border-dashed !border-rose-400" : ""
      }`}
    >
      {/* Header with back + breadcrumb */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <button onClick={onBack} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
            <ArrowLeft className="h-4 w-4 text-muted-foreground" />
          </button>
          <div className="flex items-center gap-1 text-xs text-muted-foreground overflow-x-auto">
            {breadcrumb.map((b, i) => (
              <span key={b.name} className="flex items-center gap-1 shrink-0">
                {i > 0 && <span className="text-muted-foreground/30">/</span>}
                <span className="hover:text-foreground transition-colors">{b.name}</span>
              </span>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Layers className={`h-5 w-5 ${s.label}`} />
          <h3 className={`font-display font-bold text-lg md:text-xl ${s.label}`}>{node.name}</h3>
          {node.description && (
            <button onClick={() => setShowInfo(v => !v)} className="p-1 rounded-md hover:bg-muted ml-auto">
              <Info className={`h-4 w-4 ${showInfo ? "text-primary" : "text-muted-foreground/40"}`} />
            </button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showInfo && node.description && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden mb-4">
            <div className="text-sm text-muted-foreground bg-background/60 border border-border/30 px-4 py-3 rounded-lg">
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

      {/* Children laid out as visual blocks */}
      <div className="grid gap-3" style={{
        gridTemplateColumns: `repeat(auto-fill, minmax(${node.children && node.children.length <= 3 ? "200px" : "160px"}, 1fr))`
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
          return (
            <div key={child.name}>
              <LeafBlock node={child} depth={depth + 1} />
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

/* ── Main chip visual with zoom navigation ── */
const InteractiveHierarchyDiagram = ({ hierarchy, designName }: InteractiveHierarchyDiagramProps) => {
  const padNode = hierarchy.find(n => n.name.toLowerCase().includes("pad"));
  const chipNode = hierarchy.find(n => !n.name.toLowerCase().includes("pad"));

  // Navigation stack: each entry is the node being viewed
  const [navStack, setNavStack] = useState<HierarchyNode[]>([]);

  const zoomInto = useCallback((node: HierarchyNode) => {
    setNavStack(prev => [...prev, node]);
  }, []);

  const goBack = useCallback(() => {
    setNavStack(prev => prev.slice(0, -1));
  }, []);

  const currentZoomed = navStack.length > 0 ? navStack[navStack.length - 1] : null;

  // Calculate depth of current zoomed node
  const currentDepth = navStack.length;

  if (currentZoomed) {
    return (
      <AnimatePresence mode="wait">
        <ZoomedView
          key={currentZoomed.name}
          node={currentZoomed}
          depth={currentDepth}
          onZoom={zoomInto}
          breadcrumb={navStack}
          onBack={goBack}
        />
      </AnimatePresence>
    );
  }

  // Root view: pad ring + chip
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

  return <ChipRootView padNode={padNode} chipNode={chipNode} onZoom={zoomInto} />;
};

/* ── Root view: pads around the perimeter, chip in the middle ── */
const ChipRootView = ({ padNode, chipNode, onZoom }: { padNode: HierarchyNode; chipNode: HierarchyNode; onZoom: (n: HierarchyNode) => void }) => {
  const [showPadInfo, setShowPadInfo] = useState(false);
  const pads = padNode.children || [];
  const perSide = Math.max(Math.ceil(pads.length / 4), 1);
  const top = pads.slice(0, perSide);
  const right = pads.slice(perSide, perSide * 2);
  const bottom = pads.slice(perSide * 2, perSide * 3);
  const left = pads.slice(perSide * 3);

  return (
    <div className="rounded-2xl border-2 border-slate-300 dark:border-slate-600 bg-slate-100/80 dark:bg-slate-800/40 p-3 md:p-5">
      {/* Pad ring label */}
      <div className="flex items-center justify-center gap-2 mb-3">
        <CircuitBoard className="h-4 w-4 text-slate-500" />
        <span className="font-display font-bold text-sm text-slate-600 dark:text-slate-300">{padNode.name}</span>
        {padNode.description && (
          <button onClick={() => setShowPadInfo(v => !v)} className="p-0.5 rounded hover:bg-muted">
            <Info className={`h-3.5 w-3.5 ${showPadInfo ? "text-primary" : "text-muted-foreground/40"}`} />
          </button>
        )}
      </div>

      <AnimatePresence>
        {showPadInfo && padNode.description && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden mb-3">
            <div className="text-xs text-muted-foreground bg-background/60 border border-border/30 px-4 py-2.5 rounded-lg">
              {padNode.description}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top pads */}
      <div className="flex justify-center gap-2 md:gap-3 mb-3 md:mb-4">
        {top.map(p => <PadSquare key={p.name} pad={p} />)}
      </div>

      {/* Middle: left | chip | right */}
      <div className="flex items-stretch gap-3 md:gap-4">
        <div className="flex flex-col justify-around gap-2 md:gap-3">
          {left.map(p => <PadSquare key={p.name} pad={p} />)}
        </div>

        {/* Chip as a zoomable preview */}
        <div className="flex-1 min-w-0">
          <GroupPreview node={chipNode} depth={1} onZoom={() => onZoom(chipNode)} />
        </div>

        <div className="flex flex-col justify-around gap-2 md:gap-3">
          {right.map(p => <PadSquare key={p.name} pad={p} />)}
        </div>
      </div>

      {/* Bottom pads */}
      <div className="flex justify-center gap-2 md:gap-3 mt-3 md:mt-4">
        {bottom.map(p => <PadSquare key={p.name} pad={p} />)}
      </div>
    </div>
  );
};

export default InteractiveHierarchyDiagram;
