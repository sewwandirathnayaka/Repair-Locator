import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, useRef } from "react";
import {
  Wrench,
  MapPin,
  Phone,
  Users,
  ToggleLeft,
  ToggleRight,
  Star,
  Bell,
  Navigation,
  CheckCircle2,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import { useGeolocation } from "@/hooks/useGeolocation";
import {
  getMyGarageFn,
  updateGarageAvailabilityFn,
  getActiveRequestsFn,
  updateHelpRequestFn,
  updateMechanicLocationFn,
  getGarageIncomeFn,
} from "@/server-fns/db";
import { toast } from "sonner";
import type { Garage, HelpRequest } from "@/types";
import { KURUNEGALA_CENTER } from "@/types";

export const Route = createFileRoute("/mechanic/dashboard")({ component: MechanicDashboardPage });

function MechanicDashboardPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [garage, setGarage] = useState<Garage | null>(null);
  const [fetching, setFetching] = useState(true);
  const [saving, setSaving] = useState(false);
  const [available, setAvailable] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  // Help requests & Billing
  const [helpRequests, setHelpRequests] = useState<HelpRequest[]>([]);
  const [prevCount, setPrevCount] = useState(0);
  const [acceptingId, setAcceptingId] = useState<string | null>(null);
  const notifiedIds = useRef<Set<string>>(new Set());

  const [totalIncome, setTotalIncome] = useState(0);
  const [completingRequest, setCompletingRequest] = useState<HelpRequest | null>(null);
  const [repairCost, setRepairCost] = useState("");

  // Real-time location of the mechanic's device
  const { coords: mechanicCoords } = useGeolocation(KURUNEGALA_CENTER);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/login", replace: true });
    if (!loading && user?.role === "owner") navigate({ to: "/dashboard", replace: true });
    if (!loading && user?.role === "admin") navigate({ to: "/admin", replace: true });
  }, [user, loading, navigate]);

  // Load garage info
  useEffect(() => {
    if (!user) return;
    getMyGarageFn({ data: { clerkId: user.id } })
      .then((g) => {
        if (!g) {
          navigate({ to: "/mechanic/register", replace: true });
        } else if (g.status !== "approved") {
          navigate({ to: "/mechanic/pending", replace: true });
        } else {
          setGarage(g);
          setAvailable(g.availableMechanics ?? 0);
          setIsOpen(g.open ?? false);
          getGarageIncomeFn({ data: { garageId: g.id } })
            .then(setTotalIncome)
            .catch(() => {});
        }
      })
      .catch(() => {})
      .finally(() => setFetching(false));
  }, [user, navigate]);

  // Poll for help requests every 5 seconds
  useEffect(() => {
    if (!garage) return;
    const poll = () => {
      getActiveRequestsFn({
        data: { garageId: garage.id, garageLat: garage.lat, garageLng: garage.lng },
      })
        .then((reqs) => {
          const incoming = reqs.filter(
            (r) => r.status === "pending" && !notifiedIds.current.has(r.id),
          );
          if (incoming.length > 0) {
            incoming.forEach((r) => {
              notifiedIds.current.add(r.id);
              toast(
                `🚨 New help request! ${r.ownerName} needs assistance — ${r.distanceKm?.toFixed(1) ?? "?"}km away`,
                {
                  duration: 10000,
                  action: {
                    label: "View",
                    onClick: () => {
                      const el = document.getElementById("requests-section");
                      if (el) {
                        el.scrollIntoView({ behavior: "smooth" });
                        el.classList.add("ring-4", "ring-destructive", "bg-destructive/5");
                        setTimeout(() => {
                          el.classList.remove("ring-4", "ring-destructive", "bg-destructive/5");
                        }, 2000);
                        setTimeout(
                          () =>
                            window.scrollTo({
                              top: el.getBoundingClientRect().top + window.scrollY - 100,
                              behavior: "smooth",
                            }),
                          50,
                        );
                      }
                    },
                  },
                },
              );
            });
          }
          setHelpRequests(reqs);
          setPrevCount(reqs.length);
        })
        .catch(() => {});
    };
    poll();
    const timer = setInterval(poll, 5000);
    return () => clearInterval(timer);
  }, [garage]);

  // Live Location Tracker: push mechanic's location to server if there is an active accepted request
  useEffect(() => {
    const acceptedRequests = helpRequests.filter((r) => r.status === "accepted");
    if (acceptedRequests.length === 0) return;

    const pushLocation = () => {
      for (const req of acceptedRequests) {
        updateMechanicLocationFn({
          data: {
            requestId: req.id,
            lat: mechanicCoords.lat,
            lng: mechanicCoords.lng,
          },
        }).catch(() => {}); // silently fail if offline, will try again
      }
    };

    // Push immediately, then every 5 seconds
    pushLocation();
    const timer = setInterval(pushLocation, 5000);
    return () => clearInterval(timer);
  }, [helpRequests, mechanicCoords]);

  async function handleSave() {
    if (!garage) return;
    setSaving(true);
    try {
      const result = await updateGarageAvailabilityFn({
        data: { garageId: garage.id, availableMechanics: available, open: isOpen },
      });
      if (result?.success) {
        setGarage((g) => (g ? { ...g, availableMechanics: available, open: isOpen } : g));
        toast.success("Availability updated successfully!");
      } else {
        toast.error("Failed to update. Please try again.");
      }
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  async function handleAcceptRequest(req: HelpRequest) {
    if (!garage) return;
    if (req.status === "accepted") {
      setCompletingRequest(req);
      setRepairCost("");
      return;
    }

    setAcceptingId(req.id);
    try {
      const result = await updateHelpRequestFn({
        data: { requestId: req.id, status: "accepted", garageId: garage.id },
      });
      if (result?.success) {
        toast.success(`✅ You accepted the request from ${req.ownerName}`);
        setHelpRequests((prev) =>
          prev.map((r) =>
            r.id === req.id ? { ...r, status: "accepted", acceptedByGarageId: garage.id } : r,
          ),
        );
      } else {
        toast.error("Failed to accept request.");
      }
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setAcceptingId(null);
    }
  }

  async function submitCompletion(e: React.FormEvent) {
    e.preventDefault();
    if (!garage || !completingRequest) return;
    const cost = Number(repairCost);
    if (isNaN(cost) || cost < 0) {
      toast.error("Please enter a valid cost.");
      return;
    }

    setAcceptingId(completingRequest.id);
    try {
      const result = await updateHelpRequestFn({
        data: { requestId: completingRequest.id, status: "done", garageId: garage.id, cost },
      });
      if (result?.success) {
        toast.success(`🎉 Request completed! Billed ${cost} LKR.`);
        setHelpRequests((prev) => prev.filter((r) => r.id !== completingRequest.id));
        setTotalIncome((prev) => prev + cost);
        setCompletingRequest(null);
      } else {
        toast.error("Failed to complete request.");
      }
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setAcceptingId(null);
    }
  }

  if (loading || fetching) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gold/30 border-t-gold" />
          <p className="text-sm text-muted-foreground">Loading your garage...</p>
        </div>
      </div>
    );
  }

  if (!garage) return null;

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        {/* Header */}
        <div className="mb-8 flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm uppercase tracking-wider text-gold">Mechanic Dashboard</p>
            <h1 className="mt-1 text-3xl font-bold">{garage.name}</h1>
            <p className="mt-1 text-muted-foreground flex items-center gap-1 text-sm">
              <MapPin className="h-3 w-3" /> {garage.address}
            </p>
          </div>
          {/* Notification bell */}
          <button
            type="button"
            onClick={() => {
              if (helpRequests.length > 0) {
                const el = document.getElementById("requests-section");
                if (el) {
                  el.scrollIntoView({ behavior: "smooth" });
                  // Add a temporary highlight effect
                  el.classList.add("ring-4", "ring-destructive", "bg-destructive/5");
                  setTimeout(() => {
                    el.classList.remove("ring-4", "ring-destructive", "bg-destructive/5");
                  }, 2000);
                  setTimeout(
                    () =>
                      window.scrollTo({
                        top: el.getBoundingClientRect().top + window.scrollY - 100,
                        behavior: "smooth",
                      }),
                    50,
                  );
                }
              }
            }}
            className="relative hover:scale-105 transition-transform"
          >
            <div
              className={`flex h-11 w-11 items-center justify-center rounded-xl border ${helpRequests.length > 0 ? "border-destructive/50 bg-destructive/10 shadow-sm shadow-destructive/20" : "border-border bg-card"}`}
            >
              <Bell
                className={`h-5 w-5 ${helpRequests.length > 0 ? "text-destructive animate-pulse" : "text-muted-foreground"}`}
              />
            </div>
            {helpRequests.length > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white shadow-sm">
                {helpRequests.length}
              </span>
            )}
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* ── Availability Controls ── */}
          <div className="surface-elevated rounded-2xl p-6 space-y-5">
            <h2 className="font-semibold text-lg flex items-center gap-2">
              <Wrench className="h-5 w-5 text-gold" /> Garage Status
            </h2>

            {/* Open / Closed toggle */}
            <div className="flex items-center justify-between rounded-xl border border-border p-4">
              <div>
                <p className="font-medium">Garage Open</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {isOpen ? "Accepting customers" : "Currently closed"}
                </p>
              </div>
              <button
                onClick={() => setIsOpen((v) => !v)}
                className="text-3xl transition-transform hover:scale-105"
                aria-label="Toggle open status"
              >
                {isOpen ? (
                  <ToggleRight className="h-9 w-9 text-primary" />
                ) : (
                  <ToggleLeft className="h-9 w-9 text-muted-foreground" />
                )}
              </button>
            </div>

            {/* Available mechanics stepper */}
            <div className="space-y-2">
              <label className="flex items-center gap-1 text-sm font-medium">
                <Users className="h-4 w-4 text-gold" />
                Available Mechanics Right Now
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setAvailable((v) => Math.max(0, v - 1))}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background text-xl font-bold hover:border-gold/40 hover:text-gold transition-colors"
                >
                  −
                </button>
                <div className="flex-1 rounded-lg border border-border bg-background py-2 text-center text-2xl font-bold">
                  {available}
                  <span className="text-sm font-normal text-muted-foreground ml-1">
                    / {garage.totalMechanics}
                  </span>
                </div>
                <button
                  onClick={() => setAvailable((v) => Math.min(garage.totalMechanics, v + 1))}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background text-xl font-bold hover:border-gold/40 hover:text-gold transition-colors"
                >
                  +
                </button>
              </div>
            </div>
            <Button className="w-full" size="lg" onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Update Availability"}
            </Button>
          </div>
        {/* ── Income & Garage Info ── */}
        <div className="space-y-6">
          <div className="surface-elevated rounded-2xl p-6 flex flex-col justify-center bg-gradient-to-br from-green-500/10 to-emerald-500/5 border border-green-500/20">
            <h2 className="font-semibold text-lg flex items-center gap-2 mb-2 text-green-600 dark:text-green-400">
              <span className="text-xl">💰</span> Total Earnings
            </h2>
            <p className="text-4xl font-bold text-green-600 dark:text-green-400 tracking-tight">
              Rs. {totalIncome.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground mt-2 opacity-80">
              from completed jobs on this platform
            </p>
          </div>

          <div className="surface-elevated rounded-2xl p-6 space-y-4">
            <h2 className="font-semibold text-lg flex items-center gap-2">
              <Star className="h-5 w-5 text-gold" /> Garage Details
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card shrink-0">
                  <Wrench className="h-4 w-4 text-gold" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Specialty</p>
                  <p className="font-medium">{garage.specialty}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card shrink-0">
                  <Phone className="h-4 w-4 text-gold" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="font-medium">{garage.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card shrink-0">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Status</p>
                  <Badge className="mt-0.5 border-primary/40 bg-primary/10 text-primary">
                    Approved ✓
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>

        {/* ── Active Help Requests ── */}
        <div id="requests-section" className="mt-6 surface-elevated rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Nearby Help Requests
            </h2>
            <span className="text-xs text-muted-foreground">Auto-refreshes every 5 seconds</span>
          </div>

          {helpRequests.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center text-muted-foreground">
              <Bell className="mb-3 h-8 w-8 opacity-25" />
              <p className="text-sm font-medium">No active requests right now</p>
              <p className="text-xs mt-1">
                When a vehicle owner nearby needs help, it will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {helpRequests.map((req) => {
                const isAccepted = req.status === "accepted";
                return (
                  <div
                    key={req.id}
                    className={`flex items-start gap-4 rounded-xl border p-4 ${
                      isAccepted
                        ? "border-primary/40 bg-primary/5"
                        : "border-destructive/30 bg-destructive/5"
                    }`}
                  >
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 ${
                        isAccepted
                          ? "border-primary/40 bg-primary/10 text-primary"
                          : "border-destructive/40 bg-destructive/10 text-destructive"
                      }`}
                    >
                      {isAccepted ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : (
                        <AlertTriangle className="h-5 w-5" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="font-semibold">{req.ownerName}</span>
                        {isAccepted && (
                          <Badge
                            variant="outline"
                            className="border-primary/50 text-primary text-[10px] h-5"
                          >
                            Accepted
                          </Badge>
                        )}
                        {req.distanceKm !== undefined && (
                          <span className="inline-flex items-center gap-1 rounded-full border border-gold/30 bg-gold/10 px-2 py-0.5 text-xs text-gold">
                            <Navigation className="h-3 w-3" /> {req.distanceKm.toFixed(1)} km away
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{req.description}</p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Phone className="h-3 w-3" /> {req.ownerPhone}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />{" "}
                          {new Date(req.createdAt).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 shrink-0">
                      <Button
                        size="sm"
                        className={
                          isAccepted
                            ? "bg-green-600 hover:bg-green-700 text-white"
                            : "bg-primary/90 hover:bg-primary text-primary-foreground"
                        }
                        disabled={acceptingId === req.id}
                        onClick={() => handleAcceptRequest(req)}
                      >
                        {acceptingId === req.id ? "..." : isAccepted ? "Complete" : "Accept"}
                      </Button>
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${req.lat},${req.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-1 rounded-md border border-border px-2 py-1 text-xs text-muted-foreground hover:border-gold/40 hover:text-gold transition-colors"
                      >
                        <Navigation className="h-3 w-3" /> Go
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* ── Billing Modal ── */}
      {completingRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <form
            onSubmit={submitCompletion}
            className="surface-elevated w-full max-w-sm rounded-2xl p-6 shadow-2xl animate-in fade-in-0 zoom-in-95"
          >
            <h3 className="font-semibold text-xl mb-3 flex items-center gap-2 text-gold">
              <CheckCircle2 className="h-6 w-6" /> Finish Repair
            </h3>
            <p className="text-sm text-muted-foreground mb-5">
              Enter the total repair cost for{" "}
              <strong className="text-foreground">{completingRequest.ownerName}</strong>. This will
              be sent as a digital bill to their device.
            </p>
            <div className="space-y-5">
              <div>
                <label className="text-sm font-medium mb-1 block">Repair Cost (LKR)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    Rs.
                  </span>
                  <input
                    type="number"
                    required
                    min="0"
                    value={repairCost}
                    onChange={(e) => setRepairCost(e.target.value)}
                    placeholder="2500"
                    className="w-full rounded-xl border border-border bg-background/50 pl-10 pr-4 py-3 font-semibold focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setCompletingRequest(null)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 gold-gradient text-background"
                  disabled={acceptingId === completingRequest.id}
                >
                  {acceptingId === completingRequest.id ? "Sending..." : "Send Bill"}
                </Button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
