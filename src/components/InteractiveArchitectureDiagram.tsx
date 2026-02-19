import { useState } from "react";
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

const blockTypeStyles: Record<string, { bg: string; border: string; text: string; hoverBorder: string }> = {
  processor: {
    bg: "bg-primary/15",
    border: "border-primary/40",
    text: "text-primary",
    hoverBorder: "hover:border-primary hover:shadow-[0_0_16px_hsl(var(--primary)/0.2)]",
  },
  interconnect: {
    bg: "bg-cyan-500/15",
    border: "border-cyan-500/40",
    text: "text-cyan-400",
    hoverBorder: "hover:border-cyan-400",
  },
  memory: {
    bg: "bg-amber-500/15",
    border: "border-amber-500/40",
    text: "text-amber-400",
    hoverBorder: "hover:border-amber-400 hover:shadow-[0_0_16px_rgba(251,191,36,0.2)]",
  },
  peripheral: {
    bg: "bg-emerald-500/15",
    border: "border-emerald-500/40",
    text: "text-emerald-400",
    hoverBorder: "hover:border-emerald-400 hover:shadow-[0_0_16px_rgba(52,211,153,0.2)]",
  },
  controller: {
    bg: "bg-violet-500/15",
    border: "border-violet-500/40",
    text: "text-violet-400",
    hoverBorder: "hover:border-violet-400 hover:shadow-[0_0_16px_rgba(167,139,250,0.2)]",
  },
  interface: {
    bg: "bg-rose-500/15",
    border: "border-rose-500/40",
    text: "text-rose-400",
    hoverBorder: "hover:border-rose-400 hover:shadow-[0_0_16px_rgba(251,113,133,0.2)]",
  },
};

