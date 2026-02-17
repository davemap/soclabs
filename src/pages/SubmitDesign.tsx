import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Plus, X, Send, Cpu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/Layout";
import { communityProjects } from "@/data/mockData";

interface ProvenEntry {
  type: "FPGA" | "ASIC";
  details: string;
}

const processorOptions = [
  "ARM Cortex-M0",
  "ARM Cortex-M0+",
  "ARM Cortex-M3",
  "ARM Cortex-M4",
  "ARM Cortex-M7",
  "ARM Cortex-M33",
  "RISC-V (RV32I)",
  "RISC-V (RV32IM)",
  "RISC-V (RV64)",
  "Other",
];

const busOptions = [
  "AHB-Lite",
  "Multi-layer AHB",
  "AXI4",
  "AXI4-Lite",
  "Wishbone",
  "TileLink",
  "Other",
];

const peripheralOptions = [
  "GPIO", "UART", "SPI", "I2C", "Timer", "Watchdog", "RTC",
  "DMA Controller", "ADC", "DAC", "PWM", "CAN", "Ethernet", "USB",
];

const SubmitDesign = () => {
  const { toast } = useToast();

  const [name, setName] = useState("");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const [processor, setProcessor] = useState("");
  const [customProcessor, setCustomProcessor] = useState("");
  const [bus, setBus] = useState("");
  const [customBus, setCustomBus] = useState("");
  const [architectureOverview, setArchitectureOverview] = useState("");
  const [selectedPeripherals, setSelectedPeripherals] = useState<string[]>([]);
  const [customPeripheral, setCustomPeripheral] = useState("");
  const [selectedProject, setSelectedProject] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [docsUrl, setDocsUrl] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [provenEntries, setProvenEntries] = useState<ProvenEntry[]>([]);
  const [newProvenType, setNewProvenType] = useState<"FPGA" | "ASIC">("FPGA");
  const [newProvenDetails, setNewProvenDetails] = useState("");

  const togglePeripheral = (p: string) => {
    setSelectedPeripherals((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
    );
  };

  const addCustomPeripheral = () => {
    const trimmed = customPeripheral.trim();
    if (trimmed && !selectedPeripherals.includes(trimmed)) {
      setSelectedPeripherals((prev) => [...prev, trimmed]);
      setCustomPeripheral("");
    }
  };

  const addProvenEntry = () => {
    const trimmed = newProvenDetails.trim();
    if (!trimmed) return;
    setProvenEntries((prev) => [...prev, { type: newProvenType, details: trimmed }]);
    setNewProvenDetails("");
  };

  const removeProvenEntry = (index: number) => {
    setProvenEntries((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !description.trim() || !processor) {
      toast({
        title: "Missing required fields",
        description: "Please fill in the SoC name, description, and processor.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Submission received!",
      description: "Your reference SoC request has been submitted for review. We'll be in touch soon.",
    });
  };

  return (
    <Layout>
      <section className="py-24">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 rounded-xl bg-primary/10">
                <Cpu className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-display font-bold">Submit a Reference SoC</h1>
                <p className="text-muted-foreground">
                  Request to add your own SoC platform to the SoC Labs registry.
                </p>
              </div>
            </div>
          </motion.div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-10">
              {/* Basic Info */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
                <Card>
                  <CardContent className="p-6 space-y-5">
                    <h2 className="text-lg font-display font-semibold">Basic Information</h2>

                    <div className="space-y-2">
                      <Label htmlFor="name">SoC Name *</Label>
                      <Input id="name" placeholder="e.g. MicroSoC" value={name} onChange={(e) => setName(e.target.value)} maxLength={80} />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tagline">Tagline</Label>
                      <Input id="tagline" placeholder="e.g. Ultra-low-power Cortex-M0+ SoC for wearables" value={tagline} onChange={(e) => setTagline(e.target.value)} maxLength={120} />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description *</Label>
                      <Textarea id="description" placeholder="Describe what your SoC does and who it's for..." value={description} onChange={(e) => setDescription(e.target.value)} rows={4} maxLength={1000} />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Contact Email *</Label>
                      <Input id="email" type="email" placeholder="you@university.ac.uk" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} maxLength={255} />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Architecture */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <Card>
                  <CardContent className="p-6 space-y-5">
                    <h2 className="text-lg font-display font-semibold">Architecture Details</h2>

                    <div className="space-y-2">
                      <Label>Processor Core *</Label>
                      <Select value={processor} onValueChange={setProcessor}>
                        <SelectTrigger><SelectValue placeholder="Select processor" /></SelectTrigger>
                        <SelectContent>
                          {processorOptions.map((p) => (
                            <SelectItem key={p} value={p}>{p}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {processor === "Other" && (
                        <Input placeholder="Specify processor" value={customProcessor} onChange={(e) => setCustomProcessor(e.target.value)} maxLength={100} className="mt-2" />
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Bus Architecture</Label>
                      <Select value={bus} onValueChange={setBus}>
                        <SelectTrigger><SelectValue placeholder="Select bus" /></SelectTrigger>
                        <SelectContent>
                          {busOptions.map((b) => (
                            <SelectItem key={b} value={b}>{b}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {bus === "Other" && (
                        <Input placeholder="Specify bus architecture" value={customBus} onChange={(e) => setCustomBus(e.target.value)} maxLength={100} className="mt-2" />
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Peripherals</Label>
                      <div className="flex flex-wrap gap-2">
                        {peripheralOptions.map((p) => (
                          <button
                            type="button"
                            key={p}
                            onClick={() => togglePeripheral(p)}
                            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                              selectedPeripherals.includes(p)
                                ? "bg-primary text-primary-foreground border-primary"
                                : "bg-muted text-muted-foreground border-border hover:border-primary/40"
                            }`}
                          >
                            {p}
                          </button>
                        ))}
                      </div>
                      <div className="flex gap-2 mt-2">
                        <Input
                          placeholder="Add custom peripheral"
                          value={customPeripheral}
                          onChange={(e) => setCustomPeripheral(e.target.value)}
                          maxLength={60}
                          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addCustomPeripheral(); }}}
                        />
                        <Button type="button" variant="outline" size="icon" onClick={addCustomPeripheral}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      {selectedPeripherals.filter((p) => !peripheralOptions.includes(p)).length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {selectedPeripherals.filter((p) => !peripheralOptions.includes(p)).map((p) => (
                            <Badge key={p} variant="secondary" className="gap-1">
                              {p}
                              <button type="button" onClick={() => togglePeripheral(p)}><X className="h-3 w-3" /></button>
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="arch-overview">Architecture Overview</Label>
                      <Textarea
                        id="arch-overview"
                        placeholder="Describe the high-level architecture, bus topology, memory map, and any notable design decisions..."
                        value={architectureOverview}
                        onChange={(e) => setArchitectureOverview(e.target.value)}
                        rows={5}
                        maxLength={3000}
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Proven Technologies */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                <Card>
                  <CardContent className="p-6 space-y-5">
                    <h2 className="text-lg font-display font-semibold">Proven Technologies</h2>
                    <p className="text-sm text-muted-foreground">
                      Has this SoC been proven on any FPGA boards or fabricated as an ASIC? Add each below.
                    </p>

                    {provenEntries.length > 0 && (
                      <div className="space-y-2">
                        {provenEntries.map((entry, i) => (
                          <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/30">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className={`text-xs ${entry.type === "ASIC" ? "border-amber-500/50 text-amber-400" : "border-emerald-500/50 text-emerald-400"}`}>
                                {entry.type}
                              </Badge>
                              <span className="text-sm">{entry.details}</span>
                            </div>
                            <Button type="button" variant="ghost" size="icon" className="h-7 w-7" onClick={() => removeProvenEntry(i)}>
                              <X className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex gap-2 items-end">
                      <div className="w-28 space-y-1">
                        <Label className="text-xs">Type</Label>
                        <Select value={newProvenType} onValueChange={(v) => setNewProvenType(v as "FPGA" | "ASIC")}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="FPGA">FPGA</SelectItem>
                            <SelectItem value="ASIC">ASIC</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex-1 space-y-1">
                        <Label className="text-xs">Details</Label>
                        <Input
                          placeholder={newProvenType === "FPGA" ? "e.g. Xilinx Artix-7 (XC7A35T)" : "e.g. TSMC 65nm (via Europractice)"}
                          value={newProvenDetails}
                          onChange={(e) => setNewProvenDetails(e.target.value)}
                          maxLength={120}
                          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addProvenEntry(); }}}
                        />
                      </div>
                      <Button type="button" variant="outline" size="icon" onClick={addProvenEntry}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Associated Project & Links */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <Card>
                  <CardContent className="p-6 space-y-5">
                    <h2 className="text-lg font-display font-semibold">Project & Links</h2>

                    <div className="space-y-2">
                      <Label>Associated Project</Label>
                      <p className="text-xs text-muted-foreground">Select an existing community project this SoC originates from.</p>
                      <Select value={selectedProject} onValueChange={setSelectedProject}>
                        <SelectTrigger><SelectValue placeholder="Select a project (optional)" /></SelectTrigger>
                        <SelectContent>
                          {communityProjects.map((p) => (
                            <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="github">GitHub Repository URL</Label>
                      <Input id="github" type="url" placeholder="https://github.com/..." value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} maxLength={500} />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="docs">Documentation URL</Label>
                      <Input id="docs" type="url" placeholder="https://docs.example.org/..." value={docsUrl} onChange={(e) => setDocsUrl(e.target.value)} maxLength={500} />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Submit */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
                <Button type="submit" size="lg" className="rounded-full w-full sm:w-auto">
                  <Send className="h-4 w-4 mr-2" /> Submit Request
                </Button>
              </motion.div>
            </div>
          </form>
        </div>
      </section>
    </Layout>
  );
};

export default SubmitDesign;
