import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowRight, ArrowLeft, Check, User, Mail, Building2, GraduationCap } from "lucide-react";
import { partners } from "@/data/mockData";
import { cn } from "@/lib/utils";

interface JoinCommunityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const STEPS = [
  { label: "Account", icon: User },
  { label: "About You", icon: Mail },
  { label: "Organisations", icon: Building2 },
  { label: "ORCID", icon: GraduationCap },
];

const JoinCommunityDialog = ({ open, onOpenChange }: JoinCommunityDialogProps) => {
  const [step, setStep] = useState(0);
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedOrgs, setSelectedOrgs] = useState<string[]>([]);
  const [isIndependent, setIsIndependent] = useState(false);
  const [orcid, setOrcid] = useState("");

  const reset = () => {
    setStep(0);
    setUsername("");
    setName("");
    setEmail("");
    setSelectedOrgs([]);
    setIsIndependent(false);
    setOrcid("");
  };

  const handleClose = (val: boolean) => {
    if (!val) reset();
    onOpenChange(val);
  };

  const toggleOrg = (id: string) => {
    if (isIndependent) return;
    setSelectedOrgs((prev) =>
      prev.includes(id) ? prev.filter((o) => o !== id) : [...prev, id]
    );
  };

  const canNext = () => {
    switch (step) {
      case 0: return username.trim().length >= 3;
      case 1: return name.trim().length > 0 && email.includes("@");
      case 2: return isIndependent || selectedOrgs.length > 0;
      case 3: return true;
      default: return false;
    }
  };

  const handleSubmit = () => {
    // For now just close — backend integration later
    handleClose(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden">
        {/* Progress bar */}
        <div className="flex border-b border-border">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            return (
              <div
                key={s.label}
                className={cn(
                  "flex-1 flex flex-col items-center py-3 text-xs gap-1 transition-colors",
                  i === step
                    ? "text-primary bg-primary/5"
                    : i < step
                    ? "text-primary/60"
                    : "text-muted-foreground"
                )}
              >
                <div
                  className={cn(
                    "w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium transition-colors",
                    i === step
                      ? "bg-primary text-primary-foreground"
                      : i < step
                      ? "bg-primary/20 text-primary"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {i < step ? <Check className="h-3.5 w-3.5" /> : <Icon className="h-3.5 w-3.5" />}
                </div>
                <span className="hidden sm:block">{s.label}</span>
              </div>
            );
          })}
        </div>

        <div className="p-6">
          <DialogHeader className="mb-5">
            <DialogTitle className="text-xl font-display">
              {step === 0 && "Choose a Username"}
              {step === 1 && "Your Details"}
              {step === 2 && "Your Organisations"}
              {step === 3 && "ORCID iD"}
            </DialogTitle>
            <DialogDescription>
              {step === 0 && "Pick a unique username for your SoC Labs profile."}
              {step === 1 && "Tell us your name and how to reach you."}
              {step === 2 && "Select any organisations you're affiliated with."}
              {step === 3 && "Link your ORCID identifier if you have one (optional)."}
            </DialogDescription>
          </DialogHeader>

          {/* Step 0: Username */}
          {step === 0 && (
            <div className="space-y-3">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="e.g. silicon_sarah"
                value={username}
                onChange={(e) => setUsername(e.target.value.replace(/[^a-zA-Z0-9_-]/g, "").toLowerCase())}
                className="bg-background rounded-lg"
              />
              <p className="text-xs text-muted-foreground">
                Lowercase letters, numbers, hyphens and underscores only. Min 3 characters.
              </p>
            </div>
          )}

          {/* Step 1: Name & Email */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullname">Full Name</Label>
                <Input
                  id="fullname"
                  placeholder="Your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-background rounded-lg"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-background rounded-lg"
                />
              </div>
            </div>
          )}

          {/* Step 2: Organisations */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="independent"
                  checked={isIndependent}
                  onCheckedChange={(checked) => {
                    setIsIndependent(!!checked);
                    if (checked) setSelectedOrgs([]);
                  }}
                />
                <Label htmlFor="independent" className="cursor-pointer">
                  I'm an independent researcher / hobbyist
                </Label>
              </div>

              <div
                className={cn(
                  "max-h-52 overflow-y-auto space-y-1 pr-1 transition-opacity",
                  isIndependent && "opacity-40 pointer-events-none"
                )}
              >
                {partners.map((org) => (
                  <button
                    key={org.id}
                    type="button"
                    onClick={() => toggleOrg(org.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-sm transition-colors",
                      selectedOrgs.includes(org.id)
                        ? "bg-primary/10 text-foreground border border-primary/30"
                        : "hover:bg-muted/60 border border-transparent"
                    )}
                  >
                    <div
                      className={cn(
                        "w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-colors",
                        selectedOrgs.includes(org.id)
                          ? "bg-primary border-primary"
                          : "border-border"
                      )}
                    >
                      {selectedOrgs.includes(org.id) && (
                        <Check className="h-3 w-3 text-primary-foreground" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{org.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">{org.type}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: ORCID */}
          {step === 3 && (
            <div className="space-y-3">
              <Label htmlFor="orcid">ORCID iD</Label>
              <Input
                id="orcid"
                placeholder="0000-0000-0000-0000"
                value={orcid}
                onChange={(e) => setOrcid(e.target.value)}
                className="bg-background rounded-lg"
              />
              <p className="text-xs text-muted-foreground">
                Your 16-digit ORCID identifier. Don't have one?{" "}
                <a
                  href="https://orcid.org/register"
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary hover:underline"
                >
                  Register at orcid.org
                </a>
              </p>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setStep((s) => s - 1)}
              disabled={step === 0}
              className="rounded-full"
            >
              <ArrowLeft className="h-4 w-4 mr-1" /> Back
            </Button>

            {step < STEPS.length - 1 ? (
              <Button
                size="sm"
                onClick={() => setStep((s) => s + 1)}
                disabled={!canNext()}
                className="rounded-full px-5"
              >
                Next <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={handleSubmit}
                className="rounded-full px-5"
              >
                Join SoC Labs <Check className="h-4 w-4 ml-1" />
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JoinCommunityDialog;
