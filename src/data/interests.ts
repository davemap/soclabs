export interface Interest {
  slug: string;
  name: string;
  category: "Technologies" | "Discussions" | "Activities";
  description: string;
  relatedMemberExpertise: string[];
  relatedProjectTags: string[];
  /** If set, links this interest to a technology on the Technologies page */
  technologyName?: string;
  /** Group for collapsible categorisation on the Discussions page */
  group?: string;
  /** Subcategory within the group */
  subcategory?: string;
}

export const interests: Interest[] = [
  // Technologies
  { slug: "arm-cortex-m0", name: "ARM Cortex-M0", category: "Technologies", description: "Ultra-low-power 32-bit processor ideal for education, prototyping, and small embedded designs. Available through the ARM DesignStart programme.", relatedMemberExpertise: ["Processor Design", "FPGA Design", "Low Power Design"], relatedProjectTags: ["NanoSoC"], technologyName: "ARM Cortex-M0" },
  { slug: "arm-cortex-m3", name: "ARM Cortex-M3", category: "Technologies", description: "Feature-rich 32-bit processor with hardware multiply, divide, and extensive debug support. Suitable for production-grade SoC designs.", relatedMemberExpertise: ["Processor Design", "SoC Integration"], relatedProjectTags: ["EcoSoC"], technologyName: "ARM Cortex-M3" },
  { slug: "risc-v", name: "RISC-V", category: "Technologies", description: "An open-standard instruction set architecture enabling fully open processor designs without licensing fees.", relatedMemberExpertise: ["Processor Design"], relatedProjectTags: [] },
  { slug: "fpga-design", name: "FPGA Design", category: "Technologies", description: "Field-Programmable Gate Arrays allow rapid prototyping and testing of digital designs on real hardware before committing to silicon.", relatedMemberExpertise: ["FPGA Design"], relatedProjectTags: ["FPGA"], technologyName: "Vivado / Quartus" },
  { slug: "asic-tapeout", name: "ASIC Tapeout", category: "Technologies", description: "The process of taking a verified digital design through physical implementation and submitting it for fabrication on a silicon wafer.", relatedMemberExpertise: ["ASIC Design"], relatedProjectTags: ["ASIC"], technologyName: "Design Compiler / Genus" },
  { slug: "open-source-eda", name: "Open Source EDA", category: "Technologies", description: "Open-source electronic design automation tools like Yosys and OpenROAD enabling fully transparent chip design flows.", relatedMemberExpertise: [], relatedProjectTags: [], technologyName: "Yosys" },
  { slug: "systemverilog", name: "SystemVerilog", category: "Technologies", description: "Industry-standard hardware description and verification language used for RTL design and testbench development.", relatedMemberExpertise: ["Verification"], relatedProjectTags: [], technologyName: "UVM / cocotb" },
  { slug: "chisel-firrtl", name: "Chisel/FIRRTL", category: "Technologies", description: "A modern hardware construction language embedded in Scala, enabling productive and parameterisable hardware design.", relatedMemberExpertise: [], relatedProjectTags: [] },

  // Discussions
  { slug: "ml-accelerators", name: "Machine Learning Accelerators", category: "Discussions", group: "AI & Computing", subcategory: "Hardware AI", description: "Custom hardware architectures designed to efficiently execute neural network inference and training workloads at the edge.", relatedMemberExpertise: ["Machine Learning"], relatedProjectTags: ["Machine Learning", "Accelerator"] },
  { slug: "cryptography-security", name: "Cryptography & Security", category: "Discussions", group: "Security & Communications", subcategory: "Security", description: "Hardware implementations of cryptographic algorithms and security primitives for secure embedded systems and IoT devices.", relatedMemberExpertise: ["Cryptography"], relatedProjectTags: ["Cryptography", "Security"] },
  { slug: "dsp-signal-processing", name: "DSP & Signal Processing", category: "Discussions", group: "Security & Communications", subcategory: "Signal Processing", description: "Digital signal processing architectures for audio, communications, radar, and sensor data processing applications.", relatedMemberExpertise: ["DSP", "Signal Processing"], relatedProjectTags: ["DSP", "Signal Processing"] },
  { slug: "low-power-design", name: "Low-Power Design", category: "Discussions", group: "Design Methodology", subcategory: "Power", description: "Techniques and methodologies for minimising power consumption in digital circuits, critical for battery-powered and IoT applications.", relatedMemberExpertise: ["Low Power Design"], relatedProjectTags: [] },
  { slug: "iot-edge-computing", name: "IoT & Edge Computing", category: "Discussions", group: "Design Methodology", subcategory: "Systems", description: "System-on-Chip designs optimised for Internet of Things and edge computing workloads with constrained power and area budgets.", relatedMemberExpertise: [], relatedProjectTags: [] },
  { slug: "neuromorphic-computing", name: "Neuromorphic Computing", category: "Discussions", group: "AI & Computing", subcategory: "Hardware AI", description: "Brain-inspired computing architectures that process information using spikes and event-driven computation for ultra-efficient AI.", relatedMemberExpertise: [], relatedProjectTags: [] },
  { slug: "formal-verification", name: "Formal Verification", category: "Discussions", group: "Design Methodology", subcategory: "Verification", description: "Mathematical proof-based methods to exhaustively verify that hardware designs meet their specifications without simulation gaps.", relatedMemberExpertise: ["Verification"], relatedProjectTags: [] },
  { slug: "high-level-synthesis", name: "High-Level Synthesis", category: "Discussions", group: "AI & Computing", subcategory: "Synthesis", description: "Automated translation of high-level algorithmic descriptions (C/C++/Python) into optimised hardware implementations.", relatedMemberExpertise: [], relatedProjectTags: [] },

  // Activities
  { slug: "learning-tutorials", name: "Learning & Tutorials", category: "Activities", description: "Educational resources, step-by-step guides, and hands-on tutorials covering all stages of the hardware design flow.", relatedMemberExpertise: [], relatedProjectTags: [] },
  { slug: "community-projects", name: "Community Projects", category: "Activities", description: "Collaborative open-source projects where community members build, extend, and share custom SoC designs and accelerators.", relatedMemberExpertise: [], relatedProjectTags: [] },
  { slug: "asic-shuttle-programmes", name: "ASIC Shuttle Programmes", category: "Activities", description: "Multi-project wafer services that enable affordable silicon fabrication for academic and research designs.", relatedMemberExpertise: ["ASIC Design"], relatedProjectTags: ["ASIC"] },
  { slug: "fpga-prototyping", name: "FPGA Prototyping", category: "Activities", description: "Using FPGAs to validate and demonstrate SoC designs on real hardware before committing to ASIC fabrication.", relatedMemberExpertise: ["FPGA Design"], relatedProjectTags: ["FPGA"] },
  { slug: "mentoring", name: "Mentoring", category: "Activities", description: "One-on-one and group mentoring connecting experienced silicon designers with students and early-career researchers.", relatedMemberExpertise: [], relatedProjectTags: [] },
  { slug: "publishing-research", name: "Publishing & Research", category: "Activities", description: "Academic publishing, conference participation, and collaborative research in chip design and computer architecture.", relatedMemberExpertise: [], relatedProjectTags: [] },
];
