export const referenceDesigns = [
  {
    id: "nanosoc",
    name: "nanoSoC",
    tagline: "Minimal ARM Cortex-M0 SoC for learning and prototyping",
    description:
      "A stripped-down System-on-Chip built around the ARM Cortex-M0 processor. Designed as the perfect starting point for students and researchers who want to understand SoC architecture from the ground up. Includes AHB-Lite bus, basic GPIO, UART, and timer peripherals.",
    features: [
      "ARM Cortex-M0 core",
      "AHB-Lite interconnect",
      "GPIO, UART, Timer peripherals",
      "Minimal gate count — ideal for FPGA",
      "Full RTL source available",
      "Extensive documentation & tutorials",
    ],
    useCases: [
      "Educational projects",
      "Custom accelerator integration",
      "FPGA prototyping",
      "Research experimentation",
    ],
    githubUrl: "https://git.soton.ac.uk/soclabs/accelerator-project",
    docsUrl: "https://nanosoc-project.readthedocs.io/en/latest/",
    image: "/placeholder.svg",
    processor: "ARM Cortex-M0",
    busArchitecture: "AHB-Lite",
    peripherals: ["GPIO", "UART", "Timer", "Watchdog"],
    targetTechnology: ["FPGA"],
    architectureOverview:
      "NanoSoC is built around the ARM Cortex-M0 processor — the smallest ARM core — connected via an AHB-Lite bus to a set of essential peripherals. The design philosophy is simplicity: every block is fully documented and intended to be understood, modified, and extended by students and researchers.\n\nThe bus topology is a single-master AHB-Lite with a simple address decoder routing transactions to peripheral slaves. An extension port allows users to attach custom accelerators or additional peripherals without modifying the core interconnect.",
    blockDiagram: [
      { name: "ARM Cortex-M0", type: "processor" },
      { name: "AHB-Lite Bus", type: "interconnect" },
      { name: "SRAM (32 KB)", type: "memory" },
      { name: "GPIO", type: "peripheral" },
      { name: "UART", type: "peripheral" },
      { name: "Timer", type: "peripheral" },
      { name: "Watchdog", type: "peripheral" },
      { name: "Extension Port", type: "interface" },
    ],
    relatedTechnologies: ["ARM Cortex-M0", "Vivado / Quartus", "Yosys", "UVM / cocotb"],
    developmentProjectId: "nanosoc-dev",
    version: "1.2.0",
    branch: "main",
    provenIn: [
      { type: "FPGA", details: "Xilinx Artix-7 (XC7A35T)" },
      { type: "FPGA", details: "Intel Cyclone V" },
    ],
    integrationTime: "2–4 weeks",
    relativeGateCount: "~15K",
  },
  {
    id: "ecosoc",
    name: "EcoSoC",
    tagline: "Production-ready Cortex-M3 SoC with rich peripheral set",
    description:
      "A more feature-rich SoC targeting real-world applications. Built around the ARM Cortex-M3 with a multi-layer AHB bus matrix, DMA controller, SPI, I2C, and an extensible accelerator interface. Suitable for tapeout via available ASIC shuttle services.",
    features: [
      "ARM Cortex-M3 core",
      "Multi-layer AHB bus matrix",
      "DMA controller",
      "SPI, I2C, UART, GPIO",
      "Accelerator interface slot",
      "Tapeout-ready with synthesis scripts",
    ],
    useCases: [
      "ASIC tapeout projects",
      "IoT & edge computing research",
      "Custom accelerator development",
      "Industry collaboration",
    ],
    githubUrl: "https://github.com/soclabs/ecosoc",
    docsUrl: "https://docs.soclabs.org/ecosoc",
    image: "/placeholder.svg",
    processor: "ARM Cortex-M3",
    busArchitecture: "Multi-layer AHB",
    peripherals: ["GPIO", "UART", "SPI", "I2C", "DMA Controller", "Timer", "Watchdog", "RTC"],
    targetTechnology: ["FPGA", "ASIC"],
    architectureOverview:
      "EcoSoC is a production-grade SoC built around the ARM Cortex-M3 processor with a multi-layer AHB bus matrix enabling concurrent master access. The design includes a DMA controller for efficient data movement, a comprehensive peripheral set, and a dedicated accelerator interface slot for custom hardware extensions.\n\nThe multi-layer bus matrix supports simultaneous transactions from the processor and DMA controller to different slaves, significantly improving system throughput. The accelerator slot provides a standardised AHB slave interface with interrupt and DMA request lines, making it straightforward to integrate custom IP.",
    blockDiagram: [
      { name: "ARM Cortex-M3", type: "processor" },
      { name: "AHB Bus Matrix", type: "interconnect" },
      { name: "SRAM (128 KB)", type: "memory" },
      { name: "Flash (256 KB)", type: "memory" },
      { name: "DMA Controller", type: "controller" },
      { name: "GPIO", type: "peripheral" },
      { name: "UART", type: "peripheral" },
      { name: "SPI", type: "peripheral" },
      { name: "I2C", type: "peripheral" },
      { name: "Timer", type: "peripheral" },
      { name: "RTC", type: "peripheral" },
      { name: "Accelerator Slot", type: "interface" },
    ],
    relatedTechnologies: ["ARM Cortex-M3", "Design Compiler / Genus", "Vivado / Quartus", "UVM / cocotb"],
    developmentProjectId: "ecosoc-dev",
    version: "2.0.1",
    branch: "main",
    provenIn: [
      { type: "FPGA", details: "Xilinx Artix-7 (XC7A100T)" },
      { type: "ASIC", details: "TSMC 65nm (via Europractice)" },
    ],
    integrationTime: "4–8 weeks",
    relativeGateCount: "~85K",
  },
  {
    id: "megasoc",
    name: "megaSoC",
    tagline: "Production-ready Cortex-A53 SoC for OS applications",
    description:
      "A more feature-rich SoC targeting real-world applications. Built around the ARM Cortex-A53 with a multi-layer AXI bus matrix, DMA controller, SPI, I2C, and an extensible accelerator interface. Suitable for tapeout via available ASIC shuttle services.",
    features: [
      "ARM Cortex-A53 core",
      "NIC400 AXI bus matrix",
      "DMA controller",
      "SPI, I2C, UART, GPIO",
      "Accelerator interface slot",
      "Tapeout-ready with synthesis scripts",
    ],
    useCases: [
      "ASIC tapeout projects",
      "Real-time video processing",
      "Custom accelerator development",
      "Industry collaboration",
    ],
    githubUrl: "https://github.com/soclabs/megasoc",
    docsUrl: "https://docs.soclabs.org/megasoc",
    image: "/placeholder.svg",
    processor: "ARM Cortex-A53",
    busArchitecture: "Multi-layer AXI",
    peripherals: ["GPIO", "UART", "SPI", "I2C", "DMA Controller", "Timer", "Watchdog", "RTC"],
    targetTechnology: ["FPGA", "ASIC"],
    architectureOverview:
      "megaSoC is a production-grade SoC built around the ARM Cortex-A53 processor with a multi-layer AHB bus matrix enabling concurrent master access. The design includes a DMA controller for efficient data movement, a comprehensive peripheral set, and a dedicated accelerator interface slot for custom hardware extensions.\n\nThe multi-layer bus matrix supports simultaneous transactions from the processor and DMA controller to different slaves, significantly improving system throughput. The accelerator slot provides a standardised AHB slave interface with interrupt and DMA request lines, making it straightforward to integrate custom IP.",
    blockDiagram: [
      { name: "ARM Cortex-A53", type: "processor" },
      { name: "AHB Bus Matrix", type: "interconnect" },
      { name: "SRAM (128 KB)", type: "memory" },
      { name: "Flash (256 KB)", type: "memory" },
      { name: "DMA Controller", type: "controller" },
      { name: "GPIO", type: "peripheral" },
      { name: "UART", type: "peripheral" },
      { name: "SPI", type: "peripheral" },
      { name: "I2C", type: "peripheral" },
      { name: "Timer", type: "peripheral" },
      { name: "RTC", type: "peripheral" },
      { name: "Accelerator Slot", type: "interface" },
    ],
    relatedTechnologies: ["ARM Cortex-A53", "Design Compiler / Genus", "Vivado / Quartus", "UVM / cocotb"],
    developmentProjectId: "megasoc-dev",
    version: "0.9.0-beta",
    branch: "develop",
    provenIn: [
      { type: "FPGA", details: "Xilinx Artix-7 (XC7A100T)" },
      { type: "ASIC", details: "TSMC 16nm finFET (via Europractice)" },
    ],
    integrationTime: "8–16 weeks",
    relativeGateCount: "~350K",
  },
];

