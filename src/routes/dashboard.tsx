import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useState } from "react";
import {
  Search,
  Star,
  Phone,
  MapPin,
  Clock,
  Wrench,
  Navigation,
  Users,
  AlertTriangle,
  X,
  CheckCircle2,
  BellRing,
} from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { useMechanics } from "@/hooks/useMechanics";
import { useGeolocation } from "@/hooks/useGeolocation";
import { KURUNEGALA_CENTER } from "@/types";
import type { HelpRequest } from "@/types";
import {
  createHelpRequestFn,
  getMyHelpRequestFn,
  updateHelpRequestFn,
  closeHelpRequestFn,
} from "@/server-fns/db";
import { toast } from "sonner";
import { Receipt, Banknote } from "lucide-react";

// Lazy-load Leaflet map — prevents SSR crash ("window is not defined")
const LeafletMap = lazy(() =>
  import("@/components/LeafletMap").then((m) => ({ default: m.LeafletMap })),
);

export const Route = createFileRoute("/dashboard")({ component: OwnerDashboard });

function OwnerDashboard() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { state: geoState, coords: userCoords } = useGeolocation(KURUNEGALA_CENTER);
  const { data: mechanics = [], isLoading } = useMechanics(userCoords);
  const [selected, setSelected] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  // Help request state
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestForm, setRequestForm] = useState({ description: "", phone: "" });
  const [submittingRequest, setSubmittingRequest] = useState(false);
  const [activeRequest, setActiveRequest] = useState<HelpRequest | null>(null);

  // Set initial selected shop once mechanics load
  useEffect(() => {
    const first = mechanics?.[0];
    if (first?.id && !selected) {
      setSelected(first.id);
    }
  }, [mechanics, selected]);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/login", replace: true });
    else if (user?.role === "admin") navigate({ to: "/admin", replace: true });
    else if (user?.role === "mechanic") navigate({ to: "/mechanic/pending", replace: true });
  }, [user, loading, navigate]);

  // Poll for active help request every 10 seconds
  useEffect(() => {
    if (!user || user.role !== "owner") return;
    const check = () => {
      getMyHelpRequestFn({ data: { ownerId: user.id } })
        .then((r) => setActiveRequest(r ?? null))
        .catch(() => {});
    };
    check();
    const timer = setInterval(check, 10_000);
    return () => clearInterval(timer);
  }, [user]);

  if (!user) return null;

  let filtered = mechanics.filter(
    (m) =>
      !query ||
      m.name.toLowerCase().includes(query.toLowerCase()) ||
      m.specialty.toLowerCase().includes(query.toLowerCase()),
  );

  // If a request is accepted, only show the mechanic who accepted it
  if (activeRequest?.status === "accepted" && activeRequest.acceptedByGarageId) {
    filtered = mechanics
      .filter((m) => m.id === activeRequest.acceptedByGarageId)
      .map((m) => {
        if (activeRequest.mechanicLat && activeRequest.mechanicLng) {
          return { ...m, lat: activeRequest.mechanicLat, lng: activeRequest.mechanicLng };
        }
        return m;
      });
  }

  async function handleSubmitRequest(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    if (!requestForm.description.trim()) {
      toast.error("Please describe the problem");
      return;
    }
    setSubmittingRequest(true);
    try {
      const result = await createHelpRequestFn({
        data: {
          ownerId: user.id,
          ownerName: user.name,
          ownerPhone: requestForm.phone || "Not provided",
          description: requestForm.description,
          lat: userCoords.lat,
          lng: userCoords.lng,
        },
      });
      if (result?.success) {
        toast.success("🚨 Help request sent! Nearby mechanics will be notified.");
        setShowRequestModal(false);
        // Refresh active request
        const req = await getMyHelpRequestFn({ data: { ownerId: user.id } });
        setActiveRequest(req ?? null);
      } else {
        toast.error("Failed to send request. Try again.");
      }
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setSubmittingRequest(false);
    }
  }

  async function handleCancelRequest() {
    if (!activeRequest) return;
    try {
      await updateHelpRequestFn({ data: { requestId: activeRequest.id, status: "cancelled" } });
      toast.success("Request cancelled.");
      setActiveRequest(null);
    } catch {
      toast.error("Failed to cancel request.");
    }
  }

  async function handleCloseBill() {
    if (!activeRequest) return;
    try {
      await closeHelpRequestFn({ data: { requestId: activeRequest.id } });
      setActiveRequest(null);
    } catch {
      setActiveRequest(null); // hide it locally anyway
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="mx-auto max-w-7xl px-3 py-4 sm:px-6 sm:py-8">
        {/* Page header */}
        <div className="mb-4 flex flex-col-reverse items-start justify-between gap-4 sm:mb-6 sm:flex-row sm:flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <p className="text-xs uppercase tracking-wider text-gold sm:text-sm">Vehicle Owner</p>
              <span className="inline-flex items-center gap-1 rounded-full border border-gold/30 bg-gold/5 px-2 py-0.5 text-[10px] font-medium text-gold sm:text-xs">
                <MapPin className="h-3 w-3" /> Kurunegala Area
              </span>
            </div>
            <h1 className="mt-1 text-2xl font-bold sm:text-3xl lg:text-4xl">
              Hi {user.name.split(" ")[0]}, need a repair?
            </h1>
            <p className="mt-1 flex flex-col items-start gap-1 text-sm text-muted-foreground sm:mt-2 sm:flex-row sm:items-center sm:gap-2 sm:text-base">
              Showing verified mechanics near Kurunegala town.
              {geoState.status === "success" && (
                <span className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] text-primary sm:text-xs">
                  <Navigation className="h-3 w-3" /> Live location active
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Active request status banner */}
        {activeRequest?.status === "accepted" && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-primary/40 bg-primary/10 p-4">
            <CheckCircle2 className="h-6 w-6 text-primary shrink-0" />
            <div>
              <p className="font-semibold text-primary">A mechanic is on their way!</p>
              <p className="text-sm text-muted-foreground mt-0.5">
                Your request has been accepted. Please stay at your location.
              </p>
            </div>
          </div>
        )}

        {/* Search bar with Autocomplete Dropdown */}
        <div className="relative z-[2000] mb-4 flex flex-col gap-2 sm:mb-6 sm:flex-row sm:gap-3">
          <div className="relative flex-1">
            <div className="surface-elevated flex items-center rounded-xl px-2 py-0.5 sm:rounded-2xl">
              <Search className="ml-2 h-4 w-4 text-muted-foreground" />
              <Input
                id="mechanic-search"
                placeholder="Search by shop name or specialty (brakes, engine…)"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setShowSearchDropdown(true);
                }}
                onFocus={() => setShowSearchDropdown(true)}
                onBlur={() => setTimeout(() => setShowSearchDropdown(false), 200)} // delay to allow clicking results
                className="h-10 border-0 bg-transparent text-sm shadow-none focus-visible:ring-0 sm:h-11 sm:text-sm"
              />
            </div>

            {/* Search Results Dropdown Overlay */}
            {showSearchDropdown && query.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 max-h-[300px] overflow-y-auto rounded-xl border border-border bg-background p-2 shadow-2xl surface-elevated">
                {filtered.length === 0 ? (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    No garages found for "{query}"
                  </div>
                ) : (
                  filtered.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => {
                        setSelected(m.id);
                        setQuery(m.name);
                        setShowSearchDropdown(false);
                      }}
                      className="flex w-full flex-col gap-1 rounded-lg px-4 py-3 text-left transition-colors hover:bg-muted"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-foreground">{m.name}</span>
                        <span className="flex items-center gap-1 text-xs text-primary">
                          <Users className="h-3 w-3" /> {m.availableMechanics}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">{m.specialty}</span>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Main grid: map (left) + list (right) */}
        <div className="grid gap-6 lg:grid-cols-5">
          {/* ── Map ── */}
          <div className="lg:col-span-3">
            <Suspense
              fallback={
                <div className="animate-pulse rounded-xl border border-border bg-card sm:rounded-2xl h-[55vh] lg:h-[520px]" />
              }
            >
              <div className="relative h-[55vh] sm:h-[450px] lg:h-[520px] rounded-xl sm:rounded-2xl overflow-hidden shadow-sm">
                <LeafletMap
                  mechanics={filtered}
                  selectedId={selected}
                  onSelect={setSelected}
                  userCoords={userCoords}
                  activeRequest={activeRequest}
                  onRequestMechanic={() => setShowRequestModal(true)}
                />

                {/* We removed the floating button from here */}
              </div>
            </Suspense>

            {/* SOS / Status Section (Fixed at Bottom for Instant Visibility) */}
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[400] flex w-[90%] sm:w-auto justify-center">
              {!activeRequest ? (
                <div className="relative group w-full sm:w-auto">
                  {/* Animated Glow Behind the Button */}
                  <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-red-600 via-orange-500 to-red-600 opacity-70 blur-md group-hover:opacity-100 animate-pulse transition duration-500"></div>

                  <Button
                    id="request-mechanic-btn"
                    onClick={() => setShowRequestModal(true)}
                    size="lg"
                    className="relative flex items-center justify-center w-full sm:w-auto rounded-full border border-white/20 bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-2xl hover:scale-[1.02] active:scale-95 transition-all duration-300 text-sm sm:text-base px-6 py-4 font-extrabold overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-white/10 group-hover:bg-transparent transition-colors duration-300"></div>
                    <AlertTriangle className="h-5 w-5 mr-2 drop-shadow-md animate-bounce relative z-10" />
                    <span className="drop-shadow-md tracking-wider relative z-10">
                      REQUEST MECHANIC HELP
                    </span>
                  </Button>
                </div>
              ) : activeRequest.status === "done" ? (
                <div className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl border border-green-500/40 bg-green-500/10 px-6 py-4 shadow-sm">
                  <CheckCircle2 className="h-6 w-6 text-green-500" />
                  <span className="text-lg font-bold text-green-600 dark:text-green-400">
                    Repair Completed
                  </span>
                </div>
              ) : (
                <div className="flex w-full sm:w-auto items-center justify-between gap-4 rounded-2xl border border-destructive/40 bg-destructive/10 px-6 py-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <BellRing className="h-6 w-6 text-destructive animate-pulse" />
                    <span className="text-lg font-bold text-destructive">
                      {activeRequest.status === "pending"
                        ? "Request Pending..."
                        : "Request Accepted! 🎉"}
                    </span>
                  </div>
                  <button
                    onClick={handleCancelRequest}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-destructive/20 text-destructive hover:bg-destructive hover:text-white transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ── Mechanic list (Below Map fallback) ── */}
          <div className="space-y-3 lg:col-span-2">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Nearby Garages</h2>
              <Badge variant="outline" className="border-gold/40 text-gold">
                Live
              </Badge>
            </div>

            <div className="max-h-[520px] space-y-3 overflow-y-auto pr-1">
              {isLoading ? (
                [1, 2, 3].map((n) => (
                  <div
                    key={n}
                    className="animate-pulse rounded-xl border border-border bg-card p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="w-2/3 space-y-2">
                        <div className="h-4 w-3/4 rounded bg-muted/60" />
                        <div className="h-3.5 w-1/2 rounded bg-muted/60" />
                      </div>
                      <div className="h-8 w-8 rounded-lg bg-muted/60" />
                    </div>
                  </div>
                ))
              ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card py-12 text-center text-muted-foreground">
                  <Wrench className="mb-3 h-8 w-8 opacity-30" />
                  <p className="text-sm">No garages match your search.</p>
                </div>
              ) : (
                filtered.map((m) => (
                  <button
                    key={m.id}
                    id={`mechanic-card-${m.id}`}
                    onClick={() => setSelected(m.id)}
                    className={`w-full text-left surface-elevated rounded-xl p-4 transition-all ${
                      selected === m.id
                        ? "border-gold ring-1 ring-gold/40 shadow-lg"
                        : "hover:border-gold/40"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <Wrench className="h-4 w-4 shrink-0 text-gold" />
                          <span className="truncate font-semibold">{m.name}</span>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">{m.specialty}</p>

                        {/* Available Mechanics */}
                        <div
                          className={`mt-2 flex items-center gap-1 text-xs font-medium ${
                            m.availableMechanics > 0 ? "text-primary" : "text-muted-foreground"
                          }`}
                        >
                          <Users className="h-3 w-3" />
                          {m.availableMechanics > 0
                            ? `${m.availableMechanics} mechanic${m.availableMechanics > 1 ? "s" : ""} available`
                            : "No mechanics available now"}
                        </div>

                        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" /> {m.distanceKm} km
                          </span>
                          <span className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-gold text-gold" /> {m.rating || "New"}
                          </span>
                          <span
                            className={`flex items-center gap-1 ${m.open ? "text-primary" : "text-destructive"}`}
                          >
                            <Clock className="h-3 w-3" /> {m.open ? "Open" : "Closed"}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 shrink-0">
                        <a
                          href={`tel:${m.phone}`}
                          onClick={(e) => e.stopPropagation()}
                          className="rounded-lg gold-gradient p-2 text-background hover:opacity-90"
                          aria-label={`Call ${m.name}`}
                        >
                          <Phone className="h-4 w-4" />
                        </a>
                        <a
                          href={`https://www.google.com/maps/dir/?api=1&origin=${userCoords.lat},${userCoords.lng}&destination=${m.lat},${m.lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="rounded-lg border border-primary/40 bg-primary/10 p-2 text-primary hover:bg-primary/20"
                          aria-label={`Directions to ${m.name}`}
                          title="Get Directions"
                        >
                          <Navigation className="h-4 w-4" />
                        </a>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      </main>

      {/* ── Request Mechanic Modal ── */}
      {showRequestModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="w-full max-w-md surface-elevated rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-destructive/20">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <h2 className="font-bold text-lg">Request Mechanic Help</h2>
                  <p className="text-xs text-muted-foreground">Nearby mechanics will be notified</p>
                </div>
              </div>
              <button
                onClick={() => setShowRequestModal(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-4 flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/10 px-3 py-2 text-xs">
              <Navigation className="h-3 w-3 text-primary shrink-0" />
              <span className="text-primary">
                Your location: {userCoords.lat.toFixed(4)}, {userCoords.lng.toFixed(4)}
              </span>
            </div>

            <form onSubmit={handleSubmitRequest} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="req-description">What's wrong with your vehicle? *</Label>
                <textarea
                  id="req-description"
                  required
                  rows={3}
                  placeholder="e.g. Engine won't start, flat tyre on Colombo Rd near the bridge..."
                  value={requestForm.description}
                  onChange={(e) => setRequestForm((f) => ({ ...f, description: e.target.value }))}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="req-phone">Your Contact Number</Label>
                <Input
                  id="req-phone"
                  type="tel"
                  placeholder="+94 77 XXX XXXX"
                  value={requestForm.phone}
                  onChange={(e) => setRequestForm((f) => ({ ...f, phone: e.target.value }))}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowRequestModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-destructive/90 hover:bg-destructive text-white border-0"
                  disabled={submittingRequest}
                >
                  {submittingRequest ? "Sending..." : "🚨 Send SOS Request"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Digital Bill Modal */}
      {activeRequest?.status === "done" && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/90 backdrop-blur-md p-4">
          <div className="surface-elevated w-full max-w-sm rounded-3xl p-8 shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10 mb-4 border border-green-500/20">
                <Receipt className="h-8 w-8 text-green-500" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Repair Completed</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Your mechanic has successfully finished the repair. Here is the final bill.
              </p>

              <div className="w-full rounded-2xl border border-border bg-background/50 p-5 mb-8">
                <div className="flex justify-between items-center mb-4 pb-4 border-b border-border/50">
                  <span className="text-sm text-muted-foreground">Mechanic</span>
                  <span className="font-semibold">
                    {activeRequest.acceptedByGarageId
                      ? mechanics.find((m) => m.id === activeRequest.acceptedByGarageId)?.name ||
                        "Mechanic"
                      : "Mechanic"}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-4 pb-4 border-b border-border/50">
                  <span className="text-sm text-muted-foreground">Issue</span>
                  <span
                    className="font-medium text-sm text-right line-clamp-1 max-w-[150px]"
                    title={activeRequest.description}
                  >
                    {activeRequest.description}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-base font-semibold">Total Cost</span>
                  <span className="text-2xl font-bold text-gold">
                    Rs. {(activeRequest.cost || 0).toLocaleString()}
                  </span>
                </div>
              </div>

              <Button
                onClick={handleCloseBill}
                size="lg"
                className="w-full h-12 text-base font-semibold gold-gradient text-background rounded-xl"
              >
                Close & Return
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
