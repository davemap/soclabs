import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type DesignFlow = "ASIC" | "FPGA";

interface DesignFlowContextType {
  flow: DesignFlow;
  setFlow: (flow: DesignFlow) => void;
}

const DesignFlowContext = createContext<DesignFlowContextType>({
  flow: "ASIC",
  setFlow: () => {},
});

export function DesignFlowProvider({ children }: { children: ReactNode }) {
  const [flow, setFlowState] = useState<DesignFlow>(() => {
    const stored = localStorage.getItem("learning-design-flow");
    return stored === "FPGA" ? "FPGA" : "ASIC";
  });

  const setFlow = (f: DesignFlow) => {
    setFlowState(f);
    localStorage.setItem("learning-design-flow", f);
  };

  return (
    <DesignFlowContext.Provider value={{ flow, setFlow }}>
      {children}
    </DesignFlowContext.Provider>
  );
}

export function useDesignFlow() {
  return useContext(DesignFlowContext);
}

/** Phase IDs that are ASIC-only (skipped in FPGA flow) */
export const asicOnlyPhases = new Set(["physical-design", "tapeout"]);

/** Filter learning phases based on design flow */
export function filterPhasesForFlow<T extends { id: string }>(phases: T[], flow: DesignFlow): T[] {
  if (flow === "ASIC") return phases;
  return phases.filter((p) => !asicOnlyPhases.has(p.id));
}
