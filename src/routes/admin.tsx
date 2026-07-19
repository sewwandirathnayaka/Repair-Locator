import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Users,
  Wrench,
  CheckCircle2,
  XCircle,
  Clock,
  FileText,
  MapPin,
  Phone,
  Trash2,
  Activity,
} from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext";
import {
  getPendingGaragesFn,
  getAllGaragesFn,
  approveGarageFn,
  rejectGarageFn,
  deleteGarageFn,
  getAllHelpRequestsFn,
  deleteHelpRequestFn,
} from "@/server-fns/db";
import { toast } from "sonner";
import type { Garage, HelpRequest } from "@/types";

export const Route = createFileRoute("/admin")({ component: AdminDashboard });

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Users;
  label: string;
  value: string | number;
}) {
  return (
    <div className="surface-elevated rounded-xl p-4 sm:p-5 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-2 sm:mb-4">
        <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg gold-gradient shrink-0">
          <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-background" />
        </div>
        <p className="text-2xl sm:text-3xl font-bold">{value}</p>
      </div>
      <p className="text-xs sm:text-sm text-muted-foreground leading-tight">{label}</p>
    </div>
  );
}

function AdminDashboard() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const [pendingGarages, setPendingGarages] = useState<Garage[]>([]);
  const [allGarages, setAllGarages] = useState<Garage[]>([]);
  const [helpRequests, setHelpRequests] = useState<HelpRequest[]>([]);
  const [fetching, setFetching] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [viewNvq, setViewNvq] = useState<Garage | null>(null);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/login", replace: true });
    else if (!loading && user?.role !== "admin") navigate({ to: "/dashboard", replace: true });
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!user || user.role !== "admin") return;

    const unwrap = <T,>(r: unknown): T[] => {
      if (Array.isArray(r)) return r as T[];
      if (
        r &&
        typeof r === "object" &&
        "data" in r &&
        Array.isArray((r as Record<string, unknown>).data)
      )
        return (r as Record<string, unknown>).data as T[];
      return [];
    };

    Promise.all([
      getPendingGaragesFn({ data: undefined }),
      getAllGaragesFn({ data: undefined }),
      getAllHelpRequestsFn({ data: undefined }),
    ])
      .then(([pending, all, reqs]) => {
        setPendingGarages(unwrap<Garage>(pending));
        setAllGarages(unwrap<Garage>(all));
        setHelpRequests(unwrap<HelpRequest>(reqs));
      })
      .catch((err) => {
        console.error("Admin fetch error:", err);
        toast.error("Failed to load admin data.");
      })
      .finally(() => setFetching(false));
  }, [user]);

  async function handleApprove(garageId: string) {
    setActionLoading(garageId + "_approve");
    try {
      await approveGarageFn({ data: { garageId } });
      toast.success("Garage approved! It is now live on the map.");
      setPendingGarages((p) => p.filter((g) => g.id !== garageId));
      setAllGarages((a) => a.map((g) => (g.id === garageId ? { ...g, status: "approved" } : g)));
    } catch {
      toast.error("Failed to approve. Try again.");
    } finally {
      setActionLoading(null);
    }
  }

  async function handleReject(garageId: string) {
    setActionLoading(garageId + "_reject");
    try {
      await rejectGarageFn({ data: { garageId, reason: "Does not meet requirements" } });
      toast.success("Garage rejected.");
      setPendingGarages((p) => p.filter((g) => g.id !== garageId));
      setAllGarages((a) => a.map((g) => (g.id === garageId ? { ...g, status: "rejected" } : g)));
    } catch {
      toast.error("Failed to reject. Try again.");
    } finally {
      setActionLoading(null);
    }
  }

  async function handleDeleteGarage(garageId: string) {
    if (
      !confirm("Are you sure you want to completely delete this mechanic? This cannot be undone.")
    )
      return;
    setActionLoading(garageId + "_delete");
    try {
      await deleteGarageFn({ data: { garageId } });
      toast.success("Mechanic deleted successfully.");
      setPendingGarages((p) => p.filter((g) => g.id !== garageId));
      setAllGarages((a) => a.filter((g) => g.id !== garageId));
    } catch {
      toast.error("Failed to delete mechanic.");
    } finally {
      setActionLoading(null);
    }
  }

  async function handleDeleteRequest(requestId: string) {
    if (!confirm("Are you sure you want to delete this help request?")) return;
    setActionLoading(requestId + "_delete");
    try {
      await deleteHelpRequestFn({ data: { requestId } });
      toast.success("Help request deleted.");
      setHelpRequests((r) => r.filter((x) => x.id !== requestId));
    } catch {
      toast.error("Failed to delete request.");
    } finally {
      setActionLoading(null);
    }
  }

  if (!user) return null;

  const approvedCount = allGarages.filter((g) => g.status === "approved").length;
  const rejectedCount = allGarages.filter((g) => g.status === "rejected").length;

  const ownersMap = new Map<
    string,
    { id: string; name: string; phone: string; requests: number }
  >();
  helpRequests.forEach((req) => {
    const existing = ownersMap.get(req.ownerId) || {
      id: req.ownerId,
      name: req.ownerName,
      phone: req.ownerPhone,
      requests: 0,
    };
    existing.requests++;
    ownersMap.set(req.ownerId, existing);
  });
  const ownersList = Array.from(ownersMap.values());

  return (
    <div className="min-h-screen bg-background pb-20">
      <AppHeader />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-wider text-gold">Admin Console</p>
          <h1 className="mt-1 text-3xl font-bold sm:text-4xl">Platform Overview</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Kurunegala Area — Repair Locator Admin
          </p>
        </div>

        {/* Stats */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <StatCard icon={Clock} label="Pending Apps" value={pendingGarages.length} />
          <StatCard icon={CheckCircle2} label="Approved" value={approvedCount} />
          <StatCard icon={Activity} label="Requests" value={helpRequests.length} />
          <StatCard icon={Users} label="Owners" value={ownersList.length} />
        </div>

        <Tabs defaultValue="mechanics" className="w-full">
          <TabsList className="mb-6 grid w-full grid-cols-3 bg-muted/50 p-1">
            <TabsTrigger
              value="mechanics"
              className="text-[10px] sm:text-sm data-[state=active]:gold-gradient data-[state=active]:text-background"
            >
              Mechanics
            </TabsTrigger>
            <TabsTrigger
              value="owners"
              className="text-[10px] sm:text-sm data-[state=active]:gold-gradient data-[state=active]:text-background"
            >
              Owners
            </TabsTrigger>
            <TabsTrigger
              value="works"
              className="text-[10px] sm:text-sm data-[state=active]:gold-gradient data-[state=active]:text-background"
            >
              Works
            </TabsTrigger>
          </TabsList>

          <TabsContent value="mechanics" className="space-y-8 animate-in fade-in-50 duration-500">
            {/* Pending Applications */}
            <section className="surface-elevated rounded-2xl p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Clock className="h-5 w-5 text-gold" /> Pending Applications
                </h2>
                <Badge variant="outline" className="border-gold/40 text-gold">
                  {pendingGarages.length} pending
                </Badge>
              </div>

              {fetching ? (
                <div className="space-y-3">
                  {[1, 2].map((n) => (
                    <div key={n} className="animate-pulse h-24 rounded-xl bg-muted/40" />
                  ))}
                </div>
              ) : pendingGarages.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <CheckCircle2 className="mb-3 h-8 w-8 opacity-30" />
                  <p className="text-sm">No pending applications</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingGarages.map((g) => (
                    <div
                      key={g.id}
                      className="rounded-xl border border-border bg-background/40 p-4"
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2">
                            <Wrench className="h-4 w-4 text-gold shrink-0" />
                            <span className="font-semibold">{g.name}</span>
                            <Badge variant="secondary" className="text-xs">
                              {g.specialty}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <MapPin className="h-3 w-3 shrink-0" /> {g.address}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Phone className="h-3 w-3 shrink-0" /> {g.phone}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Users className="h-3 w-3 shrink-0" /> {g.totalMechanics} mechanic(s) ·
                            Submitted{" "}
                            {g.createdAt ? new Date(g.createdAt).toLocaleDateString() : "recently"}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          {g.nvqCertificateBase64 && (
                            <Button size="sm" variant="outline" onClick={() => setViewNvq(g)}>
                              <FileText className="mr-1 h-4 w-4" /> View NVQ
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-destructive/50 text-destructive hover:bg-destructive/10"
                            disabled={!!actionLoading}
                            onClick={() => handleReject(g.id)}
                          >
                            <XCircle className="mr-1 h-4 w-4" /> Reject
                          </Button>
                          <Button
                            size="sm"
                            className="gold-gradient text-background"
                            disabled={!!actionLoading}
                            onClick={() => handleApprove(g.id)}
                          >
                            <CheckCircle2 className="mr-1 h-4 w-4" /> Approve
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* All Garages */}
            <section className="surface-elevated rounded-2xl p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Wrench className="h-5 w-5 text-gold" /> All Registered Mechanics
                </h2>
                <span className="text-xs text-muted-foreground">{allGarages.length} total</span>
              </div>
              <div className="space-y-3">
                {fetching ? (
                  [1, 2, 3].map((n) => (
                    <div key={n} className="animate-pulse h-16 rounded-xl bg-muted/40" />
                  ))
                ) : allGarages.length === 0 ? (
                  <p className="py-8 text-center text-sm text-muted-foreground">
                    No mechanics registered yet.
                  </p>
                ) : (
                  allGarages.map((g) => (
                    <div
                      key={g.id}
                      className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between rounded-lg border border-border bg-background/40 p-4"
                    >
                      <div>
                        <div className="font-medium text-sm flex items-center gap-2">
                          {g.name}
                          <Badge
                            variant={
                              g.status === "approved"
                                ? "default"
                                : g.status === "rejected"
                                  ? "destructive"
                                  : "secondary"
                            }
                            className={
                              g.status === "approved"
                                ? "gold-gradient text-background border-0 text-[10px]"
                                : "text-[10px]"
                            }
                          >
                            {g.status}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {g.specialty} · {g.address} · {g.phone}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {g.availableMechanics}/{g.totalMechanics} available
                        </span>
                        <Button
                          size="icon"
                          variant="destructive"
                          className="h-8 w-8 shrink-0"
                          disabled={!!actionLoading}
                          onClick={() => handleDeleteGarage(g.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          </TabsContent>

          <TabsContent value="owners" className="animate-in fade-in-50 duration-500">
            <section className="surface-elevated rounded-2xl p-6">
              <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
                <Users className="h-5 w-5 text-gold" /> Vehicle Owners
              </h2>
              <p className="text-sm text-muted-foreground mb-6">
                List of users who have submitted help requests on the platform.
              </p>

              <div className="space-y-3">
                {ownersList.length === 0 ? (
                  <p className="py-8 text-center text-sm text-muted-foreground">
                    No vehicle owners found yet.
                  </p>
                ) : (
                  ownersList.map((owner) => (
                    <div
                      key={owner.id}
                      className="flex items-center justify-between rounded-lg border border-border bg-background/40 p-4"
                    >
                      <div>
                        <div className="font-medium text-sm">{owner.name}</div>
                        <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                          <Phone className="h-3 w-3" /> {owner.phone}
                        </div>
                      </div>
                      <Badge variant="secondary" className="bg-gold/10 text-gold hover:bg-gold/20">
                        {owner.requests} Request(s)
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </section>
          </TabsContent>

          <TabsContent value="works" className="animate-in fade-in-50 duration-500">
            <section className="surface-elevated rounded-2xl p-6">
              <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
                <Activity className="h-5 w-5 text-gold" /> Ongoing Works & Requests
              </h2>

              <div className="space-y-4 mt-6">
                {helpRequests.length === 0 ? (
                  <p className="py-8 text-center text-sm text-muted-foreground">
                    No help requests found.
                  </p>
                ) : (
                  helpRequests.map((req) => (
                    <div
                      key={req.id}
                      className="relative rounded-xl border border-border bg-background/40 p-5"
                    >
                      <div className="flex flex-col sm:flex-row gap-4 sm:justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm">{req.description}</span>
                            <Badge
                              variant="outline"
                              className={
                                req.status === "accepted"
                                  ? "border-gold text-gold"
                                  : req.status === "pending"
                                    ? "border-orange-400 text-orange-400"
                                    : req.status === "done"
                                      ? "border-green-400 text-green-400"
                                      : "border-red-400 text-red-400"
                              }
                            >
                              {req.status}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-xs text-muted-foreground">
                            <div>
                              <strong className="text-foreground/70">Owner:</strong> {req.ownerName}{" "}
                              ({req.ownerPhone})
                            </div>
                            {req.acceptedByGarageId && (
                              <div>
                                <strong className="text-foreground/70">Mechanic:</strong>{" "}
                                {allGarages.find((g) => g.id === req.acceptedByGarageId)?.name ||
                                  req.acceptedByGarageId}
                              </div>
                            )}
                            <div className="sm:col-span-2">
                              <strong className="text-foreground/70">Time:</strong>{" "}
                              {new Date(req.createdAt).toLocaleString()}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center sm:items-start justify-end">
                          <Button
                            size="sm"
                            variant="destructive"
                            className="h-8 shrink-0 flex items-center gap-1.5"
                            disabled={!!actionLoading}
                            onClick={() => handleDeleteRequest(req.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5" /> Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          </TabsContent>
        </Tabs>
      </main>

      {/* NVQ Preview Modal */}
      {viewNvq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="surface-elevated w-full max-w-lg rounded-2xl p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold">NVQ Certificate — {viewNvq.name}</h3>
              <Button variant="ghost" size="sm" onClick={() => setViewNvq(null)}>
                ✕
              </Button>
            </div>
            {viewNvq.nvqCertificateBase64?.startsWith("data:image") ? (
              <img
                src={viewNvq.nvqCertificateBase64}
                alt="NVQ Certificate"
                className="w-full rounded-xl border border-border"
              />
            ) : viewNvq.nvqCertificateBase64?.startsWith("data:application/pdf") ? (
              <div className="flex flex-col items-center gap-3 py-8 text-muted-foreground">
                <FileText className="h-12 w-12" />
                <p className="text-sm">PDF Certificate</p>
                <a
                  href={viewNvq.nvqCertificateBase64}
                  download={viewNvq.nvqCertificateName || "nvq-certificate.pdf"}
                  className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
                >
                  Download Certificate
                </a>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                {viewNvq.nvqCertificateName || "No certificate uploaded"}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