export const communityProjects = [
  {
    id: "ml-accelerator",
    title: "Neural Network Inference Accelerator",
    author: "Dr. Sarah Chen",
    institution: "Imperial College London",
    description:
      "A custom RISC-based accelerator for running TinyML inference workloads on the NanoSoC platform. Achieves 10x speedup over software-only execution for common CNN architectures.",
    architecture:
      "Custom MAC array integrated via the AHB-Lite extension port. Includes a DMA-driven data path for efficient weight loading.",
    tags: ["Machine Learning", "Accelerator", "NanoSoC", "FPGA"],
    referenceSoc: "NanoSoC",
    technology: "FPGA",
    status: "Completed",
    githubUrl: "https://github.com/example/ml-accelerator",
    docsUrl: "https://docs.example.com/ml-accelerator",
    authorId: "sarah-chen",
    date: "2025-11-15",
    collaboratorIds: ["sarah-chen", "kenji-tanaka"],
    organisationIds: ["imperial-college-london", "arm"],
    content: `## Overview\n\nThis project implements a custom neural network inference accelerator targeting TinyML workloads. By integrating a dedicated MAC (Multiply-Accumulate) array into the NanoSoC platform via the AHB-Lite extension port, we achieve a 10x speedup compared to pure software execution.\n\n## Motivation\n\nEdge AI is becoming increasingly important for IoT applications where data cannot be sent to the cloud due to latency, bandwidth, or privacy constraints. However, microcontroller-class processors like the Cortex-M0 lack the computational throughput needed for real-time inference.\n\n## Architecture\n\nThe accelerator features:\n- **8×8 systolic MAC array** for parallel multiply-accumulate operations\n- **Weight buffer** with DMA-driven loading from main memory\n- **Activation pipeline** supporting ReLU, sigmoid, and tanh\n- **Control FSM** that sequences layer-by-layer execution\n\nThe design is memory-mapped into the AHB address space, allowing the Cortex-M0 to configure and trigger inference operations through simple register writes.\n\n## Results\n\n| Metric | Software | Accelerator | Speedup |\n|--------|----------|-------------|---------|\n| Conv2D (3×3) | 12.4 ms | 1.1 ms | 11.3× |\n| Dense (128→10) | 0.8 ms | 0.09 ms | 8.9× |\n| Full MobileNet-v1 | 340 ms | 32 ms | 10.6× |\n\n## Future Work\n\nWe plan to explore quantization-aware training to further reduce the accelerator's area and power consumption, and to port the design to ASIC using the EcoSoC platform.`,
    phaseProgress: { architecture: 100, rtl: 100, verification: 100, synthesis: 100, "physical-design": 0, tapeout: 0, "silicon-validation": 0 },
    phaseEffort: { architecture: 3, rtl: 4, verification: 4, synthesis: 3, "physical-design": 5, tapeout: 4, "silicon-validation": 4 },
    phaseUncertainty: { architecture: 2, rtl: 3, verification: 3, synthesis: 2, "physical-design": 4, tapeout: 3, "silicon-validation": 5 },
    phaseDates: {
      architecture: { startDate: "2025-03-01", projectedEndDate: "2025-04-20", completedDate: "2025-04-25" },
      rtl: { startDate: "2025-04-25", projectedEndDate: "2025-07-20", completedDate: "2025-07-18" },
      verification: { startDate: "2025-07-01", projectedEndDate: "2025-09-15", completedDate: "2025-09-12" },
      synthesis: { startDate: "2025-09-15", projectedEndDate: "2025-12-15", completedDate: "2025-12-10" },
      "physical-design": { startDate: "2026-01-15", projectedEndDate: "2026-04-15" },
      tapeout: { startDate: "2026-04-15", projectedEndDate: "2026-06-01" },
      "silicon-validation": { startDate: "2026-06-01", projectedEndDate: "2026-09-01" },
    },
    milestones: [
      { phase: "architecture", task: "Define system partitioning", done: true, effort: 3, uncertainty: 2, startDate: "2025-03-01", projectedEndDate: "2025-03-20", completedDate: "2025-03-18", assigneeId: "sarah-chen", blurb: "Break the system into processor, accelerator, and peripheral subsystems. Define interfaces and data flow between partitions.", learningTopicIds: ["system-partitioning"] },
      { phase: "architecture", task: "Select bus architecture (AHB-Lite)", done: true, effort: 2, uncertainty: 1, startDate: "2025-03-10", projectedEndDate: "2025-03-25", completedDate: "2025-03-22", assigneeId: "sarah-chen", blurb: "Evaluate AHB-Lite vs AXI for the extension port. AHB-Lite chosen for simplicity given single-master topology.", learningTopicIds: ["bus-architecture"] },
      { phase: "architecture", task: "Design memory map", done: true, effort: 2, uncertainty: 2, startDate: "2025-03-20", projectedEndDate: "2025-04-05", completedDate: "2025-04-03", assigneeId: "sarah-chen", blurb: "Allocate address ranges for MAC array registers, weight buffer, activation config, and status/control.", learningTopicIds: ["memory-map"] },
      { phase: "architecture", task: "Define accelerator interface spec", done: true, effort: 3, uncertainty: 3, startDate: "2025-04-01", projectedEndDate: "2025-04-20", completedDate: "2025-04-25", assigneeId: "kenji-tanaka", blurb: "Specify the AHB slave interface for the accelerator including register map, interrupt lines, and DMA request signals.", learningTopicIds: ["interface-protocols", "ip-selection"] },
      { phase: "rtl", task: "Implement 8×8 MAC array", done: true, effort: 4, uncertainty: 3, startDate: "2025-04-25", projectedEndDate: "2025-05-30", completedDate: "2025-05-28", assigneeId: "sarah-chen", blurb: "Design systolic array with configurable precision. Implement weight loading, partial sum accumulation, and output staging.", learningTopicIds: ["coding-style", "parameterisation"] },
      { phase: "rtl", task: "Implement weight buffer with DMA", done: true, effort: 3, uncertainty: 2, startDate: "2025-05-15", projectedEndDate: "2025-06-15", completedDate: "2025-06-10", assigneeId: "kenji-tanaka", blurb: "Double-buffered weight memory with DMA-driven loading from main SRAM. Supports pre-fetching for next layer.", learningTopicIds: ["interface-protocols", "coding-style"] },
      { phase: "rtl", task: "Implement activation pipeline", done: true, effort: 3, uncertainty: 2, startDate: "2025-06-01", projectedEndDate: "2025-06-25", completedDate: "2025-06-22", assigneeId: "sarah-chen", blurb: "Pipelined activation functions (ReLU, sigmoid, tanh) with LUT-based approximation for non-linear functions.", learningTopicIds: ["coding-style", "parameterisation"] },
      { phase: "rtl", task: "Implement control FSM", done: true, effort: 4, uncertainty: 3, startDate: "2025-06-20", projectedEndDate: "2025-07-20", completedDate: "2025-07-18", assigneeId: "sarah-chen", blurb: "Master FSM that sequences layer execution, manages DMA transfers, and handles interrupt generation on completion.", learningTopicIds: ["fsm-design"] },
      { phase: "verification", task: "Unit tests for MAC array", done: true, effort: 3, uncertainty: 2, startDate: "2025-07-01", projectedEndDate: "2025-07-25", completedDate: "2025-07-20", assigneeId: "kenji-tanaka", blurb: "Directed and constrained-random tests for the MAC array covering overflow, underflow, and precision edge cases.", learningTopicIds: ["testbench-architecture", "constrained-random"] },
      { phase: "verification", task: "Integration testbench", done: true, effort: 4, uncertainty: 3, startDate: "2025-07-20", projectedEndDate: "2025-08-20", completedDate: "2025-08-18", assigneeId: "kenji-tanaka", blurb: "Full SoC testbench with Cortex-M0 running firmware that configures and triggers the accelerator via memory-mapped registers.", learningTopicIds: ["testbench-architecture", "regression-ci"] },
      { phase: "verification", task: "Functional coverage > 95%", done: true, effort: 4, uncertainty: 3, startDate: "2025-08-15", projectedEndDate: "2025-09-15", completedDate: "2025-09-12", assigneeId: "kenji-tanaka", blurb: "Cover all register access patterns, DMA transfer sizes, activation modes, and interrupt scenarios.", learningTopicIds: ["functional-coverage"] },
      { phase: "synthesis", task: "Logic synthesis with timing constraints", done: true, effort: 3, uncertainty: 2, startDate: "2025-09-10", projectedEndDate: "2025-09-30", completedDate: "2025-09-28", assigneeId: "sarah-chen", blurb: "Synthesise for 100 MHz target. Resolve timing violations in MAC array critical paths.", learningTopicIds: ["constraints", "synthesis-strategies"] },
      { phase: "synthesis", task: "Area and power analysis", done: true, effort: 2, uncertainty: 1, startDate: "2025-09-25", projectedEndDate: "2025-10-10", completedDate: "2025-10-08", assigneeId: "sarah-chen", blurb: "Generate area and power reports. MAC array uses ~3,200 LUTs. Dynamic power within budget.", learningTopicIds: ["synthesis-strategies"] },
      { phase: "synthesis", task: "FPGA prototype on Arty A7", done: true, effort: 3, uncertainty: 2, startDate: "2025-10-05", projectedEndDate: "2025-10-25", completedDate: "2025-10-22", assigneeId: "sarah-chen", blurb: "FPGA-specific synthesis, place & route, and bitstream generation for the Digilent Arty A7-35T board.", learningTopicIds: ["synthesis-strategies"] },
      { phase: "synthesis", task: "Run inference benchmark on hardware", done: false, effort: 3, uncertainty: 3, startDate: "2025-10-20", projectedEndDate: "2025-11-15", assigneeId: "kenji-tanaka", blurb: "Execute MobileNet-v1 inference on real hardware and measure latency, throughput, and power consumption.", learningTopicIds: ["synthesis-strategies"] },
      { phase: "synthesis", task: "Optimise clock frequency", done: false, effort: 4, uncertainty: 4, startDate: "2025-11-10", projectedEndDate: "2025-12-10", assigneeId: "sarah-chen", blurb: "Push clock frequency beyond 100 MHz through pipeline balancing and critical path optimisation.", learningTopicIds: ["timing-closure"] },
      { phase: "physical-design", task: "Physical design flow", done: false, effort: 5, uncertainty: 4, startDate: "2026-02-15", projectedEndDate: "2026-04-15", assigneeId: "sarah-chen", blurb: "Complete physical design including floorplanning, placement, clock tree synthesis, routing, and sign-off checks.", learningTopicIds: ["floorplanning", "placement", "clock-tree", "routing"] },
      { phase: "tapeout", task: "Select shuttle service", done: false, effort: 2, uncertainty: 3, startDate: "2026-01-10", projectedEndDate: "2026-02-10", assigneeId: "sarah-chen", blurb: "Evaluate Europractice, MOSIS, and Google/Skywater shuttles for cost, turnaround, and technology node.", learningTopicIds: ["shuttle-submission"] },
      { phase: "silicon-validation", task: "Post-silicon bring-up", done: false, effort: 4, uncertainty: 5, startDate: "2026-07-01", projectedEndDate: "2026-08-30", assigneeId: "kenji-tanaka", blurb: "Power-on testing, JTAG connectivity, clock verification, and basic peripheral bring-up on fabricated silicon.", learningTopicIds: ["bring-up", "functional-test"] },
    ],
  },
  {
    id: "crypto-engine",
    title: "Lightweight Cryptographic Engine",
    author: "Prof. James Okonkwo",
    institution: "University of Cape Town",
    description:
      "An AES-128/256 and SHA-256 hardware accelerator designed for IoT security applications. Integrated into the EcoSoC accelerator slot with minimal area overhead.",
    architecture:
      "Pipelined AES core with configurable key length. SHA-256 engine shares the datapath for area efficiency.",
    tags: ["Cryptography", "Security", "EcoSoC", "ASIC"],
    referenceSoc: "EcoSoC",
    technology: "ASIC",
    status: "Completed",
    githubUrl: "https://github.com/example/crypto-engine",
    docsUrl: "https://docs.example.com/crypto-engine",
    authorId: "james-okonkwo",
    date: "2025-09-22",
    collaboratorIds: ["james-okonkwo"],
    organisationIds: ["university-of-cape-town", "europractice"],
    content: `## Overview\n\nThis project delivers a lightweight, area-efficient cryptographic engine supporting AES-128/256 encryption and SHA-256 hashing. Designed for resource-constrained IoT devices, it integrates seamlessly into the EcoSoC accelerator slot.\n\n## Motivation\n\nSecure communication is essential for IoT deployments, but software-based cryptography on microcontrollers introduces significant latency and energy overhead. A dedicated hardware engine offloads these operations while maintaining a small silicon footprint.\n\n## Architecture\n\n- **AES Core**: Iterative architecture with configurable 128/256-bit key support. Uses a shared S-Box to minimise area.\n- **SHA-256 Engine**: Shares the 32-bit datapath with the AES core through time-division multiplexing.\n- **Key Scheduler**: Supports on-the-fly key expansion to avoid storing round keys in memory.\n- **DMA Interface**: Allows bulk data transfers without CPU intervention.\n\n## Area & Performance\n\n| Block | Area (kGE) | Throughput |\n|-------|-----------|------------|\n| AES-128 | 8.2 | 1.2 Gbps @ 100 MHz |\n| AES-256 | 9.1 | 0.9 Gbps @ 100 MHz |\n| SHA-256 | 5.4 | 800 Mbps @ 100 MHz |\n| Total | 14.7 | — |\n\n## Tapeout Status\n\nThe design has been submitted for fabrication through the Europractice MPW shuttle in TSMC 65nm. Silicon samples are expected in Q2 2026.`,
    phaseProgress: { architecture: 100, rtl: 100, verification: 100, synthesis: 100, "physical-design": 100, tapeout: 75, "silicon-validation": 0 },
    phaseEffort: { architecture: 4, rtl: 5, verification: 3, synthesis: 4, "physical-design": 5, tapeout: 3, "silicon-validation": 4 },
    phaseUncertainty: { architecture: 2, rtl: 2, verification: 1, synthesis: 3, "physical-design": 3, tapeout: 3, "silicon-validation": 5 },
    phaseDates: {
      architecture: { startDate: "2025-01-10", projectedEndDate: "2025-02-20", completedDate: "2025-02-18" },
      rtl: { startDate: "2025-02-15", projectedEndDate: "2025-05-10", completedDate: "2025-05-08" },
      verification: { startDate: "2025-05-05", projectedEndDate: "2025-06-15", completedDate: "2025-06-12" },
      synthesis: { startDate: "2025-06-10", projectedEndDate: "2025-08-15", completedDate: "2025-08-10" },
      "physical-design": { startDate: "2025-08-10", projectedEndDate: "2025-10-05", completedDate: "2025-10-02" },
      tapeout: { startDate: "2025-10-01", projectedEndDate: "2025-10-30" },
      "silicon-validation": { startDate: "2026-03-01", projectedEndDate: "2026-06-01" },
    },
    milestones: [
      { phase: "architecture", task: "Define crypto engine spec", done: true, effort: 3, uncertainty: 2, startDate: "2025-01-10", projectedEndDate: "2025-02-01", completedDate: "2025-01-28", assigneeId: "james-okonkwo", blurb: "Write detailed specification for AES and SHA-256 engines including key sizes, modes, and throughput targets.", learningTopicIds: ["system-partitioning", "ip-selection"] },
      { phase: "architecture", task: "Plan shared datapath", done: true, effort: 4, uncertainty: 3, startDate: "2025-01-25", projectedEndDate: "2025-02-20", completedDate: "2025-02-18", assigneeId: "james-okonkwo", blurb: "Design time-division multiplexed datapath shared between AES and SHA-256 to minimise area.", learningTopicIds: ["system-partitioning"] },
      { phase: "rtl", task: "Implement AES core", done: true, effort: 5, uncertainty: 2, startDate: "2025-02-15", projectedEndDate: "2025-04-01", completedDate: "2025-03-28", assigneeId: "james-okonkwo", blurb: "Iterative AES architecture with shared S-Box. Supports both 128 and 256-bit key lengths.", learningTopicIds: ["coding-style", "parameterisation"] },
      { phase: "rtl", task: "Implement SHA-256 engine", done: true, effort: 4, uncertainty: 2, startDate: "2025-03-20", projectedEndDate: "2025-04-25", completedDate: "2025-04-22", assigneeId: "james-okonkwo", blurb: "SHA-256 message digest engine with padding logic and 64-round compression function.", learningTopicIds: ["coding-style"] },
      { phase: "rtl", task: "Implement key scheduler", done: true, effort: 3, uncertainty: 2, startDate: "2025-04-15", projectedEndDate: "2025-05-10", completedDate: "2025-05-08", assigneeId: "james-okonkwo", blurb: "On-the-fly key expansion avoiding full round-key storage. Supports both AES key lengths.", learningTopicIds: ["fsm-design", "coding-style"] },
      { phase: "verification", task: "AES known-answer tests", done: true, effort: 3, uncertainty: 1, startDate: "2025-05-05", projectedEndDate: "2025-05-25", completedDate: "2025-05-20", assigneeId: "james-okonkwo", blurb: "Validate against NIST FIPS 197 test vectors for all key lengths and block modes.", learningTopicIds: ["testbench-architecture"] },
      { phase: "verification", task: "SHA-256 test vectors", done: true, effort: 2, uncertainty: 1, startDate: "2025-05-15", projectedEndDate: "2025-06-01", completedDate: "2025-05-28", assigneeId: "james-okonkwo", blurb: "Verify against NIST SHA-256 test vectors including multi-block messages and edge cases.", learningTopicIds: ["testbench-architecture"] },
      { phase: "verification", task: "DMA integration tests", done: true, effort: 3, uncertainty: 2, startDate: "2025-05-25", projectedEndDate: "2025-06-15", completedDate: "2025-06-12", assigneeId: "james-okonkwo", blurb: "Test bulk data transfers via DMA with various buffer sizes and alignment scenarios.", learningTopicIds: ["testbench-architecture", "regression-ci"] },
      { phase: "synthesis", task: "Synthesis for TSMC 65nm", done: true, effort: 4, uncertainty: 3, startDate: "2025-06-10", projectedEndDate: "2025-07-10", completedDate: "2025-07-08", assigneeId: "james-okonkwo", blurb: "Logic synthesis targeting TSMC 65nm standard cells with 100 MHz timing constraint.", learningTopicIds: ["constraints", "synthesis-strategies"] },
      { phase: "synthesis", task: "Timing closure", done: true, effort: 3, uncertainty: 2, startDate: "2025-07-05", projectedEndDate: "2025-07-25", completedDate: "2025-07-22", assigneeId: "james-okonkwo", blurb: "Static timing analysis across all corners. Fix setup/hold violations in S-Box paths.", learningTopicIds: ["timing-closure"] },
      { phase: "synthesis", task: "FPGA prototype validation", done: true, effort: 3, uncertainty: 2, startDate: "2025-07-20", projectedEndDate: "2025-08-15", completedDate: "2025-08-10", assigneeId: "james-okonkwo", blurb: "Validate crypto engine functionality on FPGA before committing to tapeout.", learningTopicIds: ["synthesis-strategies"] },
      { phase: "physical-design", task: "Floorplanning, placement & routing", done: true, effort: 5, uncertainty: 3, startDate: "2025-08-10", projectedEndDate: "2025-09-20", completedDate: "2025-09-18", assigneeId: "james-okonkwo", blurb: "Floorplanning, placement, CTS, and routing for TSMC 65nm. Target area under 15 kGE.", learningTopicIds: ["floorplanning", "placement", "routing"] },
      { phase: "physical-design", task: "DRC/LVS sign-off", done: true, effort: 3, uncertainty: 2, startDate: "2025-09-15", projectedEndDate: "2025-10-05", completedDate: "2025-10-02", assigneeId: "james-okonkwo", blurb: "Pass all design rule checks and layout-vs-schematic verification for foundry submission.", learningTopicIds: ["signoff-checks"] },
      { phase: "tapeout", task: "Submit to Europractice shuttle", done: false, effort: 2, uncertainty: 3, startDate: "2025-10-01", projectedEndDate: "2025-10-30", assigneeId: "james-okonkwo", blurb: "Prepare GDS-II, submit to Europractice MPW shuttle, and handle foundry interface requirements.", learningTopicIds: ["shuttle-submission"] },
      { phase: "silicon-validation", task: "Receive silicon samples", done: false, effort: 1, uncertainty: 4, startDate: "2026-03-01", projectedEndDate: "2026-04-01", assigneeId: "james-okonkwo", blurb: "Receive packaged dies from Europractice, inspect packaging, and prepare test boards.", learningTopicIds: ["bring-up"] },
      { phase: "silicon-validation", task: "Post-silicon validation", done: false, effort: 4, uncertainty: 5, startDate: "2026-04-01", projectedEndDate: "2026-06-01", assigneeId: "james-okonkwo", blurb: "Full functional and performance validation of fabricated crypto engine against pre-silicon simulations.", learningTopicIds: ["functional-test", "characterisation"] },
    ],
  },
  {
    id: "dsp-filter",
    title: "Configurable DSP Filter Bank",
    author: "Maria Gonzalez",
    institution: "ETH Zürich",
    description:
      "A reconfigurable FIR/IIR filter bank for audio and sensor signal processing. Supports up to 8 parallel filter channels with programmable coefficients.",
    architecture:
      "Shared multiply-accumulate units with time-division multiplexing. Coefficient memory mapped to the AHB address space.",
    tags: ["DSP", "Signal Processing", "NanoSoC", "FPGA"],
    referenceSoc: "NanoSoC",
    technology: "FPGA",
    status: "In Progress",
    githubUrl: "https://github.com/example/dsp-filter",
    docsUrl: "https://docs.example.com/dsp-filter",
    authorId: "maria-gonzalez",
    date: "2025-08-10",
    collaboratorIds: ["maria-gonzalez"],
    organisationIds: ["eth-zurich"],
    content: `## Overview\n\nThis project implements a reconfigurable digital signal processing (DSP) filter bank on the NanoSoC platform. It supports both FIR and IIR filter topologies with up to 8 parallel channels, making it suitable for multi-sensor data acquisition and audio processing.\n\n## Motivation\n\nMany embedded applications require real-time filtering of multiple sensor channels simultaneously. Software implementations on the Cortex-M0 quickly become a bottleneck as the number of channels and filter orders increase.\n\n## Architecture\n\n- **Shared MAC Units**: Four 16×16 multiply-accumulate blocks serve all 8 channels via time-division multiplexing\n- **Coefficient RAM**: 2 KB dual-port memory mapped to the AHB address space for runtime coefficient updates\n- **Channel Sequencer**: Round-robin scheduler ensuring deterministic latency across all channels\n- **Output FIFO**: Per-channel output buffers with configurable depth\n\n## Current Status\n\nThe FIR path is fully verified and running on an Arty A7 FPGA board. IIR support and coefficient auto-loading are currently under development.\n\n## Specifications\n\n| Parameter | Value |\n|-----------|-------|\n| Max filter order | 64 (FIR), 8 (IIR) |\n| Channels | 8 |\n| Sample rate | Up to 1 MSPS per channel |\n| Coefficient width | 16-bit fixed point |\n| FPGA resource usage | ~2,400 LUTs |`,
    phaseProgress: { architecture: 100, rtl: 80, verification: 50, synthesis: 30, "physical-design": 0, tapeout: 0, "silicon-validation": 0 },
    phaseEffort: { architecture: 3, rtl: 4, verification: 4, synthesis: 3, "physical-design": 0, tapeout: 0, "silicon-validation": 0 },
    phaseUncertainty: { architecture: 2, rtl: 2, verification: 3, synthesis: 3, "physical-design": 0, tapeout: 0, "silicon-validation": 0 },
    phaseDates: {
      architecture: { startDate: "2025-02-01", projectedEndDate: "2025-03-10", completedDate: "2025-03-08" },
      rtl: { startDate: "2025-03-05", projectedEndDate: "2025-05-25" },
      verification: { startDate: "2025-04-15", projectedEndDate: "2025-06-20" },
      synthesis: { startDate: "2025-05-01", projectedEndDate: "2025-07-15" },
    },
    milestones: [
      { phase: "architecture", task: "Define filter bank architecture", done: true, effort: 3, uncertainty: 2, startDate: "2025-02-01", projectedEndDate: "2025-02-25", completedDate: "2025-02-22", assigneeId: "maria-gonzalez", blurb: "Specify filter topology, channel count, and MAC sharing strategy for area-efficient implementation.", learningTopicIds: ["system-partitioning", "ip-selection"] },
      { phase: "architecture", task: "Specify channel sequencer", done: true, effort: 2, uncertainty: 2, startDate: "2025-02-20", projectedEndDate: "2025-03-10", completedDate: "2025-03-08", assigneeId: "maria-gonzalez", blurb: "Design round-robin scheduling for 8 channels with deterministic latency guarantees.", learningTopicIds: ["system-partitioning"] },
      { phase: "rtl", task: "Implement shared MAC units", done: true, effort: 4, uncertainty: 2, startDate: "2025-03-05", projectedEndDate: "2025-04-10", completedDate: "2025-04-08", assigneeId: "maria-gonzalez", blurb: "Four 16×16 multiply-accumulate blocks with time-division multiplexing across all channels.", learningTopicIds: ["coding-style", "parameterisation"] },
      { phase: "rtl", task: "Implement coefficient RAM", done: true, effort: 3, uncertainty: 1, startDate: "2025-04-05", projectedEndDate: "2025-04-25", completedDate: "2025-04-20", assigneeId: "maria-gonzalez", blurb: "2 KB dual-port coefficient memory mapped to AHB address space for runtime updates.", learningTopicIds: ["coding-style", "interface-protocols"] },
      { phase: "rtl", task: "Implement IIR path", done: false, effort: 4, uncertainty: 3, startDate: "2025-04-20", projectedEndDate: "2025-05-25", assigneeId: "maria-gonzalez", blurb: "Add IIR filter topology with feedback paths and stability checks for up to 8th-order filters.", learningTopicIds: ["coding-style", "fsm-design"] },
      { phase: "verification", task: "FIR path unit tests", done: true, effort: 3, uncertainty: 2, startDate: "2025-04-15", projectedEndDate: "2025-05-10", completedDate: "2025-05-05", assigneeId: "maria-gonzalez", blurb: "Test FIR filters against MATLAB golden reference for various filter orders and coefficient sets.", learningTopicIds: ["testbench-architecture"] },
      { phase: "verification", task: "Multi-channel integration test", done: false, effort: 4, uncertainty: 3, startDate: "2025-05-20", projectedEndDate: "2025-06-20", assigneeId: "maria-gonzalez", blurb: "Verify all 8 channels operating simultaneously with independent filter configurations.", learningTopicIds: ["testbench-architecture", "functional-coverage"] },
      { phase: "synthesis", task: "FIR path running on Arty A7", done: true, effort: 3, uncertainty: 2, startDate: "2025-05-01", projectedEndDate: "2025-05-20", completedDate: "2025-05-18", assigneeId: "maria-gonzalez", blurb: "Deploy FIR-only configuration to Arty A7 FPGA and validate with real audio input signals.", learningTopicIds: ["synthesis-strategies"] },
      { phase: "synthesis", task: "Full filter bank synthesis & FPGA deployment", done: false, effort: 3, uncertainty: 3, startDate: "2025-06-15", projectedEndDate: "2025-07-15", assigneeId: "maria-gonzalez", blurb: "Complete synthesis with both FIR and IIR paths, all 8 channels, and runtime reconfiguration.", learningTopicIds: ["constraints", "synthesis-strategies"] },
    ],
  },
  {
    id: "riscv-coprocessor",
    title: "RISC-V Co-processor Integration",
    author: "Dr. Kenji Tanaka",
    institution: "University of Tokyo",
    description:
      "A RISC-V RV32I co-processor integrated alongside the ARM Cortex-M0 in the NanoSoC, enabling heterogeneous computing for research into multi-ISA SoC architectures.",
    architecture: "Dual-core shared-memory architecture with a custom arbitration layer on the AHB-Lite bus.",
    tags: ["RISC-V", "Processor Design", "NanoSoC", "FPGA"],
    referenceSoc: "NanoSoC",
    technology: "FPGA",
    status: "In Progress",
    githubUrl: "https://github.com/example/riscv-coprocessor",
    docsUrl: "https://docs.example.com/riscv-coprocessor",
    authorId: "kenji-tanaka",
    date: "2025-12-01",
    collaboratorIds: ["kenji-tanaka", "sarah-chen"],
    organisationIds: ["university-of-tokyo", "arm"],
    content: `## Overview\n\nThis project explores heterogeneous multi-ISA computing by integrating a RISC-V RV32I core alongside the ARM Cortex-M0 in the NanoSoC platform. The two processors share memory and peripherals through a custom bus arbitration scheme.\n\n## Motivation\n\nHeterogeneous architectures combining different ISAs can offer flexibility in workload allocation. This project serves as a research vehicle for exploring the trade-offs in multi-ISA SoC design, including coherence, synchronisation, and workload partitioning.\n\n## Architecture\n\n- **RISC-V Core**: PicoRV32-based RV32I implementation, area-optimised for FPGA\n- **Bus Arbiter**: Custom round-robin arbiter with priority override for the AHB-Lite bus\n- **Shared SRAM**: 64 KB dual-port memory accessible by both cores\n- **Mailbox**: Hardware mailbox for inter-processor communication\n\n## Current Status\n\nBoth cores boot independently and can execute code from shared memory. The mailbox IPC mechanism is functional. Currently working on a simple runtime that can partition tasks between the two cores.\n\n## Resource Usage (Arty A7-35T)\n\n| Resource | Used | Available | Utilisation |\n|----------|------|-----------|-------------|\n| LUTs | 12,400 | 20,800 | 59.6% |\n| FFs | 6,200 | 41,600 | 14.9% |\n| BRAM | 18 | 50 | 36.0% |`,
    phaseProgress: { architecture: 100, rtl: 70, verification: 40, synthesis: 20, "physical-design": 0, tapeout: 0, "silicon-validation": 0 },
    phaseEffort: { architecture: 4, rtl: 4, verification: 3, synthesis: 3, "physical-design": 0, tapeout: 0, "silicon-validation": 0 },
    phaseUncertainty: { architecture: 4, rtl: 3, verification: 4, synthesis: 4, "physical-design": 0, tapeout: 0, "silicon-validation": 0 },
    phaseDates: {
      architecture: { startDate: "2025-05-01", projectedEndDate: "2025-06-20", completedDate: "2025-06-18" },
      rtl: { startDate: "2025-06-15", projectedEndDate: "2025-09-10" },
      verification: { startDate: "2025-08-01", projectedEndDate: "2025-10-15" },
      synthesis: { startDate: "2025-09-01", projectedEndDate: "2025-11-30" },
    },
    milestones: [
      { phase: "architecture", task: "Define dual-core architecture", done: true, effort: 4, uncertainty: 4, startDate: "2025-05-01", projectedEndDate: "2025-06-01", completedDate: "2025-05-28", assigneeId: "kenji-tanaka", blurb: "Design heterogeneous dual-core topology with shared memory and independent reset/clock domains.", learningTopicIds: ["system-partitioning", "power-clocking"] },
      { phase: "architecture", task: "Design bus arbitration scheme", done: true, effort: 3, uncertainty: 3, startDate: "2025-05-25", projectedEndDate: "2025-06-20", completedDate: "2025-06-18", assigneeId: "kenji-tanaka", blurb: "Round-robin arbiter with priority override for the AHB-Lite bus supporting both cores.", learningTopicIds: ["bus-architecture"] },
      { phase: "rtl", task: "Integrate PicoRV32 core", done: true, effort: 3, uncertainty: 2, startDate: "2025-06-15", projectedEndDate: "2025-07-15", completedDate: "2025-07-10", assigneeId: "kenji-tanaka", blurb: "Instantiate and configure PicoRV32 RV32I core with AHB-Lite wrapper for bus integration.", learningTopicIds: ["ip-selection", "interface-protocols"] },
      { phase: "rtl", task: "Implement bus arbiter", done: true, effort: 4, uncertainty: 3, startDate: "2025-07-10", projectedEndDate: "2025-08-10", completedDate: "2025-08-15", assigneeId: "kenji-tanaka", blurb: "Custom arbiter handling simultaneous requests from ARM and RISC-V cores with fair scheduling.", learningTopicIds: ["fsm-design", "interface-protocols"] },
      { phase: "rtl", task: "Implement hardware mailbox", done: false, effort: 3, uncertainty: 3, startDate: "2025-08-10", projectedEndDate: "2025-09-10", assigneeId: "sarah-chen", blurb: "Hardware FIFO-based mailbox for inter-processor communication with interrupt generation.", learningTopicIds: ["coding-style", "fsm-design"] },
      { phase: "verification", task: "Dual-core boot test", done: true, effort: 3, uncertainty: 3, startDate: "2025-08-01", projectedEndDate: "2025-08-25", completedDate: "2025-08-22", assigneeId: "kenji-tanaka", blurb: "Verify both cores boot independently and can execute code from shared SRAM.", learningTopicIds: ["testbench-architecture"] },
      { phase: "verification", task: "Mailbox IPC tests", done: false, effort: 3, uncertainty: 4, startDate: "2025-09-15", projectedEndDate: "2025-10-15", assigneeId: "sarah-chen", blurb: "Test message passing between cores via mailbox with concurrent access and overflow scenarios.", learningTopicIds: ["testbench-architecture", "constrained-random"] },
      { phase: "synthesis", task: "Basic dual-core on FPGA", done: true, effort: 3, uncertainty: 3, startDate: "2025-09-01", projectedEndDate: "2025-09-30", completedDate: "2025-10-05", assigneeId: "kenji-tanaka", blurb: "Deploy dual-core system to Arty A7-35T and verify basic operation of both processors.", learningTopicIds: ["synthesis-strategies"] },
      { phase: "synthesis", task: "Runtime task partitioning", done: false, effort: 4, uncertainty: 4, startDate: "2025-10-10", projectedEndDate: "2025-11-30", assigneeId: "kenji-tanaka", blurb: "Implement simple runtime that dynamically partitions workload between ARM and RISC-V cores.", learningTopicIds: ["synthesis-strategies"] },
    ],
  },
  {
    id: "power-management",
    title: "Adaptive Power Management Unit",
    author: "Prof. Emily Watson",
    institution: "MIT",
    description:
      "An intelligent power management unit for the EcoSoC that implements dynamic voltage and frequency scaling (DVFS) based on workload characterisation.",
    architecture:
      "Digital controller with lookup-table-based DVFS policy engine. Monitors core activity counters to make scaling decisions.",
    tags: ["Low Power", "Power Management", "EcoSoC", "ASIC"],
    referenceSoc: "EcoSoC",
    technology: "ASIC",
    status: "Planning",
    githubUrl: "https://github.com/example/power-management",
    docsUrl: "https://docs.example.com/power-management",
    authorId: "emily-watson",
    date: "2026-01-20",
    collaboratorIds: ["emily-watson"],
    organisationIds: ["mit"],
    content: `## Overview\n\nThis project develops an adaptive power management unit (PMU) for the EcoSoC platform that dynamically adjusts voltage and frequency based on real-time workload analysis. The goal is to minimise energy consumption without sacrificing performance for active tasks.\n\n## Motivation\n\nBattery-powered IoT devices require aggressive power management. Static approaches leave significant energy savings on the table. By monitoring core activity in hardware and applying DVFS policies, we can achieve near-optimal power-performance trade-offs automatically.\n\n## Planned Architecture\n\n- **Activity Monitor**: Hardware performance counters tracking IPC, cache misses, and bus utilisation\n- **Policy Engine**: LUT-based decision logic mapping activity profiles to voltage/frequency operating points\n- **Clock Manager**: Glitch-free clock switching with configurable divider ratios\n- **Voltage Controller**: Digital interface to external PMIC via SPI\n\n## Project Timeline\n\n| Phase | Target Date | Status |\n|-------|------------|--------|\n| Specification | Feb 2026 | Complete |\n| RTL Design | Apr 2026 | Not started |\n| Verification | Jun 2026 | Not started |\n| ASIC Integration | Aug 2026 | Not started |\n\n## Expected Outcomes\n\nSimulation models predict 40-60% energy reduction for typical IoT workloads compared to running at fixed maximum frequency.`,
    phaseProgress: { architecture: 60, rtl: 0, verification: 0, synthesis: 0, "physical-design": 0, tapeout: 0, "silicon-validation": 0 },
    phaseEffort: { architecture: 3, rtl: 4, verification: 3, synthesis: 3, "physical-design": 4, tapeout: 3, "silicon-validation": 0 },
    phaseUncertainty: { architecture: 3, rtl: 3, verification: 3, synthesis: 2, "physical-design": 3, tapeout: 2, "silicon-validation": 0 },
    phaseDates: {
      architecture: { startDate: "2025-11-01", projectedEndDate: "2026-02-10" },
      rtl: { startDate: "2026-02-15", projectedEndDate: "2026-05-15" },
      verification: { startDate: "2026-05-01", projectedEndDate: "2026-07-01" },
      "physical-design": { startDate: "2026-07-01", projectedEndDate: "2026-08-15" },
      tapeout: { startDate: "2026-08-15", projectedEndDate: "2026-09-01" },
    },
    milestones: [
      { phase: "architecture", task: "Write PMU specification", done: true, effort: 3, uncertainty: 3, startDate: "2025-11-01", projectedEndDate: "2025-12-01", completedDate: "2025-11-28", assigneeId: "emily-watson", blurb: "Document DVFS operating points, activity counter interfaces, and power domain structure.", learningTopicIds: ["system-partitioning", "power-clocking"] },
      { phase: "architecture", task: "Define DVFS operating points", done: false, effort: 3, uncertainty: 4, startDate: "2025-12-01", projectedEndDate: "2026-01-15", assigneeId: "emily-watson", blurb: "Characterise voltage-frequency pairs for EcoSoC and define lookup table entries for the policy engine.", learningTopicIds: ["power-clocking"] },
      { phase: "architecture", task: "Plan activity monitor counters", done: false, effort: 2, uncertainty: 3, startDate: "2026-01-10", projectedEndDate: "2026-02-10", assigneeId: "emily-watson", blurb: "Select performance counters (IPC, cache miss rate, bus utilisation) and define sampling strategy.", learningTopicIds: ["system-partitioning"] },
      { phase: "rtl", task: "Implement policy engine", done: false, effort: 4, uncertainty: 3, startDate: "2026-02-15", projectedEndDate: "2026-03-30", assigneeId: "emily-watson", blurb: "LUT-based decision logic mapping activity profiles to optimal voltage/frequency operating points.", learningTopicIds: ["fsm-design", "coding-style"] },
      { phase: "rtl", task: "Implement clock manager", done: false, effort: 4, uncertainty: 3, startDate: "2026-03-15", projectedEndDate: "2026-04-30", assigneeId: "emily-watson", blurb: "Glitch-free clock switching with programmable divider ratios and smooth transition logic.", learningTopicIds: ["coding-style", "power-clocking"] },
      { phase: "rtl", task: "Implement voltage controller SPI", done: false, effort: 3, uncertainty: 2, startDate: "2026-04-15", projectedEndDate: "2026-05-15", assigneeId: "emily-watson", blurb: "SPI master interface for controlling external PMIC voltage regulators with sequencing logic.", learningTopicIds: ["interface-protocols", "coding-style"] },
    ],
  },
];

