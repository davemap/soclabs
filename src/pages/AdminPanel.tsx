import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Shield, Trash2, UserPlus, UserMinus, Building2, PenLine, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import Layout from "@/components/Layout";
import { useAuth } from "@/hooks/useAuth";
import { useUserRoles } from "@/hooks/useUserRoles";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AuthUser {
  id: string;
  email?: string;
  created_at?: string;
  user_metadata?: { full_name?: string; username?: string };
}

interface RoleEntry {
  id: string;
  user_id: string;
  role: string;
}

interface Organisation {
  id: string;
  name: string;
  type: string;
  country?: string;
  verified: boolean;
  created_at: string;
}

const AdminPanel = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { hasRole, loading: rolesLoading } = useUserRoles();

  const [users, setUsers] = useState<AuthUser[]>([]);
  const [roles, setRoles] = useState<RoleEntry[]>([]);
  const [orgs, setOrgs] = useState<Organisation[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const isAdmin = hasRole("admin");

  const callAdmin = useCallback(async (action: string, params: Record<string, string> = {}) => {
    const { data, error } = await supabase.functions.invoke("admin-actions", {
      body: { action, ...params },
    });
    if (error) throw new Error(error.message);
    if (data?.error) throw new Error(data.error);
    return data;
  }, []);

  const fetchAll = useCallback(async () => {
    if (!isAdmin) return;
    setLoadingData(true);
    try {
      const [usersRes, rolesRes, orgsRes] = await Promise.all([
        callAdmin("list_users"),
        callAdmin("list_roles"),
        callAdmin("list_organisations"),
      ]);
      setUsers(usersRes.users || []);
      setRoles(rolesRes.roles || []);
      setOrgs(orgsRes.organisations || []);
    } catch (err: any) {
      toast.error("Failed to load admin data: " + err.message);
    }
    setLoadingData(false);
  }, [isAdmin, callAdmin]);

  useEffect(() => {
    if (!rolesLoading && isAdmin) fetchAll();
  }, [rolesLoading, isAdmin, fetchAll]);

  const getUserRoles = (userId: string) => roles.filter((r) => r.user_id === userId);

  const handleAction = async (actionName: string, actionFn: () => Promise<void>) => {
    setActionLoading(actionName);
    try {
      await actionFn();
      await fetchAll();
    } catch (err: any) {
      toast.error(err.message);
    }
    setActionLoading(null);
  };

  if (authLoading || rolesLoading) {
    return (
      <Layout>
        <div className="py-32 text-center text-muted-foreground">Loading...</div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <div className="py-32 text-center">
          <h1 className="text-2xl font-display font-bold mb-4">Sign in required</h1>
          <Button onClick={() => navigate("/auth")}>Sign In</Button>
        </div>
      </Layout>
    );
  }

  if (!isAdmin) {
    return (
      <Layout>
        <div className="py-32 text-center">
          <h1 className="text-2xl font-display font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-4">You need administrator privileges to access this panel.</p>
          <Button variant="outline" onClick={() => navigate("/profile")}>Back to Profile</Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <button onClick={() => navigate("/profile")} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-8">
              <ArrowLeft className="h-4 w-4" /> Back to Profile
            </button>

            <div className="flex items-center gap-3 mb-2">
              <Shield className="h-7 w-7 text-primary" />
              <h1 className="text-3xl font-display font-bold">Admin Panel</h1>
            </div>
            <p className="text-muted-foreground mb-8">Manage users, roles, and organisations.</p>

            <Tabs defaultValue="users">
              <TabsList className="mb-6">
                <TabsTrigger value="users">Users</TabsTrigger>
                <TabsTrigger value="organisations">Organisations</TabsTrigger>
              </TabsList>

              <div className="flex justify-end mb-4">
                <Button variant="outline" size="sm" onClick={fetchAll} disabled={loadingData}>
                  <RefreshCw className={`h-4 w-4 mr-1 ${loadingData ? "animate-spin" : ""}`} /> Refresh
                </Button>
              </div>

              <TabsContent value="users">
                {loadingData ? (
                  <div className="text-center py-12 text-muted-foreground">Loading users...</div>
                ) : (
                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>User</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Roles</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {users.map((u) => {
                          const userRoles = getUserRoles(u.id);
                          const name = u.user_metadata?.full_name || u.user_metadata?.username || "—";
                          const isSelf = u.id === user.id;
                          return (
                            <TableRow key={u.id}>
                              <TableCell className="font-medium">
                                {name}
                                {isSelf && <Badge variant="outline" className="ml-2 text-xs">You</Badge>}
                              </TableCell>
                              <TableCell className="text-muted-foreground text-sm">{u.email}</TableCell>
                              <TableCell>
                                <div className="flex flex-wrap gap-1">
                                  {userRoles.map((r) => (
                                    <Badge key={r.id} variant={r.role === "admin" ? "default" : "secondary"} className="text-xs">
                                      {r.role}
                                    </Badge>
                                  ))}
                                  {userRoles.length === 0 && <span className="text-xs text-muted-foreground">—</span>}
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex gap-1 justify-end flex-wrap">
                                  {/* Grant/Revoke Admin */}
                                  {userRoles.some((r) => r.role === "admin") ? (
                                    !isSelf && (
                                      <Button
                                        variant="outline" size="sm"
                                        disabled={actionLoading !== null}
                                        onClick={() => handleAction(`revoke-admin-${u.id}`, () => callAdmin("revoke_role", { userId: u.id, role: "admin" }))}
                                      >
                                        <UserMinus className="h-3 w-3 mr-1" /> Revoke Admin
                                      </Button>
                                    )
                                  ) : (
                                    <Button
                                      variant="outline" size="sm"
                                      disabled={actionLoading !== null}
                                      onClick={() => handleAction(`grant-admin-${u.id}`, () => callAdmin("grant_role", { userId: u.id, role: "admin" }))}
                                    >
                                      <Shield className="h-3 w-3 mr-1" /> Make Admin
                                    </Button>
                                  )}

                                  {/* Grant/Revoke News Writer */}
                                  {userRoles.some((r) => r.role === "news_writer") ? (
                                    <Button
                                      variant="outline" size="sm"
                                      disabled={actionLoading !== null}
                                      onClick={() => handleAction(`revoke-nw-${u.id}`, () => callAdmin("revoke_role", { userId: u.id, role: "news_writer" }))}
                                    >
                                      <UserMinus className="h-3 w-3 mr-1" /> Revoke Writer
                                    </Button>
                                  ) : (
                                    <Button
                                      variant="outline" size="sm"
                                      disabled={actionLoading !== null}
                                      onClick={() => handleAction(`grant-nw-${u.id}`, () => callAdmin("grant_role", { userId: u.id, role: "news_writer" }))}
                                    >
                                      <PenLine className="h-3 w-3 mr-1" /> Grant Writer
                                    </Button>
                                  )}

                                  {/* Delete User */}
                                  {!isSelf && (
                                    <AlertDialog>
                                      <AlertDialogTrigger asChild>
                                        <Button variant="destructive" size="sm" disabled={actionLoading !== null}>
                                          <Trash2 className="h-3 w-3 mr-1" /> Delete
                                        </Button>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent>
                                        <AlertDialogHeader>
                                          <AlertDialogTitle>Delete user account?</AlertDialogTitle>
                                          <AlertDialogDescription>
                                            This will permanently delete <strong>{u.email}</strong>'s account, profile, and all associated roles. This action cannot be undone.
                                          </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                                          <AlertDialogAction
                                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                            onClick={() => handleAction(`delete-user-${u.id}`, () => callAdmin("delete_user", { userId: u.id }))}
                                          >
                                            Delete Account
                                          </AlertDialogAction>
                                        </AlertDialogFooter>
                                      </AlertDialogContent>
                                    </AlertDialog>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="organisations">
                {loadingData ? (
                  <div className="text-center py-12 text-muted-foreground">Loading organisations...</div>
                ) : (
                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Country</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orgs.map((org) => (
                          <TableRow key={org.id}>
                            <TableCell className="font-medium">{org.name}</TableCell>
                            <TableCell className="text-sm text-muted-foreground capitalize">{org.type}</TableCell>
                            <TableCell className="text-sm text-muted-foreground">{org.country || "—"}</TableCell>
                            <TableCell>
                              <Badge variant={org.verified ? "default" : "secondary"} className="text-xs">
                                {org.verified ? "Verified" : "Unverified"}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="destructive" size="sm" disabled={actionLoading !== null}>
                                    <Trash2 className="h-3 w-3 mr-1" /> Delete
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete organisation?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This will permanently delete <strong>{org.name}</strong> and all its join requests. This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                      onClick={() => handleAction(`delete-org-${org.id}`, () => callAdmin("delete_organisation", { orgId: org.id }))}
                                    >
                                      Delete Organisation
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </TableCell>
                          </TableRow>
                        ))}
                        {orgs.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center text-muted-foreground py-8">No organisations found.</TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default AdminPanel;
