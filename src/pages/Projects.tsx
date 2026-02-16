import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Github, Calendar, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Layout from "@/components/Layout";
import { communityProjects } from "@/data/mockData";

const Projects = () => {
  return (
    <Layout>
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Community <span className="text-gradient">Projects</span></h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Explore what our community has built. Each project extends a SoC Labs reference design with custom accelerators and peripherals.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {communityProjects.map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="h-full hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-border/60">
                  <CardContent className="p-6 flex flex-col h-full">
                    <h3 className="text-lg font-display font-bold mb-1">{project.title}</h3>
                    <p className="text-sm text-primary font-medium mb-1">{project.author}</p>
                    <p className="text-xs text-muted-foreground mb-3">{project.institution}</p>
                    <p className="text-sm text-muted-foreground mb-4 flex-1 leading-relaxed">{project.description}</p>

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {project.tags.map((tag) => (
                        <span key={tag} className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                          <Tag className="h-2.5 w-2.5" />{tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {new Date(project.date).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}
                      </span>
                      <Button asChild size="sm" variant="ghost">
                        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                          <Github className="h-4 w-4 mr-1" /> Repo
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Projects;
