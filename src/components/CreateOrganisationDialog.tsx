import { useState } from "react";
import { Plus, Building2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

const orgSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  type: z.enum(["academic", "industry"]),
  country: z.string().trim().min(2, "Country is required").max(100),
  description: z.string().trim().min(10, "Description must be at least 10 characters").max(500),
  url: z.string().trim().url("Must be a valid URL").or(z.literal("")),
  email: z.string().trim().email("Must be a valid email").max(255),
});

interface CreateOrganisationDialogProps {
  onCreated?: () => void;
}

const CreateOrganisationDialog = ({ onCreated }: CreateOrganisationDialogProps) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [type, setType] = useState<"academic" | "industry">("academic");
  const [country, setCountry] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const resetForm = () => {
    setName("");
    setType("academic");
    setCountry("");
    setDescription("");
    setUrl("");
    setEmail("");
    setErrors({});
  };

  const handleSubmit = async () => {
    const result = orgSchema.safeParse({ name, type, country, description, url, email });
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0] as string] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase.from("organisations").insert({
        name: result.data.name,
        type: result.data.type,
        country: result.data.country,
        description: result.data.description,
        url: result.data.url,
        email: result.data.email,
        created_by: user.id,
        verified: false,
      });
      if (error) throw error;

      toast({
        title: "Organisation submitted!",
        description: "Your organisation will be visible after email verification.",
      });
      resetForm();
      setOpen(false);
      onCreated?.();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) resetForm(); }}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="rounded-full">
          <Plus className="h-3.5 w-3.5 mr-1.5" /> Create Organisation
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" /> Create New Organisation
          </DialogTitle>
          <DialogDescription>
            Submit a new organisation. It will require verification before appearing publicly.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div>
            <Label className="text-xs">Organisation Name *</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. University of Oxford" />
            {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
          </div>
          <div>
            <Label className="text-xs">Type *</Label>
            <Select value={type} onValueChange={(v) => setType(v as "academic" | "industry")}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover border border-border shadow-md z-50">
                <SelectItem value="academic">Academic</SelectItem>
                <SelectItem value="industry">Industry</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">Country *</Label>
            <Input value={country} onChange={(e) => setCountry(e.target.value)} placeholder="e.g. United Kingdom" />
            {errors.country && <p className="text-xs text-destructive mt-1">{errors.country}</p>}
          </div>
          <div>
            <Label className="text-xs">Description *</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Brief description of the organisation..." rows={3} />
            {errors.description && <p className="text-xs text-destructive mt-1">{errors.description}</p>}
          </div>
          <div>
            <Label className="text-xs">Verification Email *</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@organisation.edu" />
            <p className="text-xs text-muted-foreground mt-1">An institutional email for verification purposes</p>
            {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
          </div>
          <div>
            <Label className="text-xs">Website URL</Label>
            <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://www.organisation.edu" />
            {errors.url && <p className="text-xs text-destructive mt-1">{errors.url}</p>}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> : null}
            Submit for Verification
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateOrganisationDialog;
