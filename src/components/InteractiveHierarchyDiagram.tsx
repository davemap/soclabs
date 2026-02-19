import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Info, ExternalLink, X, Cpu, Layers, Box, CircuitBoard } from "lucide-react";
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

/* ── colour palette per depth ── */
const layerStyles = [
  { bg: "bg-slate-100 dark:bg-slate-800/60", border: "border-slate-300 dark:border-slate-600", label: "text-slate-600 dark:text-slate-300", accent: "bg-slate-300 dark:bg-slate-600" },
  { bg: "bg-sky-50 dark:bg-sky-900/30", border: "border-sky-300 dark:border-sky-600", label: "text-sky-700 dark:text-sky-300", accent: "bg-sky-300 dark:bg-sky-500" },
  { bg: "bg-violet-50 dark:bg-violet-900/20", border: "border-violet-300 dark:border-violet-600", label: "text-violet-700 dark:text-violet-300", accent: "bg-violet-200 dark:bg-violet-700" },
  { bg: "bg-emerald-50 dark:bg-emerald-900/20", border: "border-emerald-300 dark:border-emerald-600", label: "text-emerald-700 dark:text-emerald-300", accent: "bg-emerald-200 dark:bg-emerald-700" },
  { bg: "bg-amber-50 dark:bg-amber-900/20", border: "border-amber-300 dark:border-amber-600", label: "text-amber-700 dark:text-amber-300", accent: "bg-amber-200 dark:bg-amber-700" },
  { bg: "bg-rose-50 dark:bg-rose-900/20", border: "border-rose-300 dark:border-rose-600", label: "text-rose-700 dark:text-rose-300", accent: "bg-rose-200 dark:bg-rose-700" },
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

/* ── Pad squares around the perimeter ── */
const PadRing = ({ node, onSelect }: { node: HierarchyNode; onSelect: (n: HierarchyNode) => void }) => {
  const pads = node.children || [];
  // Distribute pads evenly around all 4 sides
  const perSide = Math.ceil(pads.length / 4);
  const top = pads.slice(0, perSide);
  const right = pads.slice(perSide, perSide * 2);
  const bottom = pads.slice(perSide * 2, perSide * 3);
  const left = pads.slice(perSide * 3);

  const PadSquare = ({ pad }: { pad: HierarchyNode }) => {
    const [showInfo, setShowInfo] = useState(false);
    return (
      <div className="relative">
        <button
          onClick={() => { onSelect(pad); setShowInfo(s => !s); }}
          className={`w-7 h-7 md:w-8 md:h-8 rounded-sm border-2 transition-all duration-150 hover:scale-110 ${
            pad.userDesigned
              ? "border-dashed border-rose-400 bg-rose-100 dark:bg-rose-900/30"
              : "border-slate-400 dark:border-slate-500 bg-white dark:bg-slate-700 hover:border-primary hover:bg-primary/10"
          }`}
          title={pad.name}
        />
        <AnimatePresence>
          {showInfo && pad.description && <InfoPanel node={pad} onClose={() => setShowInfo(false)} />}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="relative">
      {/* Top pads */}
      <div className="flex justify-center gap-3 md:gap-4 mb-3">
        {top.map(p => <PadSquare key={p.name} pad={p} />)}
      </div>
      {/* Middle: left pads | inner | right pads */}
      <div className="flex items-stretch">
        <div className="flex flex-col justify-around gap-3 md:gap-4 mr-3">
          {left.map(p => <PadSquare key={p.name} pad={p} />)}
        </div>
        {/* Inner space - will be filled by children */}
        <div className="flex-1 min-h-[180px]" id="pad-inner" />
        <div className="flex flex-col justify-around gap-3 md:gap-4 ml-3">
          {right.map(p => <PadSquare key={p.name} pad={p} />)}
        </div>
      </div>
      {/* Bottom pads */}
      <div className="flex justify-center gap-3 md:gap-4 mt-3">
        {bottom.map(p => <PadSquare key={p.name} pad={p} />)}
      </div>
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

/* ── Nested visual box for groups ── */
const NestedBox = ({ node, depth = 0, isPadRing = false }: { node: HierarchyNode; depth?: number; isPadRing?: boolean }) => {
  const [expanded, setExpanded] = useState(depth < 2);
  const [showInfo, setShowInfo] = useState(false);
  const s = layerStyles[Math.min(depth, layerStyles.length - 1)];
  const hasChildren = node.children && node.children.length > 0;

  if (!hasChildren) {
    return <LeafBlock node={node} depth={depth} />;
  }

  // Check if this node IS the pad ring (has name containing "Pad")
  const isPads = node.name.toLowerCase().includes("pad");

  return (
    <motion.div
      layout
      className={`relative rounded-xl border-2 ${s.border} ${s.bg} transition-all duration-200 ${
        node.userDesigned ? "!border-dashed !border-rose-400" : ""
      }`}
    >
      {/* Label header */}
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full flex items-center gap-2 px-4 py-2.5 md:py-3 rounded-t-xl transition-colors hover:bg-black/5 dark:hover:bg-white/5"
      >
        <motion.div animate={{ rotate: expanded ? 90 : 0 }} transition={{ duration: 0.15 }}>
          <ChevronRight className={`h-4 w-4 ${s.label}`} />
        </motion.div>
        {depth === 0 ? (
          <CircuitBoard className={`h-4.5 w-4.5 ${s.label} shrink-0`} />
        ) : (
          <Layers className={`h-4 w-4 ${s.label} shrink-0`} />
        )}
        <span className={`font-display font-bold text-sm md:text-base ${s.label}`}>{node.name}</span>
        {node.userDesigned && (
          <span className="bg-rose-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full leading-none">USER IP</span>
        )}
        {node.description && (
          <button
            onClick={(e) => { e.stopPropagation(); setShowInfo(v => !v); }}
            className="ml-auto shrink-0 p-1 rounded-md hover:bg-muted"
          >
            <Info className={`h-3.5 w-3.5 ${showInfo ? "text-primary" : "text-muted-foreground/40"}`} />
          </button>
        )}
      </button>

      {/* Info tooltip */}
      <AnimatePresence>
        {showInfo && node.description && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="text-xs text-muted-foreground bg-background/60 border-t border-border/30 px-4 py-2.5 mx-3 mb-2 rounded-lg">
              <p>{node.description}</p>
              {node.techId && (
                <Link to={`/technologies/${node.techId}`} className="inline-flex items-center gap-1 mt-1.5 text-primary hover:underline text-xs font-medium">
                  Learn more <ExternalLink className="h-3 w-3" />
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Children - nested visual layout */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="p-3 md:p-4">
              {isPads ? (
                /* Pad ring: show pad squares around the perimeter with placeholder inner */
                <PadRing node={node} onSelect={() => {}} />
              ) : (
                /* Normal nested children as visual boxes */
                <div className="flex flex-wrap gap-3">
                  {node.children!.map(child => {
                    const childHasChildren = child.children && child.children.length > 0;
                    return (
                      <div
                        key={child.name}
                        className={childHasChildren ? "flex-1 min-w-[200px]" : ""}
                      >
                        <NestedBox node={child} depth={depth + 1} />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

/* ── Main Component: Full chip visual ── */
const InteractiveHierarchyDiagram = ({ hierarchy, designName }: InteractiveHierarchyDiagramProps) => {
  // Find the pad ring node and the chip node
  const padNode = hierarchy.find(n => n.name.toLowerCase().includes("pad"));
  const chipNode = hierarchy.find(n => !n.name.toLowerCase().includes("pad"));

  if (!padNode || !chipNode) {
    // Fallback: just render all as nested boxes
    return (
      <div className="space-y-3">
        {hierarchy.map(node => (
          <NestedBox key={node.name} node={node} depth={0} />
        ))}
      </div>
    );
  }

  return (
    <ChipVisual padNode={padNode} chipNode={chipNode} />
  );
};

/* ── The main chip visual with pads around the outside, chip inside ── */
const ChipVisual = ({ padNode, chipNode }: { padNode: HierarchyNode; chipNode: HierarchyNode }) => {
  const [showPadInfo, setShowPadInfo] = useState(false);
  const pads = padNode.children || [];
  const perSide = Math.max(Math.ceil(pads.length / 4), 1);
  const top = pads.slice(0, perSide);
  const right = pads.slice(perSide, perSide * 2);
  const bottom = pads.slice(perSide * 2, perSide * 3);
  const left = pads.slice(perSide * 3);

  const PadSquare = ({ pad }: { pad: HierarchyNode }) => {
    const [info, setInfo] = useState(false);
    return (
      <div className="relative group">
        <button
          onClick={() => setInfo(v => !v)}
          className={`w-8 h-8 md:w-9 md:h-9 rounded border-2 transition-all duration-150 hover:scale-110 hover:shadow-md ${
            pad.userDesigned
              ? "border-dashed border-rose-400 bg-rose-50 dark:bg-rose-900/30"
              : "border-slate-400 dark:border-slate-500 bg-white dark:bg-slate-700 hover:border-sky-500 hover:bg-sky-50 dark:hover:bg-sky-900/30"
          }`}
          title={pad.name}
        />
        {/* Tooltip on hover */}
        <div className="absolute z-40 bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 rounded bg-foreground text-background text-[10px] font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          {pad.name}
        </div>
        <AnimatePresence>
          {info && pad.description && <InfoPanel node={pad} onClose={() => setInfo(false)} />}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="relative">
      {/* Outer pad ring frame */}
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

        {/* Middle row: left pads | chip | right pads */}
        <div className="flex items-stretch gap-3 md:gap-4">
          {/* Left pads */}
          <div className="flex flex-col justify-around gap-2 md:gap-3">
            {left.map(p => <PadSquare key={p.name} pad={p} />)}
          </div>

          {/* Inner chip box */}
          <div className="flex-1 min-w-0">
            <NestedBox node={chipNode} depth={1} />
          </div>

          {/* Right pads */}
          <div className="flex flex-col justify-around gap-2 md:gap-3">
            {right.map(p => <PadSquare key={p.name} pad={p} />)}
          </div>
        </div>

        {/* Bottom pads */}
        <div className="flex justify-center gap-2 md:gap-3 mt-3 md:mt-4">
          {bottom.map(p => <PadSquare key={p.name} pad={p} />)}
        </div>
      </div>
    </div>
  );
};

export default InteractiveHierarchyDiagram;
