/**
 * Maps learning topic IDs to projects that have completed that design task,
 * along with their individual effort and uncertainty ratings.
 */
export interface ProjectTopicRating {
  projectId: string;
  projectTitle: string;
  effort: number;
  uncertainty: number;
}

export const projectTopicRatings: Record<string, ProjectTopicRating[]> = {
  // Architecture phase
  "requirements": [
    { projectId: "ml-accelerator", projectTitle: "Neural Network Inference Accelerator", effort: 2, uncertainty: 2 },
    { projectId: "crypto-engine", projectTitle: "Lightweight Cryptographic Engine", effort: 3, uncertainty: 1 },
    { projectId: "riscv-coprocessor", projectTitle: "RISC-V Co-processor Integration", effort: 3, uncertainty: 3 },
  ],
  "block-diagram": [
    { projectId: "ml-accelerator", projectTitle: "Neural Network Inference Accelerator", effort: 3, uncertainty: 2 },
    { projectId: "crypto-engine", projectTitle: "Lightweight Cryptographic Engine", effort: 3, uncertainty: 2 },
    { projectId: "dsp-filter", projectTitle: "Configurable DSP Filter Bank", effort: 4, uncertainty: 3 },
  ],
  "interface-selection": [
    { projectId: "ml-accelerator", projectTitle: "Neural Network Inference Accelerator", effort: 3, uncertainty: 3 },
    { projectId: "crypto-engine", projectTitle: "Lightweight Cryptographic Engine", effort: 4, uncertainty: 2 },
    { projectId: "riscv-coprocessor", projectTitle: "RISC-V Co-processor Integration", effort: 5, uncertainty: 4 },
  ],
  "memory-map": [
    { projectId: "ml-accelerator", projectTitle: "Neural Network Inference Accelerator", effort: 2, uncertainty: 1 },
    { projectId: "crypto-engine", projectTitle: "Lightweight Cryptographic Engine", effort: 3, uncertainty: 2 },
  ],
  "power-clocking": [
    { projectId: "crypto-engine", projectTitle: "Lightweight Cryptographic Engine", effort: 4, uncertainty: 3 },
    { projectId: "power-management", projectTitle: "Adaptive Power Management Unit", effort: 5, uncertainty: 4 },
  ],

  // RTL phase
  "coding-style": [
    { projectId: "ml-accelerator", projectTitle: "Neural Network Inference Accelerator", effort: 1, uncertainty: 1 },
    { projectId: "crypto-engine", projectTitle: "Lightweight Cryptographic Engine", effort: 2, uncertainty: 1 },
    { projectId: "dsp-filter", projectTitle: "Configurable DSP Filter Bank", effort: 2, uncertainty: 1 },
    { projectId: "riscv-coprocessor", projectTitle: "RISC-V Co-processor Integration", effort: 3, uncertainty: 1 },
  ],
  "fsm-design": [
    { projectId: "ml-accelerator", projectTitle: "Neural Network Inference Accelerator", effort: 3, uncertainty: 2 },
    { projectId: "crypto-engine", projectTitle: "Lightweight Cryptographic Engine", effort: 4, uncertainty: 2 },
    { projectId: "dsp-filter", projectTitle: "Configurable DSP Filter Bank", effort: 3, uncertainty: 3 },
  ],
  "interface-protocols": [
    { projectId: "ml-accelerator", projectTitle: "Neural Network Inference Accelerator", effort: 4, uncertainty: 3 },
    { projectId: "crypto-engine", projectTitle: "Lightweight Cryptographic Engine", effort: 5, uncertainty: 2 },
    { projectId: "riscv-coprocessor", projectTitle: "RISC-V Co-processor Integration", effort: 5, uncertainty: 4 },
  ],
  "parameterisation": [
    { projectId: "dsp-filter", projectTitle: "Configurable DSP Filter Bank", effort: 4, uncertainty: 2 },
    { projectId: "ml-accelerator", projectTitle: "Neural Network Inference Accelerator", effort: 2, uncertainty: 2 },
    { projectId: "crypto-engine", projectTitle: "Lightweight Cryptographic Engine", effort: 3, uncertainty: 1 },
  ],
  "dft-insertion": [
    { projectId: "crypto-engine", projectTitle: "Lightweight Cryptographic Engine", effort: 4, uncertainty: 3 },
    { projectId: "power-management", projectTitle: "Adaptive Power Management Unit", effort: 5, uncertainty: 4 },
  ],

  // Verification phase
  "testbench-architecture": [
    { projectId: "ml-accelerator", projectTitle: "Neural Network Inference Accelerator", effort: 4, uncertainty: 2 },
    { projectId: "crypto-engine", projectTitle: "Lightweight Cryptographic Engine", effort: 5, uncertainty: 3 },
    { projectId: "dsp-filter", projectTitle: "Configurable DSP Filter Bank", effort: 3, uncertainty: 3 },
  ],
  "constrained-random": [
    { projectId: "crypto-engine", projectTitle: "Lightweight Cryptographic Engine", effort: 4, uncertainty: 4 },
    { projectId: "ml-accelerator", projectTitle: "Neural Network Inference Accelerator", effort: 3, uncertainty: 5 },
  ],
  "functional-coverage": [
    { projectId: "crypto-engine", projectTitle: "Lightweight Cryptographic Engine", effort: 3, uncertainty: 2 },
    { projectId: "ml-accelerator", projectTitle: "Neural Network Inference Accelerator", effort: 3, uncertainty: 4 },
  ],
  "formal-verification": [
    { projectId: "crypto-engine", projectTitle: "Lightweight Cryptographic Engine", effort: 5, uncertainty: 2 },
  ],
  "regression-ci": [
    { projectId: "ml-accelerator", projectTitle: "Neural Network Inference Accelerator", effort: 2, uncertainty: 1 },
    { projectId: "crypto-engine", projectTitle: "Lightweight Cryptographic Engine", effort: 3, uncertainty: 2 },
    { projectId: "dsp-filter", projectTitle: "Configurable DSP Filter Bank", effort: 3, uncertainty: 3 },
  ],

  // Synthesis phase
  "constraints": [
    { projectId: "crypto-engine", projectTitle: "Lightweight Cryptographic Engine", effort: 3, uncertainty: 3 },
    { projectId: "ml-accelerator", projectTitle: "Neural Network Inference Accelerator", effort: 4, uncertainty: 3 },
  ],
  "synthesis-strategies": [
    { projectId: "crypto-engine", projectTitle: "Lightweight Cryptographic Engine", effort: 4, uncertainty: 2 },
    { projectId: "ml-accelerator", projectTitle: "Neural Network Inference Accelerator", effort: 5, uncertainty: 4 },
  ],
  "timing-closure": [
    { projectId: "crypto-engine", projectTitle: "Lightweight Cryptographic Engine", effort: 5, uncertainty: 4 },
  ],
  "lint-cdc-checks": [
    { projectId: "crypto-engine", projectTitle: "Lightweight Cryptographic Engine", effort: 2, uncertainty: 1 },
    { projectId: "ml-accelerator", projectTitle: "Neural Network Inference Accelerator", effort: 2, uncertainty: 2 },
    { projectId: "dsp-filter", projectTitle: "Configurable DSP Filter Bank", effort: 3, uncertainty: 2 },
  ],

  // Physical Design phase
  "floorplanning": [
    { projectId: "crypto-engine", projectTitle: "Lightweight Cryptographic Engine", effort: 4, uncertainty: 3 },
  ],
  "placement": [
    { projectId: "crypto-engine", projectTitle: "Lightweight Cryptographic Engine", effort: 4, uncertainty: 2 },
  ],
  "clock-tree": [
    { projectId: "crypto-engine", projectTitle: "Lightweight Cryptographic Engine", effort: 5, uncertainty: 4 },
  ],
  "routing": [
    { projectId: "crypto-engine", projectTitle: "Lightweight Cryptographic Engine", effort: 5, uncertainty: 3 },
  ],
  "power-analysis": [
    { projectId: "crypto-engine", projectTitle: "Lightweight Cryptographic Engine", effort: 4, uncertainty: 3 },
  ],

  // Tapeout phase
  "signoff-checks": [
    { projectId: "crypto-engine", projectTitle: "Lightweight Cryptographic Engine", effort: 4, uncertainty: 2 },
  ],
  "timing-signoff": [
    { projectId: "crypto-engine", projectTitle: "Lightweight Cryptographic Engine", effort: 5, uncertainty: 3 },
  ],
  "shuttle-submission": [
    { projectId: "crypto-engine", projectTitle: "Lightweight Cryptographic Engine", effort: 3, uncertainty: 2 },
  ],
  "packaging": [
    { projectId: "crypto-engine", projectTitle: "Lightweight Cryptographic Engine", effort: 3, uncertainty: 3 },
  ],

  // Silicon Validation phase
  "bring-up": [],
  "functional-test": [],
  "characterisation": [],
  "debug-techniques": [],
  "documentation": [],
};
