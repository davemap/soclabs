import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const PAGE_SIZE = 4;

type GroupFilter = "All" | "Components" | "EDA Tooling" | "Infrastructure";

interface TechToolsCarouselProps {
  techs: any[];
}

const TechToolsCarousel = ({ techs }: TechToolsCarouselProps) => {
  const [groupFilter, setGroupFilter] = useState<GroupFilter>("All");
  const [page, setPage] = useState(0);

  const groups = useMemo(() => {
    const unique = new Set(techs.map((t) => t.group as string));
    return ["All", ...Array.from(unique)] as GroupFilter[];
  }, [techs]);

  const filtered = useMemo(() => {
    if (groupFilter === "All") return techs;
    return techs.filter((t) => t.group === groupFilter);
  }, [techs, groupFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages - 1);
  const visible = filtered.slice(currentPage * PAGE_SIZE, currentPage * PAGE_SIZE + PAGE_SIZE);

  const handleFilterChange = (f: GroupFilter) => {
    setGroupFilter(f);
    setPage(0);
  };

  const groupColor = (g: string, active: boolean) => {
    if (!active) return "text-muted-foreground hover:text-foreground";
    switch (g) {
      case "Components": return "bg-primary/10 text-primary";
      case "EDA Tooling": return "bg-violet-500/15 text-violet-400";
      case "Infrastructure": return "bg-coral/10 text-coral";
      default: return "bg-primary/10 text-primary";
    }
  };

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h2 className="text-2xl font-display font-bold">Technologies & Tools</h2>
        {groups.length > 2 && (
          <div className="flex items-center gap-1 rounded-lg border border-border/60 p-0.5">
            {groups.map((g) => (
              <button
                key={g}
                onClick={() => handleFilterChange(g)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${groupColor(g, groupFilter === g)}`}
              >
                {g}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {visible.map((tech: any) => (
          <Link to={`/technologies/${tech.id}`} key={tech.name}>
            <Card className="hover:shadow-lg transition-all duration-300 hover:border-primary/40 h-full">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-display font-semibold">{tech.name}</h3>
                  <Badge variant="outline" className="text-xs">{tech.group} · {tech.category}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{tech.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

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
  );
};

export default TechToolsCarousel;
