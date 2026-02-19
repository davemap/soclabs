import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronDown, FileCode2, FolderOpen, Folder, Info, ExternalLink } from "lucide-react";
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

const languageColors: Record<string, string> = {
  verilog: "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-400",
  systemverilog: "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-400",
  vhdl: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400",
  c: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",
  assembly: "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-400",
  constraint: "bg-slate-100 text-slate-600 dark:bg-slate-500/15 dark:text-slate-400",
  config: "bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-400",
};

const HierarchyNodeItem = ({ node, depth = 0 }: { node: HierarchyNode; depth?: number }) => {
  const [expanded, setExpanded] = useState(depth < 1);
  const [showInfo, setShowInfo] = useState(false);
  const hasChildren = node.children && node.children.length > 0;
  const isGroup = node.type === "group" || node.type === "package";

  return (
    <div className="select-none">
      <div
        className={`
          flex items-center gap-2 py-1.5 px-2 rounded-lg cursor-pointer
          hover:bg-muted/60 transition-colors duration-150
          ${showInfo ? "bg-muted/40" : ""}
          ${node.userDesigned ? "border border-dashed border-rose-300 dark:border-rose-500/40 bg-rose-50/30 dark:bg-rose-500/5" : ""}
        `}
        style={{ paddingLeft: `${depth * 20 + 8}px` }}
        onClick={() => {
          if (hasChildren) setExpanded((e) => !e);
          else setShowInfo((s) => !s);
        }}
      >
        {/* Expand/collapse icon */}
        {hasChildren ? (
          <button
            onClick={(e) => { e.stopPropagation(); setExpanded((prev) => !prev); }}
            className="shrink-0 p-0.5 rounded hover:bg-muted"
          >
            {expanded ? <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" /> : <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />}
          </button>
        ) : (
          <span className="w-[18px] shrink-0" />
        )}

        {/* Icon */}
        {isGroup ? (
          expanded ? <FolderOpen className="h-4 w-4 text-amber-500 shrink-0" /> : <Folder className="h-4 w-4 text-amber-500 shrink-0" />
        ) : (
          <FileCode2 className="h-4 w-4 text-muted-foreground shrink-0" />
        )}

        {/* Name */}
        <span className={`text-sm font-mono leading-tight ${isGroup ? "font-semibold text-foreground" : "text-foreground/80"}`}>
          {node.name}
        </span>

        {/* User IP badge */}
        {node.userDesigned && (
          <span className="bg-rose-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full leading-none whitespace-nowrap tracking-wide">
            USER IP
          </span>
        )}

        {/* Language badge */}
        {node.language && (
          <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full leading-none ${languageColors[node.language] || "bg-muted text-muted-foreground"}`}>
            {node.language}
          </span>
        )}

        {/* Info toggle */}
        {node.description && (
          <button
            onClick={(e) => { e.stopPropagation(); setShowInfo((s) => !s); }}
            className="ml-auto shrink-0 p-0.5 rounded hover:bg-muted"
          >
            <Info className={`h-3.5 w-3.5 ${showInfo ? "text-primary" : "text-muted-foreground/50"}`} />
          </button>
        )}
      </div>

      {/* Info panel */}
      <AnimatePresence>
        {showInfo && node.description && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.15 }}
            className="overflow-hidden"
          >
            <div
              className="text-xs text-muted-foreground bg-muted/30 border border-border/40 rounded-lg p-3 mb-1 mx-2"
              style={{ marginLeft: `${depth * 20 + 28}px` }}
            >
              <p>{node.description}</p>
              {node.techId && (
                <Link
                  to={`/technologies/${node.techId}`}
                  className="inline-flex items-center gap-1 mt-2 text-primary hover:underline text-xs font-medium"
                >
                  Learn more <ExternalLink className="h-3 w-3" />
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Children */}
      <AnimatePresence>
        {expanded && hasChildren && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.15 }}
            className="overflow-hidden"
          >
            {node.children!.map((child) => (
              <HierarchyNodeItem key={child.name} node={child} depth={depth + 1} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const InteractiveHierarchyDiagram = ({ hierarchy, designName }: InteractiveHierarchyDiagramProps) => {
  return (
    <div className="rounded-2xl border border-border/60 bg-white dark:bg-card p-5 md:p-8">
      <div className="font-mono text-xs text-muted-foreground mb-4 pb-3 border-b border-border/30">
        {designName}/
      </div>
      <div className="space-y-0.5">
        {hierarchy.map((node) => (
          <HierarchyNodeItem key={node.name} node={node} depth={0} />
        ))}
      </div>
    </div>
  );
};

export default InteractiveHierarchyDiagram;
