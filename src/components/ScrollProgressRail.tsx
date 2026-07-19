import { useEffect, useState } from "react";

export interface RailSection {
  id: string;
  label: string;
}

interface ScrollProgressRailProps {
  sections: RailSection[];
}

const ScrollProgressRail = ({ sections }: ScrollProgressRailProps) => {
  const [activeId, setActiveId] = useState<string>(sections[0]?.id ?? "");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const total = doc.scrollHeight - doc.clientHeight;
      setProgress(total > 0 ? Math.min(1, Math.max(0, window.scrollY / total)) : 0);

      const viewMid = window.scrollY + window.innerHeight * 0.35;
      let current = sections[0]?.id ?? "";
      for (const s of sections) {
        const el = document.getElementById(s.id);
        if (el && el.offsetTop <= viewMid) current = s.id;
      }
      setActiveId(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [sections]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.offsetTop - 60, behavior: "smooth" });
  };

  return (
    <aside
      aria-label="Section navigation"
      className="fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 lg:block"
    >
      <div className="relative flex flex-col items-end gap-6 pr-4">
        {/* Rail line */}
        <div className="absolute right-[7px] top-1 bottom-1 w-px bg-white/10" />
        <div
          className="absolute right-[7px] top-1 w-px bg-gradient-to-b from-[hsl(82_70%_65%)] to-[hsl(195_90%_65%)] transition-[height] duration-200"
          style={{ height: `calc(${progress * 100}% - 4px)` }}
        />

        {sections.map((s) => {
          const active = s.id === activeId;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => scrollTo(s.id)}
              className="group flex items-center gap-3 text-right"
            >
              <span
                className={`font-mono text-[10px] uppercase tracking-[0.2em] transition-all duration-300 ${
                  active
                    ? "text-[hsl(82_70%_70%)] opacity-100 translate-x-0"
                    : "text-white/40 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
                }`}
              >
                {s.label}
              </span>
              <span className="relative flex h-3.5 w-3.5 items-center justify-center">
                <span
                  className={`absolute inline-flex h-full w-full rounded-full transition-all duration-300 ${
                    active
                      ? "bg-[hsl(82_70%_65%)]/20 scale-100"
                      : "bg-transparent scale-0"
                  }`}
                />
                <span
                  className={`relative h-2 w-2 rounded-full border transition-all duration-300 ${
                    active
                      ? "border-[hsl(82_70%_65%)] bg-[hsl(82_70%_65%)] shadow-[0_0_10px_hsl(82_70%_65%/0.8)]"
                      : "border-white/40 bg-transparent group-hover:border-white/80"
                  }`}
                />
              </span>
            </button>
          );
        })}
      </div>
    </aside>
  );
};

export default ScrollProgressRail;
