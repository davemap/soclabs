import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Github, Calendar, ExternalLink, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Layout from "@/components/Layout";
import { communityProjects } from "@/data/mockData";
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

  return (
    <Layout>
      <article className="py-24">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Back link */}
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
            <Link
              to="/projects"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Projects
            </Link>
          </motion.div>

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
              <span className="font-medium text-foreground">{project.author}</span>
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
      </article>
    </Layout>
  );
};

export default ProjectDetail;
