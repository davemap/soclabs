import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Github, Cpu, Users, GraduationCap, Globe, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Layout from "@/components/Layout";
import ScrollReveal from "@/components/ScrollReveal";
import { referenceDesigns, stats } from "@/data/mockData";

const Index = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-hero mesh-dots">
        <div className="container mx-auto px-4 py-28 md:py-40 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-semibold mb-8"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Open-Source Silicon Community
            </motion.div>
            <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight mb-6 leading-[1.1]">
              Build Your Own{" "}
              <span className="text-gradient">System-on-Chip</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              SoC Labs gives academics and students reference ARM Cortex-M designs, tools, and a global community to create, verify, and fabricate custom silicon.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="rounded-full px-8 text-base">
                <Link to="/designs">
                  Explore Designs <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full px-8 text-base">
                <Link to="/about#join">Join the Community</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border">
        <div className="container mx-auto px-4 py-14">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <ScrollReveal key={stat.label} delay={i * 0.1} className="text-center">
                <div className="text-4xl md:text-5xl font-display font-bold text-gradient">{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-2 font-medium">{stat.label}</div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Reference Designs */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <ScrollReveal className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Reference SoC Designs</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Start with our proven architectures. Fork, extend, and build your custom accelerators on top.
            </p>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {referenceDesigns.map((design, i) => (
              <ScrollReveal key={design.id} delay={i * 0.12} direction={i % 2 === 0 ? "left" : "right"}>
                <Card className="h-full hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-border/60">
                  <CardContent className="p-7">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-display font-bold">{design.name}</h3>
                        <p className="text-sm text-primary font-medium">{design.tagline}</p>
                      </div>
                      <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Cpu className="h-5 w-5 text-primary" />
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
                    <div className="flex gap-3">
                      <Button asChild size="sm" variant="outline" className="rounded-full">
                        <Link to={`/designs#${design.id}`}>Learn More</Link>
                      </Button>
                      <Button asChild size="sm" variant="ghost">
                        <a href={design.githubUrl} target="_blank" rel="noopener noreferrer">
                          <Github className="h-4 w-4 mr-1" /> GitHub
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Why Join */}
      <section className="py-24 bg-muted/40 accent-stripe border-y border-border">
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
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="container mx-auto px-4 text-center">
          <ScrollReveal>
            <div className="max-w-xl mx-auto p-10 rounded-2xl border border-primary/15 bg-gradient-to-br from-primary/5 via-transparent to-violet/5">
              <h2 className="text-3xl font-display font-bold mb-4">Ready to Build Your SoC?</h2>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Join our community, fork a reference design, and start building custom silicon today.
              </p>
              <Button asChild size="lg" className="rounded-full px-8">
                <Link to="/about#join">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
