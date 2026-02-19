import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Cpu, MemoryStick, Radio, Layers, Plug, ArrowDown, ArrowRight as ArrowRightIcon } from "lucide-react";
import { technologies } from "@/data/mockData";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface Block {
  name: string;
  type: string;
}

interface InteractiveArchitectureDiagramProps {
  blocks: Block[];
  designName: string;
}

const blockTypeIcon: Record<string, React.ReactNode> = {
  processor: <Cpu className="h-5 w-5" />,
  interconnect: <Layers className="h-5 w-5" />,
  memory: <MemoryStick className="h-5 w-5" />,
  peripheral: <Radio className="h-5 w-5" />,
  controller: <Cpu className="h-5 w-5" />,
  interface: <Plug className="h-5 w-5" />,
};

const blockTypeStyles: Record<string, { bg: string; border: string; text: string; hoverBorder: string; glow: string }> = {
  processor: {
    bg: "bg-primary/10",
    border: "border-primary/30",
    text: "text-primary",
    hoverBorder: "hover:border-primary",
    glow: "hover:shadow-[0_0_20px_hsl(var(--primary)/0.15)]",
  },
  interconnect: {
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/30",
    text: "text-cyan-400",
    hoverBorder: "hover:border-cyan-400",
    glow: "hover:shadow-[0_0_20px_rgba(34,211,238,0.15)]",
  },
  memory: {
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    text: "text-amber-400",
    hoverBorder: "hover:border-amber-400",
    glow: "hover:shadow-[0_0_20px_rgba(251,191,36,0.15)]",
  },
  peripheral: {
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    text: "text-emerald-400",
    hoverBorder: "hover:border-emerald-400",
    glow: "hover:shadow-[0_0_20px_rgba(52,211,153,0.15)]",
  },
  controller: {
    bg: "bg-violet-500/10",
    border: "border-violet-500/30",
    text: "text-violet-400",
    hoverBorder: "hover:border-violet-400",
    glow: "hover:shadow-[0_0_20px_rgba(167,139,250,0.15)]",
  },
  interface: {
    bg: "bg-rose-500/10",
    border: "border-rose-500/30",
    text: "text-rose-400",
    hoverBorder: "hover:border-rose-400",
    glow: "hover:shadow-[0_0_20px_rgba(251,113,133,0.15)]",
  },
};

const defaultStyle = {
  bg: "bg-muted",
  border: "border-border",
  text: "text-foreground",
  hoverBorder: "hover:border-foreground/50",
  glow: "",
};

// Map block names to technology page IDs
const blockToTechId: Record<string, string> = {
  "ARM Cortex-M0": "arm-cortex-m0",
  "ARM Cortex-M3": "arm-cortex-m3",
  "ARM Cortex-A53": "arm-cortex-m3", // closest match
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
};

const InteractiveArchitectureDiagram = ({ blocks, designName }: InteractiveArchitectureDiagramProps) => {
  const navigate = useNavigate();
  const [hoveredBlock, setHoveredBlock] = useState<string | null>(null);

  const processors = blocks.filter((b) => b.type === "processor");
  const interconnects = blocks.filter((b) => b.type === "interconnect");
  const controllers = blocks.filter((b) => b.type === "controller");
  const memories = blocks.filter((b) => b.type === "memory");
  const peripherals = blocks.filter((b) => b.type === "peripheral");
  const interfaces = blocks.filter((b) => b.type === "interface");

  const handleClick = (block: Block) => {
    const techId = blockToTechId[block.name];
    if (techId) {
      navigate(`/technologies/${techId}`);
    }
  };

  const renderBlock = (block: Block, size: "lg" | "md" | "sm" = "md") => {
    const style = blockTypeStyles[block.type] || defaultStyle;
    const techId = blockToTechId[block.name];
    const tech = techId ? technologies.find((t) => t.id === techId) : null;
    const isClickable = !!techId;
    const isHovered = hoveredBlock === block.name;

    const sizeClasses = {
      lg: "px-6 py-4",
      md: "px-4 py-3",
      sm: "px-3 py-2.5",
    };

    return (
      <TooltipProvider key={block.name} delayDuration={200}>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => isClickable && handleClick(block)}
              onMouseEnter={() => setHoveredBlock(block.name)}
              onMouseLeave={() => setHoveredBlock(null)}
              className={`
                relative flex items-center gap-2.5 ${sizeClasses[size]} rounded-xl border-2 
                ${style.bg} ${style.border} ${style.text}
                ${isClickable ? `cursor-pointer ${style.hoverBorder} ${style.glow} hover:-translate-y-0.5` : "cursor-default"}
                transition-all duration-300 group
              `}
            >
              <span className="shrink-0">{blockTypeIcon[block.type] || <Cpu className="h-5 w-5" />}</span>
              <span className={`font-display font-semibold ${size === "sm" ? "text-xs" : "text-sm"}`}>
                {block.name}
              </span>
              {isClickable && (
                <ArrowRightIcon className={`h-3.5 w-3.5 ml-auto opacity-0 group-hover:opacity-100 transition-opacity shrink-0`} />
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

  const ConnectionLine = ({ className = "" }: { className?: string }) => (
    <div className={`flex justify-center ${className}`}>
      <div className="flex flex-col items-center">
        <div className="w-0.5 h-4 bg-border/60" />
        <ArrowDown className="h-3 w-3 text-muted-foreground/40 -mt-0.5" />
      </div>
    </div>
  );

  return (
    <div className="rounded-2xl border border-border/60 bg-card/50 p-6 md:p-8">
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
      </div>

      {/* Processor Layer */}
      <div className="flex justify-center gap-4 flex-wrap">
        {processors.map((b) => renderBlock(b, "lg"))}
      </div>

      <ConnectionLine />

      {/* Interconnect Layer */}
      <div className="flex justify-center">
        <div className="w-full max-w-lg">
          {interconnects.map((b) => (
            <div key={b.name} className="w-full">
              {renderBlock({ ...b }, "md")}
            </div>
          ))}
        </div>
      </div>

      <ConnectionLine />

      {/* Controllers */}
      {controllers.length > 0 && (
        <>
          <div className="flex justify-center gap-3 flex-wrap">
            {controllers.map((b) => renderBlock(b, "md"))}
          </div>
          <ConnectionLine />
        </>
      )}

      {/* Memory + Peripherals Layer */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Memory */}
        <div>
          <p className="text-xs font-display font-semibold text-muted-foreground uppercase tracking-wider mb-3 text-center">
            Memory
          </p>
          <div className="flex flex-col gap-2">
            {memories.map((b) => renderBlock(b, "sm"))}
          </div>
        </div>

        {/* Peripherals */}
        <div>
          <p className="text-xs font-display font-semibold text-muted-foreground uppercase tracking-wider mb-3 text-center">
            Peripherals
          </p>
          <div className="grid grid-cols-2 gap-2">
            {peripherals.map((b) => renderBlock(b, "sm"))}
          </div>
        </div>
      </div>

      {/* Interfaces */}
      {interfaces.length > 0 && (
        <>
          <ConnectionLine className="mt-4" />
          <div>
            <p className="text-xs font-display font-semibold text-muted-foreground uppercase tracking-wider mb-3 text-center">
              External Interfaces
            </p>
            <div className="flex justify-center gap-3 flex-wrap">
              {interfaces.map((b) => renderBlock(b, "md"))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default InteractiveArchitectureDiagram;
