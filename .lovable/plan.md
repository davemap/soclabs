
# SoC Labs Website

## Overview
A dark, techy website for SoC Labs — a community enabling academics and students to build System-on-Chip designs around ARM Cortex microprocessors. The site will inform, inspire, and recruit community members, with a focus on reference designs, educational content, and community showcasing.

## Design Direction
- **Dark theme** with neon/electric accent colors (cyan, electric blue)
- Circuit-board inspired patterns and subtle tech motifs
- Clean typography with a modern engineering feel
- Responsive across desktop, tablet, and mobile

## Pages & Features

### 1. Home Page
- Hero section with bold tagline explaining SoC Labs' mission
- Featured reference SoC designs (1-2 cards) with descriptions, diagrams, and links to docs/repos
- "Why join us" value proposition section
- Call-to-action to join the community
- Testimonials or stats section (placeholder data)

### 2. Reference Designs Page
- Detailed pages for each reference SoC design
- Architecture overview, key features, target use cases
- Links to GitHub repositories and documentation
- "Use this as your starting point" CTA

### 3. Community Projects / Case Studies
- Blog-style listing of community-submitted projects (mock data for now, no auth)
- Each project page shows: title, author, description, architecture details, and a link to their Git repository
- Designed so that when auth is added later, users can create and edit their own project pages

### 4. Learning Hub — Hardware Design Stages
- Multi-page or tabbed guide walking through the stages of hardware design (specification → RTL → verification → synthesis → FPGA → ASIC)
- Clear explanations aimed at students and academics
- Visual timeline/stepper showing the design flow

### 5. Technologies & Tools Page
- Overview of available technologies, tools, and platforms
- Information on the process to get a working FPGA image
- Information on the ASIC tapeout process and available shuttles
- Resource links and getting-started guides

### 6. Partner Organisations Page
- Grid/cards showcasing organisations SoC Labs works with
- Logos, descriptions, and links to partner sites

### 7. Global Community Map
- Interactive world map with clickable pins
- Rich profile popups showing member/institution name, location, projects, and links
- Mock data for initial launch (designed to be connected to a database later)

### 8. About / Join Page
- More detail on SoC Labs' mission and team
- Sign-up CTA / interest form (static for now, backend to be added later)

## Technical Notes
- No backend or authentication for the initial build — all content will use placeholder/mock data
- Structured so a database (Supabase) can be added later for auth, project submissions, and map data
- Interactive map using a lightweight library (e.g., react-simple-maps)