export const designStages = [
  {
    id: "specification",
    title: "Specification",
    shortTitle: "Spec",
    description: "Define what your chip needs to do.",
    details: [
      "Functional requirements and use cases",
      "Performance targets (clock speed, throughput)",
      "Interface definitions (bus protocols, I/O)",
      "Power and area budgets",
      "Verification plan outline",
    ],
    icon: "FileText",
  },
  {
    id: "rtl-design",
    title: "RTL Design",
    shortTitle: "RTL",
    description: "Translate your specification into RTL code.",
    details: [
      "Write synthesisable Verilog/SystemVerilog",
      "Microarchitecture design decisions",
      "Clock domain and reset strategy",
      "Design for testability (DFT) considerations",
      "Code review and linting",
    ],
    icon: "Code",
  },
  {
    id: "verification",
    title: "Verification",
    shortTitle: "Verify",
    description: "Test your design rigorously.",
    details: [
      "Testbench development (UVM/SystemVerilog)",
      "Functional simulation",
      "Code and functional coverage analysis",
      "Formal property checking",
      "Assertion-based verification",
    ],
    icon: "CheckCircle",
  },
  {
    id: "synthesis",
    title: "Synthesis",
    shortTitle: "Synth",
    description: "Convert RTL into a gate-level netlist.",
    details: [
      "Logic synthesis with timing constraints",
      "Technology mapping to standard cells",
      "Timing analysis and optimisation",
      "Area and power reporting",
      "Design rule checking",
    ],
    icon: "Cpu",
  },
  {
    id: "physical-design",
    title: "Physical Design",
    shortTitle: "PD",
    description: "Transform gate-level netlist into physical layout.",
    details: [
      "Floorplanning and macro placement",
      "Standard cell placement & optimisation",
      "Clock tree synthesis (CTS)",
      "Routing and DRC clean-up",
      "Power grid and IR drop analysis",
    ],
    icon: "CircuitBoard",
  },
  {
    id: "tapeout",
    title: "Tapeout",
    shortTitle: "Tapeout",
    description: "Submit your design for fabrication.",
    details: [
      "Sign-off checks (DRC, LVS, ERC)",
      "Timing sign-off across all corners",
      "Shuttle service selection and submission",
      "Package and test planning",
      "GDSII preparation and delivery",
    ],
    icon: "Zap",
  },
];

