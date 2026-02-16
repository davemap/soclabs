import { Link } from "react-router-dom";
import { Cpu, Github, Twitter, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-muted/40 accent-stripe">
      <div className="container mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2.5 font-nav font-bold text-lg">
              <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
                <Cpu className="h-3.5 w-3.5 text-primary-foreground" />
              </div>
              <span className="text-gradient">SoC Labs</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Empowering academics and students to build custom System-on-Chip designs around ARM Cortex microprocessors.
            </p>
          </div>

          <div>
            <h4 className="font-display font-semibold text-sm mb-3 text-foreground">Explore</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/designs" className="hover:text-primary transition-colors">Reference Designs</Link></li>
              <li><Link to="/projects" className="hover:text-primary transition-colors">Community Projects</Link></li>
              <li><Link to="/learn" className="hover:text-primary transition-colors">Learning Hub</Link></li>
              <li><Link to="/technologies" className="hover:text-primary transition-colors">Technologies</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-sm mb-3 text-foreground">Community</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/interests" className="hover:text-primary transition-colors">Interests</Link></li>
              <li><Link to="/partners" className="hover:text-primary transition-colors">Community</Link></li>
              <li><Link to="/map" className="hover:text-primary transition-colors">Global Map</Link></li>
              <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="/about#join" className="hover:text-primary transition-colors">Join</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-sm mb-3 text-foreground">Connect</h4>
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-all"><Github className="h-4 w-4" /></a>
              <a href="#" className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-all"><Twitter className="h-4 w-4" /></a>
              <a href="#" className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-all"><Mail className="h-4 w-4" /></a>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} SoC Labs. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
