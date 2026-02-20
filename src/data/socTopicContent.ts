/**
 * SoC-specific content for Learning Hub topic detail pages.
 * Keyed by `${socId}::${topicId}` for fast lookup.
 * Each entry describes how that particular reference SoC handles the topic.
 */

export interface SocTopicEntry {
  title: string;
  /** Markdown-friendly plain text describing how this SoC handles the topic */
  content: string;
  /** Optional list of key files / modules relevant to this topic in the SoC repo */
  keyFiles?: string[];
  /** Optional tips specific to this SoC */
  tips?: string[];
}

const entries: Record<string, SocTopicEntry> = {
  // ─── ARCHITECTURE PHASE ───────────────────────────────────────────────

  // System Partitioning
  "nanosoc::system-partitioning": {
    title: "System Partitioning in nanoSoC",
    content:
      "nanoSoC partitions the system into five clearly separated subsystems: CPU Subsystem (Cortex-M0 + tightly-coupled memories), DMA Subsystem (PL230 controllers), Debug Subsystem (ADP + USRT + FT1248), System Control (APB peripherals), and an Expansion Subsystem where users attach custom accelerators.\n\nEach subsystem has its own wrapper Verilog file (e.g. `nanosoc_ss_cpu.v`, `nanosoc_ss_expansion.v`) with clean AHB-Lite interfaces, making it straightforward to modify or replace a subsystem without touching others. The Expansion Subsystem is deliberately kept as a single AHB slave port with DMA request and interrupt lines — this is where your custom IP plugs in.\n\nThe partitioning was driven by two goals: (1) minimise gate count by keeping only essential peripherals on-chip, and (2) maximise reusability by ensuring each subsystem can be independently verified and swapped.",
    keyFiles: [
      "nanosoc_tech/nanosoc/rtl/nanosoc_system.v",
      "nanosoc_tech/nanosoc/rtl/nanosoc_ss_cpu.v",
      "nanosoc_tech/nanosoc/rtl/nanosoc_ss_expansion.v",
      "system/src/accelerator_subsystem.v",
    ],
    tips: [
      "Place your accelerator in the Expansion Subsystem — don't modify the CPU or System Control subsystems.",
      "Keep your accelerator's AHB interface as simple as possible to minimise integration risk.",
      "Use the existing DMA request lines (EXP_DRQ) rather than adding new bus masters.",
    ],
  },
  "millisoc::system-partitioning": {
    title: "System Partitioning in milliSoC",
    content:
      "milliSoC uses a more complex partitioning than nanoSoC, reflecting its production-grade goals. The system is divided into: CPU Subsystem (Cortex-M3 with MPU and bus matrix master port), Memory Subsystem (dual-bank SRAM + Flash with ECC), DMA Subsystem (8-channel DMA-230 or DMA-350), Peripheral Subsystem (UART, SPI, I2C, GPIO, timers), Debug Subsystem (full CoreSight with ETM trace), and an Accelerator Slot with a standardised AHB slave wrapper.\n\nThe key architectural difference from nanoSoC is the multi-layer AHB bus matrix, which allows the CPU and DMA to access different slaves simultaneously. This means the partitioning must account for concurrent access patterns — the Memory Subsystem uses dual-bank SRAM specifically to allow parallel access from two bus masters.\n\nEach subsystem is wrapped in a SystemVerilog module with parameterised configurations (e.g. SRAM size, number of DMA channels), making it possible to generate different milliSoC variants from a single codebase.",
    keyFiles: [
      "rtl/millisoc_top.sv",
      "rtl/millisoc_bus_matrix.sv",
      "rtl/millisoc_mem_subsystem.sv",
      "rtl/accelerator_wrapper.sv",
    ],
    tips: [
      "Use the parameterised accelerator_wrapper.sv as your starting point — it handles AHB protocol compliance.",
      "If your accelerator needs high bandwidth, request a dedicated port on the bus matrix rather than sharing the peripheral bus.",
      "Dual-bank SRAM allows double-buffering: let DMA fill one bank while the CPU processes the other.",
    ],
  },
  "megasoc::system-partitioning": {
    title: "System Partitioning in megaSoC",
    content:
      "megaSoC's partitioning reflects an application-processor-class design with an ARM Cortex-A53 at its centre. The system is divided into: Application Processor Subsystem (A53 + L1/L2 cache + GIC), Memory Subsystem (DDR controller + on-chip SRAM), I/O Subsystem (quad UART, quad-SPI, I2C, GPIO), DMA Subsystem (16-channel DMA-350 with AXI-Stream), Debug & Trace Subsystem (full CoreSight DAP + ETM + CTI), and an Accelerator Subsystem with AXI slave + optional coherency port.\n\nUnlike nanoSoC and milliSoC, megaSoC must handle cache coherency between the processor and accelerators. The partitioning provides two integration options: a non-coherent AHB slave path (simpler, suitable for DMA-based designs) and a coherent AXI-ACE port (higher performance, requires snoop logic). Most academic projects should start with the non-coherent path.\n\nThe I/O Subsystem is connected via an AHB-to-APB bridge, keeping low-speed peripherals on a separate bus domain to avoid polluting the high-performance AXI fabric.",
    keyFiles: [
      "rtl/megasoc_top.sv",
      "rtl/megasoc_axi_fabric.sv",
      "rtl/megasoc_accel_subsystem.sv",
      "rtl/megasoc_io_subsystem.sv",
    ],
    tips: [
      "Start with the non-coherent AHB slave path unless your accelerator truly needs cache-coherent access.",
      "Use the DMA-350 AXI-Stream interfaces for high-bandwidth data movement to/from your accelerator.",
      "The A53's GIC (Generic Interrupt Controller) supports up to 64 shared peripheral interrupts — plan your accelerator's interrupt lines early.",
    ],
  },

  // Bus Architecture
  "nanosoc::bus-architecture": {
    title: "Bus Architecture in nanoSoC",
    content:
      "nanoSoC uses a single-master AHB-Lite interconnect — the simplest AMBA bus protocol. The Cortex-M0 is the primary bus master, with the DMA controller acting as a secondary master through a simple arbiter. An APB bridge connects low-speed peripherals (timers, UART, GPIO) to reduce bus loading on the AHB.\n\nThe address decoder is parameterised in `nanosoc_ss_interconnect.v` and supports a REMAP feature: at reset, address 0x00000000 maps to Boot ROM; after boot, firmware writes a REMAP register to swap instruction memory into that address range. This two-stage boot is standard for Cortex-M systems.\n\nThe bus matrix supports 3 masters (CPU, DMAC_0, DMAC_1 + Debug) and 8 slave regions, with configurable arbitration priority.",
    keyFiles: [
      "nanosoc_tech/nanosoc/rtl/nanosoc_ss_interconnect.v",
      "nanosoc_tech/nanosoc/rtl/nanosoc_busmatrix.v",
      "nanosoc_tech/nanosoc/rtl/nanosoc_addr_decoder.v",
    ],
    tips: [
      "AHB-Lite requires single-cycle HREADY response — ensure your accelerator's slave port responds in one cycle or inserts wait states correctly.",
      "Use the REMAP register during development to switch between boot ROM and SRAM execution.",
      "The default arbiter gives CPU highest priority — override if your DMA needs guaranteed bandwidth.",
    ],
  },
  "millisoc::bus-architecture": {
    title: "Bus Architecture in milliSoC",
    content:
      "milliSoC uses a multi-layer AHB bus matrix that allows concurrent transactions between different master-slave pairs. The Cortex-M3 and DMA controller can both access memory simultaneously as long as they target different slave ports. This significantly improves system throughput compared to nanoSoC's shared-bus approach.\n\nThe bus matrix is configured as a 2×3 matrix (2 masters, 3 slave ports) by default, expandable to 3×4 for designs with additional bus masters. Arbitration is round-robin with configurable priority. The APB subsystem sits behind an AHB-to-APB bridge on one of the slave ports.",
    keyFiles: [
      "rtl/millisoc_bus_matrix.sv",
      "rtl/millisoc_ahb2apb_bridge.sv",
    ],
    tips: [
      "Place performance-critical slaves on separate bus matrix ports to enable concurrent access.",
      "The bridge to APB adds one cycle of latency — don't put time-critical peripherals behind it.",
    ],
  },
  "megasoc::bus-architecture": {
    title: "Bus Architecture in megaSoC",
    content:
      "megaSoC uses a high-performance AXI interconnect fabric (based on ARM NIC-400 topology) supporting multiple outstanding transactions, out-of-order completion, and up to 256-bit data paths. The Cortex-A53's AXI master port connects through an L2 cache to the fabric.\n\nThe fabric supports QoS (Quality of Service) tagging, allowing priority allocation between the CPU, DMA, and accelerator ports. Low-speed peripherals connect through an AXI-to-AHB downgrade bridge followed by an AHB-to-APB bridge — two levels of protocol conversion that keep the high-performance fabric clean.\n\nAn optional ACE (AXI Coherency Extensions) port is available for accelerators that need cache-coherent access to the A53's memory space.",
    keyFiles: [
      "rtl/megasoc_axi_fabric.sv",
      "rtl/megasoc_nic400_config.sv",
      "rtl/megasoc_axi2ahb_bridge.sv",
    ],
    tips: [
      "Set QoS priorities carefully — an aggressive DMA can starve the CPU of memory bandwidth.",
      "Use AXI burst transfers (INCR/WRAP) for bulk data to maximise fabric throughput.",
      "The ACE port requires implementing snoop response logic — only use it if you truly need coherency.",
    ],
  },

  // Memory Map
  "nanosoc::memory-map": {
    title: "Memory Map in nanoSoC",
    content:
      "nanoSoC follows the standard ARM Cortex-M memory map convention. The address space is divided into: Boot ROM (0x00000000–0x0FFFFFFF), Instruction Memory (0x20000000–0x2FFFFFFF), Data Memory (0x30000000–0x3FFFFFFF), System I/O (0x40000000–0x5FFFFFFF), Expansion I/O (0x60000000–0x7FFFFFFF), Expansion SRAM Low (0x80000000–0x8FFFFFFF), Expansion SRAM High (0x90000000–0x9FFFFFFF), and System Table ROM (0xF0000000–0xF0003FFF).\n\nPeripherals within the System I/O region are mapped at 4KB boundaries: Timer 0 at 0x40000000, Timer 1 at 0x40001000, UART 0 at 0x40004000, GPIO 0 at 0x40010000, etc. The Expansion I/O region is where your custom accelerator's registers are mapped.\n\nThe REMAP bit in System Control (0x4001F000) swaps Boot ROM and Instruction Memory at address 0x00000000 after boot.",
    keyFiles: [
      "nanosoc_tech/nanosoc/rtl/nanosoc_addr_decoder.v",
      "system/testcodes/hello/hello.c",
      "docs/memory_map.md",
    ],
    tips: [
      "Your accelerator registers should be mapped in the 0x60000000–0x7FFFFFFF range (Expansion I/O).",
      "Keep register offsets aligned to 4-byte boundaries for clean AHB access.",
      "Memory is very limited — instruction memory defaults to 16KB. Optimise firmware size using Arm DS-5 compiler.",
    ],
  },
  "millisoc::memory-map": {
    title: "Memory Map in milliSoC",
    content:
      "milliSoC extends the standard Cortex-M memory map with a larger address space. Flash memory at 0x00000000 (256KB) provides non-volatile code storage with XIP support. Dual-bank SRAM at 0x20000000 (128KB) is split into two 64KB banks for concurrent access. The peripheral region at 0x40000000 includes a richer set of peripherals (UART ×2, SPI, I2C, GPIO ×2, Timer ×4, RTC, Watchdog). The accelerator slot is mapped at 0x60000000 with a 64KB register window.",
    keyFiles: [
      "rtl/millisoc_addr_map.svh",
      "rtl/millisoc_bus_matrix.sv",
    ],
    tips: [
      "Use the Flash accelerator to minimise wait states when executing from Flash.",
      "Split DMA buffers across SRAM banks to enable CPU and DMA parallel access.",
    ],
  },
  "megasoc::memory-map": {
    title: "Memory Map in megaSoC",
    content:
      "megaSoC uses a 4GB address space with regions for on-chip SRAM (0x00000000, 128KB), peripheral I/O (0x40000000, 256MB), DDR memory (0x80000000, up to 2GB), and the accelerator subsystem (0x60000000, 1MB register window + optional DMA buffer). The A53 boots from on-chip SRAM at 0x00000000, loads the bootloader from flash via SPI, then transitions to DDR for main application execution.",
    keyFiles: [
      "rtl/megasoc_addr_map.svh",
      "rtl/megasoc_axi_fabric.sv",
    ],
    tips: [
      "Ensure your accelerator's register window doesn't conflict with the reserved peripheral region.",
      "Use the dedicated DMA buffer region for zero-copy data sharing between CPU and accelerator.",
    ],
  },

  // IP Selection
  "nanosoc::ip-selection": {
    title: "IP Selection in nanoSoC",
    content:
      "nanoSoC is built entirely from ARM DesignStart IP and custom SoC Labs wrappers. The core IP set includes: Cortex-M0 (via ARM Academic Access), Corstone-101 (system IP package), PL230 µDMA (optional), and DMA-350 (optional, more capable alternative).\n\nAll ARM IP is obtained through the ARM Academic Access (AAA) programme — your institution signs an agreement with ARM, then you can download the IP from the ARM download site. SoC Labs provides a setup script (`soclabs-arm-ip-environment`) that unpacks and organises the IP for use with the nanoSoC build system.\n\nThe remaining IP (UART, timers, GPIO, debug controller) uses the Corstone-101 package, which bundles standard peripherals with integration-ready wrappers. Custom IP (your accelerator) plugs into the `accelerator_subsystem.v` wrapper.",
    keyFiles: [
      "env/dependency_env.sh",
      "nanosoc.config",
    ],
    tips: [
      "Check if your institution already has ARM Academic Access before applying — the process can take weeks.",
      "The Corstone-101 package includes everything except the processor core — make sure you download both.",
      "Set ARM_IP_LIBRARY_PATH in your .bashrc to point to the unpacked IP directory.",
    ],
  },
  "millisoc::ip-selection": {
    title: "IP Selection in milliSoC",
    content:
      "milliSoC uses Cortex-M3 (ARM Academic Access), a multi-layer AHB bus matrix (custom), PL022 SPI controller, APB UART (PL011), DMA-230 or DMA-350, and additional peripherals from the Corstone-201 package. The Flash controller uses a custom design with ECC support. The debug subsystem uses full CoreSight components including ETM trace — these require additional ARM licensing beyond the basic Academic Access tier.",
    keyFiles: [
      "config/millisoc_ip_manifest.yaml",
      "rtl/millisoc_top.sv",
    ],
    tips: [
      "CoreSight ETM trace requires an additional license agreement — plan this early.",
      "The PL022 SPI controller supports DMA — connect DMA request lines for high-throughput data transfers.",
    ],
  },
  "megasoc::ip-selection": {
    title: "IP Selection in megaSoC",
    content:
      "megaSoC uses the Cortex-A53 processor (ARM Academic Access), NIC-400 AXI interconnect, GIC-400 interrupt controller, CoreSight SoC-400 debug & trace, DMA-350 with AXI-Stream, and PL011/PL022 peripherals. The DDR controller uses a Synopsys DesignWare IP for TSMC process compatibility. Given the complexity, megaSoC has the most extensive IP dependency list of all three reference designs.\n\nThe Cortex-A53 requires a more comprehensive license than the M-class processors. It also requires an MMU-aware software stack (bare-metal bootloader + optionally Linux).",
    keyFiles: [
      "config/megasoc_ip_manifest.yaml",
      "rtl/megasoc_top.sv",
    ],
    tips: [
      "The A53 license is more restrictive than M-class — verify your institution's agreement covers it.",
      "Plan for a software stack: you'll need a bootloader and potentially a Linux BSP.",
      "The DDR controller IP may require a separate Synopsys license — check early.",
    ],
  },

  // Power & Clocking
  "nanosoc::power-clocking": {
    title: "Power & Clocking in nanoSoC",
    content:
      "nanoSoC uses a single clock domain (SYS_HCLK) driven from an external clock input pad (CLK_IN). The Clock & Reset Controller generates FCLK (free-running CPU clock), HCLK (gated bus clock), and all reset signals (PORESETn, HRESETn, SYSRESETn). There is no PLL — the external clock is used directly, keeping the design simple and portable across FPGA families.\n\nReset is controlled by the nRST pad with an on-chip glitch filter. The system supports three reset sources: external reset (nRST), CPU SYSRESETREQ (software reset), and watchdog timeout reset. All resets are synchronised to HCLK before distribution.\n\nFor ASIC tapeout on TSMC 65nm, a simple clock gating cell is used to gate HCLK during WFI (Wait For Interrupt) mode, reducing dynamic power.",
    keyFiles: [
      "nanosoc_tech/nanosoc/rtl/nanosoc_clk_reset.v",
      "nanosoc_tech/nanosoc/rtl/nanosoc_chip.v",
    ],
    tips: [
      "On FPGA, use the board's oscillator output directly — no PLL configuration needed.",
      "The watchdog reset is the last line of defence — always enable it in production firmware.",
      "For ASIC, add clock gating on peripheral clocks to further reduce power during idle.",
    ],
  },
  "millisoc::power-clocking": {
    title: "Power & Clocking in milliSoC",
    content:
      "milliSoC uses two clock domains: a high-speed domain (HCLK, up to 100 MHz) for the CPU and bus matrix, and a low-speed domain (PCLK, typically HCLK/2 or HCLK/4) for APB peripherals. A PLL generates HCLK from an external reference. Clock gating is applied at the subsystem level — unused peripherals can be clock-gated via a System Control register.\n\nThe design supports a low-power SLEEP mode (WFI) where HCLK is gated and only PCLK + RTC remain active, and a DEEP SLEEP mode where only the RTC and wake-up logic are clocked from the 32.768 kHz crystal.",
    keyFiles: [
      "rtl/millisoc_clk_gen.sv",
      "rtl/millisoc_pwr_ctrl.sv",
    ],
    tips: [
      "Configure PCLK divider based on your peripheral timing requirements — most APB peripherals work at 25 MHz.",
      "Enable per-peripheral clock gating early in RTL to avoid adding it during timing closure.",
    ],
  },
  "megasoc::power-clocking": {
    title: "Power & Clocking in megaSoC",
    content:
      "megaSoC has a complex clocking architecture with four domains: CPU domain (up to 1 GHz), AXI fabric domain (500 MHz), APB peripheral domain (100 MHz), and DDR PHY domain (at DDR data rate). Two PLLs generate the CPU and DDR clocks from a single reference. Clock domain crossings between AXI and APB use registered CDC bridges.\n\nPower management includes DVFS (Dynamic Voltage and Frequency Scaling) on the CPU domain, per-subsystem power islands with retention, and a Power Management Unit (PMU) that handles sleep/wake transitions. The accelerator subsystem sits in its own switchable power island.",
    keyFiles: [
      "rtl/megasoc_clk_tree.sv",
      "rtl/megasoc_pmu.sv",
      "rtl/megasoc_cdc_bridge.sv",
    ],
    tips: [
      "Plan CDC crossings carefully — every AXI-to-APB path goes through a synchroniser bridge.",
      "If your accelerator runs in its own clock domain, you must add CDC synchronisers at the AXI interface.",
      "Test power island switching early — retention logic bugs are notoriously hard to debug in silicon.",
    ],
  },

  // ─── RTL PHASE ────────────────────────────────────────────────────────

  "nanosoc::coding-style": {
    title: "RTL Coding Style in nanoSoC",
    content:
      "nanoSoC uses Verilog-2001 (not SystemVerilog) for maximum compatibility across simulators, including Icarus Verilog. All signal names use `snake_case`, module names are prefixed with `nanosoc_` (e.g. `nanosoc_ss_cpu`, `nanosoc_addr_decoder`). Parameters use `UPPER_CASE`.\n\nThe codebase follows a strict two-process coding style for sequential logic: one always block for the register (`always @(posedge clk)`) and one for the combinational next-state logic (`always @(*)`). This prevents latches and makes the design lint-clean with Verilator.\n\nAll modules include a standard header comment with module name, description, author, and revision history.",
    keyFiles: [
      "nanosoc_tech/nanosoc/rtl/nanosoc_ss_cpu.v",
      "system/src/accelerator_subsystem.v",
    ],
    tips: [
      "Stick to Verilog-2001 if you want to simulate with Icarus Verilog (free and open-source).",
      "Use the accelerator_subsystem.v template as a coding style reference for your own modules.",
      "Run `verilator --lint-only` on your files to catch coding issues before integration.",
    ],
  },
  "nanosoc::interface-protocols": {
    title: "Interface Protocols in nanoSoC",
    content:
      "Your accelerator connects to nanoSoC via an AHB-Lite slave interface defined in `accelerator_subsystem.v`. The interface provides: HSEL (slave select), HADDR (address), HTRANS (transfer type), HWRITE (direction), HSIZE (data size), HWDATA (write data), and must return HRDATA (read data) and HREADYOUT (ready signal).\n\nThe critical rule for AHB-Lite is the address/data phase split: address appears one cycle before data. Your slave must register the address phase signals and respond with data in the following cycle. HREADYOUT must be asserted (high) for single-cycle access or deasserted for wait states.\n\nAdditionally, 2× EXP_DRQ (DMA request from accelerator) and 4× EXP_IRQ (interrupt from accelerator to CPU) lines are available for autonomous data movement and event notification.",
    keyFiles: [
      "system/src/accelerator_subsystem.v",
      "nanosoc_tech/nanosoc/rtl/nanosoc_ss_expansion.v",
    ],
    tips: [
      "Always respond with HREADYOUT=1 unless you genuinely need wait states — unnecessary wait states kill performance.",
      "Use EXP_DRQ to trigger DMA transfers rather than polling from firmware.",
      "Test your AHB interface with the nanoSoC AMBA protocol checker (included in the testbench).",
    ],
  },

  // ─── VERIFICATION PHASE ───────────────────────────────────────────────

  "nanosoc::testbench-architecture": {
    title: "Testbench Architecture in nanoSoC",
    content:
      "nanoSoC uses a firmware-driven verification approach rather than a traditional UVM testbench. Tests are C programs compiled for the Cortex-M0, loaded into instruction memory, and executed in RTL simulation. The test infrastructure includes:\n\n• Boot ROM initialisation (automatic)\n• Test code compilation via ARM DS-5 or GCC\n• ADP (ARM Debug Processor) for pre-test setup commands\n• ASCII debug controller for STDOUT capture\n• Pass/fail detection via magic address write (TEST PASSED / TEST FAILED)\n\nTest codes live in `system/testcodes/` — each test has its own directory with a `.c` source file, a Makefile, and optional ADP command scripts and memory preload files.",
    keyFiles: [
      "system/testcodes/hello/hello.c",
      "system/testcodes/hello/Makefile",
      "system/software_list.txt",
      "nanosoc_tech/nanosoc/simulate/",
    ],
    tips: [
      "Run the `hello` test first to validate your environment before writing accelerator tests.",
      "Add your test name to software_list.txt so it's included in regression runs.",
      "Use `expram_l.hex` and `expram_h.hex` to preload test vectors into expansion memory.",
    ],
  },
  "nanosoc::regression-ci": {
    title: "Regression & CI in nanoSoC",
    content:
      "nanoSoC's regression infrastructure is Makefile-based. The `software_list.txt` file lists all test names; a top-level `make regression` target compiles and runs each test sequentially with the selected simulator.\n\nEach test's pass/fail is determined by detecting the `** TEST PASSED **` or `** TEST FAILED **` string in the simulation output. The regression summary lists passed, failed, and error counts.\n\nFor CI, the SoC Labs team uses GitLab CI pipelines that run the full regression on every merge request. The pipeline uses Icarus Verilog for smoke tests (fast, free) and VCS for full regression (licensed, nightly).",
    keyFiles: [
      "system/software_list.txt",
      "nanosoc_tech/Makefile",
      ".gitlab-ci.yml",
    ],
    tips: [
      "Use Icarus Verilog for quick smoke tests during development — it's free and fast.",
      "Set up your own GitLab CI runner if you have simulator licenses available.",
      "Keep test execution time short by minimising loop counts in firmware — use DMA for bulk data.",
    ],
  },

  // ─── SYNTHESIS PHASE ──────────────────────────────────────────────────

  "nanosoc::constraints": {
    title: "Timing Constraints in nanoSoC",
    content:
      "nanoSoC's SDC constraints define a single clock (SYS_HCLK) at 50 MHz (20ns period) for FPGA targets and up to 200 MHz for the TSMC 65nm ASIC flow. Input/output delays are set relative to the clock edges with conservative margins.\n\nFor FPGA (Vivado), the constraint file creates the clock on the CLK_IN pad and constrains all I/O pins with `set_input_delay` and `set_output_delay`. False paths are set for reset synchronisers and the REMAP register.\n\nFor ASIC (Genus/Innovus), additional constraints include clock uncertainty (jitter + skew), wire load models, and operating conditions (worst-case for setup, best-case for hold).",
    keyFiles: [
      "fpga-lib-tech/constraints/nanosoc_fpga.xdc",
      "asic_flow/constraints/nanosoc_asic.sdc",
    ],
    tips: [
      "Start with the provided constraint files — don't write from scratch.",
      "For FPGA, target 50 MHz initially. Most nanoSoC designs close timing easily at this speed.",
      "Add false paths for any test/scan-mode signals to avoid over-constraining.",
    ],
  },

  // ─── FPGA-SPECIFIC ────────────────────────────────────────────────────

  "nanosoc::synthesis-strategies": {
    title: "Synthesis Strategy in nanoSoC",
    content:
      "For FPGA targets, nanoSoC uses Xilinx Vivado (v2025) with the following strategy: (1) run synthesis with `synth_design -flatten_hierarchy rebuilt` to allow cross-boundary optimisation, (2) map memories to BRAM using inference (no explicit IP cores), (3) apply area-optimised synthesis for the peripheral subsystem and performance-optimised for the CPU subsystem.\n\nThe FPGA build is invoked from the `nanosoc_tech` directory with `make build_fpga FPGA=z2 ACCELERATOR=yes`. Supported targets are: Pynq Z2, ZCU104, Kria KV260, Kria KR260, and MPS3.\n\nFor ASIC, nanoSoC provides flows for Cadence Genus/Innovus and Synopsys Fusion Compiler targeting TSMC 65nm. The ASIC flow includes automatic clock gating insertion and memory compiler integration.",
    keyFiles: [
      "fpga-lib-tech/vivado/nanosoc_fpga_flow.tcl",
      "asic_flow/genus/nanosoc_synth.tcl",
      "nanosoc_tech/Makefile",
    ],
    tips: [
      "Use `make build_fpga FPGA=z2` for the fastest build — Pynq Z2 has the smallest device.",
      "Add ACCELERATOR=yes to include your custom IP in the build.",
      "Check utilisation reports after synthesis — nanoSoC alone uses ~15% of a Z2's LUTs.",
    ],
  },

  // ─── TAPEOUT PHASE ────────────────────────────────────────────────────

  "nanosoc::signoff-checks": {
    title: "Sign-off Checks in nanoSoC",
    content:
      "nanoSoC's ASIC flow (TSMC 65nm) includes automated DRC/LVS/ERC checks using Cadence Assura or Mentor Calibre. The flow scripts in `asic_flow/` run DRC against the TSMC 65nm design rule deck, LVS against the synthesised netlist, and ERC for electrical violations.\n\nFor academic tapeouts via Europractice, the design must pass the foundry's DRC deck with zero errors. The nanoSoC team provides pre-validated pad ring and seal ring layouts that are known to pass DRC — do not modify these unless absolutely necessary.",
    keyFiles: [
      "asic_flow/signoff/run_drc.tcl",
      "asic_flow/signoff/run_lvs.tcl",
      "asic_flow/layout/nanosoc_padring.gds",
    ],
    tips: [
      "Never modify the pad ring layout — it's been validated across multiple tapeouts.",
      "Run DRC incrementally during physical design, not just at the end.",
      "Keep a DRC waiver log for any foundry-approved rule waivers.",
    ],
  },
  "nanosoc::shuttle-submission": {
    title: "Shuttle Submission for nanoSoC",
    content:
      "nanoSoC has been successfully taped out multiple times via Europractice on TSMC 65nm. The submission process involves: (1) preparing GDSII with the correct die frame and seal ring, (2) generating a design submission form with area, power, and I/O specifications, (3) submitting before the Europractice deadline (typically 4 per year), and (4) waiting 4-6 months for fabricated dies.\n\nThe typical nanoSoC die is 1mm × 1mm with 48 I/O pads. Europractice charges per mm² — keeping the design small directly reduces cost. A minimal nanoSoC + accelerator typically costs €2,000-5,000 for 40 packaged chips.",
    keyFiles: [
      "asic_flow/submission/europractice_template.xlsx",
      "asic_flow/layout/nanosoc_die_frame.gds",
    ],
    tips: [
      "Start the Europractice application process early — institutional sign-up can take months.",
      "Keep your accelerator area under 0.5mm² to stay within a 1mm × 1mm die frame.",
      "Order QFP48 packaging — it's the cheapest option and sufficient for most academic designs.",
    ],
  },

  // ─── SILICON VALIDATION PHASE ─────────────────────────────────────────

  "nanosoc::bring-up": {
    title: "Silicon Bring-up for nanoSoC",
    content:
      "nanoSoC silicon bring-up follows a methodical sequence: (1) Power on with 1.2V core supply, measure quiescent current (~5mA expected), (2) Apply external clock (10-50 MHz), (3) Assert and release nRST, (4) Establish SWD connection using a CMSIS-DAP debug probe, (5) Read the System ROM Table at 0xF0000000 to verify chip identity, (6) Load and execute the 'hello world' test via SWD.\n\nThe ADP (ARM Debug Processor) provides an alternative bring-up path via UART if SWD is not available. Connect a USB-UART adapter to the debug UART pins and use the ADP command-line interface to read/write memory and control the processor.\n\nCommon bring-up issues include: incorrect I/O voltage levels (nanoSoC uses 1.8V I/O on TSMC 65nm), clock frequency too high for the process corner, and missing decoupling capacitors causing supply droop.",
    keyFiles: [
      "docs/bringup_checklist.md",
      "system/testcodes/hello/hello.c",
    ],
    tips: [
      "Always measure quiescent current before applying clock — excessive current indicates a short.",
      "Start at 10 MHz and increase clock frequency gradually to find the maximum operating frequency.",
      "Keep a detailed lab notebook — silicon bugs are much harder to debug without records.",
    ],
  },
  "nanosoc::functional-test": {
    title: "Functional Testing of nanoSoC",
    content:
      "After successful bring-up, run the same test suite used in simulation on real silicon. The nanoSoC test flow uses: (1) SWD to load test firmware into instruction memory, (2) Release the CPU from halt, (3) Capture STDOUT via the debug UART, (4) Compare output against golden reference from simulation.\n\nThe test codes in `system/testcodes/` are designed to produce deterministic output that can be diff'd against simulation logs. The `** TEST PASSED **` / `** TEST FAILED **` markers work identically in simulation and on silicon.\n\nFor accelerator testing, preload test vectors into expansion memory using SWD bulk write, then run your accelerator test code. Compare results against a software reference implementation.",
    keyFiles: [
      "system/testcodes/",
      "system/software_list.txt",
      "docs/silicon_test_plan.md",
    ],
    tips: [
      "Run ALL simulation tests on silicon, not just a subset — bugs can hide in unexpected places.",
      "Log all test results with chip ID, voltage, temperature, and clock frequency.",
      "If a test fails on silicon but passes in simulation, check for timing-related issues first.",
    ],
  },
};

/**
 * Look up SoC-specific content for a given reference SoC and topic.
 * Returns undefined if no content exists for this combination.
 */
export function getSocTopicContent(socId: string, topicId: string): SocTopicEntry | undefined {
  return entries[`${socId}::${topicId}`];
}

/** Get all topic IDs that have SoC-specific content for a given SoC */
export function getAvailableSocTopics(socId: string): string[] {
  const prefix = `${socId}::`;
  return Object.keys(entries)
    .filter((k) => k.startsWith(prefix))
    .map((k) => k.slice(prefix.length));
}
