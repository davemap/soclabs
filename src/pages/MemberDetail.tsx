import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Building2, FolderOpen, Heart, ExternalLink, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Layout from "@/components/Layout";
import { communityMembers, communityProjects, partners } from "@/data/mockData";
import { interests } from "@/data/interests";

const MemberDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const member = communityMembers.find((m) => m.id === id);

  if (!member) {
    return (
      <Layout>
        <section className="py-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl font-display font-bold mb-4">Member not found</h1>
            <Button variant="outline" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4 mr-2" /> Go Back
            </Button>
          </div>
        </section>
      </Layout>
    );
  }

  const memberProjects = communityProjects.filter((p) =>
    member.projects.includes(p.title)
  );

  const memberInterests = interests.filter((i) =>
    member.interests.includes(i.slug)
  );

  const memberOrgs = partners.filter((p) =>
    member.organisations?.includes(p.id)
  );

  const statusColor = (status: string) => {
    switch (status) {
      case "Completed": return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
      case "In Progress": return "bg-amber-500/10 text-amber-600 border-amber-500/20";
      case "Planning": return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const categoryColor: Record<string, string> = {
    Technologies: "bg-primary/10 text-primary",
    "Research Fields": "bg-coral/10 text-coral",
    Activities: "bg-violet/10 text-violet",
  };

  return (
    <Layout>
      <section className="py-24">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
          </motion.div>

          {/* Profile Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <div className="flex items-start gap-5 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                <span className="text-primary font-display font-bold text-xl">
                  {member.name.split(" ").map((n) => n[0]).join("")}
                </span>
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-display font-bold mb-1">{member.name}</h1>
                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Building2 className="h-3.5 w-3.5" /> {member.institution}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" /> {member.location}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 mb-5">
              {member.expertise.map((e) => (
                <Badge key={e} variant="secondary" className="text-xs font-medium">
                  {e}
                </Badge>
              ))}
            </div>

            <p className="text-muted-foreground leading-relaxed mb-4">{member.bio}</p>

            {memberOrgs.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {memberOrgs.map((org) => (
                  <Link
                    key={org.id}
                    to={`/partners/${org.id}`}
                    className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-border/60 text-muted-foreground hover:text-foreground hover:border-border transition-all"
                  >
                    <Building2 className="h-3 w-3" />
                    {org.name}
                  </Link>
                ))}
              </div>
            )}
          </motion.div>

          {/* Interests */}
          {memberInterests.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-12"
            >
              <div className="flex items-center gap-2 mb-5">
                <Heart className="h-5 w-5 text-coral" />
                <h2 className="text-2xl font-display font-bold">Interests</h2>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {memberInterests.map((interest) => (
                  <Link key={interest.slug} to={`/interests/${interest.slug}`} className="group">
                    <Card className="h-full hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 border-border/60">
                      <CardContent className="p-4 flex items-start justify-between gap-3">
                        <div>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${categoryColor[interest.category]}`}>
                            {interest.category}
                          </span>
                          <h3 className="font-display font-bold mt-2 group-hover:text-primary transition-colors">
                            {interest.name}
                          </h3>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {interest.description}
                          </p>
                        </div>
                        <ArrowRight className="h-4 w-4 mt-6 shrink-0 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}

          {/* Projects */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <div className="flex items-center gap-2 mb-5">
              <FolderOpen className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-display font-bold">Projects</h2>
            </div>

            {memberProjects.length > 0 ? (
              <div className="grid sm:grid-cols-2 gap-4">
                {memberProjects.map((project) => (
                  <Link key={project.id} to={`/projects/${project.id}`} className="group">
                    <Card className="h-full hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 border-border/60">
                      <CardContent className="p-5 flex flex-col h-full">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className={statusColor(project.status)}>
                            {project.status}
                          </Badge>
                          <Badge variant="outline" className="text-xs">{project.referenceSoc}</Badge>
                        </div>
                        <h3 className="font-display font-bold group-hover:text-primary transition-colors mb-2">
                          {project.title}
                        </h3>
                        <p className="text-sm text-muted-foreground flex-1 leading-relaxed line-clamp-3 mb-3">
                          {project.description}
                        </p>
                        <span className="inline-flex items-center gap-1 text-xs text-primary font-medium">
                          Read more <ArrowRight className="h-3 w-3" />
                        </span>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-border p-10 text-center">
                <FolderOpen className="h-8 w-8 text-muted-foreground/40 mx-auto mb-3" />
                <p className="text-muted-foreground text-sm">No linked projects yet.</p>
              </div>
            )}
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default MemberDetail;
