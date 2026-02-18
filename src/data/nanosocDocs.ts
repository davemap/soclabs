export interface DocSection {
  id: string;
  title: string;
  content: string;
}

export const nanosocDocs: DocSection[] = [
  {
    id: "getting-started",
    title: "Getting Started",
    content: `nanoSoC is the entry level reference design within SoC Labs. It is ideal for small academic projects that can be undertaken by PhD or other students to evaluate research hardware such as custom accelerators or signal processing subsystems with a low cost of fabrication and evaluation. nanoSoC is silicon proven using the TSMC 65nm process.

## Pre-requisites

The nanoSoC repository contains all the wrappers and system integrations of the Arm IP's. The IP's themselves are not included in the repository as these are licensed by Arm.

In order to gain access to the Arm IP, if you are part of an academic institution, you can sign up to [Arm's Academic Access program (AAA)](https://www.arm.com/resources/research/enablement/academic-access-inquiry). This program is an agreement between your institution and Arm, so you must be an academic or educator within the institution to make this agreement. Your institution may already be signed up, in which case you can contact your internal user manager to gain access to the IP download site.

### IP

Once you have access to the Arm IP library, you will need to download and set up your environment with the IP. SoC Labs provide a script for unpacking and setting up the IP in a way that can be used with our reference SoC's ([SoCLabs Arm IP Environment](https://git.soton.ac.uk/soclabs/soclabs-arm-ip-environment)).

The IP that you need from Arm is:

- Cortex-M0
- Corstone-101
- (Optional) PL230
- (Optional) DMA-350

Once you have downloaded and unpacked the IP, you will need to set an environment variable in your system to point to this location, you can do this by adding \`export ARM_IP_LIBRARY_PATH=/path/to/this\` to your \`.bashrc\` file.

### Software

#### Simulator

You will need a simulator in order to develop with nanoSoC. We have developed flows for:

- Synopsys VCS
- Siemens QuestaSim
- Cadence Xcelium
- Icarus Verilog

#### Firmware Compiler

We recommend using the Arm DS-5 compiler as we have found this gives the best results in terms of code size (and memory is very limited in nanoSoC to keep area and cost minimized). You can download the Arm DS-5 compiler as part of the Hardware Success Kit (available from the Arm IP download site).

#### FPGA Build

FPGA targets are available mostly for Xilinx Pynq platforms (Z2, ZCU104, Kria KV/KR260). We recommend using Xilinx Vivado (v2025).

#### ASIC

nanoSoC has been taped out using a Cadence Genus/Innovus flow. Flows are also available for Synopsys Fusion Compiler.

### Repository Structure

Below is the repository structure showing all the dependencies from the top level nanoSoC project:

- **accelerator-wrapper-tech** — includes some wrappers/IPs that may be useful for your accelerator
- **asic_flow** — includes generic flows for ASIC implementation
- **asic-lib-tech** — includes wrappers for ASIC implementation for memories etc.
- **docs** — documentation for the use of nanoSoC
- **env** — scripts for setup of environment variables used by nanoSoC
- **flist** — file lists used by the tools
- **fpga-lib-tech** — includes wrappers for FPGA specific implementation
- **generic-lib-tech** — includes wrappers for behavioural implementation
- **nanosoc-tech** — the core nanoSoC technology
  - sl-ams-tech — analog/mixed-signal behavioural models
  - slcorem0-tech — Cortex M0 wrappers and supporting files
  - sldma230-tech — PL230 DMA wrappers and supporting files
  - sldm350-tech — DMA350 wrappers and supporting files
  - socdebug-tech — Ascii debug controller and other debug IP
  - synopsys-28nm-slm-integration — Wrappers for Synopsys' TSMC 28nm SLM IP
- **rtl-primitives-tech** — IPs such as FIFO
- **soctools-flow** — supporting scripts for flows

### Cloning the Repository

This Repository contains multiple sub-repositories. In order to clone them with this repository, please use the following command:

\`\`\`bash
git clone --recurse https://git.soton.ac.uk/soclabs/accelerator-project.git
\`\`\`

At this stage you can also add your submodule with \`git submodule add\`.

After doing this you should update the \`projbranch\` file to include your repository name (as it appears in \`.gitmodules\`) and the branch. This will allow the \`set_env.sh\` script to pull in your repository when updates are made. At this point you may also like to edit the \`/env/dependency_env.sh\` to include your accelerator directory, for example:

\`\`\`bash
export ACCELERATOR_DIR="$SOCLABS_PROJECT_DIR/accelerator"
\`\`\`

### Setting up the Project Environment

Every time you wish to run commands in this project, you will need to make sure the set environment script has been run for your current terminal session. This is done by moving to the top-level of the project and running:

\`\`\`bash
source set_env.sh
\`\`\`

This sets the environment variables related to this project and creates visibility to the scripts in the flow directory.

### Updating Subrepositories

Once you have run a \`source set_env.sh\` in your current terminal, you are then able to update all your repositories to their latest version by running:

\`\`\`bash
socpull
\`\`\`

This runs a git pull on all repositories in your project.

### First-time Simulation

Before adding your IP to nanoSoC, we recommend that you run a "hello world" simulation to make sure that your environment is setup correctly. You can do this by running:

\`\`\`bash
source set_env.sh
cd nanosoc_tech
make run
\`\`\`

This will run through the compilation and simulation of nanoSoC in the following steps:

1. Compilation of the bootrom Software
2. Compilation of the testcode (hello in this case)
3. Compilation of the HDL with the simulator
4. Running the simulation

The final output from this should be:

\`\`\`
]<#> 0x50c1ab04
#
SoCLabs NanoSoC'25 ARM-CM0+ADP+EXTIO-DMA 20250412
REMAP->IMEM0
Hello world
** TEST PASSED **
Test Ended
\`\`\``,
  },
  {
    id: "adding-your-ip",
    title: "Adding your IP",
    content: `In order to add the files for your IP there are 2 options. Either as a local version of your project or as a remote version.

1. **Local version:** you can just place your IP files into a new directory or in the \`system/src\` directory.
2. **Remote version:** you can fork the accelerator-project git to your own git account, this allows you to add your IP either in the \`system/src\` directory or as a git submodule.

## Integrating your IP

There are 2 steps to integrating your IP in nanoSoC:

1. Include your IP in the file list
2. Instantiate your IP in the \`system/src/accelerator_subsystem.v\` file

For **step 1**, you can add paths to your files in the \`flist/project/accelerator.flist\` file. We recommend that you use the environment variables as mentioned in section 1.4. In order for FPGA and ASIC flows to work properly you should split Verilog and SystemVerilog files into separate \`.flist\` files. We suggest adding an \`accelerator_sv.flist\` to the \`accelerator-project/flist/project\` directory and adding the following to \`accelerator.flist\`:

\`\`\`
-f $SOCLABS_PROJECT_DIR/flist/project/accelerator_sv.flist
\`\`\`

For **step 2**, you need to edit the \`accelerator_subsystem.v\` file (found in \`accelerator-project/system/src/\`). The ports of this file are an AHB-lite port, 2x EXP DRQ (data request from accelerator to DMA), 2x EXP DLAST (last signal from DMA to accelerator), 4x EXP IRQ (Interrupts from accelerator to CPU), and some AXI stream interfaces (these are only there if the DMA350 is configured with stream interfaces).

> **Warning:** Add the option \`ACCELERATOR=yes\` to include your accelerator when you run make commands!

## Configuring nanoSoC

The nanoSoC reference design allows for some configuration flexibility. Most of these configuration options are in the \`accelerator-project/nanosoc.config\` file. In order to change this configuration, put a 'yes' next to the relevant options to include these options, otherwise leave it blank.

### DMA Configuration

The DMA options are fundamentally:

- 1x PL230
- 2x PL230
- 1x DMA350

More details on these DMA IP's are available from the Arm website.

The DMA-350 also has some extra configuration options:

- **DMA350 SMALL** — Small configuration of DMA, 2 channels, no stream interface, no extended features
- **DMA350 DEFAULT** — Default configuration of DMA, 2 channels, stream interface, extended features
- **DMA350 BIG** — Big configuration of DMA, 3 channels, stream interface, extended features

If you use either the SMALL or BIG options for this, you must reconfigure the DMA-350. Follow the below steps:

\`\`\`bash
cd accelerator-project/nanosoc_tech/nanosoc/sldma350_tech
run make clean_ip
run make config_dma_ahb_small  # or make config_dma_ahb_big
\`\`\`

### Mixed Signal IP

> Still under development! You can also include mixed signal IP in this design. In order to do this you must also have the relevant IP.

### Synopsys IP

> Still under development! If you are taping out with a TSMC 28nm node, and also have access to the Synopsys IP.`,
  },
  {
    id: "writing-software",
    title: "Writing Software",
    content: `## Address Map

### Summary

| Region | Start Address | End Address |
|---|---|---|
| Boot-Rom | 0x00000000 | 0x0FFFFFFF |
| Instruction Memory (SRAM) | 0x20000000 | 0x2FFFFFFF |
| Data Memory (SRAM) | 0x30000000 | 0x3FFFFFFF |
| System IO | 0x40000000 | 0x5FFFFFFF |
| Expansion IO | 0x60000000 | 0x7FFFFFFF |
| Expansion Memory Lo (SRAM) | 0x80000000 | 0x8FFFFFFF |
| Expansion Memory Hi (SRAM) | 0x90000000 | 0x9FFFFFFF |
| Expansion IO | 0xA0000000 | 0xDFFFFFFF |
| System Table ROM | 0xF0000000 | 0xF0003FFF |

### System IO Region

Below are the address regions for the System IO/Peripherals:

| Region | Start Address | End Address |
|---|---|---|
| Timer 0 | 0x40000000 | 0x40000FFF |
| Timer 1 | 0x40001000 | 0x40001FFF |
| Dual Timer | 0x40002000 | 0x40003FFF |
| UART 0 | 0x40004000 | 0x40004FFF |
| UART 1 | 0x40005000 | 0x40005FFF |
| UART 2 | 0x40006000 | 0x40007FFF |
| Watchdog Timer | 0x40008000 | 0x40008FFF |
| USRT 2 | 0x4000E000 | 0x4000EFFF |
| DMA 0 Base | 0x4000F000 | 0x4000FFFF |
| GPIO 0 | 0x40010000 | 0x40010FFF |
| GPIO 1 | 0x40011000 | 0x40011FFF |
| System Control | 0x4001F000 | 0x4001FFFF |

## Adding Tests

To add your own testcodes to run on nanoSoC in the simulation environment, you can add these to the \`accelerator-project/system/testcodes\` directory.

1. Create a new directory for your testcode
2. Create a \`.c\` source file with the same name as the directory
3. Copy the makefile from one of the example testcodes to your test code directory
4. Edit the \`TESTNAME\` variable in the new makefile to the name of your test
5. If you want to run any ADP code before your test, add an \`adp.cmp\` file (example in the \`adp_v4_cmd_tests\`)
6. If you want to preload expansion memories, add an \`expram_l.hex\` and/or \`expram_h.hex\`
7. Add the name of your test to the \`accelerator-project/system/software_list.txt\` file

## Preloading Expansion Memories

You may want to load test vectors directly into the expansion memories to run your tests. Doing this can save space in the instruction memory space as you then don't have to load data in as arrays or vectors in your testcode. Instead you can use the simulator to automatically load these memories at the start of simulation.

To do this, simply add an \`expram_l.hex\` file and/or \`expram_h.hex\` file to your testcode directory. These files will then be loaded to the EXPRAM L or EXPRAM H region respectively. These can then be addressed in your testcode from \`0x80000000\` for EXPRAM L and \`0x90000000\` for EXPRAM H.

The \`expram_l.hex\` files must be ASCII text files with a single byte per line. They will look very similar to the \`.hex\` files that are used to preload the instruction memory.`,
  },
  {
    id: "simulation",
    title: "Simulation",
    content: `This describes the steps needed to simulate nanoSoC. Supported simulators are:

- Synopsys VCS
- Siemens QuestaSim
- Cadence Xcelium
- Icarus Verilog

## Running Simulations

You can run make commands from the \`nanosoc_tech\` directory to run the simulation.

\`\`\`bash
make run SIM=x TESTNAME=y ACCELERATOR=yes
\`\`\`

Where \`x\` = mti, vcs, xm, or iverilog for QuestaSim, VCS, Xcelium, or Icarus Verilog respectively. And \`y\` is the name of the test, the default test is \`hello\` (a hello world example).

Or to run the simulation in the GUI you can use:

\`\`\`bash
make sim SIM=x TESTNAME=y ACCELERATOR=yes
\`\`\`

Whilst the simulation is running, you should see the output from the std out channel in the console/terminal.

## Debugging Simulations

**My simulation won't run**

This may be an environment issue or a design that won't compile. Please first check the \`compile_$(SIM).log\` in the \`simulate/sim/$(TESTNAME)\` directory. If you don't see this file, look at the output of the terminal when you run the \`make run\` command, usually it will give you some explanation.

If the problem is it can't find files, you may have forgotten to run the \`source set_env.sh\` command.

## Preloading Expansion Memories

You may want to load test vectors directly into the expansion memories to run your tests. Doing this can save space in the instruction memory space as you then don't have to load data in as arrays or vectors in your testcode. Instead you can use the simulator to automatically load these memories at the start of simulation.

To do this, simply add an \`expram_l.hex\` file and/or \`expram_h.hex\` file to your testcode directory. These files will then be loaded to the EXPRAM L or EXPRAM H region respectively. These can then be addressed in your testcode from \`0x80000000\` for EXPRAM L and \`0x90000000\` for EXPRAM H.

The \`expram_l.hex\` files must be ASCII text files with a single byte per line. They will look very similar to the \`.hex\` files that are used to preload the instruction memory.`,
  },
  {
    id: "fpga-flow",
    title: "FPGA Flow",
    content: `## Building the FPGA Image

To build the FPGA image, run the below command from the \`nanosoc_tech\` directory:

\`\`\`bash
make build_fpga ACCELERATOR=yes FPGA=x
\`\`\`

Where \`x\` is either \`zcu104\`, \`mps3\`, \`kr260\`, \`kv260\`, or \`z2\`.

If you would like another FPGA target to be included please contact the SoC Labs team or raise an issue on the accelerator-project git.`,
  },
  {
    id: "asic-implementation",
    title: "ASIC Implementation",
    content: `ASIC implementation documentation is currently being developed.

nanoSoC has been taped out using a Cadence Genus/Innovus flow. Flows are also available for Synopsys Fusion Compiler. For more details on the ASIC flow, please refer to the \`asic_flow\` directory in the repository or contact the SoC Labs team.`,
  },
];
