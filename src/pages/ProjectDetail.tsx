import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Github, Calendar, ExternalLink, Tag, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Layout from "@/components/Layout";
import { communityProjects, communityMembers } from "@/data/mockData";
import ReactMarkdown from "react-markdown";
import CommentsThreads from "@/components/CommentsThreads";

const statusColor = (status: string) => {
  switch (status) {
    case "Completed":
      return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
    case "In Progress":
      return "bg-amber-500/10 text-amber-600 border-amber-500/20";
    case "Planning":
      return "bg-blue-500/10 text-blue-600 border-blue-500/20";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const project = communityProjects.find((p) => p.id === id);
  const author = project ? communityMembers.find((m) => m.id === project.authorId) : null;

  if (!project) {
    return (
      <Layout>
        <section className="py-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl font-display font-bold mb-4">Project not found</h1>
            <Button asChild variant="outline">
              <Link to="/projects">
                <ArrowLeft className="h-4 w-4 mr-2" /> Back to Projects
              </Link>
            </Button>
          </div>
        </section>
      </Layout>
    );
  }

  const initials = project.author
    .split(" ")
    .filter((w) => /^[A-Z]/.test(w))
    .map((w) => w[0])
    .join("")
    .slice(0, 2);

  return (
    <Layout>
      <article className="py-24">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Back link */}
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
            <Link
              to="/projects"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Projects
            </Link>
          </motion.div>

          <div className="flex gap-8">
            {/* Main content */}
            <div className="flex-1 min-w-0 max-w-4xl">
              {/* Header */}
              <motion.header
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-10"
              >
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <Badge variant="outline" className={statusColor(project.status)}>
                    {project.status}
                  </Badge>
                  <Badge variant="outline">{project.referenceSoc}</Badge>
                  <Badge variant="outline">{project.technology}</Badge>
                </div>

                <h1 className="text-3xl md:text-4xl font-display font-bold mb-3">
                  {project.title}
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                  {author ? (
                    <Link
                      to={`/members/${author.id}`}
                      className="font-medium text-primary hover:underline transition-colors"
                    >
                      {project.author}
                    </Link>
                  ) : (
                    <span className="font-medium text-foreground">{project.author}</span>
                  )}
                  <span>{project.institution}</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {new Date(project.date).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>

                <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-6">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium"
                    >
                      <Tag className="h-2.5 w-2.5" />
                      {tag}
                    </span>
                  ))}
                </div>

                <Button asChild size="sm" variant="outline">
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                    <Github className="h-4 w-4 mr-2" /> View Repository
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                </Button>
              </motion.header>

              {/* Architecture sidebar */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="rounded-xl border border-border/60 bg-muted/30 p-5 mb-10"
              >
                <h3 className="text-sm font-display font-bold mb-2">Architecture Overview</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {project.architecture}
                </p>
              </motion.div>

              {/* Blog content */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="prose prose-neutral dark:prose-invert max-w-none 
                  prose-headings:font-display prose-headings:font-bold
                  prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
                  prose-h3:text-lg prose-h3:mt-6 prose-h3:mb-2
                  prose-p:leading-relaxed prose-p:text-muted-foreground
                  prose-li:text-muted-foreground
                  prose-strong:text-foreground
                  prose-table:text-sm
                  prose-th:text-left prose-th:font-display prose-th:font-semibold prose-th:text-foreground prose-th:border-b prose-th:border-border prose-th:pb-2 prose-th:pr-4
                  prose-td:border-b prose-td:border-border/40 prose-td:py-2 prose-td:pr-4 prose-td:text-muted-foreground
                  prose-a:text-primary prose-a:no-underline hover:prose-a:underline"
              >
                <ReactMarkdown>{project.content}</ReactMarkdown>
              </motion.div>

              <CommentsThreads pageId={`project-${project.id}`} />
            </div>

            {/* Sticky author sidebar */}
            <aside className="hidden lg:block w-56 shrink-0">
              <div className="sticky top-24 rounded-xl border border-border/60 bg-card p-4 shadow-sm">
                <div className="flex flex-col items-center text-center">
                  <Avatar className="h-16 w-16 mb-3">
                    <AvatarFallback className="text-lg font-display font-bold bg-primary/10 text-primary">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  {author ? (
                    <Link
                      to={`/members/${author.id}`}
                      className="text-sm font-display font-bold hover:text-primary transition-colors"
                    >
                      {project.author}
                    </Link>
                  ) : (
                    <span className="text-sm font-display font-bold">{project.author}</span>
                  )}
                  <span className="text-xs text-muted-foreground mt-0.5">{project.institution}</span>
                </div>

                {author && (
                  <>
                    <div className="border-t border-border/60 mt-3 pt-3">
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Expertise</h4>
                      <div className="flex flex-wrap gap-1">
                        {author.expertise.map((e) => (
                          <Badge key={e} variant="secondary" className="text-[10px] px-2 py-0.5">
                            {e}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-border/60 mt-3 pt-3">
                      <Button asChild variant="outline" size="sm" className="w-full rounded-lg justify-start">
                        <Link to={`/members/${author.id}`}>
                          <User className="h-3.5 w-3.5 mr-2" /> View Profile
                        </Link>
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </aside>
          </div>
        </div>
      </article>
    </Layout>
  );
};

export default ProjectDetail;
