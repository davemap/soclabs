import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Cpu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/designs", label: "Designs" },
  { to: "/projects", label: "Projects" },
  { to: "/learn", label: "Learning Hub" },
  { to: "/technologies", label: "Technologies" },
  { to: "/interests", label: "Interests" },
  { to: "/partners", label: "Community" },
  { to: "/about", label: "About" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-electric/10 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2.5 font-nav font-bold text-lg tracking-tight">
          <div className="w-8 h-8 rounded-lg bg-electric flex items-center justify-center shadow-md shadow-electric/30">
            <Cpu className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-gradient">SoC Labs</span>
        </Link>

        <div className="hidden lg:flex items-center gap-0.5">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={cn(
                "px-3 py-2 text-sm rounded-lg transition-all font-nav",
                location.pathname === link.to
                  ? "text-primary bg-primary/10 font-semibold"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden lg:block">
          <Button asChild size="sm" className="rounded-full px-5">
            <Link to="/about#join">Join Community</Link>
          </Button>
        </div>

        <button className="lg:hidden text-foreground" onClick={() => setOpen(!open)}>
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-border/60 bg-background/95 backdrop-blur-xl">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className={cn(
                  "px-3 py-2.5 text-sm rounded-lg transition-all font-nav",
                  location.pathname === link.to
                    ? "text-primary bg-primary/10 font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                {link.label}
              </Link>
            ))}
            <Button asChild size="sm" className="mt-2 rounded-full">
              <Link to="/about#join" onClick={() => setOpen(false)}>Join Community</Link>
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
