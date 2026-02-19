import { useState, useRef, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Cpu, MemoryStick, Radio, Layers, Plug, ArrowUpDown, ExternalLink as ExternalLinkIcon, X, Info, ArrowRight, Microchip, Settings2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface Block {
  name: string;
  type: string;
  external?: boolean;
  info?: string;
  techId?: string;
  gateCount?: string;
  configOptions?: string[];
}

interface InteractiveArchitectureDiagramProps {
  blocks: Block[];
  designName: string;
}

const blockTypeIcon: Record<string, React.ReactNode> = {
  processor: <Cpu className="h-4 w-4" />,
  interconnect: <Layers className="h-4 w-4" />,
  memory: <MemoryStick className="h-4 w-4" />,
  peripheral: <Radio className="h-4 w-4" />,
  controller: <Cpu className="h-4 w-4" />,
  interface: <Plug className="h-4 w-4" />,
};

const blockTypeStyles: Record<string, { bg: string; border: string; text: string; hoverBorder: string; wire: string }> = {
  processor: {
    bg: "bg-primary/15", border: "border-primary/40", text: "text-primary",
    hoverBorder: "hover:border-primary hover:shadow-[0_0_16px_hsl(var(--primary)/0.2)]",
    wire: "rgba(168,85,247,0.5)",
  },
  interconnect: {
    bg: "bg-cyan-500/15", border: "border-cyan-500/40", text: "text-cyan-400",
    hoverBorder: "hover:border-cyan-400", wire: "rgba(6,182,212,0.5)",
  },
  memory: {
    bg: "bg-amber-500/15", border: "border-amber-500/40", text: "text-amber-400",
    hoverBorder: "hover:border-amber-400 hover:shadow-[0_0_16px_rgba(251,191,36,0.2)]",
    wire: "rgba(245,158,11,0.5)",
  },
  peripheral: {
    bg: "bg-emerald-500/15", border: "border-emerald-500/40", text: "text-emerald-400",
    hoverBorder: "hover:border-emerald-400 hover:shadow-[0_0_16px_rgba(52,211,153,0.2)]",
    wire: "rgba(16,185,129,0.5)",
  },
  controller: {
    bg: "bg-violet-500/15", border: "border-violet-500/40", text: "text-violet-400",
    hoverBorder: "hover:border-violet-400 hover:shadow-[0_0_16px_rgba(167,139,250,0.2)]",
    wire: "rgba(139,92,246,0.5)",
  },
  interface: {
    bg: "bg-rose-500/15", border: "border-rose-500/40", text: "text-rose-400",
    hoverBorder: "hover:border-rose-400 hover:shadow-[0_0_16px_rgba(251,113,133,0.2)]",
    wire: "rgba(244,63,94,0.5)",
  },
};

const defaultStyle = {
  bg: "bg-muted", border: "border-border", text: "text-foreground", hoverBorder: "", wire: "rgba(150,150,150,0.5)",
};

// Pad signal assignments for external blocks — which edge and signal names
const padSignals: Record<string, { edge: "top" | "right" | "bottom" | "left"; signals: string[] }> = {
  "GPIO": { edge: "bottom", signals: ["IO[0]", "IO[1]", "IO[2]", "IO[3]", "IO[4]", "IO[5]"] },
  "UART": { edge: "left", signals: ["TXD", "RXD", "CTS", "RTS"] },
  "Debug Controller": { edge: "right", signals: ["SWDIO", "SWDCK", "SWO", "nRST"] },
};

const PAD_SIZE = 14;
const PAD_GAP = 6;
const PADRING_WIDTH = 32;

interface WirePath {
  d: string;
  color: string;
  label: string;
}

const InteractiveArchitectureDiagram = ({ blocks, designName }: InteractiveArchitectureDiagramProps) => {
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null);
  const [wirePaths, setWirePaths] = useState<WirePath[]>([]);
  const [hoveredWire, setHoveredWire] = useState<string | null>(null);
  const chipRef = useRef<HTMLDivElement>(null);

  const processors = blocks.filter((b) => b.type === "processor");
  const controllers = blocks.filter((b) => b.type === "controller");
  const interconnects = blocks.filter((b) => b.type === "interconnect");
  const memories = blocks.filter((b) => b.type === "memory");
  const peripherals = blocks.filter((b) => b.type === "peripheral");
  const interfaces = blocks.filter((b) => b.type === "interface");

  const masters = [...processors, ...controllers];
  const slaves = [...memories, ...peripherals, ...interfaces];
  const externalBlocks = blocks.filter((b) => b.external);

  // Power/ground pads for unused pad positions
  const powerPads = ["VDD", "VSS", "VDD", "VSS", "VDDIO", "VSS", "VDD", "VSS"];

  const computeWires = useCallback(() => {
    const chip = chipRef.current;
    if (!chip) return;

    const chipRect = chip.getBoundingClientRect();
    const paths: WirePath[] = [];

    externalBlocks.forEach((block) => {
      const blockEl = chip.querySelector(`[data-ext-block="${block.name}"]`);
      const padEls = chip.querySelectorAll(`[data-pad-for="${block.name}"]`);
      if (!blockEl || padEls.length === 0) return;

      const bRect = blockEl.getBoundingClientRect();
      const bx = bRect.left + bRect.width / 2 - chipRect.left;
      const by = bRect.top + bRect.height / 2 - chipRect.top;
      const style = blockTypeStyles[block.type] || defaultStyle;

      padEls.forEach((padEl) => {
        const pRect = padEl.getBoundingClientRect();
        const px = pRect.left + pRect.width / 2 - chipRect.left;
        const py = pRect.top + pRect.height / 2 - chipRect.top;

        // Determine pad edge for curve direction
        const padInfo = padSignals[block.name];
        const edge = padInfo?.edge || "bottom";

        let d: string;
        if (edge === "bottom") {
          const cy1 = by + (py - by) * 0.3;
          const cy2 = by + (py - by) * 0.7;
          d = `M ${bx} ${by} C ${bx} ${cy1}, ${px} ${cy2}, ${px} ${py}`;
        } else if (edge === "top") {
          const cy1 = by - (by - py) * 0.3;
          const cy2 = by - (by - py) * 0.7;
          d = `M ${bx} ${by} C ${bx} ${cy1}, ${px} ${cy2}, ${px} ${py}`;
        } else if (edge === "left") {
          const cx1 = bx - (bx - px) * 0.3;
          const cx2 = bx - (bx - px) * 0.7;
          d = `M ${bx} ${by} C ${cx1} ${by}, ${cx2} ${py}, ${px} ${py}`;
        } else {
          const cx1 = bx + (px - bx) * 0.3;
          const cx2 = bx + (px - bx) * 0.7;
          d = `M ${bx} ${by} C ${cx1} ${by}, ${cx2} ${py}, ${px} ${py}`;
        }

        paths.push({ d, color: style.wire, label: block.name });
      });
    });

    setWirePaths(paths);
  }, [blocks, externalBlocks]);

  useEffect(() => {
    // Small delay so layout settles
    const timer = setTimeout(computeWires, 100);
    window.addEventListener("resize", computeWires);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", computeWires);
    };
  }, [computeWires]);

  const handleClick = (block: Block) => {
    setSelectedBlock((prev) => (prev?.name === block.name ? null : block));
  };

  const BlockNode = ({ block, className = "" }: { block: Block; className?: string }) => {
    const style = blockTypeStyles[block.type] || defaultStyle;
    const isSelected = selectedBlock?.name === block.name;
    const isWireHovered = hoveredWire === block.name;

    return (
      <TooltipProvider key={block.name} delayDuration={200}>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              data-ext-block={block.external ? block.name : undefined}
              onClick={() => handleClick(block)}
              onMouseEnter={() => block.external && setHoveredWire(block.name)}
              onMouseLeave={() => setHoveredWire(null)}
              className={`
                flex flex-col items-center justify-center gap-0.5 rounded-lg border-2 
                ${style.bg} ${style.border} ${style.text}
                ${isSelected ? `${style.hoverBorder.replace(/hover:/g, "")} scale-[1.03]` : ""}
                ${isWireHovered ? "ring-2 ring-orange-400/50" : ""}
                cursor-pointer ${style.hoverBorder} hover:-translate-y-0.5
                transition-all duration-300 group min-w-0 relative
                ${className}
              `}
            >
              <span className="shrink-0">{blockTypeIcon[block.type] || <Cpu className="h-3.5 w-3.5" />}</span>
              <span className="font-display font-semibold text-[9px] text-center leading-tight px-0.5">{block.name}</span>
              <Info className="h-2 w-2 opacity-0 group-hover:opacity-60 transition-opacity" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-[180px]">
            <p className="text-xs">Click for details on <span className="font-semibold">{block.name}</span></p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  const BusStub = () => (
    <div className="flex flex-col items-center">
      <div className="w-0.5 h-3 bg-cyan-500/40" />
      <ArrowUpDown className="h-2 w-2 text-cyan-500/50" />
    </div>
  );

  // Render pads along one edge
  const renderPadEdge = (edge: "top" | "right" | "bottom" | "left") => {
    // Find which external blocks go on this edge
    const edgeBlocks = externalBlocks.filter((b) => padSignals[b.name]?.edge === edge);
    const signalPads: { name: string; blockName: string }[] = [];
    edgeBlocks.forEach((b) => {
      const ps = padSignals[b.name];
      if (ps) {
        ps.signals.forEach((s) => signalPads.push({ name: s, blockName: b.name }));
      }
    });

    // Add power pads to fill
    const totalPads = Math.max(8, signalPads.length + 4);
    const allPads: { name: string; blockName?: string; isPower: boolean }[] = [];

    // Interleave: power, signals, power
    allPads.push({ name: "VDD", isPower: true });
    allPads.push({ name: "VSS", isPower: true });
    signalPads.forEach((sp) => allPads.push({ ...sp, isPower: false }));
    while (allPads.length < totalPads) {
      allPads.push({ name: allPads.length % 2 === 0 ? "VDD" : "VSS", isPower: true });
    }

    const isVertical = edge === "left" || edge === "right";

    return (
      <div className={`flex ${isVertical ? "flex-col" : "flex-row"} items-center justify-center gap-[3px]`}>
        {allPads.map((pad, i) => (
          <div
            key={`${edge}-${i}`}
            data-pad-for={pad.blockName || undefined}
            className={`
              flex items-center justify-center relative group/pad
              ${isVertical ? "w-[14px] h-[14px]" : "w-[14px] h-[14px]"}
              ${pad.isPower
                ? "bg-zinc-600/30 border border-zinc-500/30"
                : "bg-orange-400/30 border border-orange-400/60 shadow-[0_0_4px_rgba(251,146,60,0.3)]"
              }
              rounded-[2px]
            `}
          >
            {/* Pad label tooltip */}
            <div className={`
              absolute z-20 pointer-events-none opacity-0 group-hover/pad:opacity-100 transition-opacity
              bg-card border border-border rounded px-1.5 py-0.5 whitespace-nowrap
              ${edge === "top" ? "top-full mt-1" : ""}
              ${edge === "bottom" ? "bottom-full mb-1" : ""}
              ${edge === "left" ? "left-full ml-1" : ""}
              ${edge === "right" ? "right-full mr-1" : ""}
            `}>
              <span className={`text-[8px] font-mono font-bold ${pad.isPower ? "text-zinc-400" : "text-orange-400"}`}>
                {pad.name}
              </span>
            </div>
            {/* Bond pad dot */}
            {!pad.isPower && (
              <div className="w-[6px] h-[6px] rounded-full bg-orange-400/70" />
            )}
            {pad.isPower && (
              <div className="w-[4px] h-[4px] rounded-full bg-zinc-500/50" />
            )}
          </div>
        ))}
      </div>
    );
  };

  const busName = interconnects[0]?.name || "System Bus";

  return (
    <div className="rounded-2xl border border-border/60 bg-card/50 p-5 md:p-8 overflow-x-auto">
      {/* Legend */}
      <div className="flex flex-wrap gap-3 mb-6 pb-4 border-b border-border/40">
        {Object.entries(blockTypeStyles).map(([type, style]) => {
          const hasType = blocks.some((b) => b.type === type);
          if (!hasType) return null;
          return (
            <div key={type} className="flex items-center gap-1.5">
              <div className={`w-2.5 h-2.5 rounded-full ${style.bg} border ${style.border}`} />
              <span className="text-xs text-muted-foreground capitalize">{type}</span>
            </div>
          );
        })}
        <div className="flex items-center gap-1.5 ml-2 pl-2 border-l border-border/40">
          <div className="w-2.5 h-2.5 rounded-sm bg-orange-400/25 border border-orange-400/60" />
          <span className="text-xs text-muted-foreground">Signal Pad</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-sm bg-zinc-600/30 border border-zinc-500/30" />
          <span className="text-xs text-muted-foreground">Power/GND</span>
        </div>
      </div>

      {/* ═══════════ CHIP DIAGRAM ═══════════ */}
      <div className="min-w-[700px]" ref={chipRef}>
        <div className="relative">

          {/* SVG Wire overlay */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none z-10"
            style={{ overflow: "visible" }}
          >
            {wirePaths.map((wp, i) => (
              <g key={i}>
                {/* Glow effect */}
                <path
                  d={wp.d}
                  fill="none"
                  stroke={wp.color}
                  strokeWidth={hoveredWire === wp.label ? 4 : 2}
                  strokeOpacity={hoveredWire === wp.label ? 0.4 : 0.15}
                  filter="blur(3px)"
                />
                {/* Wire */}
                <path
                  d={wp.d}
                  fill="none"
                  stroke={wp.color}
                  strokeWidth={hoveredWire === wp.label ? 2.5 : 1.2}
                  strokeOpacity={hoveredWire === wp.label ? 0.9 : 0.5}
                  strokeDasharray={hoveredWire === wp.label ? "none" : "4 3"}
                  className="transition-all duration-300"
                />
              </g>
            ))}
          </svg>

          {/* Chip package */}
          <div className="bg-zinc-900/80 rounded-xl border-2 border-zinc-700/60 p-0 shadow-[0_0_30px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.05)]">

            {/* Corner notch (pin 1 indicator) */}
            <div className="absolute top-2 left-2 w-4 h-4 rounded-full border border-zinc-600/50 bg-zinc-800/80" />

            {/* ── TOP PADS ── */}
            <div className="flex justify-center py-2">
              {renderPadEdge("top")}
            </div>

            <div className="flex">
              {/* ── LEFT PADS ── */}
              <div className="flex items-center px-2">
                {renderPadEdge("left")}
              </div>

              {/* ── DIE AREA ── */}
              <div className="flex-1 mx-1 my-1">
                {/* Die surface */}
                <div className="relative rounded-lg border border-zinc-600/40 bg-gradient-to-br from-zinc-800/90 via-zinc-850/90 to-zinc-900/90 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">

                  {/* System boundary */}
                  <div className="relative rounded-md border border-border/50 bg-card/40 p-3 pt-5">
                    {/* System label */}
                    <div className="absolute -top-2.5 left-3 px-2 bg-zinc-800/90 rounded">
                      <span className="text-[10px] font-display font-bold text-muted-foreground uppercase tracking-widest">
                        {designName} System
                      </span>
                    </div>

                    {/* Bus Masters */}
                    <div className="flex justify-center gap-2 mb-0.5">
                      {masters.map((b) => (
                        <div key={b.name} className="flex flex-col items-center">
                          <BlockNode block={b} className="px-2 py-1.5 w-[5.5rem] h-16" />
                          <BusStub />
                        </div>
                      ))}
                    </div>

                    {/* The Bus — clickable */}
                    <div className="relative mx-1">
                      <button
                        onClick={() => {
                          const busBlock = interconnects[0];
                          if (busBlock) handleClick(busBlock);
                        }}
                        className={`w-full h-8 rounded bg-gradient-to-r from-cyan-500/20 via-cyan-500/30 to-cyan-500/20 border border-cyan-500/40 flex items-center justify-center cursor-pointer hover:border-cyan-400 hover:from-cyan-500/30 hover:via-cyan-500/40 hover:to-cyan-500/30 transition-all duration-300 group ${selectedBlock?.name === busName ? "ring-2 ring-cyan-400/60 border-cyan-400" : ""}`}
                      >
                        <span className="font-display font-bold text-[10px] text-cyan-400 tracking-wide group-hover:text-cyan-300 transition-colors">
                          {busName}
                        </span>
                      </button>
                    </div>

                    {/* Bus Slaves */}
                    <div className="flex justify-center gap-1.5 mt-0.5 flex-wrap">
                      {slaves.map((b) => (
                        <div key={b.name} className="flex flex-col items-center">
                          <BusStub />
                          <BlockNode block={b} className="px-1.5 py-1.5 w-[4.5rem] h-14" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Die label */}
                  <div className="mt-2 text-center">
                    <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-[0.2em]">
                      {designName} — Silicon Die
                    </span>
                  </div>
                </div>
              </div>

              {/* ── RIGHT PADS ── */}
              <div className="flex items-center px-2">
                {renderPadEdge("right")}
              </div>
            </div>

            {/* ── BOTTOM PADS ── */}
            <div className="flex justify-center py-2">
              {renderPadEdge("bottom")}
            </div>

            {/* Package label */}
            <div className="absolute bottom-2 right-3">
              <span className="text-[8px] font-mono text-zinc-600 uppercase tracking-wider">
                {designName} QFP
              </span>
            </div>
          </div>
        </div>

        {/* Hierarchy key */}
        <div className="flex items-center justify-center gap-5 mt-5 pt-3 border-t border-border/40">
          <div className="flex items-center gap-2">
            <div className="w-5 h-3 rounded-sm bg-zinc-900/80 border border-zinc-700/60" />
            <span className="text-[10px] text-muted-foreground font-display font-semibold">Package + Pads</span>
          </div>
          <span className="text-muted-foreground/30">→</span>
          <div className="flex items-center gap-2">
            <div className="w-5 h-3 rounded-sm bg-zinc-800/60 border border-zinc-600/40" />
            <span className="text-[10px] text-muted-foreground font-display font-semibold">Silicon Die</span>
          </div>
          <span className="text-muted-foreground/30">→</span>
          <div className="flex items-center gap-2">
            <div className="w-5 h-3 rounded-sm border border-border/50 bg-card/40" />
            <span className="text-[10px] text-muted-foreground font-display font-semibold">SoC System</span>
          </div>
          <span className="text-muted-foreground/30">→</span>
          <div className="flex items-center gap-2">
            <div className="w-5 h-3 rounded-sm border-2 border-primary/40 bg-primary/10" />
            <span className="text-[10px] text-muted-foreground font-display font-semibold">IP Blocks</span>
          </div>
        </div>
      </div>

      {/* Info Panel */}
      <AnimatePresence mode="wait">
        {selectedBlock && (
          <motion.div
            key={selectedBlock.name}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="mt-4 pt-4 border-t border-border/40">
              <div className={`rounded-xl border-2 p-5 ${(blockTypeStyles[selectedBlock.type] || defaultStyle).bg} ${(blockTypeStyles[selectedBlock.type] || defaultStyle).border}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`p-2 rounded-lg ${(blockTypeStyles[selectedBlock.type] || defaultStyle).bg} ${(blockTypeStyles[selectedBlock.type] || defaultStyle).text}`}>
                      {blockTypeIcon[selectedBlock.type] || <Cpu className="h-5 w-5" />}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-display font-bold text-sm">{selectedBlock.name}</h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`text-xs font-medium capitalize ${(blockTypeStyles[selectedBlock.type] || defaultStyle).text}`}>
                          {selectedBlock.type}
                        </span>
                        {selectedBlock.external && (
                          <span className="text-[10px] text-orange-400 font-medium flex items-center gap-0.5">
                            <ExternalLinkIcon className="h-2.5 w-2.5" /> Connected to Padring
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedBlock(null)}
                    className="p-1 rounded-md hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors shrink-0"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Pad signals for external blocks */}
                {selectedBlock.external && padSignals[selectedBlock.name] && (
                  <div className="mt-3 flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] text-orange-400 font-semibold uppercase tracking-wider">Pads:</span>
                    {padSignals[selectedBlock.name].signals.map((s) => (
                      <Badge key={s} variant="outline" className="text-[10px] font-mono border-orange-400/40 text-orange-400">
                        {s}
                      </Badge>
                    ))}
                    <Badge variant="outline" className="text-[10px] font-mono border-zinc-500/40 text-zinc-400">
                      {padSignals[selectedBlock.name].edge} edge
                    </Badge>
                  </div>
                )}

                {selectedBlock.info && (
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                    {selectedBlock.info}
                  </p>
                )}

                <div className="mt-4 flex flex-wrap gap-4">
                  {selectedBlock.gateCount && (
                    <div className="flex items-center gap-2">
                      <Microchip className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">Gate count:</span>
                      <Badge variant="secondary" className="text-xs font-mono">{selectedBlock.gateCount}</Badge>
                    </div>
                  )}
                  {selectedBlock.external && (
                    <div className="flex items-center gap-2">
                      <ExternalLinkIcon className="h-3.5 w-3.5 text-orange-400" />
                      <span className="text-xs text-orange-400 font-medium">Routes to chip padring</span>
                    </div>
                  )}
                </div>

                {selectedBlock.configOptions && selectedBlock.configOptions.length > 0 && (
                  <div className="mt-3">
                    <div className="flex items-center gap-1.5 mb-2">
                      <Settings2 className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-xs font-semibold text-muted-foreground">Configuration Options</span>
                    </div>
                    <div className="space-y-1">
                      {selectedBlock.configOptions.map((opt, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                          <span className="mt-0.5 shrink-0 w-1.5 h-1.5 rounded-full bg-muted-foreground/40" />
                          <span>{opt}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedBlock.techId && (
                  <div className="mt-4 pt-3 border-t border-border/30">
                    <Button asChild variant="outline" size="sm" className="rounded-full">
                      <Link to={`/technologies/${selectedBlock.techId}`}>
                        Learn More <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InteractiveArchitectureDiagram;
