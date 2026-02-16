import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Designs from "./pages/Designs";
import Projects from "./pages/Projects";
import LearningHub from "./pages/LearningHub";
import ProjectDetail from "./pages/ProjectDetail";
import Technologies from "./pages/Technologies";
import Partners from "./pages/Partners";

import About from "./pages/About";
import Interests from "./pages/Interests";
import InterestDetail from "./pages/InterestDetail";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/designs" element={<Designs />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />
          <Route path="/learn" element={<LearningHub />} />
          <Route path="/technologies" element={<Technologies />} />
          <Route path="/partners" element={<Partners />} />
          
          <Route path="/interests" element={<Interests />} />
          <Route path="/interests/:slug" element={<InterestDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
