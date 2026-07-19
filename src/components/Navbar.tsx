import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Cpu, LogIn, LogOut, User, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import JoinCommunityDialog from "@/components/JoinCommunityDialog";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navLinks = [
  { to: "/designs", label: "Reference Designs" },
  { to: "/projects", label: "Projects" },
  { to: "/learn", label: "Learning Hub" },
  { to: "/technologies", label: "Technologies" },
  { to: "/research", label: "Discussions" },
  { to: "/news", label: "News" },
  { to: "/partners", label: "Community" },
  { to: "/about", label: "About" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [joinOpen, setJoinOpen] = useState(false);
  const location = useLocation();
  const { user, loading, signOut } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-electric/10 bg-[hsl(var(--nav-bg)/0.95)] backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-baseline gap-2 font-nav mr-6 leading-none">
          <span className="font-bold text-3xl tracking-tight text-primary-foreground lowercase">soc labs</span>
        </Link>

        <div className="hidden lg:flex items-center gap-0.5">
          {navLinks.map((link) => {
            const isActive = link.to === "/" 
              ? location.pathname === "/" 
              : location.pathname.startsWith(link.to);
            return (
              <Link
                key={link.to}
                to={link.to}
                className={cn(
                  "relative px-3 py-2 text-sm rounded-lg transition-all font-nav",
                  isActive
                    ? "text-primary-foreground font-semibold"
                    : "text-primary-foreground/80 hover:text-primary-foreground hover:bg-white/10"
                )}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-[2px] rounded-full bg-electric" />
                )}
              </Link>
            );
          })}
        </div>

        <div className="hidden lg:flex items-center gap-2">
          {!loading && (
            user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="rounded-full text-primary-foreground/80 hover:text-primary-foreground hover:bg-white/10 gap-1.5"
                  >
                    <User className="h-4 w-4" />
                    Profile
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44 bg-card border border-border shadow-lg z-[100]">
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link to="/profile">
                      <User className="h-4 w-4 mr-2" />
                      My Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={signOut} className="cursor-pointer">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button
                  size="sm"
                  variant="ghost"
                  className="rounded-full text-primary-foreground/80 hover:text-primary-foreground hover:bg-white/10"
                  asChild
                >
                  <Link to="/auth">
                    <LogIn className="h-4 w-4 mr-1" /> Sign In
                  </Link>
                </Button>
                <Button size="sm" className="rounded-full px-5" onClick={() => setJoinOpen(true)}>
                  Join Community
                </Button>
              </>
            )
          )}
        </div>

        <button className="lg:hidden text-primary-foreground" onClick={() => setOpen(!open)}>
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-white/10 bg-[hsl(var(--nav-bg)/0.98)] backdrop-blur-xl">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className={cn(
                  "px-3 py-2.5 text-sm rounded-lg transition-all font-nav",
                  (link.to === "/" ? location.pathname === "/" : location.pathname.startsWith(link.to))
                    ? "text-primary-foreground bg-primary/20 font-semibold"
                    : "text-primary-foreground/80 hover:text-primary-foreground hover:bg-white/10"
                )}
              >
                {link.label}
              </Link>
            ))}
            {!loading && (
              user ? (
                <Button
                  size="sm"
                  variant="ghost"
                  className="mt-2 rounded-full justify-start text-primary-foreground/80"
                  onClick={() => { setOpen(false); signOut(); }}
                >
                  <LogOut className="h-4 w-4 mr-2" /> Sign Out
                </Button>
              ) : (
                <>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="mt-2 rounded-full justify-start text-primary-foreground/80"
                    asChild
                  >
                    <Link to="/auth" onClick={() => setOpen(false)}>
                      <LogIn className="h-4 w-4 mr-2" /> Sign In
                    </Link>
                  </Button>
                  <Button size="sm" className="mt-1 rounded-full" onClick={() => { setOpen(false); setJoinOpen(true); }}>
                    Join Community
                  </Button>
                </>
              )
            )}
          </div>
        </div>
      )}
      <JoinCommunityDialog open={joinOpen} onOpenChange={setJoinOpen} />
    </nav>
  );
};

export default Navbar;
