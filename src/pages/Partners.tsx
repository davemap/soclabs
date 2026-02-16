import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Layout from "@/components/Layout";
import { partners } from "@/data/mockData";

const Partners = () => {
  return (
    <Layout>
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center mb-16"
          >
            <h1 className="text-4xl font-bold mb-4">Partner <span className="text-gradient">Organisations</span></h1>
            <p className="text-lg text-muted-foreground">
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
                <Card className="h-full border-border bg-card/80 hover:border-primary/30 transition-colors">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <span className="text-primary font-bold font-mono text-lg">{partner.name[0]}</span>
                    </div>
                    <h3 className="font-bold text-lg mb-2">{partner.name}</h3>
                    <p className="text-sm text-muted-foreground flex-1 mb-4">{partner.description}</p>
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