export interface LearningTopic {
  id: string;
  title: string;
  summary: string;
  content: string;
  effort?: number;       // 1-5 scale
  uncertainty?: number;  // 1-5 scale
}

export interface LearningPhase {
  id: string;
  title: string;
  shortTitle: string;
  description: string;
  icon: string;
  topics: LearningTopic[];
}

export const learningPhases: LearningPhase[] = [
  {
    id: "architecture",
    title: "Architecture",
    shortTitle: "Arch",
    description:
      "Define the high-level architecture of your SoC — the building blocks, interconnects, and system-level decisions that shape everything downstream.",
    icon: "FileText",
    topics: [
      {
        id: "architecture-overview",
        title: "Overview",
        summary: "An introduction to the Architecture phase and what you'll learn.",
        content:
          "The Architecture phase is where you define the high-level blueprint of your System-on-Chip. You'll decide which functional blocks to include, how they connect, how memory is organised, and how clocks and power are managed. Getting architecture right is critical — mistakes here ripple through every downstream phase. This overview introduces the key decisions you'll make: system partitioning, bus architecture, memory mapping, IP selection, and power/clocking strategy.",
      },
      {
        id: "system-partitioning",
        title: "System Partitioning",
        summary: "Decide what goes on-chip vs off-chip and how subsystems interact.",
        content:
          "System partitioning determines boundaries between hardware blocks, software responsibility, and external interfaces. Consider power domains, clock domains, and data bandwidth between partitions. A well-partitioned system simplifies verification and enables parallel development across teams.",
        effort: 3,
        uncertainty: 4,
      },
      {
        id: "bus-architecture",
        title: "Bus Architecture & Interconnect",
        summary: "Choose your on-chip bus protocol and interconnect topology.",
        content:
          "Select from AMBA protocols (AHB, APB, AXI) based on bandwidth and complexity needs. AHB suits simple single-master systems, while AXI supports high-performance multi-master designs with out-of-order transactions. Consider crossbar vs shared-bus topologies and their area/performance trade-offs.",
        effort: 4,
        uncertainty: 3,
      },
      {
        id: "memory-map",
        title: "Memory Map & Address Space",
        summary: "Plan the address space allocation for peripherals and memory.",
        content:
          "Define a clean memory map that assigns address ranges to each peripheral, memory controller, and system register block. Follow ARM conventions for Cortex-M systems. Ensure no overlaps, leave room for future expansion, and document base addresses for software teams.",
        effort: 2,
        uncertainty: 2,
      },
      {
        id: "ip-selection",
        title: "IP Block Selection",
        summary: "Choose which IP blocks to integrate — build, buy, or use open source.",
        content:
          "Evaluate available IP for each function: processor cores (ARM DesignStart), communication interfaces (UART, SPI, I2C), timers, DMA controllers, and custom accelerators. Consider licensing terms, verification maturity, and integration effort for each block.",
        effort: 3,
        uncertainty: 4,
      },
      {
        id: "power-clocking",
        title: "Power & Clocking Strategy",
        summary: "Plan clock generation, distribution, and power management.",
        content:
          "Define clock domains, PLL/oscillator requirements, and clock gating strategy. For multi-domain designs, plan CDC (Clock Domain Crossing) synchronisers early. Consider power domains if targeting low-power operation, and plan reset sequencing across domains.",
        effort: 4,
        uncertainty: 3,
      },
    ],
  },
  {
    id: "rtl",
    title: "RTL Design",
    shortTitle: "RTL",
    description:
      "Write the Register Transfer Level code that describes your hardware in synthesisable Verilog or SystemVerilog.",
    icon: "Code",
    topics: [
      {
        id: "rtl-overview",
        title: "Overview",
        summary: "An introduction to the RTL Design phase and what you'll learn.",
        content:
          "The RTL Design phase is where your architecture becomes real hardware description code. You'll write synthesisable Verilog or SystemVerilog that defines the behaviour of every block in your SoC. This phase covers coding conventions, FSM design patterns, interface protocol implementation, parameterisation for reuse, and designing for testability. Clean, well-structured RTL is the foundation for successful verification, synthesis, and tapeout.",
      },
      {
        id: "coding-style",
        title: "Coding Style & Conventions",
        summary: "Establish RTL coding standards for a clean, synthesisable codebase.",
        content:
          "Use consistent naming conventions (snake_case for signals, UPPER_CASE for parameters). Always use non-blocking assignments in sequential blocks and blocking in combinational. Avoid latches by ensuring all branches are covered in combinational logic. Lint your code with tools like Verilator or Spyglass.",
        effort: 2,
        uncertainty: 1,
      },
      {
        id: "fsm-design",
        title: "Finite State Machine Design",
        summary: "Implement robust FSMs using proven design patterns.",
        content:
          "Use two-process or three-process FSM patterns for clarity. Encode states using localparams or enums. Always include a default state and handle unexpected transitions. Consider one-hot vs binary encoding based on your target technology — one-hot is faster on FPGAs, binary saves area in ASICs.",
        effort: 3,
        uncertainty: 2,
      },
      {
        id: "interface-protocols",
        title: "Interface Protocol Implementation",
        summary: "Implement standard bus interfaces (AXI, AHB, APB) correctly.",
        content:
          "Follow ARM AMBA specifications precisely — incorrect handshaking causes subtle bugs. Implement proper ready/valid handshaking for AXI, ensure single-cycle HREADY response for AHB, and handle wait states correctly on APB. Use protocol checkers during simulation to catch violations early.",
        effort: 5,
        uncertainty: 3,
      },
      {
        id: "parameterisation",
        title: "Parameterisation & Reuse",
        summary: "Write configurable, reusable RTL modules.",
        content:
          "Use SystemVerilog parameters and generate statements to create configurable modules. Parameterise data widths, FIFO depths, and feature enables. Write self-contained modules with clean interfaces that can be reused across projects. Document all parameters with their valid ranges.",
        effort: 3,
        uncertainty: 2,
      },
      {
        id: "dft-insertion",
        title: "Design for Testability (DFT)",
        summary: "Prepare your RTL for manufacturing test.",
        content:
          "Add scan chain insertion points, BIST (Built-In Self-Test) for memories, and JTAG test access ports. Structure your RTL to be scan-friendly by avoiding internally generated clocks and asynchronous resets where possible. DFT is critical for ASIC flows — plan it from the start.",
        effort: 4,
        uncertainty: 3,
      },
    ],
  },
  {
    id: "verification",
    title: "Verification",
    shortTitle: "Verify",
    description: "Rigorously test your design to ensure it meets the specification before committing to silicon.",
    icon: "CheckCircle",
    topics: [
      {
        id: "verification-overview",
        title: "Overview",
        summary: "An introduction to the Verification phase and what you'll learn.",
        content:
          "Verification is often the most time-consuming phase of hardware design — and the most important. A bug that reaches silicon costs orders of magnitude more to fix than one caught in simulation. This phase covers building structured testbench environments, constrained-random stimulus generation, functional coverage measurement, formal verification techniques, and setting up regression and CI/CD pipelines for your design.",
      },
      {
        id: "testbench-architecture",
        title: "Testbench Architecture",
        summary: "Build a structured verification environment using UVM or cocotb.",
        content:
          "A well-structured testbench separates stimulus generation, checking, and coverage collection. UVM provides a proven methodology with drivers, monitors, scoreboards, and sequences. For simpler projects or Python-familiar teams, cocotb offers a lightweight alternative with coroutine-based test flows.",
        effort: 4,
        uncertainty: 3,
      },
      {
        id: "constrained-random",
        title: "Constrained-Random Verification",
        summary: "Use randomised testing to find corner-case bugs.",
        content:
          "Define constraint classes that generate legal but diverse stimulus. Constrained-random testing finds bugs that directed tests miss by exploring unexpected state combinations. Combine with functional coverage to measure progress and identify gaps in your test space.",
        effort: 4,
        uncertainty: 4,
      },
      {
        id: "functional-coverage",
        title: "Functional Coverage",
        summary: "Measure and track what your tests actually exercise.",
        content:
          "Define covergroups for critical functionality: protocol transactions, FSM state transitions, boundary conditions, and error scenarios. Use cross-coverage to find untested combinations. Aim for meaningful coverage metrics rather than just high numbers — focus on functional intent, not line coverage alone.",
        effort: 3,
        uncertainty: 3,
      },
      {
        id: "formal-verification",
        title: "Formal Verification",
        summary: "Use mathematical proofs to verify protocol and interface correctness.",
        content:
          "Write SystemVerilog Assertions (SVA) to specify protocol rules and invariants. Formal tools exhaustively prove these properties hold for all possible inputs — no stimulus needed. Ideal for verifying bus protocols, arbitration logic, FIFO full/empty conditions, and CDC paths.",
        effort: 5,
        uncertainty: 2,
      },
      {
        id: "regression-ci",
        title: "Regression & CI/CD",
        summary: "Automate test runs and track results across design changes.",
        content:
          "Set up nightly regression suites that run your full test suite. Use CI/CD pipelines (GitHub Actions, GitLab CI) to run smoke tests on every commit. Track pass/fail trends, coverage progression, and simulation performance. Automate seed management for reproducible random tests.",
        effort: 3,
        uncertainty: 2,
      },
    ],
  },
  {
    id: "synthesis",
    title: "Synthesis",
    shortTitle: "Synth",
    description:
      "Transform your RTL into optimised gate-level netlists targeting your chosen technology — FPGA or ASIC standard cells.",
    icon: "Cpu",
    topics: [
      {
        id: "synthesis-overview",
        title: "Overview",
        summary: "An introduction to the Synthesis phase and what you'll learn.",
        content:
          "Synthesis transforms your RTL code into an optimised gate-level netlist — the bridge between abstract hardware description and physical implementation. You'll learn to write timing constraints, choose synthesis strategies that balance area, speed, and power, close timing on critical paths, and run lint and CDC checks to catch structural issues before they become silicon bugs.",
      },
      {
        id: "constraints",
        title: "Timing Constraints (SDC)",
        summary: "Write Synopsys Design Constraints to guide synthesis optimisation.",
        content:
          "Define clock definitions, input/output delays, and false/multi-cycle paths. Accurate constraints are essential — over-constraining wastes area and power, under-constraining leads to timing failures. Use create_clock, set_input_delay, set_output_delay, and set_false_path judiciously.",
        effort: 3,
        uncertainty: 3,
      },
      {
        id: "synthesis-strategies",
        title: "Synthesis Strategies",
        summary: "Choose optimisation targets: area, speed, or power.",
        content:
          "Balance area, timing, and power goals through synthesis directives. Use compile_ultra for aggressive optimisation, apply clock gating for power reduction, and flatten hierarchies where timing is critical. Iteratively refine based on synthesis reports — each run teaches you about your design's bottlenecks.",
        effort: 4,
        uncertainty: 3,
      },
      {
        id: "timing-closure",
        title: "Timing Closure",
        summary: "Analyse and fix timing violations in the synthesised netlist.",
        content:
          "Read timing reports to identify critical paths, setup/hold violations, and clock skew issues. Fix violations through RTL restructuring (pipeline stages, logic re-partitioning), constraint adjustments, or synthesis directives. Timing closure is iterative — expect multiple passes between synthesis and RTL changes.",
        effort: 5,
        uncertainty: 4,
      },
      {
        id: "lint-cdc-checks",
        title: "Lint & CDC Checks",
        summary: "Run structural checks to catch common design errors.",
        content:
          "Use RTL lint tools (Spyglass, Ascent Lint) to catch coding issues that could cause simulation/synthesis mismatches. Run CDC analysis to verify all clock domain crossings are properly synchronised. Fix all lint warnings before proceeding — they often indicate real bugs.",
        effort: 2,
        uncertainty: 2,
      },
    ],
  },
  {
    id: "physical-design",
    title: "Physical Design",
    shortTitle: "PD",
    description:
      "Transform your gate-level netlist into a physical layout ready for fabrication — floorplanning, placement, routing, and sign-off.",
    icon: "CircuitBoard",
    topics: [
      {
        id: "physical-design-overview",
        title: "Overview",
        summary: "An introduction to the Physical Design phase and what you'll learn.",
        content:
          "Physical Design turns your gate-level netlist into a real chip layout. This is where abstract logic becomes geometric shapes on silicon — floorplanning decides where blocks go, placement positions every standard cell, clock tree synthesis ensures timing coherence, routing connects everything with metal wires, and power analysis verifies robust power delivery. Each step requires iterative refinement to meet timing, area, and power targets.",
      },
      {
        id: "floorplanning",
        title: "Floorplanning",
        summary: "Plan the physical arrangement of blocks and I/O pads on the die.",
        content:
          "Define die size, place hard macros (memories, PLLs), and plan power grid topology. Good floorplanning prevents congestion and timing issues downstream. Place related blocks close together, keep critical paths short, and ensure adequate routing channels between dense blocks.",
        effort: 4,
        uncertainty: 3,
      },
      {
        id: "placement",
        title: "Placement & Optimisation",
        summary: "Place standard cells and optimise for timing and congestion.",
        content:
          "The placer assigns physical locations to each standard cell. Guide it with placement blockages, regions, and density targets. Run incremental optimisation after placement to fix timing and reduce congestion. Check placement quality through timing, congestion, and utilisation reports.",
        effort: 4,
        uncertainty: 3,
      },
      {
        id: "clock-tree",
        title: "Clock Tree Synthesis (CTS)",
        summary: "Build balanced clock distribution networks.",
        content:
          "CTS inserts buffers and inverters to distribute clocks with minimal skew across all flip-flops. Define target skew, insertion delay, and transition time. Check clock tree quality — excessive skew wastes timing margin, excessive buffers consume area and power. Handle multi-clock designs carefully.",
        effort: 5,
        uncertainty: 4,
      },
      {
        id: "routing",
        title: "Routing & DRC Clean-up",
        summary: "Connect all cells with metal wires following design rules.",
        content:
          "Global routing plans wire paths, detailed routing implements them on metal layers. Fix DRC violations (spacing, width, via rules) iteratively. Handle antenna effects, electromigration, and IR drop checks. A clean route with zero DRC violations is required for tapeout.",
        effort: 5,
        uncertainty: 4,
      },
      {
        id: "power-analysis",
        title: "Power Grid & IR Drop Analysis",
        summary: "Ensure robust power delivery across the die.",
        content:
          "Design power rings and stripes to deliver VDD/VSS with minimal IR drop. Analyse static and dynamic IR drop to ensure all cells receive adequate voltage. Hot spots with excessive current density can cause electromigration failures — fix with wider stripes or additional vias.",
        effort: 4,
        uncertainty: 3,
      },
    ],
  },
  {
    id: "tapeout",
    title: "Tapeout",
    shortTitle: "Tapeout",
    description: "Prepare and submit your final design database (GDSII) for fabrication through a shuttle service.",
    icon: "Zap",
    topics: [
      {
        id: "tapeout-overview",
        title: "Overview",
        summary: "An introduction to the Tapeout phase and what you'll learn.",
        content:
          "Tapeout is the point of no return — once your GDSII is submitted for fabrication, there's no going back. This phase covers the final sign-off checks (DRC, LVS, ERC), static timing analysis across all process corners, shuttle service submission procedures, and packaging and test planning. Meticulous attention to detail here is what separates a successful chip from an expensive paperweight.",
      },
      {
        id: "signoff-checks",
        title: "Sign-off Checks (DRC/LVS/ERC)",
        summary: "Run final verification checks required by the foundry.",
        content:
          "Design Rule Check (DRC) ensures your layout follows foundry manufacturing rules. Layout vs Schematic (LVS) confirms the layout matches your netlist. Electrical Rule Check (ERC) catches issues like floating gates and missing connections. All must pass with zero errors before submission.",
        effort: 4,
        uncertainty: 2,
      },
      {
        id: "timing-signoff",
        title: "Timing Sign-off (STA)",
        summary: "Verify timing across all process/voltage/temperature corners.",
        content:
          "Run Static Timing Analysis across worst-case and best-case PVT corners. Check setup timing at slow corners and hold timing at fast corners. Include on-chip variation (OCV) derating. All paths must meet timing with margin — there are no second chances after tapeout.",
        effort: 5,
        uncertainty: 3,
      },
      {
        id: "shuttle-submission",
        title: "Shuttle Service Submission",
        summary: "Submit to multi-project wafer services like Europractice or OpenMPW.",
        content:
          "Shuttle services share wafer costs across multiple designs. Prepare your GDSII according to shuttle-specific requirements: die size, pad frame, seal ring, and fill rules. Submit before the deadline with all required documentation. Turnaround is typically 3-6 months.",
        effort: 3,
        uncertainty: 2,
      },
      {
        id: "packaging",
        title: "Packaging & Test Planning",
        summary: "Choose packaging and plan production test methodology.",
        content:
          "Select a package type (QFP, BGA, chip-on-board) based on pin count, thermal needs, and cost. Define the bond pad to package pin mapping. Plan production tests using scan chains, BIST, and functional tests. Create test programs for ATE (Automatic Test Equipment) if needed.",
        effort: 3,
        uncertainty: 3,
      },
    ],
  },
  {
    id: "silicon-validation",
    title: "Silicon Validation",
    shortTitle: "SiVal",
    description: "Validate your fabricated chips — bring-up, characterisation, and debugging on real silicon.",
    icon: "Cpu",
    topics: [
      {
        id: "silicon-validation-overview",
        title: "Overview",
        summary: "An introduction to the Silicon Validation phase and what you'll learn.",
        content:
          "Silicon Validation is where your design meets reality. After months of simulation, synthesis, and fabrication, you finally have physical chips to test. This phase covers the methodical bring-up process, functional testing against specifications, performance characterisation across voltage and temperature, debugging techniques for silicon bugs, and documenting results and errata for future design iterations.",
      },
      {
        id: "bring-up",
        title: "Silicon Bring-up",
        summary: "Power on your chip for the first time and establish basic communication.",
        content:
          "Start with power supply sequencing and checking current draw. Establish JTAG connectivity, read device ID registers, and verify clock generation. Bring-up is methodical — check one subsystem at a time, starting with the simplest peripherals. Keep a detailed lab notebook of all measurements.",
        effort: 4,
        uncertainty: 5,
      },
      {
        id: "functional-test",
        title: "Functional Testing",
        summary: "Verify all chip functions match the original specification.",
        content:
          "Run the same test vectors used in simulation on real silicon. Compare results systematically. Test all interfaces, peripheral modes, and interrupt paths. Watch for issues that simulation might miss: noise sensitivity, supply droop under load, and temperature-dependent behaviour.",
        effort: 4,
        uncertainty: 4,
      },
      {
        id: "characterisation",
        title: "Performance Characterisation",
        summary: "Measure speed, power, and analogue performance across conditions.",
        content:
          "Measure maximum clock frequency by sweeping speed until failure. Profile power consumption in active and sleep modes. Characterise across voltage (±10%) and temperature (-40°C to 85°C for industrial). Compare silicon measurements against pre-silicon estimates and identify discrepancies.",
        effort: 5,
        uncertainty: 4,
      },
      {
        id: "debug-techniques",
        title: "Debug Techniques",
        summary: "Diagnose and work around silicon bugs.",
        content:
          "Use JTAG debug, trace ports, and on-chip instrumentation to isolate bugs. Compare silicon behaviour against RTL simulation using the same stimulus. Common issues include hold-time violations, CDC glitches, and analogue/digital boundary problems. Document all errata for future design spins.",
        effort: 5,
        uncertainty: 5,
      },
      {
        id: "documentation",
        title: "Documentation & Errata",
        summary: "Document results, known issues, and lessons learned.",
        content:
          "Write a silicon validation report covering all test results, characterisation data, and known errata. Document workarounds for any bugs found. Feed lessons back into the design process for the next tape-out. Share findings with the community to help others avoid the same pitfalls.",
        effort: 2,
        uncertainty: 1,
      },
    ],
  },
];

