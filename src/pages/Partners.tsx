import { useState, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, X, ArrowRight, Building2, GraduationCap, MapPin, Filter, Globe, UserPlus } from "lucide-react";
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from "react-simple-maps";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Layout from "@/components/Layout";
import ScrollReveal from "@/components/ScrollReveal";
import { partners, communityMembers } from "@/data/mockData";
import JoinCommunityDialog from "@/components/JoinCommunityDialog";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

type Partner = (typeof partners)[number];

const industryColors = [
  "bg-primary/10 text-primary",
  "bg-coral/10 text-coral",
  "bg-violet/10 text-violet",
  "bg-amber/10 text-amber",
  "bg-primary/10 text-primary",
  "bg-coral/10 text-coral",
];

type MapFilter = "all" | "academic" | "industry";

const Partners = () => {
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [mapFilter, setMapFilter] = useState<MapFilter>("all");
  const [highlightedOrg, setHighlightedOrg] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [position, setPosition] = useState<{ coordinates: [number, number]; zoom: number }>({
    coordinates: [0, 0],
    zoom: 1,
  });
  const [joinOpen, setJoinOpen] = useState(false);

  const industryPartners = useMemo(() => partners.filter((p) => p.type === "industry"), []);
  const academicPartners = useMemo(() => partners.filter((p) => p.type === "academic"), []);

  // Countries that have partners (for highlighting)
  const countriesWithPartners = useMemo(() => {
    const set = new Set<string>();
    partners.forEach((p) => {
      if (p.country) set.add(p.country);
    });
    return set;
  }, []);

  const mapPartners = useMemo(() => {
    return partners.filter((p) => {
      if (!p.coordinates) return false;
      if (mapFilter === "all") return true;
      return p.type === mapFilter;
    });
  }, [mapFilter]);

  // Filter partner lists by selected country
  const filteredAcademic = useMemo(() => {
    if (!selectedCountry) return academicPartners;
    return academicPartners.filter((p) => p.country === selectedCountry);
  }, [academicPartners, selectedCountry]);

  const filteredIndustry = useMemo(() => {
    if (!selectedCountry) return industryPartners;
    return industryPartners.filter((p) => p.country === selectedCountry);
  }, [industryPartners, selectedCountry]);

  const getMembersForOrg = (orgId: string) =>
    communityMembers.filter((m) => m.organisations?.includes(orgId));

  const handleCountryClick = useCallback((geo: any) => {
    const countryName = geo.properties.name;
    if (countriesWithPartners.has(countryName)) {
      setSelectedCountry((prev) => (prev === countryName ? null : countryName));
      setSelectedPartner(null);
    }
  }, [countriesWithPartners]);

  const handleMoveEnd = useCallback((pos: { coordinates: [number, number]; zoom: number }) => {
    setPosition(pos);
  }, []);

  const clearCountryFilter = () => {
    setSelectedCountry(null);
  };

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
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              We work with leading organisations across academia, industry, and open-source to make custom silicon accessible.
            </p>
            <Button size="lg" className="rounded-full px-8" onClick={() => setJoinOpen(true)}>
              <UserPlus className="mr-2 h-4 w-4" /> Join the Community
            </Button>
          </motion.div>

          {/* Global Map */}
          <ScrollReveal className="max-w-5xl mx-auto mb-6">
            <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                <h2 className="text-2xl font-display font-bold">Global <span className="text-gradient">Network</span></h2>
              </div>
              <div className="flex items-center gap-1.5">
                <Filter className="h-3.5 w-3.5 text-muted-foreground" />
                {(["all", "academic", "industry"] as MapFilter[]).map((f) => (
                  <button
                    key={f}
                    onClick={() => { setMapFilter(f); setSelectedPartner(null); }}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-medium transition-all border",
                      mapFilter === f
                        ? "bg-foreground text-background border-foreground"
                        : "border-border/60 text-muted-foreground hover:text-foreground hover:border-border"
                    )}
                  >
                    {f === "all" ? "All" : f === "academic" ? "Academic" : "Industry"}
                  </button>
                ))}
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal className="max-w-5xl mx-auto mb-6">
            <div className="relative rounded-2xl border border-border/60 bg-card overflow-hidden shadow-sm">
              <ComposableMap
                projectionConfig={{ scale: 147 }}
                width={800}
                height={450}
                style={{ background: "transparent", width: "100%", height: "auto" }}
              >
                <ZoomableGroup
                  center={position.coordinates}
                  zoom={position.zoom}
                  onMoveEnd={handleMoveEnd}
                  minZoom={1}
                  maxZoom={12}
                  translateExtent={[[-100, -50], [900, 500]]}
                >
                  <Geographies geography={geoUrl}>
                    {({ geographies }) =>
                      geographies.map((geo) => {
                        const countryName = geo.properties.name;
                        const hasPartner = countriesWithPartners.has(countryName);
                        const isSelected = selectedCountry === countryName;

                        return (
                          <Geography
                            key={geo.rsmKey}
                            geography={geo}
                            onClick={() => handleCountryClick(geo)}
                            fill={
                              isSelected
                                ? "hsl(168, 50%, 35%)"
                                : hasPartner
                                ? "hsl(220, 14%, 34%)"
                                : "hsl(220, 14%, 28%)"
                            }
                            stroke="hsl(220, 12%, 34%)"
                            strokeWidth={0.5}
                            style={{
                              default: { outline: "none", cursor: hasPartner ? "pointer" : "default" },
                              hover: {
                                fill: isSelected
                                  ? "hsl(168, 50%, 40%)"
                                  : hasPartner
                                  ? "hsl(168, 30%, 28%)"
                                  : "hsl(220, 14%, 30%)",
                                outline: "none",
                                cursor: hasPartner ? "pointer" : "default",
                              },
                              pressed: { outline: "none" },
                            }}
                          />
                        );
                      })
                    }
                  </Geographies>
                  {mapPartners.map((partner) => (
                    <Marker
                      key={partner.id}
                      coordinates={partner.coordinates!}
                      onClick={() => setSelectedPartner(partner)}
                      style={{ cursor: "pointer" }}
                    >
                      <circle
                        r={highlightedOrg === partner.id ? 6 : 4}
                        fill={partner.type === "academic" ? "hsl(210, 100%, 60%)" : "hsl(15, 85%, 62%)"}
                        stroke={highlightedOrg === partner.id ? "hsl(0, 0%, 100%)" : partner.type === "academic" ? "hsl(210, 100%, 80%)" : "hsl(15, 85%, 80%)"}
                        strokeWidth={highlightedOrg === partner.id ? 2 : 1.5}
                        opacity={0.9}
                      />
                      <circle r={8} fill="transparent" />
                    </Marker>
                  ))}
                </ZoomableGroup>
              </ComposableMap>

              {/* Legend */}
              <div className="absolute top-3 left-3 flex gap-3">
                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                  <div className="w-2.5 h-2.5 rounded-full bg-[hsl(210,100%,60%)]" />
                  Academic
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                  <div className="w-2.5 h-2.5 rounded-full bg-[hsl(15,85%,62%)]" />
                  Industry
                </div>
              </div>

              {/* Zoom hint */}
              <div className="absolute bottom-3 left-3 text-[10px] text-muted-foreground/60">
                Scroll to zoom · Click a country to filter
              </div>

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
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${selectedPartner.type === "academic" ? "bg-primary/10" : "bg-coral/10"}`}>
                        {selectedPartner.type === "academic" ? (
                          <GraduationCap className="h-5 w-5 text-primary" />
                        ) : (
                          <Building2 className="h-5 w-5 text-coral" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-display font-bold text-lg">{selectedPartner.name}</h3>
                        <span className="text-xs text-muted-foreground capitalize">{selectedPartner.type} partner</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                      {selectedPartner.description}
                    </p>

                    {getMembersForOrg(selectedPartner.id).length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs font-display font-semibold text-foreground mb-2">Members</p>
                        <div className="space-y-1.5">
                          {getMembersForOrg(selectedPartner.id).map((member) => (
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

                    <Link
                      to={`/partners/${selectedPartner.id}`}
                      className="inline-flex items-center gap-1 text-xs text-primary hover:underline font-medium"
                    >
                      View Organisation <ArrowRight className="h-3 w-3" />
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </ScrollReveal>

          {/* Country filter indicator */}
          {selectedCountry && (
            <div className="max-w-5xl mx-auto mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm">
                <Globe className="h-4 w-4 text-primary" />
                <span>Filtering by <strong>{selectedCountry}</strong></span>
                <button
                  onClick={clearCountryFilter}
                  className="ml-1 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Academic Partners Section */}
          <div className="max-w-5xl mx-auto mb-20">
            <ScrollReveal>
              <div className="flex items-center gap-2 mb-6">
                <GraduationCap className="h-5 w-5 text-primary" />
                <h2 className="text-2xl font-display font-bold">Academic <span className="text-gradient">Partners</span></h2>
                <span className="text-sm text-muted-foreground ml-1">({filteredAcademic.length})</span>
              </div>
            </ScrollReveal>

            {filteredAcademic.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center">No academic partners in {selectedCountry}.</p>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredAcademic.map((partner, i) => {
                  const members = getMembersForOrg(partner.id);
                  return (
                    <ScrollReveal key={partner.id} delay={i * 0.06}>
                      <Link
                        to={`/partners/${partner.id}`}
                        onMouseEnter={() => setHighlightedOrg(partner.id)}
                        onMouseLeave={() => setHighlightedOrg(null)}
                      >
                        <Card className={cn(
                          "h-full hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-border/60",
                          highlightedOrg === partner.id && "border-primary/40 shadow-lg"
                        )}>
                          <CardContent className="p-6 flex flex-col h-full">
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-primary/10">
                              <GraduationCap className="h-5 w-5 text-primary" />
                            </div>
                            <h3 className="font-display font-bold text-lg mb-1">{partner.name}</h3>
                            <p className="text-xs text-muted-foreground mb-2">{partner.country}</p>
                            <p className="text-sm text-muted-foreground flex-1 mb-4 leading-relaxed">{partner.description}</p>

                            {members.length > 0 && (
                              <div className="mb-4">
                                <p className="text-xs font-display font-semibold mb-2">{members.length} member{members.length !== 1 ? "s" : ""}</p>
                                <div className="flex -space-x-2">
                                  {members.slice(0, 5).map((m) => (
                                    <div
                                      key={m.id}
                                      className="w-8 h-8 rounded-full bg-primary/10 border-2 border-card flex items-center justify-center"
                                      title={m.name}
                                    >
                                      <span className="text-primary font-display font-bold text-[10px]">
                                        {m.name.split(" ").map((n) => n[0]).join("")}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            <span className="text-xs text-primary font-medium inline-flex items-center gap-1">
                              View details <ArrowRight className="h-3 w-3" />
                            </span>
                          </CardContent>
                        </Card>
                      </Link>
                    </ScrollReveal>
                  );
                })}
              </div>
            )}
          </div>

          {/* Industry Partners Section */}
          <div className="max-w-5xl mx-auto">
            <ScrollReveal>
              <div className="flex items-center gap-2 mb-6">
                <Building2 className="h-5 w-5 text-coral" />
                <h2 className="text-2xl font-display font-bold">Industry <span className="text-gradient-warm">Partners</span></h2>
                <span className="text-sm text-muted-foreground ml-1">({filteredIndustry.length})</span>
              </div>
            </ScrollReveal>

            {filteredIndustry.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center">No industry partners in {selectedCountry}.</p>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredIndustry.map((partner, i) => {
                  const members = getMembersForOrg(partner.id);
                  return (
                    <ScrollReveal key={partner.id} delay={i * 0.06}>
                      <Link
                        to={`/partners/${partner.id}`}
                        onMouseEnter={() => setHighlightedOrg(partner.id)}
                        onMouseLeave={() => setHighlightedOrg(null)}
                      >
                        <Card className={cn(
                          "h-full hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-border/60",
                          highlightedOrg === partner.id && "border-coral/40 shadow-lg"
                        )}>
                          <CardContent className="p-6 flex flex-col h-full">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${industryColors[i % industryColors.length]}`}>
                              <span className="font-display font-bold text-lg">{partner.name[0]}</span>
                            </div>
                            <h3 className="font-display font-bold text-lg mb-1">{partner.name}</h3>
                            <p className="text-xs text-muted-foreground mb-2">{partner.country}</p>
                            <p className="text-sm text-muted-foreground flex-1 mb-4 leading-relaxed">{partner.description}</p>

                            {members.length > 0 && (
                              <div className="mb-4">
                                <p className="text-xs font-display font-semibold mb-2">{members.length} collaborator{members.length !== 1 ? "s" : ""}</p>
                                <div className="flex -space-x-2">
                                  {members.slice(0, 5).map((m) => (
                                    <div
                                      key={m.id}
                                      className="w-8 h-8 rounded-full bg-coral/10 border-2 border-card flex items-center justify-center"
                                      title={m.name}
                                    >
                                      <span className="text-coral font-display font-bold text-[10px]">
                                        {m.name.split(" ").map((n) => n[0]).join("")}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            <span className="text-xs text-coral font-medium inline-flex items-center gap-1">
                              View details <ArrowRight className="h-3 w-3" />
                            </span>
                          </CardContent>
                        </Card>
                      </Link>
                    </ScrollReveal>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>
      <JoinCommunityDialog open={joinOpen} onOpenChange={setJoinOpen} />
    </Layout>
  );
};

export default Partners;
