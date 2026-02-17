import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink, ArrowRight } from "lucide-react";
import Layout from "@/components/Layout";
import ScrollReveal from "@/components/ScrollReveal";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { technologies, referenceDesigns, communityProjects } from "@/data/mockData";

const TechnologyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const tech = technologies.find((t) => t.id === id);

  if (!tech) {
    return (
      <Layout>
        <div className="py-24 text-center">
          <h1 className="text-2xl font-display font-bold mb-4">Technology not found</h1>
          <Link to="/technologies" className="text-primary hover:underline">← Back to Technologies</Link>
        </div>
      </Layout>
    );
  }

  // Find reference SoCs that list this technology
  const relatedDesigns = referenceDesigns.filter(
    (d) => d.relatedTechnologies?.includes(tech.name)
  );

  // Find projects that use this technology (match by tag or technology field)
  const relatedProjects = communityProjects.filter(
    (p) => p.tags?.some((t) => tech.name.toLowerCase().includes(t.toLowerCase()) || t.toLowerCase().includes(tech.name.split(" ")[0].toLowerCase()))
      || p.technology?.toLowerCase().includes(tech.category.split(" ")[0].toLowerCase())
  );

  // Deduplicate projects more precisely based on tech name
  const matchedProjects = communityProjects.filter((p) => {
    const techNameLower = tech.name.toLowerCase();
    const matchesTechField = p.referenceSoc && relatedDesigns.some((d) => d.name === p.referenceSoc);
    const matchesTag = p.tags?.some((tag) => {
      const tagLower = tag.toLowerCase();
      return techNameLower.includes(tagLower) || tagLower.includes(tech.name.split("/")[0].trim().split(" ").pop()?.toLowerCase() || "");
    });
    // For processor IPs, match via reference SoC
    // For tools, match if the project's reference SoC uses this tool
    return matchesTechField || matchesTag;
  });

  return (
    <Layout>
      <section className="py-24">
        <div className="container mx-auto px-4">
          {/* Back link */}
          <Link
            to="/technologies"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Technologies
          </Link>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto mb-12"
          >
            <Badge variant="outline" className="mb-4">{tech.category}</Badge>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">{tech.name}</h1>
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
            <h2 className="text-2xl font-display font-bold mb-6">
              Projects using <span className="text-gradient">{tech.name}</span>
            </h2>
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
              <p className="text-sm text-muted-foreground">No community projects currently use this technology.</p>
            )}
          </ScrollReveal>
        </div>
      </section>
    </Layout>
  );
};

export default TechnologyDetail;