export const technologies = [
  // ── Components > Processors ──
  {
    id: "arm-cortex-m0",
    name: "ARM Cortex-M0",
    group: "Components",
    category: "Processors",
    description:
      "Ultra-low-power 32-bit processor ideal for education and small designs. Available through the ARM DesignStart programme.",
    longDescription:
      "The ARM Cortex-M0 is the smallest and most energy-efficient ARM processor, featuring a 3-stage pipeline and Thumb instruction set. Its minimal gate count makes it ideal for FPGA prototyping and educational SoC designs. Available royalty-free through the ARM DesignStart programme.",
    features: [
      "32-bit ARMv6-M architecture",
      "3-stage pipeline",
      "Thumb instruction set",
      "Minimal gate count (~12K gates)",
      "AMBA AHB-Lite interface",
      "Available via DesignStart",
    ],
    links: [{ label: "ARM DesignStart", url: "https://www.arm.com/resources/designstart" }],
  },
  {
    id: "arm-cortex-m3",
    name: "ARM Cortex-M3",
    group: "Components",
    category: "Processors",
    description:
      "Feature-rich 32-bit processor with hardware multiply, divide, and extensive debug support. Suitable for production designs.",
    longDescription:
      "The ARM Cortex-M3 brings a richer feature set including hardware multiply/divide, bit-banding, and a Nested Vectored Interrupt Controller (NVIC). Its 3-stage pipeline and Thumb-2 instruction set deliver high code density and performance suitable for production ASIC tapeouts.",
    features: [
      "32-bit ARMv7-M architecture",
      "3-stage pipeline with branch speculation",
      "Thumb-2 instruction set",
      "Hardware multiply and divide",
      "NVIC with up to 240 interrupts",
      "Memory Protection Unit (MPU)",
    ],
    links: [{ label: "ARM Cortex-M3 Documentation", url: "https://developer.arm.com/Processors/Cortex-M3" }],
  },

  // ── Components > System Interconnects ──
  {
    id: "amba-interconnect",
    name: "AMBA Interconnect (AHB / AXI / APB)",
    group: "Components",
    category: "System Interconnects",
    description:
      "ARM's Advanced Microcontroller Bus Architecture protocols for on-chip communication between processors, peripherals, and memory.",
    longDescription:
      "AMBA (Advanced Microcontroller Bus Architecture) is the de-facto standard for on-chip interconnects in ARM-based SoCs. AHB-Lite provides a simple single-master bus, AXI enables high-performance multi-master access with out-of-order transactions, and APB offers a low-power interface for slow peripherals.",
    features: [
      "AHB-Lite: simple single-master bus",
      "AXI: high-performance, out-of-order, multi-master",
      "APB: low-power peripheral bus",
      "Bus matrix for concurrent access",
      "Well-documented open specification",
      "Widely supported by IP vendors",
    ],
    links: [
      { label: "AMBA Specification", url: "https://developer.arm.com/architectures/system-architectures/amba" },
    ],
  },

  // ── Components > Peripherals ──
  {
    id: "standard-peripherals",
    name: "Standard Peripheral IP",
    group: "Components",
    category: "Peripherals",
    description:
      "Common on-chip peripherals including GPIO, UART, SPI, I2C, timers, and watchdog for embedded SoC designs.",
    longDescription:
      "Standard peripheral IP blocks provide essential I/O and control functionality for embedded SoCs. These include general-purpose I/O (GPIO), serial communication (UART, SPI, I2C), timers, watchdog, and real-time clocks. Available as open-source or through ARM DesignStart.",
    features: [
      "GPIO with programmable direction and interrupts",
      "UART with configurable baud rate",
      "SPI master/slave with DMA support",
      "I2C multi-master capable",
      "32-bit timers with capture/compare",
      "Watchdog with system reset",
    ],
    links: [
      { label: "ARM CMSDK Peripherals", url: "https://developer.arm.com/Tools%20and%20Software/Corstone-101" },
    ],
  },

  // ── Components > Memory Controllers ──
  {
    id: "memory-controllers",
    name: "SRAM & Memory Controllers",
    group: "Components",
    category: "Memory Controllers",
    description:
      "On-chip SRAM blocks and memory controller IP for interfacing with external memories in SoC designs.",
    longDescription:
      "Memory subsystems are critical to SoC performance. On-chip SRAM provides fast, low-latency storage for code and data, while memory controllers manage access to external DRAM or Flash. Designs must consider bandwidth, latency, power, and area trade-offs.",
    features: [
      "Single-port and dual-port SRAM blocks",
      "Configurable memory sizes",
      "AHB/AXI memory interface wrappers",
      "Optional ECC for reliability",
      "Low-power retention modes",
      "BIST (Built-In Self Test) support",
    ],
    links: [],
  },

  // ── Components > Hardware Acceleration ──
  {
    id: "hw-acceleration",
    name: "Custom Accelerator Interfaces",
    group: "Components",
    category: "Hardware Acceleration",
    description:
      "Standardised interfaces and templates for integrating custom hardware accelerators into ARM-based SoCs.",
    longDescription:
      "Custom accelerators are key to achieving high performance and energy efficiency for domain-specific workloads. SoC Labs provides standardised accelerator interface templates compatible with AMBA bus protocols, enabling rapid integration of custom compute engines for ML, DSP, cryptography, and more.",
    features: [
      "AHB-Lite slave accelerator template",
      "AXI4 streaming interface support",
      "DMA request and interrupt lines",
      "Memory-mapped register interface",
      "Configurable data width and buffering",
      "Example accelerator designs available",
    ],
    links: [
      { label: "SoC Labs Accelerator Guide", url: "https://git.soton.ac.uk/soclabs/accelerator-project" },
    ],
  },

  // ── EDA Tooling > RTL Design ──
  {
    id: "verilator-linting",
    name: "Verilator / Linting Tools",
    group: "EDA Tooling",
    category: "RTL Design",
    description:
      "Open-source RTL simulation and linting tools for catching design errors early in the development cycle.",
    longDescription:
      "Verilator compiles synthesisable Verilog and SystemVerilog into fast C++ or SystemC models. It also provides powerful linting capabilities that catch common RTL coding errors. Combined with tools like Spyglass, these form the first line of defence for design quality.",
    features: [
      "Fast cycle-accurate simulation",
      "Comprehensive linting rules",
      "SystemVerilog support",
      "C++/SystemC testbench integration",
      "Coverage collection",
      "Open-source and free",
    ],
    links: [
      { label: "Verilator", url: "https://www.veripool.org/verilator/" },
    ],
  },

  // ── EDA Tooling > Verification ──
  {
    id: "uvm-cocotb",
    name: "UVM / cocotb",
    group: "EDA Tooling",
    category: "Verification",
    description:
      "Universal Verification Methodology (SystemVerilog) and cocotb (Python) for comprehensive design verification.",
    longDescription:
      "UVM is the industry-standard verification methodology built on SystemVerilog, providing a structured framework for creating reusable testbenches. cocotb offers a Python-based alternative that lowers the barrier to entry while still supporting complex verification scenarios with coroutine-driven test flows.",
    features: [
      "UVM: structured verification methodology",
      "Constrained-random stimulus generation",
      "Functional coverage collection",
      "cocotb: Python-based testbenches",
      "Coroutine-driven test flows",
      "Works with major simulators",
    ],
    links: [
      { label: "UVM Reference", url: "https://www.accellera.org/activities/working-groups/uvm" },
      { label: "cocotb GitHub", url: "https://github.com/cocotb/cocotb" },
    ],
  },

  // ── EDA Tooling > Synthesis ──
  {
    id: "vivado-quartus",
    name: "Vivado / Quartus",
    group: "EDA Tooling",
    category: "Synthesis",
    description:
      "Industry-standard FPGA development suites from AMD/Xilinx and Intel/Altera for synthesis, place & route, and programming.",
    longDescription:
      "Vivado (AMD/Xilinx) and Quartus Prime (Intel/Altera) are the primary FPGA development environments. They provide integrated synthesis, place & route, timing analysis, and on-chip debugging. Both offer free editions suitable for academic use with most common FPGA families.",
    features: [
      "RTL synthesis and optimisation",
      "Place and route",
      "Static timing analysis",
      "Integrated logic analyser (ILA/SignalTap)",
      "IP integrator and block design",
      "Free academic licences available",
    ],
    links: [
      { label: "AMD Vivado", url: "https://www.xilinx.com/products/design-tools/vivado.html" },
      { label: "Intel Quartus", url: "https://www.intel.com/content/www/us/en/products/details/fpga/development-tools/quartus-prime.html" },
    ],
  },
  {
    id: "yosys",
    name: "Yosys",
    group: "EDA Tooling",
    category: "Synthesis",
    description: "Open-source synthesis framework supporting Verilog and SystemVerilog for both FPGA and ASIC flows.",
    longDescription:
      "Yosys is an open-source synthesis framework that converts RTL into optimised gate-level netlists. It supports technology mapping to FPGA architectures (via nextpnr) and standard cell libraries for ASIC flows. Its modular architecture enables custom synthesis passes and formal verification via sby.",
    features: [
      "Open-source Verilog synthesis",
      "Technology mapping to FPGAs and ASICs",
      "Formal verification via sby",
      "Modular pass-based architecture",
      "Lattice iCE40 / ECP5 support",
      "Active community and development",
    ],
    links: [
      { label: "Yosys GitHub", url: "https://github.com/YosysHQ/yosys" },
    ],
  },
  {
    id: "design-compiler-genus",
    name: "Design Compiler / Genus",
    group: "EDA Tooling",
    category: "Synthesis",
    description:
      "Industry-standard ASIC logic synthesis tools from Synopsys and Cadence for production-quality gate-level netlists.",
    longDescription:
      "Design Compiler (Synopsys) and Genus (Cadence) are the leading commercial logic synthesis tools for ASIC design. They translate RTL into optimised gate-level netlists mapped to standard cell libraries, with advanced timing optimisation, power analysis, and design-for-test insertion capabilities.",
    features: [
      "Advanced timing-driven synthesis",
      "Multi-corner multi-mode optimisation",
      "Power-aware synthesis (UPF/CPF)",
      "DFT insertion (scan chains)",
      "Standard cell library mapping",
      "Academic licensing available",
    ],
    links: [
      { label: "Synopsys University", url: "https://www.synopsys.com/university.html" },
      { label: "Cadence Academic", url: "https://www.cadence.com/en_US/home/company/cadence-academic-network.html" },
    ],
  },

  // ── EDA Tooling > Physical Design ──
  {
    id: "openroad",
    name: "OpenROAD",
    group: "EDA Tooling",
    category: "Physical Design",
    description: "Open-source physical design platform providing automated floorplanning, placement, CTS, and routing.",
    longDescription:
      "OpenROAD is an open-source RTL-to-GDSII flow that automates floorplanning, placement, clock tree synthesis, and routing. It enables fully transparent ASIC physical design without commercial tool licences, making tapeout accessible for academic and research groups.",
    features: [
      "Automated floorplanning",
      "Global and detailed placement",
      "Clock tree synthesis (CTS)",
      "Global and detailed routing",
      "Timing-driven optimisation",
      "Open PDK support (SkyWater 130nm)",
    ],
    links: [
      { label: "OpenROAD", url: "https://openroad.readthedocs.io/" },
    ],
  },
  {
    id: "innovus-icc2",
    name: "Innovus / ICC2",
    group: "EDA Tooling",
    category: "Physical Design",
    description:
      "Commercial physical design tools from Cadence and Synopsys for production-quality ASIC place & route.",
    longDescription:
      "Innovus (Cadence) and IC Compiler II (Synopsys) are the industry-standard tools for ASIC physical design. They provide advanced placement, clock tree synthesis, routing, and optimisation engines that achieve production-quality results across advanced technology nodes.",
    features: [
      "Advanced multi-objective placement",
      "Clock tree synthesis and optimisation",
      "Detail routing with DRC fix",
      "IR drop and EM analysis",
      "Multi-corner multi-mode optimisation",
      "Academic licensing available",
    ],
    links: [
      { label: "Cadence Innovus", url: "https://www.cadence.com/en_US/home/tools/digital-design-and-signoff/soc-implementation-and-floorplanning/innovus-implementation-system.html" },
    ],
  },

  // ── EDA Tooling > Tapeout ──
  {
    id: "signoff-tools",
    name: "Sign-off Tools (DRC / LVS / STA)",
    group: "EDA Tooling",
    category: "Tapeout",
    description:
      "Design rule checking, layout vs schematic verification, and static timing analysis tools for tapeout sign-off.",
    longDescription:
      "Before submitting a design for fabrication, it must pass sign-off checks: DRC verifies manufacturing rules, LVS confirms the layout matches the schematic, and STA ensures timing is met across all operating corners. Tools include Calibre (Siemens), IC Validator (Synopsys), and PrimeTime.",
    features: [
      "DRC: design rule checking",
      "LVS: layout vs schematic verification",
      "STA: static timing analysis",
      "Power integrity analysis",
      "Signal integrity checks",
      "GDSII generation and validation",
    ],
    links: [
      { label: "Siemens Calibre", url: "https://eda.sw.siemens.com/en-US/ic/calibre/" },
    ],
  },

  // ── EDA Tooling > Silicon Validation ──
  {
    id: "debug-test-tools",
    name: "Debug & Test Equipment",
    group: "EDA Tooling",
    category: "Silicon Validation",
    description:
      "JTAG debuggers, logic analysers, and automated test equipment for post-silicon bring-up and validation.",
    longDescription:
      "After fabrication, silicon must be validated against its specification. This requires JTAG debug probes (e.g., ARM DSTREAM), logic analysers, oscilloscopes, and automated test equipment (ATE). Software tools like ARM DS-5 and OpenOCD provide debug access to the running chip.",
    features: [
      "JTAG / SWD debug access",
      "ARM DSTREAM / ULINKpro probes",
      "OpenOCD open-source debugger",
      "Logic analyser integration",
      "Power measurement and profiling",
      "Automated test pattern generation",
    ],
    links: [
      { label: "OpenOCD", url: "https://openocd.org/" },
      { label: "ARM Development Studio", url: "https://developer.arm.com/Tools%20and%20Software/Arm%20Development%20Studio" },
    ],
  },

  // ── Infrastructure > FPGA Boards ──
  {
    id: "fpga-boards",
    name: "FPGA Development Boards",
    group: "Infrastructure",
    category: "FPGA Boards",
    description:
      "Prototyping boards from Xilinx/AMD and Intel/Altera used for SoC validation before ASIC fabrication.",
    longDescription:
      "FPGA development boards provide real hardware for prototyping SoC designs. Popular boards include Digilent Arty A7 (Xilinx Artix-7), Terasic DE10 (Intel Cyclone V), and higher-end platforms for larger designs. FPGA prototyping is a critical step before committing to silicon.",
    features: [
      "Digilent Arty A7 (Artix-7 35T/100T)",
      "Terasic DE10 (Cyclone V)",
      "Nexys A7 for education",
      "On-board JTAG programming",
      "Pmod and Arduino-compatible headers",
      "Academic pricing available",
    ],
    links: [
      { label: "Digilent Arty A7", url: "https://digilent.com/shop/arty-a7/" },
      { label: "Terasic DE10", url: "https://www.terasic.com.tw/" },
    ],
  },

  // ── Infrastructure > Shuttle Services ──
  {
    id: "shuttle-services",
    name: "ASIC Shuttle Services",
    group: "Infrastructure",
    category: "Shuttle Services",
    description:
      "Multi-project wafer services enabling affordable silicon fabrication for academic and research designs.",
    longDescription:
      "ASIC shuttle services share wafer costs across multiple designs, making fabrication affordable for universities and small teams. Europractice provides access to advanced nodes (TSMC, GlobalFoundries), while Google/efabless OpenMPW offers free fabrication on SkyWater 130nm for open-source designs.",
    features: [
      "Europractice MPW shuttles",
      "Google/efabless OpenMPW (free)",
      "chipIgnite programme",
      "MOSIS educational shuttles",
      "Technology nodes from 130nm to 7nm",
      "Package and test included",
    ],
    links: [
      { label: "Europractice", url: "https://europractice-ic.com/" },
      { label: "efabless chipIgnite", url: "https://efabless.com/" },
    ],
  },
];

