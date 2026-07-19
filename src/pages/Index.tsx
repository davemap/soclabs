import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Cpu, Users, GraduationCap, Globe, Calendar, User, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Layout from "@/components/Layout";
import ScrollReveal from "@/components/ScrollReveal";
import CircuitBackground from "@/components/CircuitBackground";
import ScrollProgressRail from "@/components/ScrollProgressRail";
import { referenceDesigns, communityMembers, communityProjects, partners } from "@/data/mockData";
import { newsArticles } from "@/data/newsData";
import { useAuth } from "@/hooks/useAuth";

import socDie from "@/assets/home/soc-die.jpg";
import labCommunity from "@/assets/home/lab-community.jpg";
import wafer from "@/assets/home/wafer.jpg";

import imgFpgaWorkshop from "@/assets/news/fpga-workshop.jpg";
import imgAsicTapeout from "@/assets/news/asic-tapeout.jpg";
import imgDesignComp from "@/assets/news/design-competition.jpg";
import imgRiscvSummit from "@/assets/news/riscv-summit.jpg";
import imgMlAccel from "@/assets/news/ml-accelerator.jpg";
import imgOpenEda from "@/assets/news/open-eda.jpg";
import imgDvfs from "@/assets/news/dvfs-power.jpg";

const articleImages: Record<string, string> = {
  "nanosoc-fpga-workshop-2026": imgFpgaWorkshop,
  "ecosoc-tapeout-tsmc-28nm": imgAsicTapeout,
  "design-competition-2026": imgDesignComp,
  "risc-v-summit-talk": imgRiscvSummit,
  "ml-accelerator-tinyml-benchmark": imgMlAccel,
  "open-eda-flow-yosys": imgOpenEda,
  "dvfs-controller-results": imgDvfs,
};

const railSections = [
  { id: "hero", label: "Intro" },
  { id: "designs", label: "Designs" },
  { id: "why", label: "Why Join" },
  { id: "news", label: "Latest" },
  { id: "cta", label: "Start" },
];

