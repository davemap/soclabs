export interface DocSection {
  id: string;
  title: string;
  content: string;
}

export const megasocDocs: DocSection[] = [
  {
    id: "getting-started",
    title: "Getting Started",
    content: `megaSoC is a production-grade reference SoC within SoC Labs, built around the ARM Cortex-A53 processor. It is designed for more complex projects requiring an application-class processor with a rich peripheral set, multi-layer AXI bus matrix, and DMA controller.

## Pre-requisites

The megaSoC repository contains all the wrappers and system integrations. The Arm IP cores themselves are not included and must be obtained separately.

In order to gain access to the Arm IP, if you are part of an academic institution, you can sign up to [Arm's Academic Access program (AAA)](https://www.arm.com/resources/research/enablement/academic-access-inquiry).

### Cloning the Repository

This repository contains multiple sub-repositories. Clone with:

\`\`\`bash
git clone --recurse https://git.soton.ac.uk/soclabs/megasoc_project.git
\`\`\`

### Setting up the Project Environment

Every time you wish to run commands in this project, run the environment setup script:

\`\`\`bash
source set_env.sh
\`\`\`

This sets the environment variables and creates visibility to the scripts in the flow directory.

*Full documentation will be synced from the repository. Click "Sync Docs" to fetch the latest content.*`,
  },
  {
    id: "adding-your-ip",
    title: "Adding your IP",
    content: `Documentation for adding custom IP to megaSoC will be synced from the repository.

Click "Sync Docs" above to fetch the latest content from the megaSoC repository.`,
  },
  {
    id: "fpga-flow",
    title: "FPGA Flow",
    content: `Documentation for the megaSoC FPGA build flow will be synced from the repository.

Click "Sync Docs" above to fetch the latest content from the megaSoC repository.`,
  },
  {
    id: "asic-implementation",
    title: "ASIC Implementation",
    content: `Documentation for the megaSoC ASIC implementation flow will be synced from the repository.

Click "Sync Docs" above to fetch the latest content from the megaSoC repository.`,
  },
];
