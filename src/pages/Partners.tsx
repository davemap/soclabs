import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, X, ArrowRight, Building2, GraduationCap, MapPin } from "lucide-react";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Layout from "@/components/Layout";
import ScrollReveal from "@/components/ScrollReveal";
import { partners, communityMembers } from "@/data/mockData";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

type AcademicPartner = (typeof partners)[number] & { coordinates?: [number, number] };

const industryColors = [
  "bg-primary/10 text-primary",
  "bg-coral/10 text-coral",
  "bg-violet/10 text-violet",
  "bg-amber/10 text-amber",
  "bg-primary/10 text-primary",
  "bg-coral/10 text-coral",
];

const Partners = () => {
  const [selectedPartner, setSelectedPartner] = useState<AcademicPartner | null>(null);

  const industryPartners = useMemo(() => partners.filter((p) => p.type === "industry"), []);
  const academicPartners = useMemo(() => partners.filter((p) => p.type === "academic"), []);

  // Find community members associated with each academic institution
  const getMembersForInstitution = (name: string) =>
    communityMembers.filter((m) => m.institution === name);

  return (
    <Layout>
      <section className="py-24">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Our <span className="text-gradient">Community</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              We work with leading organisations across academia, industry, and open-source to make custom silicon accessible.
            </p>
          </motion.div>

          {/* Global Map — Academic Institutions */}
          <ScrollReveal className="max-w-5xl mx-auto mb-8">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-display font-bold">Global Academic <span className="text-gradient">Network</span></h2>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              Our academic partners span the globe. Click on a pin to learn more about each institution.
            </p>
          </ScrollReveal>

          <ScrollReveal className="max-w-5xl mx-auto mb-20">
            <div className="relative rounded-2xl border border-border/60 bg-card overflow-hidden shadow-sm">
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
                {academicPartners.map((partner) =>
                  partner.coordinates ? (
                    <Marker
                      key={partner.name}
                      coordinates={partner.coordinates}
                      onClick={() => setSelectedPartner(partner)}
                      style={{ cursor: "pointer" }}
                    >
                      <circle
                        r={6}
                        fill="hsl(210, 100%, 60%)"
                        stroke="hsl(210, 100%, 80%)"
                        strokeWidth={2}
                        opacity={0.9}
                      />
                      <circle r={12} fill="transparent" />
                    </Marker>
                  ) : null
                )}
              </ComposableMap>

              {/* Info popup */}
              <AnimatePresence>
                {selectedPartner && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 rounded-xl border border-border/60 bg-card p-5 shadow-xl"
                  >
                    <button
                      onClick={() => setSelectedPartner(null)}
                      className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <GraduationCap className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-display font-bold text-lg">{selectedPartner.name}</h3>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                      {selectedPartner.description}
                    </p>

                    {/* Members at this institution */}
                    {getMembersForInstitution(selectedPartner.name).length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs font-display font-semibold text-foreground mb-2">Members</p>
                        <div className="space-y-2">
                          {getMembersForInstitution(selectedPartner.name).map((member) => (
                            <Link
                              key={member.id}
                              to={`/community/${member.id}`}
                              className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
                            >
                              <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center">
                                <span className="text-primary font-display font-bold text-[10px]">
                                  {member.name.split(" ").map((n) => n[0]).join("")}
                                </span>
                              </div>
                              <span className="font-medium">{member.name}</span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    <a
                      href={selectedPartner.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-primary hover:underline font-medium"
                    >
                      Visit Website <ExternalLink className="h-3 w-3" />
                    </a>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </ScrollReveal>

          {/* Academic Partners Section */}
          <div className="max-w-5xl mx-auto mb-20">
            <ScrollReveal>
              <div className="flex items-center gap-2 mb-6">
                <GraduationCap className="h-5 w-5 text-primary" />
                <h2 className="text-2xl font-display font-bold">Academic <span className="text-gradient">Partners</span></h2>
                <span className="text-sm text-muted-foreground ml-1">({academicPartners.length})</span>
              </div>
            </ScrollReveal>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {academicPartners.map((partner, i) => {
                const members = getMembersForInstitution(partner.name);
                return (
                  <ScrollReveal key={partner.name} delay={i * 0.06}>
                    <Card className="h-full hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-border/60">
                      <CardContent className="p-6 flex flex-col h-full">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-primary/10">
                          <GraduationCap className="h-5 w-5 text-primary" />
                        </div>
                        <h3 className="font-display font-bold text-lg mb-2">{partner.name}</h3>
                        <p className="text-sm text-muted-foreground flex-1 mb-4 leading-relaxed">{partner.description}</p>

                        {members.length > 0 && (
                          <div className="mb-4">
                            <p className="text-xs font-display font-semibold mb-2">{members.length} member{members.length !== 1 ? "s" : ""}</p>
                            <div className="flex -space-x-2">
                              {members.slice(0, 5).map((m) => (
                                <Link
                                  key={m.id}
                                  to={`/community/${m.id}`}
                                  className="w-8 h-8 rounded-full bg-primary/10 border-2 border-card flex items-center justify-center hover:z-10 hover:scale-110 transition-transform"
                                  title={m.name}
                                >
                                  <span className="text-primary font-display font-bold text-[10px]">
                                    {m.name.split(" ").map((n) => n[0]).join("")}
                                  </span>
                                </Link>
                              ))}
                            </div>
                          </div>
                        )}

                        <Button asChild variant="ghost" size="sm" className="self-start">
                          <a href={partner.url} target="_blank" rel="noopener noreferrer">
                            Visit Website <ExternalLink className="h-3 w-3 ml-1" />
                          </a>
                        </Button>
                      </CardContent>
                    </Card>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>

          {/* Industry Partners Section */}
          <div className="max-w-5xl mx-auto">
            <ScrollReveal>
              <div className="flex items-center gap-2 mb-6">
                <Building2 className="h-5 w-5 text-coral" />
                <h2 className="text-2xl font-display font-bold">Industry <span className="text-gradient-warm">Partners</span></h2>
                <span className="text-sm text-muted-foreground ml-1">({industryPartners.length})</span>
              </div>
            </ScrollReveal>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {industryPartners.map((partner, i) => (
                <ScrollReveal key={partner.name} delay={i * 0.06}>
                  <Card className="h-full hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-border/60">
                    <CardContent className="p-6 flex flex-col h-full">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${industryColors[i % industryColors.length]}`}>
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
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Partners;
