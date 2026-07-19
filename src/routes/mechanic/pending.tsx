import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Clock, CheckCircle2, XCircle, Wrench, MapPin, Phone } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { getMyGarageFn } from "@/server-fns/db";
import type { Garage } from "@/types";

export const Route = createFileRoute("/mechanic/pending")({ component: MechanicPendingPage });

function MechanicPendingPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [garage, setGarage] = useState<Garage | null>(null);
  const [fetchingGarage, setFetchingGarage] = useState(true);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/login", replace: true });
    if (!loading && user?.role === "owner") navigate({ to: "/dashboard", replace: true });
    if (!loading && user?.role === "admin") navigate({ to: "/admin", replace: true });
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!user) return;
    getMyGarageFn({ data: { clerkId: user.id } })
      .then((g) => {
        if (!g) {
          // If no garage found at all, they haven't registered yet
          navigate({ to: "/mechanic/register", replace: true });
        } else if (g.status === "approved") {
          navigate({ to: "/mechanic/dashboard", replace: true });
        } else {
          setGarage(g);
        }
      })
      .catch(() => {})
      .finally(() => setFetchingGarage(false));
  }, [user, navigate]);

  if (loading || fetchingGarage) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center text-muted-foreground">Checking status...</div>
      </div>
    );
  }

  const status = garage?.status ?? "pending";

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="mx-auto flex max-w-lg flex-col items-center px-4 py-20 text-center">
        {status === "pending" && (
          <>
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full border-4 border-gold/30 bg-gold/10">
              <Clock className="h-10 w-10 text-gold animate-pulse" />
            </div>
            <h1 className="text-3xl font-bold">Application Under Review</h1>
            <p className="mt-3 text-muted-foreground">
              Your garage registration has been submitted. Our admin team will review your NVQ
              certificate and approve your account shortly.
            </p>
            <div className="mt-8 w-full surface-elevated rounded-2xl p-5 text-left space-y-3">
              <p className="text-xs uppercase tracking-wider text-gold font-medium">
                Your Submission
              </p>
              {garage ? (
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Wrench className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="font-medium">{garage.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4 shrink-0" />
                    <span>{garage.address}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-4 w-4 shrink-0" />
                    <span>{garage.phone}</span>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No garage found. Please register first.
                </p>
              )}
            </div>
            <p className="mt-6 text-xs text-muted-foreground">
              Refresh the page to check your approval status.
            </p>
          </>
        )}

        {status === "approved" && (
          <>
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full border-4 border-primary/30 bg-primary/10">
              <CheckCircle2 className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-3xl font-bold">You're Approved!</h1>
            <p className="mt-3 text-muted-foreground">Your garage is now live on Repair Locator.</p>
            <Button className="mt-8" onClick={() => navigate({ to: "/mechanic/dashboard" })}>
              Go to My Garage Dashboard
            </Button>
          </>
        )}

        {status === "rejected" && (
          <>
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full border-4 border-destructive/30 bg-destructive/10">
              <XCircle className="h-10 w-10 text-destructive" />
            </div>
            <h1 className="text-3xl font-bold">Application Rejected</h1>
            <p className="mt-3 text-muted-foreground">
              Unfortunately, your garage registration was not approved. Please contact the admin for
              more information.
            </p>
            <Button
              variant="outline"
              className="mt-8"
              onClick={() => navigate({ to: "/mechanic/register" })}
            >
              Re-apply
            </Button>
          </>
        )}
      </main>
    </div>
  );
}
