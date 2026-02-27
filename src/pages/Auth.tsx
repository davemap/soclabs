import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowLeft, Cpu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";
import JoinCommunityDialog from "@/components/JoinCommunityDialog";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [joinOpen, setJoinOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const [showResend, setShowResend] = useState(false);
  const [resending, setResending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setShowResend(false);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        if (error.message?.toLowerCase().includes("email not confirmed")) {
          setShowResend(true);
        }
        throw error;
      }
      toast({ title: "Welcome back!", description: "You've signed in successfully." });
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!email) return;
    setResending(true);
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email,
      });
      if (error) throw error;
      toast({ title: "Verification email sent", description: "Please check your inbox and verify your email." });
      setShowResend(false);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setResending(false);
    }
  };

  return (
    <Layout>
      <section className="py-24 min-h-[80vh] flex items-center">
        <div className="container mx-auto px-4 max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="text-center mb-8">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Cpu className="h-6 w-6 text-primary" />
              </div>
              <h1 className="text-2xl font-display font-bold mb-2">Welcome Back</h1>
              <p className="text-sm text-muted-foreground">
                Sign in to your SoC Labs account
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                    minLength={6}
                  />
                </div>
              </div>

              {showResend && (
                <div className="rounded-lg border border-border bg-muted/50 p-3 text-sm text-muted-foreground">
                  <p className="mb-2">Your email hasn't been verified yet.</p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full rounded-full"
                    onClick={handleResendVerification}
                    disabled={resending}
                  >
                    {resending ? "Sending..." : "Resend verification email"}
                  </Button>
                </div>
              )}

              <Button type="submit" className="w-full rounded-full" disabled={loading}>
                {loading ? "Please wait..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <button
                onClick={() => setJoinOpen(true)}
                className="text-primary hover:underline font-medium"
              >
                Join the Community
              </button>
            </div>

            <div className="mt-4 text-center">
              <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-3 w-3" /> Back
              </button>
            </div>
          </motion.div>
        </div>
      </section>
      <JoinCommunityDialog open={joinOpen} onOpenChange={setJoinOpen} />
    </Layout>
  );
};

export default Auth;
