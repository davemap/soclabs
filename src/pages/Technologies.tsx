import { motion } from "framer-motion";
import { ArrowRight, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import { technologies } from "@/data/mockData";

const categories = [...new Set(technologies.map((t) => t.category))];

const categoryColors: Record<string, string> = {
  "Processor IP": "bg-primary/10 text-primary",
  "FPGA Tools": "bg-coral/10 text-coral",
  "Open Source EDA": "bg-violet/10 text-violet",
  "ASIC Tools": "bg-amber/10 text-amber",
  "Verification": "bg-primary/10 text-primary",
};

const Technologies = () => {
  return (
    <Layout>
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Technologies & <span className="text-gradient">Tools</span></h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              An overview of the platforms, tools, and IP available to design, verify, and fabricate your SoC.
            </p>
          </motion.div>

          {categories.map((cat) => (
            <div key={cat} className="max-w-4xl mx-auto mb-12">
              <div className="flex items-center gap-2 mb-4">
                <span className={`text-xs px-3 py-1 rounded-full font-semibold ${categoryColors[cat] || "bg-muted text-muted-foreground"}`}>{cat}</span>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {technologies
                  .filter((t) => t.category === cat)
                  .map((tech, i) => (
                    <motion.div
                      key={tech.name}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Card className="hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 border-border/60">
                        <CardContent className="p-5">
                          <h3 className="font-display font-semibold mb-1">{tech.name}</h3>
                          <p className="text-sm text-muted-foreground leading-relaxed">{tech.description}</p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
              </div>
            </div>
          ))}

          {/* FPGA & ASIC Processes */}
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 mt-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-2xl border border-border/60 bg-card p-7 shadow-sm"
            >
              <h2 className="text-xl font-display font-bold mb-4">FPGA Prototyping Process</h2>
              <ol className="space-y-3">
                {[
                  "Synthesise your RTL for target FPGA (Xilinx/Intel)",
                  "Run place & route with timing constraints",
                  "Generate bitstream and program the FPGA",
                  "Develop software drivers and test firmware",
                  "Debug with integrated logic analyser (ILA/SignalTap)",
                  "Benchmark performance on real hardware",
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <span className="text-primary font-display font-bold text-xs mt-0.5">{String(i + 1).padStart(2, "0")}</span>
                    {step}
                  </li>
                ))}
              </ol>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="rounded-2xl border border-border/60 bg-card p-7 shadow-sm"
            >
              <h2 className="text-xl font-display font-bold mb-4">ASIC Tapeout Process</h2>
              <ol className="space-y-3">
                {[
                  "Complete RTL verification and freeze design",
                  "Run logic synthesis targeting standard cell library",
                  "Physical design: floorplanning, placement, routing",
                  "Sign-off checks: DRC, LVS, timing closure",
                  "Submit to shuttle service (Europractice, OpenMPW)",
                  "Receive packaged chips and run post-silicon validation",
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <span className="text-coral font-display font-bold text-xs mt-0.5">{String(i + 1).padStart(2, "0")}</span>
                    {step}
                  </li>
                ))}
              </ol>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Technologies;