export const partners = [
  // Industry Partners
  {
    id: "arm",
    name: "ARM",
    type: "industry" as const,
    country: "United Kingdom",
    description:
      "Provider of processor IP through the DesignStart programme, enabling academic access to Cortex-M processors.",
    longDescription:
      "ARM provides the processor IP at the heart of SoC Labs reference designs. Through the DesignStart programme, academic institutions get royalty-free access to Cortex-M0 and Cortex-M3 cores, complete with documentation, example systems, and development tools.",
    url: "https://www.arm.com",
    logo: "/placeholder.svg",
    coordinates: [-1.2578, 51.752] as [number, number],
  },
  {
    id: "europractice",
    name: "Europractice",
    type: "industry" as const,
    country: "Belgium",
    description:
      "ASIC fabrication service providing multi-project wafer (MPW) shuttle access for academic and research institutions.",
    longDescription:
      "Europractice provides affordable access to ASIC fabrication for academic institutions across Europe. Their multi-project wafer (MPW) shuttle services allow university research groups to tape out designs in advanced process nodes at a fraction of the cost of a full wafer run.",
    url: "https://europractice-ic.com",
    logo: "/placeholder.svg",
    coordinates: [4.7005, 50.8798] as [number, number],
  },
  {
    id: "ukri",
    name: "UKRI",
    type: "industry" as const,
    country: "United Kingdom",
    description:
      "UK Research and Innovation — funding body supporting research infrastructure and collaborative projects.",
    longDescription:
      "UKRI funds research infrastructure and collaborative projects across UK universities. Their support enables SoC Labs to provide shared design resources, training programmes, and access to fabrication services for the UK academic community.",
    url: "https://www.ukri.org",
    logo: "/placeholder.svg",
    coordinates: [-0.9628, 51.4543] as [number, number],
  },
  {
    id: "ieee",
    name: "IEEE",
    type: "industry" as const,
    country: "United States of America",
    description:
      "Professional association supporting standards development and knowledge sharing in electronics and computing.",
    longDescription:
      "IEEE supports the SoC Labs community through standards development, conferences, and publication venues. Community members regularly publish in IEEE journals and present at IEEE conferences on topics ranging from processor design to verification methodology.",
    url: "https://www.ieee.org",
    logo: "/placeholder.svg",
    coordinates: [-74.1724, 40.7357] as [number, number],
  },
  {
    id: "google",
    name: "Google",
    type: "industry" as const,
    country: "United States of America",
    description:
      "Supporting open-source silicon initiatives and providing shuttle access through the Google-sponsored OpenMPW programme.",
    longDescription:
      "Google sponsors the OpenMPW programme through efabless, providing free ASIC fabrication for open-source designs on the SkyWater 130nm process. This initiative has enabled dozens of academic and hobbyist designs to reach silicon.",
    url: "https://developers.google.com",
    logo: "/placeholder.svg",
    coordinates: [-122.0842, 37.422] as [number, number],
  },
  {
    id: "efabless",
    name: "efabless",
    type: "industry" as const,
    country: "United States of America",
    description: "Platform for open-source chip design and fabrication, providing access to shuttle programmes.",
    longDescription:
      "efabless provides a cloud-based platform for chip design and manages the OpenMPW and chipIgnite shuttle programmes. Their platform streamlines the tapeout process, making ASIC fabrication accessible to individual designers and small research groups.",
    url: "https://efabless.com",
    logo: "/placeholder.svg",
    coordinates: [-97.7431, 30.2672] as [number, number],
  },
  // Academic Partners
  {
    id: "imperial-college-london",
    name: "Imperial College London",
    type: "academic" as const,
    country: "United Kingdom",
    description: "Leading research in embedded intelligence and hardware-software co-design for edge AI applications.",
    longDescription:
      "Imperial College London's Department of Electrical and Electronic Engineering is a world leader in embedded systems and AI hardware research. Their Embedded Intelligence Lab focuses on deploying neural network models onto resource-constrained hardware, contributing key accelerator IP to the SoC Labs ecosystem.",
    url: "https://www.imperial.ac.uk",
    logo: "imperial-college-london",
    coordinates: [-0.1749, 51.4988] as [number, number],
  },
  {
    id: "university-of-cape-town",
    name: "University of Cape Town",
    type: "academic" as const,
    country: "South Africa",
    description:
      "Pioneering hardware security research with a focus on lightweight cryptographic implementations for IoT.",
    longDescription:
      "The University of Cape Town's hardware security group specialises in lightweight cryptographic implementations for resource-constrained IoT devices. They have successfully taped out multiple ASIC designs through Europractice shuttle services and actively mentor students across Southern Africa.",
    url: "https://www.uct.ac.za",
    logo: "university-of-cape-town",
    coordinates: [18.4601, -33.9577] as [number, number],
  },
  {
    id: "eth-zurich",
    name: "ETH Zürich",
    type: "academic" as const,
    country: "Switzerland",
    description: "World-class research in reconfigurable computing and digital signal processing architectures.",
    longDescription:
      "ETH Zürich's Integrated Systems Laboratory conducts cutting-edge research in reconfigurable computing, digital signal processing, and energy-efficient computing. Their work on configurable DSP architectures demonstrates how custom hardware can dramatically improve throughput and energy efficiency.",
    url: "https://ethz.ch",
    logo: "eth-zurich",
    coordinates: [8.5482, 47.3769] as [number, number],
  },
  {
    id: "university-of-tokyo",
    name: "University of Tokyo",
    type: "academic" as const,
    country: "Japan",
    description: "Research in heterogeneous multi-ISA architectures and advanced processor design methodologies.",
    longDescription:
      "The University of Tokyo's VLSI Design and Education Centre explores heterogeneous multi-ISA computing and advanced processor design. Their research into integrating RISC-V cores alongside ARM processors in SoC Labs platforms opens new paradigms for workload partitioning.",
    url: "https://www.u-tokyo.ac.jp/en/",
    logo: "university-of-tokyo",
    coordinates: [139.7671, 35.6812] as [number, number],
  },
  {
    id: "mit",
    name: "MIT",
    type: "academic" as const,
    country: "United States of America",
    description:
      "Energy-efficient circuits research spanning digital and mixed-signal power management for IoT devices.",
    longDescription:
      "MIT's Energy-Efficient Circuits group develops adaptive power management techniques for always-on IoT devices. Their work on dynamic voltage and frequency scaling (DVFS) controllers for the EcoSoC platform targets 40-60% energy reduction for typical IoT workloads.",
    url: "https://www.mit.edu",
    logo: "mit",
    coordinates: [-71.0942, 42.3601] as [number, number],
  },
  {
    id: "iit-bombay",
    name: "IIT Bombay",
    type: "academic" as const,
    country: "India",
    description: "Expert research in on-chip communication architectures and SoC integration methodologies.",
    longDescription:
      "IIT Bombay's VLSI group focuses on on-chip communication architectures and SoC integration. Their research on high-performance bus interconnects and communication interfaces contributes critical infrastructure IP to the EcoSoC platform.",
    url: "https://www.iitb.ac.in",
    logo: "iit-bombay",
    coordinates: [72.8544, 19.0222] as [number, number],
  },
  {
    id: "tu-munich",
    name: "TU Munich",
    type: "academic" as const,
    country: "Germany",
    description: "Safety-critical hardware design research targeting automotive ISO 26262 compliance.",
    longDescription:
      "TU Munich's Chair of Integrated Systems focuses on safety-critical hardware design for automotive applications. Their work on certified safety controllers based on the EcoSoC targets ISO 26262 compliance for autonomous vehicle subsystems.",
    url: "https://www.tum.de/en/",
    logo: "tu-munich",
    coordinates: [11.582, 48.1351] as [number, number],
  },
];

