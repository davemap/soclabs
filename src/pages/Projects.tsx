import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Github, Calendar, Tag, Search, Filter, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Layout from "@/components/Layout";
import ScrollReveal from "@/components/ScrollReveal";
import { communityProjects } from "@/data/mockData";

const referenceSocs = ["All", "NanoSoC", "EcoSoC"];
const technologyTypes = ["All", "FPGA", "ASIC"];
const statusOptions = ["All", "Completed", "In Progress", "Planning"];

const Projects = () => {
  const [search, setSearch] = useState("");
  const [socFilter, setSocFilter] = useState("All");
  const [techFilter, setTechFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const filtered = useMemo(() => {
    return communityProjects.filter((p) => {
      const matchesSearch =
        !search ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.author.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase()) ||
        p.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
      const matchesSoc = socFilter === "All" || p.referenceSoc === socFilter;
      const matchesTech = techFilter === "All" || p.technology === techFilter;
      const matchesStatus = statusFilter === "All" || p.status === statusFilter;
      return matchesSearch && matchesSoc && matchesTech && matchesStatus;
    });
  }, [search, socFilter, techFilter, statusFilter]);

  const statusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
      case "In Progress":
        return "bg-amber-500/15 text-amber-400 border-amber-500/30";
      case "Planning":
        return "bg-blue-500/15 text-blue-400 border-blue-500/30";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Layout>
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Community <span className="text-gradient">Projects</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Explore what our community has built. Each project extends a SoC Labs reference design with custom accelerators and peripherals.
            </p>
          </motion.div>

          {/* Search & Filters */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-6xl mx-auto mb-8 space-y-4"
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search projects by name, author, or keyword..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 h-11 bg-card border-border/60"
              />
            </div>

            <div className="flex flex-wrap gap-6">
              <FilterGroup label="Reference SoC" options={referenceSocs} value={socFilter} onChange={setSocFilter} />
              <FilterGroup label="Technology" options={technologyTypes} value={techFilter} onChange={setTechFilter} />
              <FilterGroup label="Status" options={statusOptions} value={statusFilter} onChange={setStatusFilter} />
            </div>
          </motion.div>

          {/* Results */}
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <Filter className="h-10 w-10 mx-auto mb-3 opacity-40" />
              <p className="text-lg font-medium">No projects match your filters</p>
              <p className="text-sm">Try adjusting your search or filter criteria.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {filtered.map((project, i) => (
                <ScrollReveal key={project.id} delay={i * 0.05}>
                  <Link to={`/projects/${project.id}`} className="block h-full">
                    <Card className="h-full hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-border/60 group cursor-pointer">
                      <CardContent className="p-6 flex flex-col h-full">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="text-lg font-display font-bold group-hover:text-primary transition-colors">
                            {project.title}
                          </h3>
                          <ArrowRight className="h-4 w-4 mt-1 shrink-0 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                        </div>
                        <p className="text-sm text-primary font-medium mb-1">{project.author}</p>
                        <p className="text-xs text-muted-foreground mb-3">{project.institution}</p>
                        <p className="text-sm text-muted-foreground mb-4 flex-1 leading-relaxed line-clamp-3">
                          {project.description}
                        </p>

                        <div className="flex items-center gap-2 mb-3">
                          <Badge variant="outline" className={statusColor(project.status)}>
                            {project.status}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {project.referenceSoc}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {project.technology}
                          </Badge>
                        </div>

                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {project.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium"
                            >
                              <Tag className="h-2.5 w-2.5" />
                              {tag}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {new Date(project.date).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}
                          </span>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="pointer-events-none"
                            tabIndex={-1}
                          >
                            Read More <ArrowRight className="h-3 w-3 ml-1" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

const FilterGroup = ({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) => (
  <div className="flex items-center gap-2">
    <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">{label}:</span>
    <div className="flex gap-1 flex-wrap">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={`text-xs px-3 py-1.5 rounded-full border transition-all font-medium ${
            value === opt
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-card text-muted-foreground border-border/60 hover:border-primary/40 hover:text-foreground"
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  </div>
);

export default Projects;
