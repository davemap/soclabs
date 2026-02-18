import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Designs from "./pages/Designs";
import DesignDetail from "./pages/DesignDetail";
import DesignDocs from "./pages/DesignDocs";
import SubmitDesign from "./pages/SubmitDesign";
import Projects from "./pages/Projects";
import LearningHub from "./pages/LearningHub";
import LearningTopicDetail from "./pages/LearningTopicDetail";
import ProjectDetail from "./pages/ProjectDetail";
import Technologies from "./pages/Technologies";
import TechnologyDetail from "./pages/TechnologyDetail";
import Partners from "./pages/Partners";
import OrganisationDetail from "./pages/OrganisationDetail";
import MemberDetail from "./pages/MemberDetail";
import News from "./pages/News";
import NewsDetail from "./pages/NewsDetail";
import SubmitNews from "./pages/SubmitNews";
import StartProject from "./pages/StartProject";
import About from "./pages/About";
import Interests from "./pages/Interests";
import InterestDetail from "./pages/InterestDetail";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import AccountSettings from "./pages/AccountSettings";
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
          <Route path="/designs/submit" element={<SubmitDesign />} />
          <Route path="/designs/:id" element={<DesignDetail />} />
          <Route path="/designs/:id/docs" element={<DesignDocs />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/start" element={<StartProject />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />
           <Route path="/learn" element={<LearningHub />} />
           <Route path="/learn/:phaseId/:topicId" element={<LearningTopicDetail />} />
           <Route path="/technologies" element={<Technologies />} />
           <Route path="/technologies/:id" element={<TechnologyDetail />} />
          <Route path="/partners" element={<Partners />} />
           <Route path="/partners/:id" element={<OrganisationDetail />} />
          <Route path="/community/:id" element={<MemberDetail />} />
          <Route path="/news" element={<News />} />
          <Route path="/news/submit" element={<SubmitNews />} />
          <Route path="/news/:id" element={<NewsDetail />} />
          <Route path="/research" element={<Interests />} />
          <Route path="/interests" element={<Interests />} />
          <Route path="/interests/:slug" element={<InterestDetail />} />
          <Route path="/research/:slug" element={<InterestDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/account-settings" element={<AccountSettings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