export const communityMembers = [
  {
    id: "sarah-chen",
    name: "Dr. Sarah Chen",
    institution: "Imperial College London",
    organisations: ["imperial-college-london", "arm"],
    location: "London, UK",
    coordinates: [-0.1749, 51.4988] as [number, number],
    projects: ["Neural Network Inference Accelerator"],
    expertise: ["Machine Learning", "FPGA Design"],
    bio: "Dr. Chen leads the Embedded Intelligence Lab at Imperial College, where her research focuses on deploying neural network models onto resource-constrained hardware. She has published over 30 papers on hardware-software co-design for edge AI and is a key contributor to the NanoSoC ML accelerator project.",
    interests: ["ml-accelerators", "fpga-design", "arm-cortex-m0"],
    url: "#",
  },
  {
    id: "james-okonkwo",
    name: "Prof. James Okonkwo",
    institution: "University of Cape Town",
    organisations: ["university-of-cape-town", "europractice"],
    location: "Cape Town, South Africa",
    coordinates: [18.4601, -33.9577] as [number, number],
    projects: ["Lightweight Cryptographic Engine"],
    expertise: ["Cryptography", "ASIC Design"],
    bio: "Professor Okonkwo is a leading researcher in hardware security, specialising in lightweight cryptographic implementations for IoT devices. His group at UCT has taped out multiple ASIC designs through Europractice shuttle services and actively mentors students across Southern Africa.",
    interests: ["cryptography-security", "asic-tapeout", "arm-cortex-m3"],
    url: "#",
  },
  {
    id: "maria-gonzalez",
    name: "Maria Gonzalez",
    institution: "ETH Zürich",
    organisations: ["eth-zurich"],
    location: "Zürich, Switzerland",
    coordinates: [8.5482, 47.3769] as [number, number],
    projects: ["Configurable DSP Filter Bank"],
    expertise: ["DSP", "Signal Processing"],
    bio: "Maria is a doctoral researcher at ETH Zürich working on reconfigurable signal processing architectures. Her DSP filter bank project demonstrates how custom hardware can dramatically improve the throughput and energy efficiency of multi-channel sensor data processing.",
    interests: ["dsp-signal-processing", "fpga-design", "fpga-prototyping"],
    url: "#",
  },
  {
    id: "kenji-tanaka",
    name: "Dr. Kenji Tanaka",
    institution: "University of Tokyo",
    organisations: ["university-of-tokyo", "ieee"],
    location: "Tokyo, Japan",
    coordinates: [139.7671, 35.6812] as [number, number],
    projects: ["RISC-V Co-processor"],
    expertise: ["Processor Design", "Verification"],
    bio: "Dr. Tanaka researches heterogeneous multi-ISA architectures at the University of Tokyo. His current project integrates a RISC-V core alongside the ARM Cortex-M0 in the NanoSoC, exploring new paradigms for workload partitioning in embedded systems.",
    interests: ["risc-v", "arm-cortex-m0", "formal-verification", "systemverilog"],
    url: "#",
  },
  {
    id: "emily-watson",
    name: "Prof. Emily Watson",
    institution: "MIT",
    organisations: ["mit", "google"],
    location: "Cambridge, MA, USA",
    coordinates: [-71.0942, 42.3601] as [number, number],
    projects: ["Power Management Unit"],
    expertise: ["Low Power Design", "Analog"],
    bio: "Professor Watson directs the Energy-Efficient Circuits group at MIT. Her research spans digital and mixed-signal power management techniques, with a focus on adaptive DVFS controllers that can dramatically reduce energy consumption in always-on IoT devices.",
    interests: ["low-power-design", "asic-tapeout", "arm-cortex-m3"],
    url: "#",
  },
  {
    id: "raj-patel",
    name: "Dr. Raj Patel",
    institution: "IIT Bombay",
    organisations: ["iit-bombay", "arm"],
    location: "Mumbai, India",
    coordinates: [72.8544, 19.0222] as [number, number],
    projects: ["Communication Interface Hub"],
    expertise: ["SoC Integration", "Bus Architecture"],
    bio: "Dr. Patel is an expert in on-chip communication architectures and SoC integration methodologies. At IIT Bombay, he leads a team developing high-performance bus interconnects and communication interfaces for the EcoSoC platform.",
    interests: ["arm-cortex-m3", "asic-tapeout", "community-projects"],
    url: "#",
  },
  {
    id: "anna-muller",
    name: "Dr. Anna Müller",
    institution: "TU Munich",
    organisations: ["tu-munich", "europractice"],
    location: "Munich, Germany",
    coordinates: [11.582, 48.1351] as [number, number],
    projects: ["Safety-Critical Controller"],
    expertise: ["Functional Safety", "Automotive"],
    bio: "Dr. Müller's research at TU Munich focuses on safety-critical hardware design for automotive applications. She is developing a certified safety controller based on the EcoSoC, targeting ISO 26262 compliance for autonomous vehicle subsystems.",
    interests: ["arm-cortex-m3", "formal-verification", "asic-tapeout"],
    url: "#",
  },
];

export const stats = [
  { label: "Community Members", value: "500+" },
  { label: "Universities", value: "45" },
  { label: "Countries", value: "28" },
  { label: "Projects Built", value: "120+" },
];
