import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Cpu, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const PAGE_SIZE = 4;

type TechFilter = "All" | "FPGA" | "ASIC";

interface CommunityProjectsCarouselProps {
  design: { name: string };
  mockProjects: any[];
  dbProjects: any[];
}

const CommunityProjectsCarousel = ({ design, mockProjects, dbProjects }: CommunityProjectsCarouselProps) => {
  const [techFilter, setTechFilter] = useState<TechFilter>("All");
  const [page, setPage] = useState(0);

  // Normalise into a unified list
  const allProjects = useMemo(() => {
    const fromDb = dbProjects.map((p) => ({
      id: p.id,
      title: p.title,
      description: p.description,
      status: p.status,
      technology: (p.target_technology || "").toUpperCase() || p.reference_soc,
      author: null,
      institution: null,
      source: "db" as const,
    }));
    const fromMock = mockProjects.map((p) => ({
      id: p.id,
      title: p.title,
      description: p.description,
      status: p.status,
      technology: (p.technology || "").toUpperCase(),
      author: p.author,
      institution: p.institution,
      source: "mock" as const,
    }));
    return [...fromDb, ...fromMock];
  }, [dbProjects, mockProjects]);

  const filtered = useMemo(() => {
    if (techFilter === "All") return allProjects;
    return allProjects.filter((p) => p.technology === techFilter);
  }, [allProjects, techFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages - 1);
  const visible = filtered.slice(currentPage * PAGE_SIZE, currentPage * PAGE_SIZE + PAGE_SIZE);

  const handleFilterChange = (f: TechFilter) => {
    setTechFilter(f);
    setPage(0);
  };

  const filterButtons: TechFilter[] = ["All", "FPGA", "ASIC"];

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="text-2xl font-display font-bold">Community Projects</h2>
          <p className="text-muted-foreground text-sm mt-1">Projects built on top of the {design.name} platform by community members.</p>
        </div>
        <div className="flex items-center gap-1 rounded-lg border border-border/60 p-0.5">
          {filterButtons.map((f) => (
            <button
              key={f}
              onClick={() => handleFilterChange(f)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                techFilter === f
                  ? f === "FPGA"
                    ? "bg-sky-500/15 text-sky-400"
                    : f === "ASIC"
                    ? "bg-violet-500/15 text-violet-400"
                    : "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {filtered.length > 0 ? (
        <>
          <div className="grid sm:grid-cols-2 gap-4">
            {visible.map((project) => (
              <Link to={`/projects/${project.id}`} key={`${project.source}-${project.id}`} className="group">
                <Card className="hover:shadow-lg transition-all duration-300 hover:border-primary/40 h-full">
                  <CardContent className="p-5 flex flex-col h-full">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          project.status === "Completed"
                            ? "border-green-500/30 text-green-400"
                            : project.status === "In Progress"
                            ? "border-primary/30 text-primary"
                            : "border-border text-muted-foreground"
                        }`}
                      >
                        {project.status}
                      </Badge>
                      {project.technology && (
                        <Badge
                          variant="outline"
                          className={`text-xs ${
                            project.technology === "FPGA"
                              ? "border-sky-500/30 text-sky-400"
                              : project.technology === "ASIC"
                              ? "border-violet-500/30 text-violet-400"
                              : ""
                          }`}
                        >
                          {project.technology}
                        </Badge>
                      )}
                    </div>
                    <h3 className="font-display font-semibold mb-1 group-hover:text-primary transition-colors">{project.title}</h3>
                    {project.author && (
                      <p className="text-xs text-primary mb-2">{project.author} — {project.institution}</p>
                    )}
                    <p className="text-sm text-muted-foreground line-clamp-2 flex-1">{project.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-6">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full"
                disabled={currentPage === 0}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-muted-foreground">
                {currentPage + 1} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full"
                disabled={currentPage >= totalPages - 1}
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="rounded-2xl border border-dashed border-border p-10 text-center">
          <Cpu className="h-8 w-8 text-muted-foreground/40 mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">
            {techFilter === "All"
              ? `No community projects have been built on ${design.name} yet.`
              : `No ${techFilter} projects found for ${design.name}.`}
          </p>
          <Button asChild variant="outline" size="sm" className="mt-4 rounded-full">
            <Link to="/projects/start">Start a project</Link>
          </Button>
        </div>
      )}
    </>
  );
};

export default CommunityProjectsCarousel;
