import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Github, Cpu, Users, GraduationCap, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Layout from "@/components/Layout";
import { referenceDesigns, stats } from "@/data/mockData";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};

const Index = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative overflow-hidden circuit-dots">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="container mx-auto px-4 py-24 md:py-36 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/5 text-primary text-xs font-mono mb-6">
              <Cpu className="h-3 w-3" />
              Open-Source Silicon Community
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Build Your Own{" "}
              <span className="text-gradient glow-text">System-on-Chip</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              SoC Labs gives academics and students reference ARM Cortex-M designs, tools, and a global community to create, verify, and fabricate custom silicon.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="glow-cyan">
                <Link to="/designs">
                  Explore Designs <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/about#join">Join the Community</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border bg-card/30">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-primary font-mono">{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Reference Designs */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-3">Reference SoC Designs</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Start with our proven architectures. Fork, extend, and build your custom accelerators on top.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {referenceDesigns.map((design, i) => (
              <motion.div
                key={design.id}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <Card className="h-full border-border hover:border-primary/50 transition-colors bg-card/80">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-foreground">{design.name}</h3>
                        <p className="text-sm text-primary font-mono">{design.tagline}</p>
                      </div>
                      <Cpu className="h-8 w-8 text-primary/50" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{design.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {design.features.slice(0, 3).map((f) => (
                        <span key={f} className="text-xs px-2 py-1 rounded bg-primary/10 text-primary font-mono">
                          {f}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-3">
                      <Button asChild size="sm" variant="outline">
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
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Join */}
      <section className="py-20 bg-card/30 border-y border-border">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Join SoC Labs?</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                icon: GraduationCap,
                title: "Learn by Building",
                desc: "Go from RTL to FPGA to ASIC with real reference designs, guided tutorials, and expert community support.",
              },
              {
                icon: Users,
                title: "Global Community",
                desc: "Connect with researchers, students, and engineers across 28+ countries. Share knowledge, collaborate on projects.",
              },
              {
                icon: Globe,
                title: "Silicon Access",
                desc: "Access ASIC shuttle programmes and FPGA platforms to take your designs from simulation to real hardware.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary mb-4">
                  <item.icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-xl mx-auto p-8 rounded-xl border border-primary/20 bg-gradient-to-b from-primary/5 to-transparent"
          >
            <h2 className="text-2xl font-bold mb-3">Ready to Build Your SoC?</h2>
            <p className="text-muted-foreground mb-6">
              Join our community, fork a reference design, and start building custom silicon today.
            </p>
            <Button asChild size="lg" className="glow-cyan">
              <Link to="/about#join">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
