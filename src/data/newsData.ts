export type NewsTag =
  | "Conferences"
  | "Design Competitions"
  // Technology tags
  | "ARM Cortex-M0"
  | "ARM Cortex-M3"
  | "ARM Cortex-A53"
  | "RISC-V"
  | "FPGA"
  | "ASIC"
  | "Open Source EDA"
  | "SystemVerilog"
  | "Chisel/FIRRTL"
  // Interest tags
  | "Machine Learning"
  | "Cryptography & Security"
  | "DSP & Signal Processing"
  | "Low-Power Design"
  | "IoT & Edge Computing"
  | "Neuromorphic Computing"
  | "Formal Verification"
  | "High-Level Synthesis";

export const allNewsTags: NewsTag[] = [
  "Conferences",
  "Design Competitions",
  "ARM Cortex-M0",
  "ARM Cortex-M3",
  "ARM Cortex-A53",
  "RISC-V",
  "FPGA",
  "ASIC",
  "Open Source EDA",
  "SystemVerilog",
  "Chisel/FIRRTL",
  "Machine Learning",
  "Cryptography & Security",
  "DSP & Signal Processing",
  "Low-Power Design",
  "IoT & Edge Computing",
  "Neuromorphic Computing",
  "Formal Verification",
  "High-Level Synthesis",
];

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  author: string;
  authorId: string;
  institution: string;
  date: string;
  tags: NewsTag[];
  image?: string;
}

export const newsImages: Record<string, string> = {
  "nanosoc-fpga-workshop-2026": "/news/fpga-workshop.jpg",
  "ecosoc-tapeout-tsmc-28nm": "/news/asic-tapeout.jpg",
  "design-competition-2026": "/news/design-competition.jpg",
  "risc-v-summit-talk": "/news/riscv-summit.jpg",
  "ml-accelerator-tinyml-benchmark": "/news/ml-accelerator.jpg",
  "open-eda-flow-yosys": "/news/open-eda.jpg",
  "dvfs-controller-results": "/news/dvfs-power.jpg",
};

