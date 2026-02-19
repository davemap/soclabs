import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Cpu, MemoryStick, Radio, Layers, Plug, ArrowRight as ArrowRightIcon, ArrowUpDown, Bug, ExternalLink as ExternalLinkIcon } from "lucide-react";
import { technologies } from "@/data/mockData";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface Block {
  name: string;
  type: string;
  external?: boolean;
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

// Map block names to technology page IDs
const blockToTechId: Record<string, string> = {
  "ARM Cortex-M0": "arm-cortex-m0",
  "ARM Cortex-M3": "arm-cortex-m3",
  "ARM Cortex-A53": "arm-cortex-m3",
  "AHB-Lite Bus": "amba-interconnect",
  "AHB Bus Matrix": "amba-interconnect",
  "GPIO": "standard-peripherals",
  "UART": "standard-peripherals",
  "SPI": "standard-peripherals",
  "I2C": "standard-peripherals",
  "Timer": "standard-peripherals",
  "Watchdog": "standard-peripherals",
  "RTC": "standard-peripherals",
  "SRAM (32 KB)": "memory-controllers",
  "SRAM (128 KB)": "memory-controllers",
  "Flash (256 KB)": "memory-controllers",
  "DMA Controller": "amba-interconnect",
  "Extension Port": "hw-acceleration",
  "Accelerator Slot": "hw-acceleration",
  "Debug Controller": "standard-peripherals",
};

const InteractiveArchitectureDiagram = ({ blocks, designName }: InteractiveArchitectureDiagramProps) => {
  const navigate = useNavigate();
  const [hoveredBlock, setHoveredBlock] = useState<string | null>(null);

  // Separate blocks into bus masters (above bus), the bus itself, and bus slaves (below bus)
  const processors = blocks.filter((b) => b.type === "processor");
  const controllers = blocks.filter((b) => b.type === "controller");
  const interconnects = blocks.filter((b) => b.type === "interconnect");
  const memories = blocks.filter((b) => b.type === "memory");
  const peripherals = blocks.filter((b) => b.type === "peripheral");
  const interfaces = blocks.filter((b) => b.type === "interface");

  const masters = [...processors, ...controllers];
  const slaves = [...memories, ...peripherals, ...interfaces];

  const handleClick = (block: Block) => {
    const techId = blockToTechId[block.name];
    if (techId) navigate(`/technologies/${techId}`);
  };

  const BlockNode = ({ block, className = "" }: { block: Block; className?: string }) => {
    const style = blockTypeStyles[block.type] || defaultStyle;
    const techId = blockToTechId[block.name];
    const tech = techId ? technologies.find((t) => t.id === techId) : null;
    const isClickable = !!techId;

    return (
      <TooltipProvider key={block.name} delayDuration={200}>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => isClickable && handleClick(block)}
              onMouseEnter={() => setHoveredBlock(block.name)}
              onMouseLeave={() => setHoveredBlock(null)}
              className={`
                flex flex-col items-center justify-center gap-1.5 rounded-xl border-2 
                ${style.bg} ${style.border} ${style.text}
                ${block.external ? "ring-2 ring-orange-400/40 ring-offset-1 ring-offset-transparent" : ""}
                ${isClickable ? `cursor-pointer ${style.hoverBorder} hover:-translate-y-0.5` : "cursor-default"}
                transition-all duration-300 group min-w-0
                ${className}
              `}
            >
              <span className="shrink-0">{blockTypeIcon[block.type] || <Cpu className="h-4 w-4" />}</span>
              <span className="font-display font-semibold text-xs text-center leading-tight">{block.name}</span>
              {block.external && (
                <span className="flex items-center gap-0.5 text-[10px] text-orange-400 font-medium mt-0.5">
                  <ExternalLinkIcon className="h-2.5 w-2.5" /> External
                </span>
              )}
              {isClickable && (
                <ArrowRightIcon className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              )}
            </button>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="max-w-xs">
            {tech ? (
              <div>
                <p className="font-semibold text-sm">{tech.name}</p>
                <p className="text-xs text-muted-foreground mt-1">{tech.description}</p>
                <p className="text-xs text-primary mt-1.5">Click to view details →</p>
              </div>
            ) : (
              <p className="text-sm">{block.name} ({block.type})</p>
            )}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  // Vertical connector stub
  const BusStub = ({ direction }: { direction: "up" | "down" }) => (
    <div className="flex flex-col items-center">
      <div className={`w-0.5 ${direction === "up" ? "h-5" : "h-5"} bg-cyan-500/40`} />
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
        {/* ── Bus Masters (above bus) ── */}
        <div className="flex justify-center gap-3 mb-1 px-4">
          {masters.map((b) => (
            <div key={b.name} className="flex flex-col items-center">
              <BlockNode block={b} className="px-4 py-3 w-28 h-24" />
              <BusStub direction="down" />
            </div>
          ))}
        </div>

        {/* ── The Bus ── */}
        <div className="relative mx-4">
          <div className="w-full h-12 rounded-lg bg-gradient-to-r from-cyan-500/20 via-cyan-500/30 to-cyan-500/20 border-2 border-cyan-500/40 flex items-center justify-center">
            <span className="font-display font-bold text-sm text-cyan-400 tracking-wide">
              {busName}
            </span>
          </div>
        </div>

        {/* ── Bus Slaves (below bus) ── */}
        <div className="flex justify-center gap-3 mt-1 px-4">
          {slaves.map((b) => (
            <div key={b.name} className="flex flex-col items-center">
              <BusStub direction="up" />
              <BlockNode block={b} className="px-3 py-2.5 w-24 h-22" />
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
    </div>
  );
};

export default InteractiveArchitectureDiagram;
