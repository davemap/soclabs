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
  processor: <Cpu className="h-6 w-6" />,
  interconnect: <Layers className="h-6 w-6" />,
  memory: <MemoryStick className="h-6 w-6" />,
  peripheral: <Radio className="h-6 w-6" />,
  controller: <Cpu className="h-6 w-6" />,
  interface: <Plug className="h-6 w-6" />,
};

const typeColors: Record<string, { bg: string; border: string; text: string }> = {
  processor: { bg: "bg-blue-50 dark:bg-blue-500/10", border: "border-blue-200 dark:border-blue-500/30", text: "text-blue-600 dark:text-blue-400" },
  controller: { bg: "bg-violet-50 dark:bg-violet-500/10", border: "border-violet-200 dark:border-violet-500/30", text: "text-violet-600 dark:text-violet-400" },
  interconnect: { bg: "bg-indigo-50 dark:bg-indigo-500/10", border: "border-indigo-200 dark:border-indigo-500/30", text: "text-indigo-600 dark:text-indigo-400" },
  memory: { bg: "bg-emerald-50 dark:bg-emerald-500/10", border: "border-emerald-200 dark:border-emerald-500/30", text: "text-emerald-600 dark:text-emerald-400" },
  peripheral: { bg: "bg-amber-50 dark:bg-amber-500/10", border: "border-amber-200 dark:border-amber-500/30", text: "text-amber-600 dark:text-amber-400" },
  interface: { bg: "bg-rose-50 dark:bg-rose-500/10", border: "border-rose-200 dark:border-rose-500/30", text: "text-rose-600 dark:text-rose-400" },
};

const defaultColor = { bg: "bg-muted", border: "border-border", text: "text-foreground" };

