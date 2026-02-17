import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink, GraduationCap, Building2, Users, FolderOpen, Github, Tag } from "lucide-react";
import Layout from "@/components/Layout";
import ScrollReveal from "@/components/ScrollReveal";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { partners, communityMembers, communityProjects } from "@/data/mockData";

const OrganisationDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const org = partners.find((p) => p.id === id);

  if (!org) {
    return (
      <Layout>
        <div className="py-24 text-center">
          <h1 className="text-2xl font-display font-bold mb-4">Organisation not found</h1>
          <button onClick={() => navigate(-1)} className="text-primary hover:underline">← Go Back</button>
        </div>
      </Layout>
    );
  }

  const Icon = org.type === "academic" ? GraduationCap : Building2;
  const members = communityMembers.filter((m) => m.organisations?.includes(org.id));

  // Find projects from associated members
  const memberProjectTitles = new Set(members.flatMap((m) => m.projects));
  const relatedProjects = communityProjects.filter((p) => memberProjectTitles.has(p.title));

  return (
    <Layout>
      <section className="py-24">
        <div className="container mx-auto px-4 max-w-4xl">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </button>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${org.type === "academic" ? "bg-primary/10" : "bg-coral/10"}`}>
                <Icon className={`h-6 w-6 ${org.type === "academic" ? "text-primary" : "text-coral"}`} />
              </div>
              <Badge variant="outline">{org.type === "academic" ? "Academic Partner" : "Industry Partner"}</Badge>
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">{org.name}</h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {org.longDescription || org.description}
            </p>
            <a
              href={org.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 font-medium mt-4 transition-colors"
            >
              Visit Website <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </motion.div>

          {/* Members */}
          <div className="mb-16">
            <ScrollReveal>
              <div className="flex items-center gap-2 mb-6">
                <Users className="h-5 w-5 text-primary" />
                <h2 className="text-2xl font-display font-bold">Members</h2>
                <span className="text-sm text-muted-foreground ml-1">({members.length})</span>
              </div>
            </ScrollReveal>

            {members.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {members.map((member, i) => (
                  <ScrollReveal key={member.id} delay={i * 0.05}>
                    <Link to={`/community/${member.id}`}>
                      <Card className="h-full hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 border-border/60">
                        <CardContent className="p-5">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                              <span className="text-primary font-display font-bold text-sm">
                                {member.name.split(" ").map((n) => n[0]).join("")}
                              </span>
                            </div>
                            <div className="min-w-0">
                              <h3 className="font-display font-bold text-sm truncate hover:text-primary transition-colors">{member.name}</h3>
                              <p className="text-xs text-muted-foreground truncate">{member.location}</p>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-1 mb-2">
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
                        </CardContent>
                      </Card>
                    </Link>
                  </ScrollReveal>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-border p-10 text-center">
                <Users className="h-8 w-8 text-muted-foreground/40 mx-auto mb-3" />
                <p className="text-muted-foreground text-sm">No members are currently associated with this organisation.</p>
              </div>
            )}
          </div>

          {/* Projects */}
          <div>
            <ScrollReveal>
              <div className="flex items-center gap-2 mb-6">
                <FolderOpen className="h-5 w-5 text-coral" />
                <h2 className="text-2xl font-display font-bold">Projects</h2>
                <span className="text-sm text-muted-foreground ml-1">({relatedProjects.length})</span>
              </div>
            </ScrollReveal>

            {relatedProjects.length > 0 ? (
              <div className="grid sm:grid-cols-2 gap-5">
                {relatedProjects.map((project, i) => (
                  <ScrollReveal key={project.id} delay={i * 0.05}>
                    <Link to={`/projects/${project.id}`}>
                      <Card className="h-full hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 border-border/60">
                        <CardContent className="p-5">
                          <h3 className="font-display font-bold mb-1">{project.title}</h3>
                          <p className="text-sm text-primary font-medium mb-0.5">{project.author}</p>
                          <p className="text-xs text-muted-foreground mb-3">{project.institution}</p>
                          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-3">{project.description}</p>
                          <div className="flex flex-wrap gap-1.5">
                            {project.tags.map((tag) => (
                              <span key={tag} className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                                <Tag className="h-2.5 w-2.5" />{tag}
                              </span>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </ScrollReveal>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-border p-10 text-center">
                <FolderOpen className="h-8 w-8 text-muted-foreground/40 mx-auto mb-3" />
                <p className="text-muted-foreground text-sm">No projects are currently associated with this organisation.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default OrganisationDetail;