export const newsArticles: NewsArticle[] = [
  {
    id: "nanosoc-fpga-workshop-2026",
    title: "NanoSoC FPGA Workshop at DATE 2026 — Hands-on Sessions Announced",
    summary:
      "SoC Labs will host a full-day workshop at DATE 2026 in Lyon, where attendees can prototype custom accelerators on the NanoSoC platform using Xilinx Artix-7 boards.",
    content: `## Workshop Overview

SoC Labs is pleased to announce a full-day hands-on workshop at the Design, Automation and Test in Europe (DATE) 2026 conference in Lyon, France. Participants will work through the complete flow of adding a custom accelerator to the NanoSoC platform and deploying it on an FPGA.

## What You'll Learn

- Setting up the NanoSoC build environment
- Writing a simple AHB-Lite peripheral in SystemVerilog
- Integrating your peripheral via the extension port
- Running simulation with cocotb testbenches
- Synthesising and programming the design onto an Arty A7-35T board

## Schedule

| Time | Session |
|------|---------|
| 09:00 | Introduction to NanoSoC architecture |
| 10:30 | Hands-on: writing your first peripheral |
| 12:00 | Lunch break |
| 13:00 | Simulation & verification with cocotb |
| 14:30 | FPGA synthesis & deployment |
| 16:00 | Show & tell — demo your accelerator |

## Registration

Spaces are limited to 40 participants. Register through the DATE 2026 workshop portal. FPGA boards will be provided on-site.`,
    author: "Dr. Sarah Chen",
    authorId: "sarah-chen",
    institution: "Imperial College London",
    date: "2026-02-10",
    tags: ["Conferences", "ARM Cortex-M0", "FPGA", "SystemVerilog"],
  },
  {
    id: "ecosoc-tapeout-tsmc-28nm",
    title: "EcoSoC Successfully Tapes Out on TSMC 28nm",
    summary:
      "The EcoSoC reference design has completed its first tapeout on TSMC 28nm through the Europractice MPW shuttle, marking a major milestone for the community.",
    content: `## Milestone Achievement

We are thrilled to announce that the EcoSoC reference design has successfully completed tapeout on TSMC 28nm technology through the Europractice multi-project wafer (MPW) shuttle service. This represents the most advanced process node achieved by the SoC Labs community to date.

## Key Results

- **Die area**: 2.1 mm² including pads
- **Gate count**: 245,000 equivalent gates
- **Target clock speed**: 200 MHz
- **Power estimate**: 15 mW at nominal voltage

## What This Means

This tapeout validates the EcoSoC platform as a production-ready foundation for custom silicon. Community members can now confidently build their accelerators knowing the base platform is silicon-proven at an advanced node.

## Timeline

Silicon samples are expected to arrive in Q3 2026. Post-silicon validation results will be shared with the community as soon as they are available.

## Acknowledgements

This work was made possible through collaboration between the University of Cape Town, Europractice, and ARM. Special thanks to Prof. James Okonkwo and his team for leading the physical design effort.`,
    author: "Prof. James Okonkwo",
    authorId: "james-okonkwo",
    institution: "University of Cape Town",
    date: "2026-02-05",
    tags: ["ASIC", "ARM Cortex-M3"],
  },
  {
    id: "design-competition-2026",
    title: "SoC Labs Design Competition 2026 — Call for Entries",
    summary:
      "Submit your custom accelerator design for a chance to win ASIC fabrication funding and present at the SoC Labs Annual Symposium.",
    content: `## Competition Overview

The annual SoC Labs Design Competition challenges students and early-career researchers to design innovative accelerators targeting our reference SoC platforms. Winning designs will receive funding for ASIC fabrication through our shuttle programme partners.

## Categories

1. **Best Accelerator Design** — Most innovative custom hardware accelerator
2. **Best Verification** — Most thorough verification methodology
3. **Best Low-Power Design** — Lowest energy per operation
4. **People's Choice** — Community vote at the symposium

## Prizes

| Category | Prize |
|----------|-------|
| Best Accelerator | ASIC tapeout funding (up to £15,000) + conference travel |
| Best Verification | £3,000 + conference travel |
| Best Low-Power | £3,000 + conference travel |
| People's Choice | £1,500 |

## Timeline

- **Submissions open**: 1 March 2026
- **Deadline**: 30 June 2026
- **Finalists announced**: 31 July 2026
- **Symposium presentations**: September 2026

## Eligibility

Open to students (undergraduate, masters, doctoral) and researchers within 5 years of their highest degree. Teams of up to 3 members are welcome.

## How to Enter

Submit your design repository, a technical report (max 6 pages), and a 3-minute video overview through the SoC Labs competition portal.`,
    author: "Prof. Emily Watson",
    authorId: "emily-watson",
    institution: "MIT",
    date: "2026-01-28",
    tags: ["Design Competitions", "FPGA", "ASIC"],
  },
  {
    id: "risc-v-summit-talk",
    title: "Heterogeneous Multi-ISA SoC Presented at RISC-V Summit Europe",
    summary:
      "Dr. Kenji Tanaka presented the RISC-V co-processor integration project at the RISC-V Summit Europe, demonstrating ARM + RISC-V heterogeneous computing on the NanoSoC.",
    content: `## Conference Presentation

Dr. Kenji Tanaka from the University of Tokyo presented the latest results of the RISC-V co-processor integration project at the RISC-V Summit Europe 2026 in Munich. The talk demonstrated a working heterogeneous computing system combining an ARM Cortex-M0 with a PicoRV32 RISC-V core on the NanoSoC platform.

## Key Highlights

- Both cores successfully boot and execute code from shared memory
- Hardware mailbox IPC enables inter-processor communication with < 100ns latency
- Total FPGA resource utilisation of 59.6% on an Arty A7-35T
- A simple task partitioning runtime demonstrates 1.7x speedup on embarrassingly parallel workloads

## Community Response

The talk generated significant interest from the RISC-V community, with several groups expressing interest in contributing to the project. The heterogeneous approach opens new research directions in workload scheduling and ISA-specific optimisation.

## Next Steps

The team is now working on a more sophisticated runtime with dynamic task migration between the two cores, and exploring the addition of a third specialised accelerator core.`,
    author: "Dr. Kenji Tanaka",
    authorId: "kenji-tanaka",
    institution: "University of Tokyo",
    date: "2026-01-20",
    tags: ["Conferences", "RISC-V", "ARM Cortex-M0", "FPGA"],
  },
  {
    id: "ml-accelerator-tinyml-benchmark",
    title: "NanoSoC ML Accelerator Achieves Top-3 on MLPerf Tiny Benchmark",
    summary:
      "The community-developed neural network inference accelerator on NanoSoC has achieved top-3 performance on the MLPerf Tiny benchmark for keyword spotting.",
    content: `## Benchmark Results

The neural network inference accelerator developed by Dr. Sarah Chen's team at Imperial College London has achieved a top-3 ranking on the MLPerf Tiny benchmark for the keyword spotting task. This is the first time an open-source, community-developed accelerator has placed in the top tier.

## Performance

| Task | Latency | Accuracy | Ranking |
|------|---------|----------|---------|
| Keyword Spotting | 1.2 ms | 93.1% | 3rd |
| Visual Wake Words | 8.4 ms | 87.3% | 7th |
| Anomaly Detection | 0.4 ms | 91.8% | 5th |

## Architecture Improvements

Since the initial design, the team has made several optimisations:
- Upgraded from 8×8 to 16×16 systolic array
- Added support for 4-bit quantised inference
- Implemented weight compression reducing memory bandwidth by 2.3x

## Impact

This result demonstrates that open-source SoC platforms can compete with commercial solutions for edge AI workloads. The full design and benchmark scripts are available on the project's GitHub repository.`,
    author: "Dr. Sarah Chen",
    authorId: "sarah-chen",
    institution: "Imperial College London",
    date: "2026-01-15",
    tags: ["Machine Learning", "ARM Cortex-M0", "FPGA"],
  },
  {
    id: "open-eda-flow-yosys",
    title: "Fully Open-Source ASIC Flow Achieved with Yosys + OpenROAD for NanoSoC",
    summary:
      "A complete open-source RTL-to-GDSII flow for the NanoSoC has been demonstrated using Yosys, OpenROAD, and the SkyWater 130nm PDK.",
    content: `## Open-Source Silicon

For the first time, the NanoSoC reference design has been taken through a complete RTL-to-GDSII flow using entirely open-source tools. This milestone means that anyone with a computer can now design, verify, and prepare a chip for fabrication without any commercial EDA tool licenses.

## Tool Chain

- **Synthesis**: Yosys
- **Place & Route**: OpenROAD
- **PDK**: SkyWater SKY130
- **Signoff**: Magic (DRC/LVS), ngspice (analog checks)

## Results

| Metric | Value |
|--------|-------|
| Die area | 4.8 mm² |
| Gate count | 18,200 |
| Max clock | 50 MHz |
| Total power | 8.2 mW |

## Significance

While the performance is modest compared to commercial nodes, this flow is invaluable for education and research. Students can now experience the entire chip design process from RTL to layout without any licensing barriers.

## Getting Started

The complete flow scripts, Makefile, and documentation are available in the NanoSoC repository under the asic-flow/open-source directory.`,
    author: "Maria Gonzalez",
    authorId: "maria-gonzalez",
    institution: "ETH Zürich",
    date: "2026-01-08",
    tags: ["Open Source EDA", "ASIC", "ARM Cortex-M0"],
  },
  {
    id: "dvfs-controller-results",
    title: "Adaptive DVFS Controller Achieves 52% Energy Reduction on EcoSoC",
    summary:
      "Early simulation results from the adaptive power management project show a 52% energy reduction for typical IoT workloads compared to fixed-frequency operation.",
    content: `## Research Update

Prof. Emily Watson's team at MIT has published early simulation results for the adaptive DVFS (Dynamic Voltage and Frequency Scaling) controller targeting the EcoSoC platform. The results exceed initial projections, showing a 52% energy reduction for representative IoT workload profiles.

## Methodology

The team characterised six representative IoT workloads:
1. Periodic sensor sampling
2. BLE advertisement
3. Data aggregation
4. Encryption (AES-128)
5. ML inference (keyword spotting)
6. Mixed real-world profile

## Results

| Workload | Fixed (mW) | DVFS (mW) | Reduction |
|----------|-----------|-----------|-----------|
| Sensor sampling | 12.4 | 4.1 | 67% |
| BLE advertisement | 18.7 | 9.8 | 48% |
| Data aggregation | 8.2 | 3.9 | 52% |
| Encryption | 22.1 | 14.3 | 35% |
| ML inference | 25.8 | 13.1 | 49% |
| Mixed profile | 15.4 | 7.4 | 52% |

## Next Steps

The team is now implementing the RTL and plans to integrate with the EcoSoC for FPGA validation by Q2 2026, with ASIC tapeout targeted for late 2026.`,
    author: "Prof. Emily Watson",
    authorId: "emily-watson",
    institution: "MIT",
    date: "2025-12-18",
    tags: ["Low-Power Design", "ARM Cortex-M3", "IoT & Edge Computing"],
  },
];
