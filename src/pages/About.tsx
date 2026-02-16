import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, ArrowRight, Check, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import Layout from "@/components/Layout";
import { interests } from "@/data/interests";

const categories = ["Technologies", "Research Fields", "Activities"] as const;

const categoryStyles = {
  Technologies: { active: "bg-primary text-primary-foreground border-primary", inactive: "border-primary/20 text-primary hover:bg-primary/10" },
  "Research Fields": { active: "bg-coral text-coral-foreground border-coral", inactive: "border-coral/20 text-coral hover:bg-coral/10" },
  Activities: { active: "bg-violet text-violet-foreground border-violet", inactive: "border-violet/20 text-violet hover:bg-violet/10" },
};

const About = () => {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

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

      {/* Interests */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-3">Register Your <span className="text-gradient">Interests</span></h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Select the technologies, research fields, and activities you're interested in. Click on any interest to explore related people and projects.
              </p>
            </div>

            <div className="space-y-8">
              {categories.map((category, catIdx) => {
                const styles = categoryStyles[category];
                const categoryInterests = interests.filter((i) => i.category === category);

                return (
                  <motion.div
                    key={category}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: catIdx * 0.1 }}
                  >
                    <h3 className="font-display font-semibold text-sm mb-3 text-foreground">{category}</h3>
                    <div className="flex flex-wrap gap-2">
                      {categoryInterests.map((interest) => {
                        const isSelected = selectedInterests.includes(interest.name);
                        return (
                          <div key={interest.slug} className="flex items-center gap-0">
                            <button
                              onClick={() => toggleInterest(interest.name)}
                              className={cn(
                                "inline-flex items-center gap-1.5 pl-3.5 pr-2 py-2 rounded-l-full border border-r-0 text-sm font-medium transition-all duration-200",
                                isSelected ? styles.active : styles.inactive
                              )}
                            >
                              {isSelected && <Check className="h-3.5 w-3.5" />}
                              {interest.name}
                            </button>
                            <Link
                              to={`/interests/${interest.slug}`}
                              className={cn(
                                "inline-flex items-center px-2 py-2 rounded-r-full border text-sm transition-all duration-200",
                                isSelected ? styles.active : styles.inactive
                              )}
                              title={`Explore ${interest.name}`}
                            >
                              <ExternalLink className="h-3 w-3" />
                            </Link>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {selectedInterests.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-6 p-4 rounded-xl bg-primary/5 border border-primary/15 text-sm text-primary font-medium text-center"
              >
                {selectedInterests.length} interest{selectedInterests.length !== 1 ? "s" : ""} selected — fill in the form below to register
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Join form */}
      <section id="join" className="py-24 bg-muted/40 accent-stripe border-t border-border">
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

              {selectedInterests.length > 0 && (
                <div>
                  <label className="text-sm font-medium mb-2 block">Your Interests</label>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedInterests.map((interest) => (
                      <span key={interest} className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary font-medium">
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              )}

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
