export const referenceDesigns = [
  {
    id: "nanosoc",
    name: "NanoSoC",
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
    useCases: ["Educational projects", "Custom accelerator integration", "FPGA prototyping", "Research experimentation"],
    githubUrl: "https://github.com/soclabs/nanosoc",
    docsUrl: "#",
    image: "/placeholder.svg",
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
    docsUrl: "#",
    image: "/placeholder.svg",
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
    architecture: "Custom MAC array integrated via the AHB-Lite extension port. Includes a DMA-driven data path for efficient weight loading.",
    tags: ["Machine Learning", "Accelerator", "NanoSoC", "FPGA"],
    githubUrl: "https://github.com/example/ml-accelerator",
    date: "2025-11-15",
  },
  {
    id: "crypto-engine",
    title: "Lightweight Cryptographic Engine",
    author: "Prof. James Okonkwo",
    institution: "University of Cape Town",
    description:
      "An AES-128/256 and SHA-256 hardware accelerator designed for IoT security applications. Integrated into the EcoSoC accelerator slot with minimal area overhead.",
    architecture: "Pipelined AES core with configurable key length. SHA-256 engine shares the datapath for area efficiency.",
    tags: ["Cryptography", "Security", "EcoSoC", "ASIC"],
    githubUrl: "https://github.com/example/crypto-engine",
    date: "2025-09-22",
  },
  {
    id: "dsp-filter",
    title: "Configurable DSP Filter Bank",
    author: "Maria Gonzalez",
    institution: "ETH Zürich",
    description:
      "A reconfigurable FIR/IIR filter bank for audio and sensor signal processing. Supports up to 8 parallel filter channels with programmable coefficients.",
    architecture: "Shared multiply-accumulate units with time-division multiplexing. Coefficient memory mapped to the AHB address space.",
    tags: ["DSP", "Signal Processing", "NanoSoC", "FPGA"],
    githubUrl: "https://github.com/example/dsp-filter",
    date: "2025-08-10",
  },
];

export const designStages = [
  {
    id: "specification",
    title: "Specification",
    shortTitle: "Spec",
    description: "Define what your chip needs to do. Write a detailed specification covering functionality, performance targets, interfaces, power budget, and area constraints.",
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
    description: "Translate your specification into Register Transfer Level code using Verilog or SystemVerilog. This is where your design takes shape as synthesisable hardware description.",
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
    description: "Rigorously test your design to ensure it meets the specification. Use simulation, formal verification, and constrained-random testing to find bugs before silicon.",
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
    description: "Convert your RTL into a gate-level netlist using synthesis tools. This maps your design onto the target technology library, optimising for timing, area, and power.",
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
    id: "fpga",
    title: "FPGA Prototyping",
    shortTitle: "FPGA",
    description: "Test your design on real hardware using an FPGA. This gives you a working prototype to validate functionality, debug issues, and demonstrate your accelerator.",
    details: [
      "FPGA-specific synthesis and place & route",
      "Board support package setup",
      "Hardware debugging with ILA/SignalTap",
      "Software driver development",
      "Performance benchmarking on hardware",
    ],
    icon: "CircuitBoard",
  },
  {
    id: "asic",
    title: "ASIC Tapeout",
    shortTitle: "ASIC",
    description: "Take your verified design to silicon through an ASIC fabrication process. Use available shuttle services to get your custom chip manufactured.",
    details: [
      "Physical design (place & route)",
      "Sign-off checks (DRC, LVS, timing)",
      "Shuttle service selection and submission",
      "Package and test plan",
      "Post-silicon validation",
    ],
    icon: "Zap",
  },
];

export const technologies = [
  {
    name: "ARM Cortex-M0",
    category: "Processor IP",
    description: "Ultra-low-power 32-bit processor ideal for education and small designs. Available through the ARM DesignStart programme.",
  },
  {
    name: "ARM Cortex-M3",
    category: "Processor IP",
    description: "Feature-rich 32-bit processor with hardware multiply, divide, and extensive debug support. Suitable for production designs.",
  },
  {
    name: "Vivado / Quartus",
    category: "FPGA Tools",
    description: "Industry-standard FPGA development suites from AMD/Xilinx and Intel/Altera for synthesis, simulation, and programming.",
  },
  {
    name: "Yosys + OpenROAD",
    category: "Open Source EDA",
    description: "Open-source synthesis and place & route toolchain. Enables fully open ASIC and FPGA flows.",
  },
  {
    name: "Cadence / Synopsys",
    category: "ASIC Tools",
    description: "Commercial EDA tools for synthesis, physical design, and sign-off. Available through academic licensing programmes.",
  },
  {
    name: "UVM / cocotb",
    category: "Verification",
    description: "Universal Verification Methodology (SystemVerilog) and cocotb (Python) for comprehensive design verification.",
  },
];

