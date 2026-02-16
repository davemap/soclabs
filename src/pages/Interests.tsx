import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, ExternalLink, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Layout from "@/components/Layout";
import { interests } from "@/data/interests";

const categories = ["Technologies", "Research Fields", "Activities"] as const;

const categoryStyles = {
  Technologies: { active: "bg-primary text-primary-foreground border-primary", inactive: "border-primary/20 text-primary hover:bg-primary/10", badge: "bg-primary/10 text-primary" },
  "Research Fields": { active: "bg-coral text-coral-foreground border-coral", inactive: "border-coral/20 text-coral hover:bg-coral/10", badge: "bg-coral/10 text-coral" },
  Activities: { active: "bg-violet text-violet-foreground border-violet", inactive: "border-violet/20 text-violet hover:bg-violet/10", badge: "bg-violet/10 text-violet" },
};

const Interests = () => {
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
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Explore <span className="text-gradient">Interests</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto">
              Browse technologies, research fields, and activities. Select the ones you care about, then register to connect with like-minded people and projects.
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto space-y-10">
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
                  <div className="flex items-center gap-2 mb-4">
                    <span className={`text-xs px-3 py-1 rounded-full font-semibold ${styles.badge}`}>{category}</span>
                    <span className="text-xs text-muted-foreground">{categoryInterests.length} topics</span>
                  </div>
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
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl mx-auto mt-10"
            >
              <div className="p-6 rounded-2xl border border-primary/15 bg-gradient-to-br from-primary/5 via-transparent to-violet/5 text-center">
                <Sparkles className="h-5 w-5 text-primary mx-auto mb-2" />
                <p className="text-sm font-medium text-foreground mb-1">
                  {selectedInterests.length} interest{selectedInterests.length !== 1 ? "s" : ""} selected
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  Register to connect with people and projects in these areas.
                </p>
                <Button asChild className="rounded-full px-6">
                  <Link to="/about#join">
                    Register Your Interests <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Interests;
