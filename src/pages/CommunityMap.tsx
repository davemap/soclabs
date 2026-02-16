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
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center mb-12"
          >
            <h1 className="text-4xl font-bold mb-4">Global <span className="text-gradient">Community</span></h1>
            <p className="text-lg text-muted-foreground">
              Our members span the globe. Click on a pin to learn more about each contributor.
            </p>
          </motion.div>

          <div className="relative max-w-5xl mx-auto rounded-xl border border-border bg-card/50 overflow-hidden">
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
                      fill="hsl(220, 15%, 14%)"
                      stroke="hsl(220, 15%, 20%)"
                      strokeWidth={0.5}
                      style={{
                        default: { outline: "none" },
                        hover: { fill: "hsl(220, 15%, 18%)", outline: "none" },
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
                    fill="hsl(190, 95%, 50%)"
                    stroke="hsl(190, 95%, 50%)"
                    strokeWidth={2}
                    opacity={0.8}
                    className="animate-pulse-glow"
                  />
                  <circle r={10} fill="transparent" />
                </Marker>
              ))}
            </ComposableMap>

            {/* Profile popup */}
            <AnimatePresence>
              {selected && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-80 rounded-lg border border-primary/30 bg-card p-5 shadow-xl"
                >
                  <button
                    onClick={() => setSelected(null)}
                    className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <h3 className="font-bold text-lg">{selected.name}</h3>
                  <p className="text-sm text-primary font-mono">{selected.institution}</p>
                  <p className="text-xs text-muted-foreground mb-3">{selected.location}</p>

                  <div className="mb-3">
                    <p className="text-xs font-semibold text-foreground mb-1">Projects</p>
                    {selected.projects.map((p) => (
                      <span key={p} className="inline-block text-xs px-2 py-0.5 rounded bg-primary/10 text-primary mr-1 mb-1">
                        {p}
                      </span>
                    ))}
                  </div>

                  <div className="mb-3">
                    <p className="text-xs font-semibold text-foreground mb-1">Expertise</p>
                    <div className="flex flex-wrap gap-1">
                      {selected.expertise.map((e) => (
                        <span key={e} className="text-xs px-2 py-0.5 rounded bg-secondary text-secondary-foreground">
                          {e}
                        </span>
                      ))}
                    </div>
                  </div>

                  <a
                    href={selected.url}
                    className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
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