const Index = () => {
  const { user } = useAuth();

  return (
    <Layout>
      <div className="relative -mt-16 bg-[hsl(212_44%_10%)] text-slate-100">
        {/* Global circuit backdrop (follows the page) */}
        <div className="pointer-events-none fixed inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(212_50%_18%)_0%,hsl(212_44%_9%)_60%,hsl(212_50%_6%)_100%)]" />
          <CircuitBackground className="opacity-70" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,hsl(212_50%_6%)_100%)]" />
        </div>

        <ScrollProgressRail sections={railSections} />

        <div className="relative z-10">
          {/* ── HERO ───────────────────────────────────────────── */}
          <section id="hero" className="relative pt-32 pb-28 md:pt-40 md:pb-36">
            <div className="container mx-auto grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] items-center gap-12 px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
              >
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[hsl(82_60%_65%)]/30 bg-[hsl(82_60%_65%)]/5 px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-[hsl(82_65%_72%)]">
                  <Sparkles className="h-3.5 w-3.5" />
                  SoC Labs · Community for Custom Silicon
                </div>

                <h1 className="font-display font-bold tracking-tight text-4xl md:text-6xl lg:text-7xl leading-[1.02]">
                  Write the test once.
                  <br />
                  Run it from RTL simulation
                  <br />
                  <span className="text-[hsl(82_70%_65%)]">to silicon.</span>
                </h1>

                <p className="mt-8 max-w-xl text-base md:text-lg text-slate-300/85 leading-relaxed">
                  SoC Labs gives academics and students reference ARM Cortex-M designs, an
                  end-to-end verification flow, and a global community to create, verify,
                  and fabricate custom silicon.
                </p>

                <div className="mt-10 flex flex-wrap items-center gap-4">
                  <Button
                    asChild
                    size="lg"
                    className="rounded-full bg-[hsl(82_65%_60%)] px-8 text-base text-[hsl(212_50%_10%)] hover:bg-[hsl(82_70%_65%)]"
                  >
                    <Link to="/projects">
                      Explore Projects <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="rounded-full border-white/20 bg-white/5 px-8 text-base text-slate-100 hover:bg-white/10 hover:text-white"
                  >
                    <Link to="/designs">View Reference SoCs</Link>
                  </Button>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.9, delay: 0.2 }}
                className="relative"
              >
                <div className="relative overflow-hidden rounded-3xl border border-white/10 shadow-[0_30px_80px_-20px_hsl(212_50%_4%)]">
                  <img
                    src={socDie}
                    alt="Custom system-on-chip die with glowing traces"
                    width={1600}
                    height={1200}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-[hsl(212_50%_6%)]/70 via-transparent to-[hsl(82_60%_50%)]/10 mix-blend-multiply" />
                  <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-[hsl(82_70%_65%)]/15" />
                </div>
                <div className="absolute -bottom-6 -left-6 hidden rounded-2xl border border-white/10 bg-[hsl(212_50%_10%)]/90 px-5 py-4 backdrop-blur md:block">
                  <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[hsl(195_75%_70%)]">
                    Tapeout ready
                  </div>
                  <div className="mt-1 font-display text-xl font-semibold">nanoSoC · milliSoC · megaSoC</div>
                </div>
              </motion.div>
            </div>
          </section>

          {/* ── REFERENCE DESIGNS ─────────────────────────────── */}
          <section id="designs" className="relative py-24 border-y border-white/5">
            <div className="container mx-auto px-4">
              <ScrollReveal className="mb-14 max-w-2xl">
                <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.25em] text-[hsl(82_65%_72%)]">
                  01 — Reference Designs
                </div>
                <h2 className="font-display text-3xl md:text-5xl font-bold leading-tight">
                  Start with our{" "}
                  <span className="text-[hsl(82_70%_65%)]">proven architectures.</span>
                </h2>
                <p className="mt-4 text-slate-300/80">
                  Fork, extend, and build your custom accelerators on top of production-tested
                  ARM Cortex-M reference SoCs.
                </p>
              </ScrollReveal>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {referenceDesigns.slice(0, 3).map((design, i) => (
                  <ScrollReveal key={design.id} delay={i * 0.1} direction={i % 2 === 0 ? "left" : "right"}>
                    <Link to={`/designs/${design.id}`} className="group block h-full">
                      <Card className="h-full border-white/10 bg-white/[0.03] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-[hsl(82_70%_65%)]/40 hover:bg-white/[0.06]">
                        <CardContent className="p-7">
                          <div className="mb-5 flex items-start justify-between">
                            <div>
                              <h3 className="font-display text-xl font-bold text-white">{design.name}</h3>
                              <p className="text-sm font-medium text-[hsl(195_75%_70%)]">{design.tagline}</p>
                            </div>
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[hsl(82_60%_60%)]/10 ring-1 ring-[hsl(82_60%_60%)]/30">
                              <Cpu className="h-5 w-5 text-[hsl(82_70%_70%)]" />
                            </div>
                          </div>
                          <p className="mb-5 line-clamp-3 text-sm text-slate-300/75">{design.description}</p>
                          <div className="mb-5 flex flex-wrap gap-2">
                            {design.features.slice(0, 3).map((f) => (
                              <span
                                key={f}
                                className="rounded-full bg-white/5 px-2.5 py-1 text-[11px] font-medium text-slate-200 ring-1 ring-white/10"
                              >
                                {f}
                              </span>
                            ))}
                          </div>
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-[hsl(82_70%_70%)]">
                            View details{" "}
                            <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                          </span>
                        </CardContent>
                      </Card>
                    </Link>
                  </ScrollReveal>
                ))}
              </div>

              <ScrollReveal className="mt-10 text-center">
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="rounded-full border-white/20 bg-white/5 px-8 text-slate-100 hover:bg-white/10 hover:text-white"
                >
                  <Link to="/designs">
                    View All Reference SoCs <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </ScrollReveal>
            </div>
          </section>

          {/* ── WHY JOIN ──────────────────────────────────────── */}
          <section id="why" className="relative py-24">
            <div className="container mx-auto px-4">
              <div className="grid items-center gap-12 lg:grid-cols-2">
                <ScrollReveal direction="left">
                  <div className="relative overflow-hidden rounded-3xl border border-white/10">
                    <img
                      src={labCommunity}
                      alt="Engineers collaborating in a hardware research lab"
                      width={1600}
                      height={1008}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-[hsl(212_50%_6%)]/60 via-transparent to-[hsl(195_75%_50%)]/10" />
                  </div>
                </ScrollReveal>

                <ScrollReveal direction="right">
                  <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.25em] text-[hsl(82_65%_72%)]">
                    02 — Why Join
                  </div>
                  <h2 className="font-display text-3xl md:text-5xl font-bold leading-tight">
                    A community that takes you all the way{" "}
                    <span className="text-[hsl(82_70%_65%)]">to silicon.</span>
                  </h2>

                  <div className="mt-8 space-y-6">
                    {[
                      {
                        icon: GraduationCap,
                        title: "Learn by Building",
                        desc: "Go from RTL to FPGA to ASIC with real reference designs, guided tutorials, and expert support.",
                      },
                      {
                        icon: Users,
                        title: "Global Community",
                        desc: "Connect with researchers and engineers across 28+ countries. Share knowledge, collaborate on projects.",
                      },
                      {
                        icon: Globe,
                        title: "Silicon Access",
                        desc: "Access ASIC shuttle programmes and FPGA platforms to take designs from simulation to real hardware.",
                      },
                    ].map((item) => (
                      <div key={item.title} className="flex items-start gap-4">
                        <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[hsl(82_60%_60%)]/10 ring-1 ring-[hsl(82_60%_60%)]/30">
                          <item.icon className="h-5 w-5 text-[hsl(82_70%_70%)]" />
                        </div>
                        <div>
                          <div className="font-display text-lg font-semibold text-white">{item.title}</div>
                          <div className="mt-1 text-sm leading-relaxed text-slate-300/80">{item.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollReveal>
              </div>

              {/* Stats bar */}
              <ScrollReveal className="mt-16">
                <div className="mx-auto max-w-4xl rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm">
                  <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
                    {[
                      { label: "Community Members", value: communityMembers.length },
                      { label: "Organisations", value: partners.length },
                      { label: "Countries", value: new Set(partners.map((p) => p.country).filter(Boolean)).size },
                      { label: "Projects Built", value: communityProjects.length },
                    ].map((stat) => (
                      <div key={stat.label} className="text-center">
                        <div className="font-display text-3xl md:text-4xl font-bold text-[hsl(82_70%_68%)]">
                          {stat.value}
                        </div>
                        <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-slate-400">
                          {stat.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollReveal>

              {!user && (
                <ScrollReveal className="mt-12 text-center">
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="rounded-full border-white/20 bg-white/5 px-8 text-slate-100 hover:bg-white/10 hover:text-white"
                  >
                    <Link to="/about#join">Join the Community</Link>
                  </Button>
                </ScrollReveal>
              )}
            </div>
          </section>

          {/* ── LATEST NEWS ───────────────────────────────────── */}
          <section id="news" className="relative py-24 border-y border-white/5">
            <div className="container mx-auto px-4">
              <ScrollReveal className="mb-14 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
                <div>
                  <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.25em] text-[hsl(82_65%_72%)]">
                    03 — Latest News
                  </div>
                  <h2 className="font-display text-3xl md:text-5xl font-bold leading-tight">
                    Milestones, events, and{" "}
                    <span className="text-[hsl(82_70%_65%)]">research breakthroughs.</span>
                  </h2>
                </div>
                <Button
                  asChild
                  variant="outline"
                  className="rounded-full border-white/20 bg-white/5 text-slate-100 hover:bg-white/10 hover:text-white"
                >
                  <Link to="/news">
                    All news <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </ScrollReveal>

              <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
                {[...newsArticles]
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .slice(0, 3)
                  .map((article, i) => (
                    <ScrollReveal key={article.id} delay={i * 0.1}>
                      <Link to={`/news/${article.id}`} className="group block h-full">
                        <Card className="flex h-full flex-col overflow-hidden border-white/10 bg-white/[0.03] transition-all duration-300 hover:-translate-y-1 hover:border-[hsl(82_70%_65%)]/40 hover:bg-white/[0.06]">
                          <div className="relative h-36 overflow-hidden bg-[hsl(212_50%_8%)]">
                            <img
                              src={articleImages[article.id] || "/placeholder.svg"}
                              alt={article.title}
                              loading="lazy"
                              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[hsl(212_50%_6%)]/80 to-transparent" />
                          </div>
                          <CardContent className="flex flex-1 flex-col p-5">
                            <div className="mb-3 flex flex-wrap gap-1.5">
                              {article.tags.slice(0, 2).map((tag) => (
                                <Badge
                                  key={tag}
                                  variant="secondary"
                                  className="bg-white/5 text-[10px] text-slate-200 ring-1 ring-white/10"
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                            <h3 className="mb-2 line-clamp-2 font-display text-lg font-bold text-white">
                              {article.title}
                            </h3>
                            <p className="mb-4 line-clamp-3 flex-1 text-sm text-slate-300/75">
                              {article.summary}
                            </p>
                            <div className="flex items-center justify-between border-t border-white/10 pt-3 text-xs text-slate-400">
                              <span className="flex items-center gap-1">
                                <User className="h-3 w-3" /> {article.author}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />{" "}
                                {new Date(article.date).toLocaleDateString("en-GB", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </span>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    </ScrollReveal>
                  ))}
              </div>
            </div>
          </section>

          {/* ── CTA ───────────────────────────────────────────── */}
          <section id="cta" className="relative py-28">
            <div className="container mx-auto px-4">
              <ScrollReveal>
                <div className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl border border-white/10">
                  <img
                    src={wafer}
                    alt="Silicon wafer with SoC die array"
                    width={1408}
                    height={1008}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover opacity-40"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-[hsl(212_50%_8%)]/95 via-[hsl(212_50%_10%)]/85 to-[hsl(82_50%_20%)]/60" />
                  <div className="relative px-8 py-16 text-center md:px-16 md:py-20">
                    <div className="mb-4 font-mono text-[11px] uppercase tracking-[0.25em] text-[hsl(82_65%_72%)]">
                      04 — Start Building
                    </div>
                    <h2 className="font-display text-3xl md:text-5xl font-bold leading-tight text-white">
                      Ready to build your{" "}
                      <span className="text-[hsl(82_70%_65%)]">System-on-Chip?</span>
                    </h2>
                    <p className="mx-auto mt-5 max-w-xl text-slate-200/80">
                      Define your project, pick a reference design, and start building custom
                      silicon today.
                    </p>
                    <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                      <Button
                        asChild
                        size="lg"
                        className="rounded-full bg-[hsl(82_65%_60%)] px-8 text-base text-[hsl(212_50%_10%)] hover:bg-[hsl(82_70%_65%)]"
                      >
                        <Link to="/projects/start">
                          Start a Project <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        asChild
                        size="lg"
                        variant="outline"
                        className="rounded-full border-white/20 bg-white/5 px-8 text-slate-100 hover:bg-white/10 hover:text-white"
                      >
                        <Link to="/learn">Explore the Learning Hub</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
