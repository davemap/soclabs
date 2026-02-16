import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Plus, X, Search, Rocket, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/Layout";
import { referenceDesigns, technologies } from "@/data/mockData";
import { interests } from "@/data/interests";

const timeframeOptions = [
  { value: "1-month", label: "1 Month" },
  { value: "3-months", label: "3 Months" },
  { value: "6-months", label: "6 Months" },
  { value: "1-year", label: "1 Year" },
  { value: "2-years", label: "2 Years" },
  { value: "3-years", label: "3 Years" },
  { value: "unknown", label: "Unknown" },
];

const StartProject = () => {
  const { toast } = useToast();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [referenceSoc, setReferenceSoc] = useState("");
  const [targetTechnology, setTargetTechnology] = useState("");
  const [timeframe, setTimeframe] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [docsUrl, setDocsUrl] = useState("");

  // Interests search
  const [interestSearch, setInterestSearch] = useState("");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  // Technologies search
  const [techSearch, setTechSearch] = useState("");
  const [selectedTechnologies, setSelectedTechnologies] = useState<string[]>([]);

  const filteredInterests = useMemo(() => {
    if (!interestSearch.trim()) return interests;
    const q = interestSearch.toLowerCase();
    return interests.filter(
      (i) => i.name.toLowerCase().includes(q) || i.category.toLowerCase().includes(q)
    );
  }, [interestSearch]);

  const filteredTechnologies = useMemo(() => {
    if (!techSearch.trim()) return technologies;
    const q = techSearch.toLowerCase();
    return technologies.filter(
      (t) => t.name.toLowerCase().includes(q) || t.category.toLowerCase().includes(q)
    );
  }, [techSearch]);

  const toggleInterest = (slug: string) => {
    setSelectedInterests((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  };

  const toggleTechnology = (name: string) => {
    setSelectedTechnologies((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !referenceSoc) {
      toast({
        title: "Missing required fields",
        description: "Please provide a project title and select a reference SoC.",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Project created!",
      description: "Your project page has been set up. Create an account to manage it.",
    });
  };

  return (
    <Layout>
      <section className="py-24">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Home
            </Link>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 rounded-xl bg-primary/10">
                <Rocket className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-display font-bold">Start a Project</h1>
                <p className="text-muted-foreground">
                  Set up your SoC project, pick a reference design, and get building.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Account CTA */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.02 }}>
            <Card className="mb-8 border-primary/20 bg-primary/5">
              <CardContent className="p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="flex-1">
                  <h3 className="font-display font-semibold text-sm mb-1">Create an Account</h3>
                  <p className="text-xs text-muted-foreground">
                    Sign up to save your project, collaborate with the community, and track progress.
                  </p>
                </div>
                <Button asChild size="sm" className="rounded-full">
                  <Link to="/about#join">
                    Sign Up <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-8">
              {/* Basic Info */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
                <Card>
                  <CardContent className="p-6 space-y-5">
                    <h2 className="text-lg font-display font-semibold">Project Details</h2>
                    <div className="space-y-2">
                      <Label htmlFor="title">Project Title *</Label>
                      <Input id="title" placeholder="e.g. Custom ML Accelerator for NanoSoC" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={120} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="desc">Description</Label>
                      <Textarea id="desc" placeholder="What does your project do? Who is it for?" value={description} onChange={(e) => setDescription(e.target.value)} rows={4} maxLength={1000} />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Reference SoC */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
                <Card>
                  <CardContent className="p-6 space-y-5">
                    <h2 className="text-lg font-display font-semibold">Reference SoC *</h2>
                    <p className="text-sm text-muted-foreground">Select the reference design your project is based on.</p>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {referenceDesigns.map((d) => (
                        <button
                          key={d.id}
                          type="button"
                          onClick={() => setReferenceSoc(d.id)}
                          className={`text-left p-4 rounded-xl border transition-all ${
                            referenceSoc === d.id
                              ? "border-primary bg-primary/10 ring-1 ring-primary/30"
                              : "border-border hover:border-primary/30"
                          }`}
                        >
                          <div className="font-display font-bold text-sm">{d.name}</div>
                          <div className="text-xs text-muted-foreground mt-1">{d.tagline}</div>
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Target Technology & Timeframe */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.11 }}>
                <Card>
                  <CardContent className="p-6 space-y-5">
                    <h2 className="text-lg font-display font-semibold">Target & Timeline</h2>
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <Label>Target Technology</Label>
                        <div className="flex gap-2">
                          {["FPGA", "ASIC"].map((t) => (
                            <button
                              key={t}
                              type="button"
                              onClick={() => setTargetTechnology(t)}
                              className={`flex-1 py-2.5 px-4 rounded-lg border text-sm font-medium transition-all ${
                                targetTechnology === t
                                  ? "border-primary bg-primary/10 text-primary"
                                  : "border-border text-muted-foreground hover:border-primary/30"
                              }`}
                            >
                              {t}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Estimated Timeframe</Label>
                        <div className="flex flex-wrap gap-2">
                          {timeframeOptions.map((tf) => (
                            <button
                              key={tf.value}
                              type="button"
                              onClick={() => setTimeframe(tf.value)}
                              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                                timeframe === tf.value
                                  ? "bg-primary text-primary-foreground border-primary"
                                  : "bg-muted text-muted-foreground border-border hover:border-primary/40"
                              }`}
                            >
                              {tf.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Interests */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14 }}>
                <Card>
                  <CardContent className="p-6 space-y-5">
                    <h2 className="text-lg font-display font-semibold">Interests</h2>
                    <p className="text-sm text-muted-foreground">Associate your project with relevant interests so others can find it.</p>

                    {selectedInterests.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {selectedInterests.map((slug) => {
                          const interest = interests.find((i) => i.slug === slug);
                          return (
                            <Badge key={slug} variant="secondary" className="gap-1">
                              {interest?.name ?? slug}
                              <button type="button" onClick={() => toggleInterest(slug)}><X className="h-3 w-3" /></button>
                            </Badge>
                          );
                        })}
                      </div>
                    )}

                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search interests..."
                        value={interestSearch}
                        onChange={(e) => setInterestSearch(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                    <div className="max-h-48 overflow-y-auto space-y-1 rounded-lg border border-border p-2">
                      {filteredInterests.map((i) => (
                        <button
                          key={i.slug}
                          type="button"
                          onClick={() => toggleInterest(i.slug)}
                          className={`w-full text-left px-3 py-2 rounded-md text-sm flex items-center justify-between transition-colors ${
                            selectedInterests.includes(i.slug)
                              ? "bg-primary/10 text-primary"
                              : "hover:bg-muted"
                          }`}
                        >
                          <span>{i.name}</span>
                          <span className="text-xs text-muted-foreground">{i.category}</span>
                        </button>
                      ))}
                      {filteredInterests.length === 0 && (
                        <p className="text-xs text-muted-foreground text-center py-3">No interests found.</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Technologies & Tools */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.17 }}>
                <Card>
                  <CardContent className="p-6 space-y-5">
                    <h2 className="text-lg font-display font-semibold">Technologies & Tools</h2>
                    <p className="text-sm text-muted-foreground">Select the tools and technologies your project will use.</p>

                    {selectedTechnologies.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {selectedTechnologies.map((name) => (
                          <Badge key={name} variant="secondary" className="gap-1">
                            {name}
                            <button type="button" onClick={() => toggleTechnology(name)}><X className="h-3 w-3" /></button>
                          </Badge>
                        ))}
                      </div>
                    )}

                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search technologies..."
                        value={techSearch}
                        onChange={(e) => setTechSearch(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {filteredTechnologies.map((t) => (
                        <button
                          key={t.name}
                          type="button"
                          onClick={() => toggleTechnology(t.name)}
                          className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                            selectedTechnologies.includes(t.name)
                              ? "bg-primary text-primary-foreground border-primary"
                              : "bg-muted text-muted-foreground border-border hover:border-primary/40"
                          }`}
                        >
                          {t.name}
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Links */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <Card>
                  <CardContent className="p-6 space-y-5">
                    <h2 className="text-lg font-display font-semibold">External Links</h2>
                    <div className="space-y-2">
                      <Label htmlFor="github">GitHub / GitLab Repository</Label>
                      <Input id="github" type="url" placeholder="https://github.com/..." value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} maxLength={500} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="docs">Documentation Site</Label>
                      <Input id="docs" type="url" placeholder="https://docs.example.org/..." value={docsUrl} onChange={(e) => setDocsUrl(e.target.value)} maxLength={500} />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Submit */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.23 }}>
                <Button type="submit" size="lg" className="rounded-full w-full sm:w-auto">
                  <Rocket className="h-4 w-4 mr-2" /> Create Project
                </Button>
              </motion.div>
            </div>
          </form>
        </div>
      </section>
    </Layout>
  );
};

export default StartProject;
