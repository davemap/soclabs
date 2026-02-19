import { useState } from "react";
import { Link } from "react-router-dom";
import { Cpu, MemoryStick, Radio, Layers, Plug, ArrowRight, Microchip, Settings2, X, ExternalLink as ExternalLinkIcon } from "lucide-react";
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

const typeColors: Record<string, { bg: string; border: string; text: string; pad: string }> = {
  processor: { bg: "bg-blue-100/80 dark:bg-blue-500/15", border: "border-blue-300 dark:border-blue-500/40", text: "text-blue-700 dark:text-blue-400", pad: "bg-blue-300 dark:bg-blue-500/50" },
  controller: { bg: "bg-violet-100/80 dark:bg-violet-500/15", border: "border-violet-300 dark:border-violet-500/40", text: "text-violet-700 dark:text-violet-400", pad: "bg-violet-300 dark:bg-violet-500/50" },
  interconnect: { bg: "bg-indigo-100/80 dark:bg-indigo-500/15", border: "border-indigo-300 dark:border-indigo-500/40", text: "text-indigo-700 dark:text-indigo-400", pad: "bg-indigo-300 dark:bg-indigo-500/50" },
  memory: { bg: "bg-green-100/80 dark:bg-green-500/15", border: "border-green-300 dark:border-green-500/40", text: "text-green-700 dark:text-green-400", pad: "bg-green-300 dark:bg-green-500/50" },
  peripheral: { bg: "bg-amber-100/80 dark:bg-amber-500/15", border: "border-amber-300 dark:border-amber-500/40", text: "text-amber-700 dark:text-amber-400", pad: "bg-amber-300 dark:bg-amber-500/50" },
  interface: { bg: "bg-rose-100/80 dark:bg-rose-500/15", border: "border-rose-300 dark:border-rose-500/40", text: "text-rose-700 dark:text-rose-400", pad: "bg-rose-300 dark:bg-rose-500/50" },
};

const defaultColor = { bg: "bg-muted", border: "border-border", text: "text-foreground", pad: "bg-muted-foreground/30" };

// Which external blocks go to which edge
const padEdgeMap: Record<string, "top" | "right" | "bottom" | "left"> = {
  "GPIO": "bottom",
  "UART": "left",
  "Debug Controller": "right",
};

const padSignalNames: Record<string, string[]> = {
  "GPIO": ["IO[0]", "IO[1]", "IO[2]", "IO[3]", "IO[4]", "IO[5]"],
  "UART": ["TXD", "RXD", "CTS", "RTS"],
  "Debug Controller": ["SWDIO", "SWDCK", "SWO", "nRST"],
};

