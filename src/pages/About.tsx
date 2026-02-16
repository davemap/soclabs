import { motion } from "framer-motion";
import { Mail, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Layout from "@/components/Layout";

const About = () => {
  return (
    <Layout>
      {/* Mission */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">About <span className="text-gradient">SoC Labs</span></h1>
            <p className="text-lg text-muted-foreground mb-4 leading-relaxed">
              SoC Labs is an open community that makes custom silicon design accessible to academics and students worldwide. We provide reference ARM Cortex-M based System-on-Chip designs, tools, education, and pathways to real hardware — from FPGA prototypes to ASIC tapeouts.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Our mission is to lower the barriers to chip design, foster collaboration across institutions, and inspire the next generation of silicon engineers.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 border-y border-border bg-muted/40 accent-stripe">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { title: "Open & Accessible", desc: "All reference designs are open-source. We believe silicon design should be available to everyone, not just large corporations.", color: "text-primary" },
              { title: "Community-Driven", desc: "Built by and for the academic community. Share your projects, learn from others, and collaborate across borders.", color: "text-coral" },
              { title: "Real Silicon", desc: "We don't stop at simulation. Through shuttle programmes and FPGA platforms, your designs can become real chips.", color: "text-violet" },
            ].map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <h3 className={`font-display font-bold text-lg mb-2 ${v.color}`}>{v.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Join form */}
      <section id="join" className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-lg mx-auto"
          >
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 text-primary mb-4">
                <Mail className="h-6 w-6" />
              </div>
              <h2 className="text-3xl font-display font-bold mb-2">Join the Community</h2>
              <p className="text-muted-foreground">
                Interested in building custom silicon? Register your interest and we'll get in touch.
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
              }}
              className="space-y-4 rounded-2xl border border-border/60 bg-card p-7 shadow-sm"
            >
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Name</label>
                  <Input placeholder="Your name" className="bg-background rounded-lg" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Institution</label>
                  <Input placeholder="University / Organisation" className="bg-background rounded-lg" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Email</label>
                <Input type="email" placeholder="you@example.com" className="bg-background rounded-lg" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Tell us about your interest</label>
                <Textarea placeholder="What would you like to build? What's your experience level?" className="bg-background rounded-lg" rows={4} />
              </div>
              <Button type="submit" className="w-full rounded-full">
                Register Interest <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
