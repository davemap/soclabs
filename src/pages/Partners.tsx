import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, X, ArrowRight } from "lucide-react";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Layout from "@/components/Layout";
import ScrollReveal from "@/components/ScrollReveal";
import { partners, communityMembers } from "@/data/mockData";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

type Member = (typeof communityMembers)[number];

const partnerColors = [
  "bg-primary/10 text-primary",
  "bg-coral/10 text-coral",
  "bg-violet/10 text-violet",
  "bg-amber/10 text-amber",
  "bg-primary/10 text-primary",
  "bg-coral/10 text-coral",
];

const Partners = () => {
  const [selected, setSelected] = useState<Member | null>(null);

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

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto mb-20">
            {partners.map((partner, i) => (
              <ScrollReveal key={partner.name} delay={i * 0.06}>
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
              </ScrollReveal>
            ))}
          </div>

          {/* Global Community Map */}
          <ScrollReveal className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Global <span className="text-gradient">Map</span></h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Our members span the globe. Click on a pin to learn more about each contributor.
            </p>
          </ScrollReveal>

          <ScrollReveal>
            <div className="relative max-w-5xl mx-auto rounded-2xl border border-border/60 bg-card overflow-hidden shadow-sm">
              <ComposableMap
                projectionConfig={{ scale: 147 }}
                className="w-full h-auto"
                style={{ background: "transparent" }}
              >
                <Geographies geography={geoUrl}>
                  {({ geographies }) =>
                    geographies.map((geo) => (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill="hsl(220, 14%, 28%)"
                        stroke="hsl(220, 12%, 34%)"
                        strokeWidth={0.5}
                        style={{
                          default: { outline: "none" },
                          hover: { fill: "hsl(168, 30%, 28%)", outline: "none" },
                          pressed: { outline: "none" },
                        }}
                      />
                    ))
                  }
                </Geographies>
                {communityMembers.map((member) => (
                  <Marker
                    key={member.name}
                    coordinates={member.coordinates}
                    onClick={() => setSelected(member)}
                    style={{ cursor: "pointer" }}
                  >
                    <circle
                      r={5}
                      fill="hsl(168, 75%, 44%)"
                      stroke="hsl(168, 75%, 44%)"
                      strokeWidth={2}
                      opacity={0.85}
                      className="animate-pulse-glow"
                    />
                    <circle r={10} fill="transparent" />
                  </Marker>
                ))}
              </ComposableMap>

              <AnimatePresence>
                {selected && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-80 rounded-xl border border-border/60 bg-card p-5 shadow-xl"
                  >
                    <button
                      onClick={() => setSelected(null)}
                      className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <h3 className="font-display font-bold text-lg">{selected.name}</h3>
                    <p className="text-sm text-primary font-medium">{selected.institution}</p>
                    <p className="text-xs text-muted-foreground mb-3">{selected.location}</p>

                    <div className="mb-3">
                      <p className="text-xs font-display font-semibold text-foreground mb-1">Projects</p>
                      {selected.projects.map((p) => (
                        <span key={p} className="inline-block text-xs px-2.5 py-0.5 rounded-full bg-primary/10 text-primary mr-1 mb-1 font-medium">
                          {p}
                        </span>
                      ))}
                    </div>

                    <div className="mb-3">
                      <p className="text-xs font-display font-semibold text-foreground mb-1">Expertise</p>
                      <div className="flex flex-wrap gap-1">
                        {selected.expertise.map((e) => (
                          <span key={e} className="text-xs px-2.5 py-0.5 rounded-full bg-secondary text-secondary-foreground font-medium">
                            {e}
                          </span>
                        ))}
                      </div>
                    </div>

                    <Link
                      to={`/community/${selected.id}`}
                      className="inline-flex items-center gap-1 text-xs text-primary hover:underline font-medium"
                    >
                      View Profile <ArrowRight className="h-3 w-3" />
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </Layout>
  );
};

export default Partners;
