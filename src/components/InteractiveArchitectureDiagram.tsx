import { useState } from "react";
import { Cpu, MemoryStick, Radio, Layers, Plug, ArrowUpDown, ExternalLink as ExternalLinkIcon, X, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { motion, AnimatePresence } from "framer-motion";

interface Block {
  name: string;
  type: string;
  external?: boolean;
  info?: string;
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
                ${block.external ? "ring-2 ring-orange-400/40 ring-offset-1 ring-offset-transparent" : ""}
                ${isSelected ? `${style.hoverBorder.replace("hover:", "")} scale-[1.03]` : ""}
                cursor-pointer ${style.hoverBorder} hover:-translate-y-0.5
                transition-all duration-300 group min-w-0
                ${className}
              `}
            >
              <span className="shrink-0">{blockTypeIcon[block.type] || <Cpu className="h-4 w-4" />}</span>
              <span className="font-display font-semibold text-xs text-center leading-tight">{block.name}</span>
              {block.external && (
                <span className="flex items-center gap-0.5 text-[10px] text-orange-400 font-medium">
                  <ExternalLinkIcon className="h-2.5 w-2.5" /> External
                </span>
              )}
              <Info className="h-3 w-3 opacity-0 group-hover:opacity-60 transition-opacity" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-[180px]">
            <p className="text-xs">Click for details on <span className="font-semibold">{block.name}</span></p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  const BusStub = ({ direction }: { direction: "up" | "down" }) => (
    <div className="flex flex-col items-center">
      <div className={`w-0.5 h-5 bg-cyan-500/40`} />
      <ArrowUpDown className="h-3 w-3 text-cyan-500/50" />
    </div>
  );

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
        {blocks.some((b) => b.external) && (
          <div className="flex items-center gap-1.5 ml-2 pl-2 border-l border-border/40">
            <div className="w-2.5 h-2.5 rounded-full bg-orange-400/20 border border-orange-400/60 ring-1 ring-orange-400/40" />
            <span className="text-xs text-muted-foreground">External I/O</span>
          </div>
        )}
      </div>

      <div className="min-w-[600px]">
        {/* Bus Masters */}
        <div className="flex justify-center gap-3 mb-1 px-4">
          {masters.map((b) => (
            <div key={b.name} className="flex flex-col items-center">
              <BlockNode block={b} className="px-4 py-3 w-28 h-24" />
              <BusStub direction="down" />
            </div>
          ))}
        </div>

        {/* The Bus */}
        <div className="relative mx-4">
          <div className="w-full h-12 rounded-lg bg-gradient-to-r from-cyan-500/20 via-cyan-500/30 to-cyan-500/20 border-2 border-cyan-500/40 flex items-center justify-center">
            <span className="font-display font-bold text-sm text-cyan-400 tracking-wide">
              {busName}
            </span>
          </div>
        </div>

        {/* Bus Slaves */}
        <div className="flex justify-center gap-3 mt-1 px-4">
          {slaves.map((b) => (
            <div key={b.name} className="flex flex-col items-center">
              <BusStub direction="up" />
              <BlockNode block={b} className="px-3 py-2.5 w-24 h-[5.5rem]" />
            </div>
          ))}
        </div>
      </div>

      {/* SoC label */}
      <div className="mt-6 pt-4 border-t border-border/40 text-center">
        <span className="text-xs font-display font-semibold text-muted-foreground uppercase tracking-widest">
          {designName} System
        </span>
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
                            <ExternalLinkIcon className="h-2.5 w-2.5" /> External Interface
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
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InteractiveArchitectureDiagram;