const InteractiveArchitectureDiagram = ({ blocks, designName }: InteractiveArchitectureDiagramProps) => {
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null);

  const processors = blocks.filter((b) => b.type === "processor");
  const controllers = blocks.filter((b) => b.type === "controller");
  const interconnects = blocks.filter((b) => b.type === "interconnect");
  const memories = blocks.filter((b) => b.type === "memory");
  const peripherals = blocks.filter((b) => b.type === "peripheral");
  const interfaces = blocks.filter((b) => b.type === "interface");

  const masters = [...processors, ...controllers];
  const slaves = [...memories, ...peripherals, ...interfaces];
  const externalBlocks = blocks.filter((b) => b.external);
  const busName = interconnects[0]?.name || "System Bus";

  const handleClick = (block: Block) => {
    setSelectedBlock((prev) => (prev?.name === block.name ? null : block));
  };

  // Build pad arrays per edge
  const buildEdgePads = (edge: "top" | "right" | "bottom" | "left") => {
    const edgeExternals = externalBlocks.filter((b) => padEdgeMap[b.name] === edge);
    const pads: { label: string; type: "signal" | "power"; blockType?: string }[] = [];

    // Power pads first
    pads.push({ label: "VDD", type: "power" });
    pads.push({ label: "VSS", type: "power" });

    edgeExternals.forEach((b) => {
      const signals = padSignalNames[b.name] || [];
      signals.forEach((s) => pads.push({ label: s, type: "signal", blockType: b.type }));
    });

    // Fill to at least 10
    while (pads.length < 10) {
      pads.push({ label: pads.length % 2 === 0 ? "VDD" : "VSS", type: "power" });
    }
    return pads;
  };

  const PadStrip = ({ edge }: { edge: "top" | "right" | "bottom" | "left" }) => {
    const pads = buildEdgePads(edge);
    const isVert = edge === "left" || edge === "right";

    return (
      <div className={`flex ${isVert ? "flex-col" : "flex-row"} items-center justify-center gap-1`}>
        {pads.map((p, i) => {
          const color = p.type === "signal" && p.blockType
            ? (typeColors[p.blockType] || defaultColor).pad
            : "bg-rose-300/60 dark:bg-rose-500/30";
          return (
            <div
              key={`${edge}-${i}`}
              className={`${isVert ? "w-3.5 h-3.5" : "w-3.5 h-3.5"} ${color} rounded-[2px] border ${p.type === "power" ? "border-rose-300/40 dark:border-rose-500/20" : "border-current/20"}`}
              title={p.label}
            />
          );
        })}
      </div>
    );
  };

  // Connector arrow between block and bus
  const BusArrow = () => (
    <div className="flex flex-col items-center my-0.5">
      <svg width="12" height="20" viewBox="0 0 12 20" className="text-indigo-400 dark:text-indigo-500/70">
        <line x1="6" y1="0" x2="6" y2="20" stroke="currentColor" strokeWidth="1.5" />
        <polygon points="3,4 6,0 9,4" fill="currentColor" />
        <polygon points="3,16 6,20 9,16" fill="currentColor" />
      </svg>
    </div>
  );

  const BlockNode = ({ block, className = "" }: { block: Block; className?: string }) => {
    const c = typeColors[block.type] || defaultColor;
    const isSelected = selectedBlock?.name === block.name;

    return (
      <button
        onClick={() => handleClick(block)}
        className={`
          flex flex-col items-center justify-center gap-0.5 rounded-md border
          ${c.bg} ${c.border} ${c.text}
          ${isSelected ? "ring-2 ring-offset-1 ring-current scale-[1.03]" : ""}
          cursor-pointer hover:scale-[1.02] hover:shadow-md
          transition-all duration-200 ${className}
        `}
      >
        <span className="shrink-0">{blockTypeIcon[block.type] || <Cpu className="h-3.5 w-3.5" />}</span>
        <span className="font-display font-semibold text-[9px] text-center leading-tight px-0.5">{block.name}</span>
      </button>
    );
  };

  return (
    <div className="rounded-2xl border border-border/60 bg-card/50 p-4 md:p-6 overflow-x-auto">
      {/* Legend */}
      <div className="flex flex-wrap gap-3 mb-4 pb-3 border-b border-border/40">
        {Object.entries(typeColors).map(([type, c]) => {
          if (!blocks.some((b) => b.type === type)) return null;
          return (
            <div key={type} className="flex items-center gap-1.5">
              <div className={`w-2.5 h-2.5 rounded-sm ${c.bg} border ${c.border}`} />
              <span className="text-xs text-muted-foreground capitalize">{type}</span>
            </div>
          );
        })}
        <div className="flex items-center gap-1.5 ml-2 pl-2 border-l border-border/40">
          <div className="w-2.5 h-2.5 rounded-sm bg-rose-300/60 dark:bg-rose-500/30 border border-rose-300/40 dark:border-rose-500/20" />
          <span className="text-xs text-muted-foreground">I/O Pad</span>
        </div>
      </div>

      {/* Chip floorplan */}
      <div className="min-w-[500px] max-w-[700px] mx-auto">
        {/* Outer package */}
        <div className="relative border-2 border-zinc-400/50 dark:border-zinc-600/60 rounded-lg bg-zinc-100/50 dark:bg-zinc-900/60 p-1">

          {/* Pin 1 notch */}
          <div className="absolute top-1.5 left-1.5 w-3 h-3 rounded-full border border-zinc-400/40 dark:border-zinc-600/50" />

          {/* Top pads */}
          <div className="flex justify-center py-1.5">
            <PadStrip edge="top" />
          </div>

          <div className="flex">
            {/* Left pads */}
            <div className="flex items-center px-1.5">
              <PadStrip edge="left" />
            </div>

            {/* Die area */}
            <div className="flex-1 mx-1">
              <div className="relative rounded-md border border-zinc-300 dark:border-zinc-600/40 bg-white/80 dark:bg-zinc-800/80 p-4 min-h-[320px] flex flex-col">

                {/* Die label */}
                <div className="absolute -top-2 left-3 px-2 bg-white dark:bg-zinc-800 rounded text-[9px] font-mono text-muted-foreground uppercase tracking-widest">
                  {designName}
                </div>

                {/* Masters row */}
                <div className="flex justify-center gap-3 mb-1">
                  {masters.map((b) => (
                    <div key={b.name} className="flex flex-col items-center">
                      <BlockNode block={b} className="w-20 h-16 px-1.5" />
                      <BusArrow />
                    </div>
                  ))}
                </div>

                {/* Bus bar */}
                <button
                  onClick={() => { const bus = interconnects[0]; if (bus) handleClick(bus); }}
                  className={`
                    w-full h-7 rounded-sm border flex items-center justify-center
                    ${typeColors.interconnect.bg} ${typeColors.interconnect.border} ${typeColors.interconnect.text}
                    ${selectedBlock?.name === busName ? "ring-2 ring-current" : ""}
                    cursor-pointer hover:shadow-md transition-all duration-200
                  `}
                >
                  <span className="font-display font-bold text-[10px] tracking-wide">{busName}</span>
                </button>

                {/* Slaves row */}
                <div className="flex justify-center gap-2 mt-1 flex-wrap">
                  {slaves.map((b) => (
                    <div key={b.name} className="flex flex-col items-center">
                      <BusArrow />
                      <BlockNode block={b} className="w-[4.5rem] h-14 px-1" />
                    </div>
                  ))}
                </div>

                {/* Spacer */}
                <div className="flex-1" />
              </div>
            </div>

            {/* Right pads */}
            <div className="flex items-center px-1.5">
              <PadStrip edge="right" />
            </div>
          </div>

          {/* Bottom pads */}
          <div className="flex justify-center py-1.5">
            <PadStrip edge="bottom" />
          </div>

          {/* Package label */}
          <div className="absolute bottom-1 right-2 text-[7px] font-mono text-muted-foreground/50 uppercase tracking-wider">
            {designName} QFP
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
              <div className={`rounded-xl border-2 p-5 ${(typeColors[selectedBlock.type] || defaultColor).bg} ${(typeColors[selectedBlock.type] || defaultColor).border}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`p-2 rounded-lg ${(typeColors[selectedBlock.type] || defaultColor).bg} ${(typeColors[selectedBlock.type] || defaultColor).text}`}>
                      {blockTypeIcon[selectedBlock.type] || <Cpu className="h-5 w-5" />}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-display font-bold text-sm">{selectedBlock.name}</h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`text-xs font-medium capitalize ${(typeColors[selectedBlock.type] || defaultColor).text}`}>
                          {selectedBlock.type}
                        </span>
                        {selectedBlock.external && (
                          <span className="text-[10px] text-orange-500 dark:text-orange-400 font-medium flex items-center gap-0.5">
                            <ExternalLinkIcon className="h-2.5 w-2.5" /> External I/O
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button onClick={() => setSelectedBlock(null)} className="p-1 rounded-md hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors shrink-0">
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {selectedBlock.external && padSignalNames[selectedBlock.name] && (
                  <div className="mt-3 flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] text-orange-500 dark:text-orange-400 font-semibold uppercase tracking-wider">Pads:</span>
                    {padSignalNames[selectedBlock.name].map((s) => (
                      <Badge key={s} variant="outline" className="text-[10px] font-mono border-orange-400/40 text-orange-500 dark:text-orange-400">{s}</Badge>
                    ))}
                  </div>
                )}

                {selectedBlock.info && (
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{selectedBlock.info}</p>
                )}

                <div className="mt-4 flex flex-wrap gap-4">
                  {selectedBlock.gateCount && (
                    <div className="flex items-center gap-2">
                      <Microchip className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">Gate count:</span>
                      <Badge variant="secondary" className="text-xs font-mono">{selectedBlock.gateCount}</Badge>
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
