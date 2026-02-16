import { Link } from "react-router-dom";
import { Cpu, Github, Twitter, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 font-bold text-lg">
              <Cpu className="h-5 w-5 text-primary" />
              <span className="text-gradient">SoC Labs</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Empowering academics and students to build custom System-on-Chip designs around ARM Cortex microprocessors.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-3 text-foreground">Explore</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/designs" className="hover:text-primary transition-colors">Reference Designs</Link></li>
              <li><Link to="/projects" className="hover:text-primary transition-colors">Community Projects</Link></li>
              <li><Link to="/learn" className="hover:text-primary transition-colors">Learning Hub</Link></li>
              <li><Link to="/technologies" className="hover:text-primary transition-colors">Technologies</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-3 text-foreground">Community</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/map" className="hover:text-primary transition-colors">Global Map</Link></li>
              <li><Link to="/partners" className="hover:text-primary transition-colors">Partners</Link></li>
              <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="/about#join" className="hover:text-primary transition-colors">Join</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-3 text-foreground">Connect</h4>
            <div className="flex gap-3">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><Github className="h-5 w-5" /></a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><Twitter className="h-5 w-5" /></a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><Mail className="h-5 w-5" /></a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} SoC Labs. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
