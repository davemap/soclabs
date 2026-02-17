import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import ScrollReveal from "@/components/ScrollReveal";
import { Link } from "react-router-dom";
import JoinCommunityDialog from "@/components/JoinCommunityDialog";
import { useAuth } from "@/hooks/useAuth";

const About = () => {
  const [joinOpen, setJoinOpen] = useState(false);
  const { user } = useAuth();

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
              <ScrollReveal key={v.title} delay={i * 0.1}>
                <div className="text-center">
                  <h3 className={`font-display font-bold text-lg mb-2 ${v.color}`}>{v.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Interests CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <ScrollReveal>
            <div className="max-w-xl mx-auto p-10 rounded-2xl border border-primary/15 bg-gradient-to-br from-primary/5 via-transparent to-violet/5">
              <h2 className="text-2xl font-display font-bold mb-3">Find Your Focus</h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Explore technologies, discussions, and activities — and connect with people who share your interests.
              </p>
              <div className="flex items-center justify-center gap-3">
                <Button asChild className="rounded-full px-6">
                  <Link to="/learn">
                    Learning Hub <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild className="rounded-full px-6">
                  <Link to="/technologies">
                    Technologies <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild className="rounded-full px-6">
                  <Link to="/research">
                    Discussions <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Join CTA */}
      {!user && (
        <section id="join" className="py-24 bg-muted/40 accent-stripe border-t border-border">
          <div className="container mx-auto px-4">
            <ScrollReveal className="max-w-lg mx-auto text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 text-primary mb-4">
                <Mail className="h-6 w-6" />
              </div>
              <h2 className="text-3xl font-display font-bold mb-2">Join the Community</h2>
              <p className="text-muted-foreground mb-6">
                Interested in building custom silicon? Sign up and become part of SoC Labs.
              </p>
              <Button className="rounded-full px-8" onClick={() => setJoinOpen(true)}>
                Join Community <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </ScrollReveal>
          </div>
        </section>
      )}

      <JoinCommunityDialog open={joinOpen} onOpenChange={setJoinOpen} />
    </Layout>
  );
};

export default About;
