import { Link } from "react-router-dom";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowRight, Cpu, Users, GraduationCap, Globe, Calendar, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Layout from "@/components/Layout";
import ScrollReveal from "@/components/ScrollReveal";
import LightGeometricBackground from "@/components/LightGeometricBackground";

import { referenceDesigns, communityMembers, communityProjects, partners } from "@/data/mockData";
import { newsArticles } from "@/data/newsData";
import { useAuth } from "@/hooks/useAuth";

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

const AnimatedCounter = ({ value }: { value: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [display, setDisplay] = useState(0);
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { stiffness: 60, damping: 20 });
  const rounded = useTransform(spring, (latest) => Math.round(latest));

  useEffect(() => {
    const unsubscribe = rounded.on("change", (v) => setDisplay(v));
    return () => unsubscribe();
  }, [rounded]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          motionValue.set(value);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [motionValue, value]);

  return <div ref={ref}>{display}</div>;
};

const Index = () => {
  const { user } = useAuth();

  return (
    <Layout>
      <div className="relative -mt-16 bg-background text-foreground">
        {/* Global geometric backdrop (follows the page) */}
        <div className="pointer-events-none fixed inset-0 z-0">
          <LightGeometricBackground />
        </div>

        <div className="relative z-10">
          {/* ── HERO ───────────────────────────────────────────── */}
          <section id="hero" className="relative pt-32 pb-28 md:pt-40 md:pb-36">
            <div className="container mx-auto flex flex-col items-center text-center gap-12 px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="max-w-4xl"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="mb-6 inline-flex items-center rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-xs font-medium tracking-wide text-primary"
                >
                  enabling innovation in system-on-chip development
                </motion.div>
                <h1 className="font-display font-bold tracking-tight text-4xl md:text-6xl lg:text-7xl leading-[1.15] space-y-4">
                  <span className="block">Develop your <span className="text-primary">System.</span>&nbsp;&nbsp;</span>
                  <span className="block">&nbsp; &nbsp; &nbsp;Integrate your <span className="text-[hsl(28_95%_50%)]">Accelerator.</span></span>
                  <span className="block">Test your <span className="text-[hsl(88_60%_45%)]">Chip.</span></span>
                </h1>

                <p className="mt-8 mx-auto max-w-xl text-base md:text-lg text-muted-foreground leading-relaxed">
                  SoC Labs gives academics and students reference ARM Cortex-M designs, an
                  end-to-end verification flow, and a global community to create, verify,
                  and fabricate custom silicon.
                </p>

                <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      asChild
                      size="lg"
                      className="rounded-full bg-primary px-8 text-base text-primary-foreground hover:bg-primary/90"
                    >
                      <Link to="/projects" className="group inline-flex items-center">
                        Explore SoC Labs Projects
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </section>


          {/* ── REFERENCE DESIGNS ─────────────────────────────── */}
          <section id="designs" className="relative py-24 border-y border-border/60">
            <div className="container mx-auto px-4">
              <ScrollReveal className="mb-14 max-w-2xl">
                <h2 className="font-display text-3xl md:text-5xl font-bold leading-tight text-foreground">
                  Start with our{" "}
                  <span className="text-primary">proven architectures.</span>
                </h2>
                <p className="mt-4 text-muted-foreground">
                  Fork, extend, and build your custom accelerators on top of production-tested
                  ARM Cortex-M reference SoCs.
                </p>
              </ScrollReveal>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {referenceDesigns.slice(0, 3).map((design, i) => (
                  <ScrollReveal key={design.id} delay={i * 0.1} direction={i % 2 === 0 ? "left" : "right"}>
                    <Link to={`/designs/${design.id}`} className="group block h-full">
                      <motion.div
                        whileHover={{ y: -6, scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      >
                      <Card className="h-full border-border bg-card shadow-sm transition-all duration-300 hover:border-primary/40 hover:bg-background hover:shadow-lg hover:shadow-primary/10">
                        <CardContent className="p-7">
                          <div className="mb-5 flex items-start justify-between">
                            <div>
                              <h3 className="font-display text-xl font-bold text-card-foreground">{design.name}</h3>
                              <p className="text-sm font-medium text-primary">{design.tagline}</p>
                            </div>
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/30">
                              <Cpu className="h-5 w-5 text-primary" />
                            </div>
                          </div>
                          <p className="mb-5 line-clamp-3 text-sm text-muted-foreground">{design.description}</p>
                          <div className="mb-5 flex flex-wrap gap-2">
                            {design.features.slice(0, 3).map((f) => (
                              <span
                                key={f}
                                className="rounded-full bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground ring-1 ring-border"
                              >
                                {f}
                              </span>
                            ))}
                          </div>
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-primary">
                            View details{" "}
                            <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                          </span>
                        </CardContent>
                      </Card>
                      </motion.div>
                    </Link>
                  </ScrollReveal>
                ))}
              </div>

              <ScrollReveal className="mt-10 text-center">
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="rounded-full border-border bg-card px-8 text-foreground hover:bg-muted hover:text-foreground"
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
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className="relative overflow-hidden rounded-3xl border border-border shadow-sm"
                  >
                    <img
                      src={labCommunity}
                      alt="Engineers collaborating in a hardware research lab"
                      width={1600}
                      height={1008}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-electric/10" />
                  </motion.div>
                </ScrollReveal>

                <ScrollReveal direction="right">
                  <h2 className="font-display text-3xl md:text-5xl font-bold leading-tight text-foreground">
                    A community that takes you all the way{" "}
                    <span className="text-primary">to silicon.</span>
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
                      <motion.div
                        key={item.title}
                        className="flex items-start gap-4 rounded-xl p-3 transition-colors hover:bg-muted/50"
                        whileHover={{ x: 8 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      >
                        <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/30 transition-colors group-hover:bg-primary/20">
                          <item.icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-display text-lg font-semibold text-foreground">{item.title}</div>
                          <div className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.desc}</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </ScrollReveal>
              </div>

              {/* Stats bar */}
              <ScrollReveal className="mt-16">
                <div className="mx-auto max-w-4xl rounded-2xl border border-border bg-card p-6 shadow-sm">
                  <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
                    {[
                      { label: "Community Members", value: communityMembers.length },
                      { label: "Organisations", value: partners.length },
                      { label: "Countries", value: new Set(partners.map((p) => p.country).filter(Boolean)).size },
                      { label: "Projects Built", value: communityProjects.length },
                    ].map((stat) => (
                      <motion.div
                        key={stat.label}
                        className="text-center"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      >
                        <div className="font-display text-3xl md:text-4xl font-bold text-primary">
                          <AnimatedCounter value={stat.value} />
                        </div>
                        <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                          {stat.label}
                        </div>
                      </motion.div>
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
                    className="rounded-full border-border bg-card px-8 text-foreground hover:bg-muted hover:text-foreground"
                  >
                    <Link to="/about#join">Join the Community</Link>
                  </Button>
                </ScrollReveal>
              )}
            </div>
          </section>

          {/* ── LATEST NEWS ───────────────────────────────────── */}
          <section id="news" className="relative py-24 border-y border-border/60">
            <div className="container mx-auto px-4">
              <ScrollReveal className="mb-14 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
                <div>
                  <h2 className="font-display text-3xl md:text-5xl font-bold leading-tight text-foreground">
                    Milestones, events, and{" "}
                    <span className="text-primary">research breakthroughs.</span>
                  </h2>
                </div>
                <Button
                  asChild
                  variant="outline"
                  className="rounded-full border-border bg-card text-foreground hover:bg-muted hover:text-foreground"
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
                        <Card className="flex h-full flex-col overflow-hidden border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:bg-background">
                          <div className="relative h-36 overflow-hidden bg-muted">
                            <img
                              src={articleImages[article.id] || "/placeholder.svg"}
                              alt={article.title}
                              loading="lazy"
                              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
                          </div>
                          <CardContent className="flex flex-1 flex-col p-5">
                            <div className="mb-3 flex flex-wrap gap-1.5">
                              {article.tags.slice(0, 2).map((tag) => (
                                <Badge
                                  key={tag}
                                  variant="secondary"
                                  className="bg-muted text-[10px] text-muted-foreground ring-1 ring-border"
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                            <h3 className="mb-2 line-clamp-2 font-display text-lg font-bold text-card-foreground">
                              {article.title}
                            </h3>
                            <p className="mb-4 line-clamp-3 flex-1 text-sm text-muted-foreground">
                              {article.summary}
                            </p>
                            <div className="flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
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
                <div className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
                  <img
                    src={wafer}
                    alt="Silicon wafer with SoC die array"
                    width={1408}
                    height={1008}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover opacity-20"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-background/90 via-card/90 to-primary/5" />
                  <div className="relative px-8 py-16 text-center md:px-16 md:py-20">
                    <h2 className="font-display text-3xl md:text-5xl font-bold leading-tight text-foreground">
                      Ready to build your{" "}
                      <span className="text-primary">System-on-Chip?</span>
                    </h2>
                    <p className="mx-auto mt-5 max-w-xl text-muted-foreground">
                      Define your project, pick a reference design, and start building custom
                      silicon today.
                    </p>
                    <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                      <Button
                        asChild
                        size="lg"
                        className="rounded-full bg-primary px-8 text-base text-primary-foreground hover:bg-primary/90"
                      >
                        <Link to="/projects/start">
                          Start a Project <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        asChild
                        size="lg"
                        variant="outline"
                        className="rounded-full border-border bg-background px-8 text-foreground hover:bg-muted hover:text-foreground"
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