const InteractiveArchitectureDiagram = ({ blocks, designName }: InteractiveArchitectureDiagramProps) => {
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null);

  const processors = blocks.filter((b) => b.type === "processor");
  const controllers = blocks.filter((b) => b.type === "controller");
  const interconnects = blocks.filter((b) => b.type === "interconnect");
  const memories = blocks.filter((b) => b.type === "memory");
  const peripherals = blocks.filter((b) => b.type === "peripheral");
  const interfaces = blocks.filter((b) => b.type === "interface");

  const masters = [...processors, ...controllers];
  const expansionBlocks = interfaces.filter((b) => b.name.toLowerCase().includes("expansion"));
  const regularSlaves = [...memories, ...peripherals, ...interfaces.filter((b) => !b.name.toLowerCase().includes("expansion"))];
  const busName = interconnects[0]?.name || "System Bus";

  const handleClick = (block: Block) => {
    setSelectedBlock((prev) => (prev?.name === block.name ? null : block));
  };

  const BusArrow = () => (
    <div className="flex flex-col items-center py-1">
      <svg width="16" height="28" viewBox="0 0 16 28" className="text-indigo-300 dark:text-indigo-500/60">
        <line x1="8" y1="0" x2="8" y2="28" stroke="currentColor" strokeWidth="2" />
        <polygon points="4,6 8,0 12,6" fill="currentColor" />
        <polygon points="4,22 8,28 12,22" fill="currentColor" />
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
          flex flex-col items-center justify-center gap-1.5 rounded-xl border-2
          bg-white dark:bg-card ${c.border} ${c.text}
          ${isSelected ? "ring-2 ring-offset-2 ring-current shadow-lg scale-[1.03]" : "shadow-sm"}
          cursor-pointer hover:scale-[1.02] hover:shadow-md
          transition-all duration-200 ${className}
        `}
      >
        <span className="shrink-0">{blockTypeIcon[block.type] || <Cpu className="h-6 w-6" />}</span>
        <span className="font-display font-bold text-xs text-center leading-tight px-1">{block.name}</span>
      </button>
    );
  };

  return (
    <div className="rounded-2xl border border-border/60 bg-white dark:bg-card p-5 md:p-8">
      {/* Legend */}
      <div className="flex flex-wrap gap-4 mb-6 pb-4 border-b border-border/30">
        {Object.entries(typeColors).map(([type, c]) => {
          if (!blocks.some((b) => b.type === type)) return null;
          return (
            <div key={type} className="flex items-center gap-2">
              <div className={`w-3.5 h-3.5 rounded ${c.bg} border-2 ${c.border}`} />
              <span className="text-sm text-muted-foreground capitalize">{type}</span>
            </div>
          );
        })}
      </div>

      {/* Block diagram */}
      <div className="max-w-[750px] mx-auto py-4">

        {/* Masters row */}
        <div className="flex justify-center gap-5 mb-1">
          {masters.map((b) => (
            <div key={b.name} className="flex flex-col items-center">
              <BlockNode block={b} className="w-32 h-24 px-3" />
              <BusArrow />
            </div>
          ))}
        </div>

        {/* Bus bar */}
        <button
          onClick={() => { const bus = interconnects[0]; if (bus) handleClick(bus); }}
          className={`
            w-full h-10 rounded-lg border-2 flex items-center justify-center
            bg-white dark:bg-card ${typeColors.interconnect.border} ${typeColors.interconnect.text}
            ${selectedBlock?.name === busName ? "ring-2 ring-current shadow-lg" : "shadow-sm"}
            cursor-pointer hover:shadow-md transition-all duration-200
          `}
        >
          <Layers className="h-4 w-4 mr-2" />
          <span className="font-display font-bold text-sm tracking-wide">{busName}</span>
        </button>

        {/* Slaves row */}
        <div className="flex justify-center gap-4 mt-1 flex-wrap">
          {regularSlaves.map((b) => (
            <div key={b.name} className="flex flex-col items-center">
              <BusArrow />
              <BlockNode block={b} className="w-28 h-20 px-2" />
            </div>
          ))}

          {/* Expansion Region — dashed, distinct from regular slaves */}
          {expansionBlocks.map((b) => {
            const c = typeColors[b.type] || defaultColor;
            const isSelected = selectedBlock?.name === b.name;
            return (
              <div key={b.name} className="flex flex-col items-center">
                <BusArrow />
                <button
                  onClick={() => handleClick(b)}
                  className={`
                    flex flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed
                    bg-white dark:bg-card ${c.border} ${c.text}
                    ${isSelected ? "ring-2 ring-offset-2 ring-current shadow-lg scale-[1.03]" : "shadow-sm"}
                    cursor-pointer hover:scale-[1.02] hover:shadow-md
                    transition-all duration-200 w-28 h-20 px-2
                  `}
                >
                  <Plug className="h-6 w-6" />
                  <span className="font-display font-bold text-xs text-center leading-tight">{b.name}</span>
                </button>
              </div>
            );
          })}
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
            <div className="mt-6 pt-5 border-t border-border/30">
              <div className={`rounded-xl border-2 p-5 ${(typeColors[selectedBlock.type] || defaultColor).bg} ${(typeColors[selectedBlock.type] || defaultColor).border}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`p-2.5 rounded-lg ${(typeColors[selectedBlock.type] || defaultColor).bg} ${(typeColors[selectedBlock.type] || defaultColor).text}`}>
                      {blockTypeIcon[selectedBlock.type] || <Cpu className="h-6 w-6" />}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-display font-bold text-base">{selectedBlock.name}</h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`text-sm font-medium capitalize ${(typeColors[selectedBlock.type] || defaultColor).text}`}>
                          {selectedBlock.type}
                        </span>
                        {selectedBlock.external && (
                          <span className="text-xs text-muted-foreground font-medium flex items-center gap-0.5">
                            <ExternalLinkIcon className="h-3 w-3" /> External I/O
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button onClick={() => setSelectedBlock(null)} className="p-1.5 rounded-lg hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors shrink-0">
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {selectedBlock.info && (
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{selectedBlock.info}</p>
                )}

                <div className="mt-4 flex flex-wrap gap-4">
                  {selectedBlock.gateCount && (
                    <div className="flex items-center gap-2">
                      <Microchip className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Gate count:</span>
                      <Badge variant="secondary" className="text-sm font-mono">{selectedBlock.gateCount}</Badge>
                    </div>
                  )}
                </div>

                {selectedBlock.configOptions && selectedBlock.configOptions.length > 0 && (
                  <div className="mt-3">
                    <div className="flex items-center gap-1.5 mb-2">
                      <Settings2 className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-semibold text-muted-foreground">Configuration Options</span>
                    </div>
                    <div className="space-y-1.5">
                      {selectedBlock.configOptions.map((opt, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="mt-1 shrink-0 w-1.5 h-1.5 rounded-full bg-muted-foreground/40" />
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