const defaultStyle = {
  bg: "bg-muted",
  border: "border-border",
  text: "text-foreground",
  hoverBorder: "",
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

  const handleClick = (block: Block) => {
    setSelectedBlock((prev) => (prev?.name === block.name ? null : block));
  };

  const BlockNode = ({ block, className = "" }: { block: Block; className?: string }) => {
    const style = blockTypeStyles[block.type] || defaultStyle;
    const isSelected = selectedBlock?.name === block.name;

    return (
      <TooltipProvider key={block.name} delayDuration={200}>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => handleClick(block)}
              className={`
                flex flex-col items-center justify-center gap-1 rounded-xl border-2 
                ${style.bg} ${style.border} ${style.text}
                ${isSelected ? `${style.hoverBorder.replace(/hover:/g, "")} scale-[1.03]` : ""}
                cursor-pointer ${style.hoverBorder} hover:-translate-y-0.5
                transition-all duration-300 group min-w-0
                ${className}
              `}
            >
              <span className="shrink-0">{blockTypeIcon[block.type] || <Cpu className="h-4 w-4" />}</span>
              <span className="font-display font-semibold text-[10px] text-center leading-tight">{block.name}</span>
              <Info className="h-2.5 w-2.5 opacity-0 group-hover:opacity-60 transition-opacity" />
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
      <div className="w-0.5 h-4 bg-cyan-500/40" />
      <ArrowUpDown className="h-2.5 w-2.5 text-cyan-500/50" />
    </div>
  );

  // Pad connector — a dashed line from external block to padring edge
  const PadConnector = ({ direction }: { direction: "up" | "down" | "left" | "right" }) => {
    const isVertical = direction === "up" || direction === "down";
    return (
      <div className={`flex ${isVertical ? "flex-col" : "flex-row"} items-center`}>
        <div
          className={`${isVertical ? "w-px h-4" : "h-px w-4"} border-dashed ${isVertical ? "border-l" : "border-t"} border-orange-400/60`}
        />
        <div className="w-2 h-2 rounded-full bg-orange-400/30 border border-orange-400/60" />
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
          <div className="w-2.5 h-2.5 rounded-full bg-orange-400/20 border border-orange-400/60 ring-1 ring-orange-400/40" />
          <span className="text-xs text-muted-foreground">External I/O Pad</span>
        </div>
      </div>

      {/* ═══════════ HIERARCHY DIAGRAM ═══════════ */}
      <div className="min-w-[700px]">

        {/* ── Layer 1: PADRING (outermost) ── */}
        <div className="relative rounded-2xl border-[3px] border-dashed border-orange-400/40 bg-orange-400/[0.03] p-1">
          {/* Padring label */}
          <div className="absolute -top-3 left-4 px-2 bg-card/90">
            <span className="text-[11px] font-display font-bold text-orange-400 uppercase tracking-widest">
              {designName} Chip Pads
            </span>
          </div>

          {/* Pad dots along top edge */}
          <div className="flex justify-center gap-6 pt-1 pb-2">
            {externalBlocks.map((b) => (
              <div key={`pad-${b.name}`} className="flex flex-col items-center gap-0.5">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-sm bg-orange-400/25 border border-orange-400/50" />
                  <span className="text-[9px] text-orange-400/70 font-mono font-medium">{b.name.split(" ")[0]}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Dashed connectors from pads down to system */}
          <div className="flex justify-center gap-6 mb-0">
            {externalBlocks.map((b) => (
              <div key={`conn-${b.name}`} className="flex flex-col items-center">
                <PadConnector direction="down" />
              </div>
            ))}
          </div>

          {/* ── Layer 2: SYSTEM (middle) ── */}
          <div className="relative rounded-xl border-2 border-border/60 bg-card/60 mx-2 mb-2 p-4 pt-6">
            {/* System label */}
            <div className="absolute -top-3 left-4 px-2 bg-card/90">
              <span className="text-[11px] font-display font-bold text-muted-foreground uppercase tracking-widest">
                {designName} System
              </span>
            </div>

            {/* ── Layer 3: COMPONENTS (innermost) ── */}
            {/* Bus Masters */}
            <div className="flex justify-center gap-3 mb-1">
              {masters.map((b) => (
                <div key={b.name} className="flex flex-col items-center">
                  <BlockNode block={b} className="px-3 py-2 w-24 h-20" />
                  <BusStub />
                </div>
              ))}
            </div>

            {/* The Bus */}
            <div className="relative mx-2">
              <div className="w-full h-10 rounded-lg bg-gradient-to-r from-cyan-500/20 via-cyan-500/30 to-cyan-500/20 border-2 border-cyan-500/40 flex items-center justify-center">
                <span className="font-display font-bold text-xs text-cyan-400 tracking-wide">
                  {busName}
                </span>
              </div>
            </div>

            {/* Bus Slaves */}
            <div className="flex justify-center gap-2 mt-1">
              {slaves.map((b) => (
                <div key={b.name} className="flex flex-col items-center">
                  <BusStub />
                  <div className="relative">
                    <BlockNode block={b} className="px-2 py-2 w-[5.5rem] h-[4.5rem]" />
                    {/* Show padring connection indicator on external blocks */}
                    {b.external && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-orange-400/30 border border-orange-400/60 flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-orange-400/70" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Masters with external indicator */}
            {masters.some((b) => b.external) && (
              <div className="absolute top-6 right-3">
                {masters.filter((b) => b.external).map((b) => (
                  <div key={`ext-${b.name}`} className="flex items-center gap-1 text-[9px] text-orange-400/70">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-400/70" />
                    <span>{b.name} → pad</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pad dots along bottom edge */}
          <div className="flex justify-center gap-8 pt-1 pb-1">
            {[...Array(Math.max(4, externalBlocks.length))].map((_, i) => (
              <div key={`bpad-${i}`} className="w-2.5 h-2.5 rounded-sm bg-orange-400/15 border border-orange-400/30" />
            ))}
          </div>
        </div>

        {/* Hierarchy labels */}
        <div className="flex items-center justify-center gap-6 mt-5 pt-3 border-t border-border/40">
          <div className="flex items-center gap-2">
            <div className="w-4 h-2 rounded-sm border-2 border-dashed border-orange-400/50" />
            <span className="text-[10px] text-muted-foreground font-display font-semibold">Chip Pads</span>
          </div>
          <span className="text-muted-foreground/30">→</span>
          <div className="flex items-center gap-2">
            <div className="w-4 h-2 rounded-sm border-2 border-border/60" />
            <span className="text-[10px] text-muted-foreground font-display font-semibold">SoC System</span>
          </div>
          <span className="text-muted-foreground/30">→</span>
          <div className="flex items-center gap-2">
            <div className="w-4 h-2 rounded-sm border-2 border-primary/40 bg-primary/10" />
            <span className="text-[10px] text-muted-foreground font-display font-semibold">IP Components</span>
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
                            <ExternalLinkIcon className="h-2.5 w-2.5" /> External Interface → Padring
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
                {selectedBlock.info && (
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                    {selectedBlock.info}
                  </p>
                )}

                {/* Gate count & config options */}
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
                      <span className="text-xs text-orange-400 font-medium">Connected to chip padring</span>
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

                {/* Learn More link */}
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