export const partners = [
  {
    name: "ARM",
    description: "Provider of processor IP through the DesignStart programme, enabling academic access to Cortex-M processors.",
    url: "https://www.arm.com",
    logo: "/placeholder.svg",
  },
  {
    name: "Europractice",
    description: "ASIC fabrication service providing multi-project wafer (MPW) shuttle access for academic and research institutions.",
    url: "https://europractice-ic.com",
    logo: "/placeholder.svg",
  },
  {
    name: "UKRI",
    description: "UK Research and Innovation — funding body supporting research infrastructure and collaborative projects.",
    url: "https://www.ukri.org",
    logo: "/placeholder.svg",
  },
  {
    name: "IEEE",
    description: "Professional association supporting standards development and knowledge sharing in electronics and computing.",
    url: "https://www.ieee.org",
    logo: "/placeholder.svg",
  },
  {
    name: "Google",
    description: "Supporting open-source silicon initiatives and providing shuttle access through the Google-sponsored OpenMPW programme.",
    url: "https://developers.google.com",
    logo: "/placeholder.svg",
  },
  {
    name: "efabless",
    description: "Platform for open-source chip design and fabrication, providing access to shuttle programmes.",
    url: "https://efabless.com",
    logo: "/placeholder.svg",
  },
];

export const communityMembers = [
  {
    name: "Dr. Sarah Chen",
    institution: "Imperial College London",
    location: "London, UK",
    coordinates: [-0.1749, 51.4988] as [number, number],
    projects: ["Neural Network Inference Accelerator"],
    expertise: ["Machine Learning", "FPGA Design"],
    url: "#",
  },
  {
    name: "Prof. James Okonkwo",
    institution: "University of Cape Town",
    location: "Cape Town, South Africa",
    coordinates: [18.4601, -33.9577] as [number, number],
    projects: ["Lightweight Cryptographic Engine"],
    expertise: ["Cryptography", "ASIC Design"],
    url: "#",
  },
  {
    name: "Maria Gonzalez",
    institution: "ETH Zürich",
    location: "Zürich, Switzerland",
    coordinates: [8.5482, 47.3769] as [number, number],
    projects: ["Configurable DSP Filter Bank"],
    expertise: ["DSP", "Signal Processing"],
    url: "#",
  },
  {
    name: "Dr. Kenji Tanaka",
    institution: "University of Tokyo",
    location: "Tokyo, Japan",
    coordinates: [139.7671, 35.6812] as [number, number],
    projects: ["RISC-V Co-processor"],
    expertise: ["Processor Design", "Verification"],
    url: "#",
  },
  {
    name: "Prof. Emily Watson",
    institution: "MIT",
    location: "Cambridge, MA, USA",
    coordinates: [-71.0942, 42.3601] as [number, number],
    projects: ["Power Management Unit"],
    expertise: ["Low Power Design", "Analog"],
    url: "#",
  },
  {
    name: "Dr. Raj Patel",
    institution: "IIT Bombay",
    location: "Mumbai, India",
    coordinates: [72.8544, 19.0222] as [number, number],
    projects: ["Communication Interface Hub"],
    expertise: ["SoC Integration", "Bus Architecture"],
    url: "#",
  },
  {
    name: "Dr. Anna Müller",
    institution: "TU Munich",
    location: "Munich, Germany",
    coordinates: [11.5820, 48.1351] as [number, number],
    projects: ["Safety-Critical Controller"],
    expertise: ["Functional Safety", "Automotive"],
    url: "#",
  },
];

export const stats = [
  { label: "Community Members", value: "500+" },
  { label: "Universities", value: "45" },
  { label: "Countries", value: "28" },
  { label: "Projects Built", value: "120+" },
];
