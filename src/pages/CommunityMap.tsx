import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import { X, ExternalLink } from "lucide-react";
import Layout from "@/components/Layout";
import { communityMembers } from "@/data/mockData";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

type Member = (typeof communityMembers)[number];

const CommunityMap = () => {
  const [selected, setSelected] = useState<Member | null>(null);

  return (
    <Layout>
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Global <span className="text-gradient">Community</span></h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Our members span the globe. Click on a pin to learn more about each contributor.
            </p>
          </motion.div>

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
                      fill="hsl(40, 15%, 92%)"
                      stroke="hsl(40, 15%, 85%)"
                      strokeWidth={0.5}
                      style={{
                        default: { outline: "none" },
                        hover: { fill: "hsl(168, 40%, 88%)", outline: "none" },
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
                    fill="hsl(168, 75%, 38%)"
                    stroke="hsl(168, 75%, 38%)"
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

                  <a
                    href={selected.url}
                    className="inline-flex items-center gap-1 text-xs text-primary hover:underline font-medium"
                  >
                    View Profile <ExternalLink className="h-3 w-3" />
                  </a>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default CommunityMap;
