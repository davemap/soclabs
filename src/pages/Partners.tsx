import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Layout from "@/components/Layout";
import { partners } from "@/data/mockData";

const partnerColors = [
  "bg-primary/10 text-primary",
  "bg-coral/10 text-coral",
  "bg-violet/10 text-violet",
  "bg-amber/10 text-amber",
  "bg-primary/10 text-primary",
  "bg-coral/10 text-coral",
];

const Partners = () => {
  return (
    <Layout>
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Our <span className="text-gradient">Community</span></h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              We work with leading organisations across academia, industry, and open-source to make custom silicon accessible.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {partners.map((partner, i) => (
              <motion.div
                key={partner.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="h-full hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-border/60">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${partnerColors[i % partnerColors.length]}`}>
                      <span className="font-display font-bold text-lg">{partner.name[0]}</span>
                    </div>
                    <h3 className="font-display font-bold text-lg mb-2">{partner.name}</h3>
                    <p className="text-sm text-muted-foreground flex-1 mb-4 leading-relaxed">{partner.description}</p>
                    <Button asChild variant="ghost" size="sm" className="self-start">
                      <a href={partner.url} target="_blank" rel="noopener noreferrer">
                        Visit Website <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Partners;
