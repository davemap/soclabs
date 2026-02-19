import { useState } from "react";
import { useUserInterests } from "@/hooks/useUserInterests";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Users, FolderOpen, Tag, ExternalLink, Wrench, Check, Plus, ArrowRight, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Layout from "@/components/Layout";
import { interests } from "@/data/interests";
import { communityMembers, communityProjects, technologies } from "@/data/mockData";
import CommentsThreads from "@/components/CommentsThreads";
import { cn } from "@/lib/utils";

const categoryColor: Record<string, string> = {
  Technologies: "bg-primary/10 text-primary",
  "Discussions": "bg-coral/10 text-coral",
  Activities: "bg-violet/10 text-violet",
};

const InterestDetail = () => {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();
  const interest = interests.find((i) => i.slug === slug);

  if (!interest) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-24 text-center">
          <h1 className="text-2xl font-display font-bold mb-4">Interest not found</h1>
          <Button variant="outline" className="rounded-full" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Go Back
          </Button>
        </div>
      </Layout>
    );
  }

  const relatedMembers = communityMembers.filter((m) =>
    m.expertise.some((e) => interest.relatedMemberExpertise.includes(e))
  );

  const relatedProjects = communityProjects.filter((p) =>
    p.tags.some((t) => interest.relatedProjectTags.includes(t))
  );

  const linkedTechnology = interest.technologyName
    ? technologies.find((t) => t.name === interest.technologyName)
    : null;

  return (
    <Layout>
      <section className="py-24">
        <div className="container mx-auto px-4">
          {/* Back link */}
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back
          </button>

          <div className="flex gap-6 items-start max-w-5xl mx-auto">
            {/* Main column */}
            <div className="flex-1 min-w-0">
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-12"
              >
                <div className="flex items-start gap-3 mb-4">
                  <span className={`text-xs px-3 py-1 rounded-full font-semibold ${categoryColor[interest.category]}`}>
                    {interest.category}
                  </span>
                </div>
                <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">{interest.name}</h1>
                <p className="text-lg text-muted-foreground leading-relaxed">{interest.description}</p>
              </motion.div>

              <div className="space-y-12">
                {/* Linked Technology */}
                {linkedTechnology && (
                  <div>
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      className="flex items-center gap-2 mb-4"
                    >
                      <Wrench className="h-5 w-5 text-primary" />
                      <h2 className="text-2xl font-display font-bold">Related Technology</h2>
                    </motion.div>

                    <Card className="border-border/60 hover:shadow-lg transition-all duration-300">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-display font-bold text-lg mb-1">{linkedTechnology.name}</h3>
                            <span className="text-xs px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium">{(linkedTechnology as any).group} · {linkedTechnology.category}</span>
                            <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{linkedTechnology.description}</p>
                          </div>
                        </div>
                        <Button asChild variant="outline" size="sm" className="rounded-full mt-4">
                          <Link to={`/technologies/${linkedTechnology.id}`}>
                            View Technology <ExternalLink className="h-3 w-3 ml-1" />
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* People */}
                <div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-2 mb-6"
                  >
                    <Users className="h-5 w-5 text-primary" />
                    <h2 className="text-2xl font-display font-bold">People</h2>
                    <span className="text-sm text-muted-foreground ml-1">({relatedMembers.length})</span>
                  </motion.div>

                  {relatedMembers.length > 0 ? (
                    <div className="grid sm:grid-cols-2 gap-5">
                      {relatedMembers.map((member, i) => (
                        <motion.div
                          key={member.name}
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
                      <p className="text-muted-foreground text-sm">No community members have registered this interest yet.</p>
                      <Button asChild variant="outline" size="sm" className="mt-4 rounded-full">
                        <Link to="/about#join">Be the first to join</Link>
                      </Button>
                    </div>
                  )}
                </div>

                {/* Projects */}
                <div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-2 mb-6"
                  >
                    <FolderOpen className="h-5 w-5 text-coral" />
                    <h2 className="text-2xl font-display font-bold">Projects</h2>
                    <span className="text-sm text-muted-foreground ml-1">({relatedProjects.length})</span>
                  </motion.div>

                  {relatedProjects.length > 0 ? (
                    <div className="grid sm:grid-cols-2 gap-5">
                      {relatedProjects.map((project, i) => (
                        <motion.div
                          key={project.id}
                          initial={{ opacity: 0, y: 15 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.05 }}
                        >
                          <Link to={`/projects/${project.id}`}>
                            <Card className="h-full hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 border-border/60 group">
                              <CardContent className="p-5 flex flex-col h-full">
                                <h3 className="font-display font-bold mb-1 group-hover:text-primary transition-colors">{project.title}</h3>
                                <p className="text-sm text-primary font-medium mb-0.5">{project.author}</p>
                                <p className="text-xs text-muted-foreground mb-3">{project.institution}</p>
                                <p className="text-sm text-muted-foreground mb-4 flex-1 leading-relaxed line-clamp-3">{project.description}</p>
                                <div className="flex flex-wrap gap-1.5 mb-4">
                                  {project.tags.map((tag) => (
                                    <span key={tag} className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                                      <Tag className="h-2.5 w-2.5" />{tag}
                                    </span>
                                  ))}
                                </div>
                                <span className="text-xs text-muted-foreground group-hover:text-primary transition-colors inline-flex items-center gap-1 self-start">
                                  <FolderOpen className="h-3.5 w-3.5" /> View Project
                                </span>
                              </CardContent>
                            </Card>
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-border p-10 text-center">
                      <FolderOpen className="h-8 w-8 text-muted-foreground/40 mx-auto mb-3" />
                      <p className="text-muted-foreground text-sm">No projects are associated with this interest yet.</p>
                      <Button asChild variant="outline" size="sm" className="mt-4 rounded-full">
                        <Link to="/projects">Browse all projects</Link>
                      </Button>
                    </div>
                  )}
                </div>

                <CommentsThreads pageId={`interest-${interest.slug}`} />
              </div>
            </div>

            {/* Sticky sidebar */}
            <InterestSidebar
              interest={interest}
              linkedTechnology={linkedTechnology}
            />
          </div>
        </div>
      </section>
    </Layout>
  );
};

/* ── Sidebar component ── */
const InterestSidebar = ({ interest, linkedTechnology }: {
  interest: (typeof interests)[number];
  linkedTechnology: (typeof technologies)[number] | null | undefined;
}) => {
  const { isRegistered, toggleInterest } = useUserInterests();
  const registered = isRegistered(interest.slug);

  return (
    <aside className="hidden lg:block w-56 shrink-0 sticky top-24 space-y-3">
      {/* Register Interest */}
      <div className="rounded-xl border border-border/60 bg-card p-4 shadow-sm">
        <button
          onClick={() => toggleInterest(interest.slug)}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-display font-semibold transition-all duration-200",
            registered
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground hover:bg-primary/10"
          )}
        >
          {registered ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {registered ? "Interested" : "Register Interest"}
        </button>
      </div>

      {/* Resources */}
      <div className="rounded-xl border border-border/60 bg-card p-4 shadow-sm">
        <h3 className="text-xs font-display font-semibold text-muted-foreground uppercase tracking-wider mb-3">Resources</h3>
        <div className="space-y-1.5">
          {linkedTechnology && (
            <Button asChild variant="ghost" className="w-full rounded-lg justify-start" size="sm">
              <Link to={`/technologies/${linkedTechnology.id}`}>
                <Wrench className="h-4 w-4 mr-2" /> {linkedTechnology.name}
              </Link>
            </Button>
          )}
          <Button asChild variant="ghost" className="w-full rounded-lg justify-start" size="sm">
            <Link to="/interests">
              <BookOpen className="h-4 w-4 mr-2" /> All Discussions
            </Link>
          </Button>
        </div>
      </div>

      {/* Quick links */}
      <div className="rounded-xl border border-border/60 bg-card p-4 shadow-sm">
        <h3 className="text-xs font-display font-semibold text-muted-foreground uppercase tracking-wider mb-3">Explore</h3>
        <Button asChild variant="ghost" className="w-full rounded-lg justify-start text-primary" size="sm">
          <Link to="/technologies">
            <ArrowRight className="h-4 w-4 mr-2" /> Technologies
          </Link>
        </Button>
        <Button asChild variant="ghost" className="w-full rounded-lg justify-start text-primary" size="sm">
          <Link to="/projects/start">
            <ArrowRight className="h-4 w-4 mr-2" /> Start a Project
          </Link>
        </Button>
      </div>
    </aside>
  );
};

export default InterestDetail;
