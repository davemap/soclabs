import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Cpu, Users, GraduationCap, Globe, Calendar, User, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Layout from "@/components/Layout";
import ScrollReveal from "@/components/ScrollReveal";
import ScrollProgressRail from "@/components/ScrollProgressRail";
import { referenceDesigns, communityMembers, communityProjects, partners } from "@/data/mockData";
import { newsArticles } from "@/data/newsData";
import { useAuth } from "@/hooks/useAuth";

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
  { id: "project-focus", label: "Project Focus" },
  { id: "news", label: "Latest" },
  { id: "cta", label: "Start" },
];


const Index = () => {
  const { user } = useAuth();

  return (
    <Layout>
      <div className="relative">
        <ScrollProgressRail sections={railSections} />

        <div className="relative z-10">
          {/* Hero */}
          <section id="hero" className="relative overflow-hidden bg-[#0b1c2b] text-white">
            <div
              className="absolute inset-0 opacity-[0.18] pointer-events-none"
              style={{
                backgroundImage:
                  "linear-gradient(115deg, transparent 46%, rgba(147,197,253,0.5) 46%, rgba(147,197,253,0.5) 46.4%, transparent 46.4%), linear-gradient(0deg, transparent 62%, rgba(163,230,53,0.55) 62%, rgba(163,230,53,0.55) 62.3%, transparent 62.3%)",
                backgroundSize: "220px 220px, 260px 260px",
              }}
            />
            <div className="container mx-auto px-4 py-28 md:py-40 relative">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-3xl mx-auto text-center"
              >
                <div className="text-xs md:text-sm font-semibold tracking-[0.2em] text-[#a3e635] mb-4 uppercase">
                  Reference SoCs · Verification · Silicon
                </div>
                <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight mb-6 leading-[1.1] text-white">
                  Build Your Own{" "}
                  <span className="text-[#a3e635]">System-on-Chip</span>
                </h1>
                <p className="text-lg md:text-xl text-white/70 mb-10 max-w-2xl mx-auto leading-relaxed">
                  SoC Labs gives academics and students reference ARM Cortex-M designs, tools, and a global community to create, verify, and fabricate custom silicon.
                </p>
                <div className="flex justify-center">
                  <Button asChild size="lg" className="rounded-full px-8 text-base bg-[#a3e635] text-[#0b1c2b] hover:bg-[#bef264]">
                    <Link to="/projects">
                      Explore SoC Labs Projects <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </motion.div>
            </div>
          </section>


          {/* Reference Designs */}
          <section id="designs" className="py-24 bg-secondary/5 border-y border-border/50">
            <div className="container mx-auto px-4">
              <ScrollReveal className="text-center mb-14">
                <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Reference SoC Designs</h2>
                <p className="text-muted-foreground max-w-xl mx-auto">
                  Start with our proven architectures. Fork, extend, and build your custom accelerators on top.
                </p>
              </ScrollReveal>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {referenceDesigns.slice(0, 3).map((design, i) => (
                  <ScrollReveal key={design.id} delay={i * 0.12} direction={i % 2 === 0 ? "left" : "right"}>
                    <Link to={`/designs/${design.id}`} className="block h-full">
                      <Card className="h-full hover:shadow-xl hover:shadow-electric/5 hover:-translate-y-1 transition-all duration-300 border-border/60 hover:border-electric/30 cursor-pointer">
                        <CardContent className="p-7">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="text-xl font-display font-bold">{design.name}</h3>
                              <p className="text-sm text-primary font-medium">{design.tagline}</p>
                            </div>
                            <div className="w-11 h-11 rounded-xl bg-electric/10 flex items-center justify-center">
                              <Cpu className="h-5 w-5 text-electric" />
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mb-5 line-clamp-3">{design.description}</p>
                          <div className="flex flex-wrap gap-2 mb-5">
                            {design.features.slice(0, 3).map((f) => (
                              <span key={f} className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary font-medium">
                                {f}
                              </span>
                            ))}
                          </div>
                          <span className="text-xs text-primary font-medium inline-flex items-center gap-1">
                            View details <ArrowRight className="h-3 w-3" />
                          </span>
                        </CardContent>
                      </Card>
                    </Link>
                  </ScrollReveal>
                ))}
              </div>
              <ScrollReveal className="text-center mt-10">
                <Button asChild variant="outline" size="lg" className="rounded-full px-8">
                  <Link to="/designs">View All Reference SoC's <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
              </ScrollReveal>
            </div>
          </section>

          {/* Why Join */}
          <section id="why" className="relative py-24 bg-muted/40 accent-stripe border-y border-border">
            <div className="container mx-auto px-4">
              <ScrollReveal>
                <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-14">Why Join SoC Labs?</h2>
              </ScrollReveal>
              <div className="grid md:grid-cols-3 gap-10 max-w-4xl mx-auto">
                {[
                  {
                    icon: GraduationCap,
                    title: "Learn by Building",
                    desc: "Go from RTL to FPGA to ASIC with real reference designs, guided tutorials, and expert community support.",
                    color: "bg-primary/10 text-primary",
                  },
                  {
                    icon: Users,
                    title: "Global Community",
                    desc: "Connect with researchers, students, and engineers across 28+ countries. Share knowledge, collaborate on projects.",
                    color: "bg-coral/10 text-coral",
                  },
                  {
                    icon: Globe,
                    title: "Silicon Access",
                    desc: "Access ASIC shuttle programmes and FPGA platforms to take your designs from simulation to real hardware.",
                    color: "bg-violet/10 text-violet",
                  },
                ].map((item, i) => (
                  <ScrollReveal key={item.title} delay={i * 0.12}>
                    <div className="text-center">
                      <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl ${item.color} mb-5`}>
                        <item.icon className="h-6 w-6" />
                      </div>
                      <h3 className="font-display font-bold text-lg mb-2">{item.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                    </div>
                  </ScrollReveal>
                ))}
              </div>

              <ScrollReveal className="mt-16">
                <div className="max-w-3xl mx-auto rounded-2xl border border-border bg-background/80 backdrop-blur-sm shadow-lg p-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {[
                      { label: "Community Members", value: communityMembers.length },
                      { label: "Organisations", value: partners.length },
                      { label: "Countries", value: new Set(partners.map((p) => p.country).filter(Boolean)).size },
                      { label: "Projects Built", value: communityProjects.length },
                    ].map((stat) => (
                      <div key={stat.label} className="text-center">
                        <div className="text-3xl md:text-4xl font-display font-bold text-gradient">{stat.value}</div>
                        <div className="text-xs text-muted-foreground mt-1 font-medium">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
              {!user && (
                <ScrollReveal className="text-center mt-12">
                  <Button asChild size="lg" variant="outline" className="rounded-full px-8 text-base">
                    <Link to="/about#join">Join the Community</Link>
                  </Button>
                </ScrollReveal>
              )}
            </div>
          </section>

          {/* Latest News */}
          <section id="news" className="py-24 bg-secondary/5 border-y border-border/50">
            <div className="container mx-auto px-4">
              <ScrollReveal className="text-center mb-14">
                <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Latest News</h2>
                <p className="text-muted-foreground max-w-xl mx-auto">
                  Stay up to date with community milestones, events, and research breakthroughs.
                </p>
              </ScrollReveal>

              <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {[...newsArticles]
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .slice(0, 3)
                  .map((article, i) => (
                    <ScrollReveal key={article.id} delay={i * 0.12}>
                      <Link to={`/news/${article.id}`} className="block h-full">
                        <Card className="h-full hover:shadow-xl hover:shadow-electric/5 hover:-translate-y-1 transition-all duration-300 border-border/60 hover:border-electric/30 overflow-hidden">
                          <div className="relative h-36 overflow-hidden bg-muted">
                            <img
                              src={articleImages[article.id] || "/placeholder.svg"}
                              alt={article.title}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
                          </div>
                          <CardContent className="p-5 flex flex-col flex-1">
                            <div className="flex flex-wrap gap-1.5 mb-3">
                              {article.tags.slice(0, 2).map((tag) => (
                                <Badge key={tag} variant="secondary" className="text-[10px]">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                            <h3 className="text-lg font-display font-bold mb-2 line-clamp-2">{article.title}</h3>
                            <p className="text-sm text-muted-foreground mb-4 line-clamp-3 flex-1">{article.summary}</p>
                            <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border/50">
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

              <ScrollReveal className="text-center mt-10">
                <Button asChild variant="outline" size="lg" className="rounded-full px-8">
                  <Link to="/news">View All News <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
              </ScrollReveal>
            </div>
          </section>

          {/* CTA */}
          <section id="cta" className="py-24">
            <div className="container mx-auto px-4 text-center">
              <ScrollReveal>
                <div className="max-w-xl mx-auto p-10 rounded-2xl border border-primary/15 bg-gradient-to-br from-primary/5 via-transparent to-violet/5">
                  <h2 className="text-3xl font-display font-bold mb-4">Ready to Build Your SoC?</h2>
                  <p className="text-muted-foreground mb-8 leading-relaxed">
                    Define your project, pick a reference design, and start building custom silicon today.
                  </p>
                  <Button asChild size="lg" className="rounded-full px-8">
                    <Link to="/projects/start">
                      Start a Project <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
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
