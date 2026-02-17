import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink, ArrowRight, Users, FolderOpen, Check, Tag, Github } from "lucide-react";
import Layout from "@/components/Layout";
import ScrollReveal from "@/components/ScrollReveal";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { technologies, referenceDesigns, communityProjects, communityMembers } from "@/data/mockData";
import { interests } from "@/data/interests";

const RegisterInterestBox = ({ name }: { name: string }) => {
  const [registered, setRegistered] = useState(false);

  return (
    <button
      onClick={() => setRegistered(!registered)}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all duration-300 shrink-0 ${
        registered
          ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
          : "border-border/60 bg-card hover:border-primary/40"
      }`}
      title={registered ? "Interest registered" : `Register interest in ${name}`}
    >
      <div
        className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all duration-200 ${
          registered
            ? "border-primary bg-primary text-primary-foreground"
            : "border-border"
        }`}
      >
        {registered && <Check className="h-4 w-4" />}
      </div>
      <span className="text-sm font-display font-semibold whitespace-nowrap">
        {registered ? "Interested" : "Register Interest"}
      </span>
    </button>
  );
};

const TechnologyDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const tech = technologies.find((t) => t.id === id);

  if (!tech) {
    return (
      <Layout>
        <div className="py-24 text-center">
          <h1 className="text-2xl font-display font-bold mb-4">Technology not found</h1>
          <button onClick={() => navigate(-1)} className="text-primary hover:underline">← Go Back</button>
        </div>
      </Layout>
    );
  }

  // Find interest slugs linked to this technology
  const linkedInterests = interests.filter((i) => i.technologyName === tech.name);
  const linkedSlugs = linkedInterests.map((i) => i.slug);

  // Find members interested in this technology
  const interestedMembers = communityMembers.filter((m) =>
    m.interests?.some((slug: string) => linkedSlugs.includes(slug))
  );

  // Find reference SoCs that list this technology
  const relatedDesigns = referenceDesigns.filter(
    (d) => d.relatedTechnologies?.includes(tech.name)
  );

  // Find projects that use this technology
  const matchedProjects = communityProjects.filter((p) => {
    const techNameLower = tech.name.toLowerCase();
    const matchesTechField = p.referenceSoc && relatedDesigns.some((d) => d.name === p.referenceSoc);
    const matchesTag = p.tags?.some((tag) => {
      const tagLower = tag.toLowerCase();
      return techNameLower.includes(tagLower) || tagLower.includes(tech.name.split("/")[0].trim().split(" ").pop()?.toLowerCase() || "");
    });
    return matchesTechField || matchesTag;
  });

  return (
    <Layout>
      <section className="py-24">
        <div className="container mx-auto px-4">
          {/* Back link */}
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </button>

          {/* Header with Register Interest */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto mb-12"
          >
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="outline">{(tech as any).group}</Badge>
              <Badge variant="outline" className="text-muted-foreground">{tech.category}</Badge>
            </div>
            <div className="flex items-start justify-between gap-6 mb-4">
              <h1 className="text-4xl md:text-5xl font-display font-bold">{tech.name}</h1>
              <RegisterInterestBox name={tech.name} />
            </div>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {tech.longDescription || tech.description}
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8 mb-16">
            {/* Features */}
            <ScrollReveal className="md:col-span-2">
              <div className="rounded-2xl border border-border/60 bg-card p-7">
                <h2 className="text-lg font-display font-bold mb-4">Key Features</h2>
                <ul className="space-y-2">
                  {tech.features?.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <ArrowRight className="h-3 w-3 mt-1.5 text-primary shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>

            {/* Links */}
            <ScrollReveal delay={0.1}>
              <div className="rounded-2xl border border-border/60 bg-card p-7">
                <h2 className="text-lg font-display font-bold mb-4">Resources</h2>
                <div className="space-y-3">
                  {tech.links?.map((link, i) => (
                    <a
                      key={i}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
                    >
                      <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Interested People */}
          <div className="max-w-4xl mx-auto mb-16">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="flex items-center gap-2 mb-6"
            >
              <Users className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-display font-bold">People Interested</h2>
              <span className="text-sm text-muted-foreground ml-1">({interestedMembers.length})</span>
            </motion.div>

            {interestedMembers.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {interestedMembers.map((member, i) => (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Card className="h-full hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 border-border/60">
                      <CardContent className="p-5">
                        <Link to={`/community/${member.id}`} className="group">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                              <span className="text-primary font-display font-bold text-sm">
                                {member.name.split(" ").map((n) => n[0]).join("")}
                              </span>
                            </div>
                            <div className="min-w-0">
                              <h3 className="font-display font-bold text-sm truncate group-hover:text-primary transition-colors">{member.name}</h3>
                              <p className="text-xs text-muted-foreground truncate">{member.institution}</p>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground mb-3">{member.location}</p>
                          <div className="flex flex-wrap gap-1 mb-3">
                            {member.expertise.map((e) => (
                              <span key={e} className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground font-medium">
                                {e}
                              </span>
                            ))}
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {member.projects.map((p) => (
                              <span key={p} className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                                {p}
                              </span>
                            ))}
                          </div>
                        </Link>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-border p-10 text-center">
                <Users className="h-8 w-8 text-muted-foreground/40 mx-auto mb-3" />
                <p className="text-muted-foreground text-sm">No community members have registered interest in this technology yet.</p>
                <Button asChild variant="outline" size="sm" className="mt-4 rounded-full">
                  <Link to="/about#join">Be the first to join</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Reference SoCs */}
          <ScrollReveal className="max-w-4xl mx-auto mb-12">
            <h2 className="text-2xl font-display font-bold mb-6">
              Reference SoCs using <span className="text-gradient">{tech.name}</span>
            </h2>
            {relatedDesigns.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-4">
                {relatedDesigns.map((design) => (
                  <Link key={design.id} to={`/designs/${design.id}`}>
                    <Card className="hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 border-border/60 h-full">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-display font-bold">{design.name}</h3>
                          {design.provenIn?.map((p, i) => (
                            <Badge key={i} variant="outline" className="text-[10px]">
                              {p.type}
                            </Badge>
                          ))}
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">{design.tagline}</p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No reference SoCs currently use this technology.</p>
            )}
          </ScrollReveal>

          {/* Community Projects */}
          <ScrollReveal className="max-w-4xl mx-auto">
            <div className="flex items-center gap-2 mb-6">
              <FolderOpen className="h-5 w-5 text-coral" />
              <h2 className="text-2xl font-display font-bold">
                Projects using <span className="text-gradient">{tech.name}</span>
              </h2>
              <span className="text-sm text-muted-foreground ml-1">({matchedProjects.length})</span>
            </div>
            {matchedProjects.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-4">
                {matchedProjects.map((project) => (
                  <Link key={project.id} to={`/projects/${project.id}`}>
                    <Card className="hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 border-border/60 h-full">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge
                            variant="outline"
                            className={
                              project.status === "Completed"
                                ? "border-green-500/30 text-green-400"
                                : project.status === "In Progress"
                                ? "border-primary/30 text-primary"
                                : "border-border text-muted-foreground"
                            }
                          >
                            {project.status}
                          </Badge>
                        </div>
                        <h3 className="font-display font-semibold mb-1">{project.title}</h3>
                        <p className="text-xs text-muted-foreground mb-2">{project.author} · {project.institution}</p>
                        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">{project.description}</p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-border p-10 text-center">
                <FolderOpen className="h-8 w-8 text-muted-foreground/40 mx-auto mb-3" />
                <p className="text-muted-foreground text-sm">No community projects currently use this technology.</p>
                <Button asChild variant="outline" size="sm" className="mt-4 rounded-full">
                  <Link to="/projects">Browse all projects</Link>
                </Button>
              </div>
            )}
          </ScrollReveal>
        </div>
      </section>
    </Layout>
  );
};

export default TechnologyDetail;
