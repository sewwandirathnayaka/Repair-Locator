import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { MapPin, Search, Shield, Star, Smartphone, Zap } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

export const Route = createFileRoute("/")({
  component: Landing,
});

function Landing() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate({ to: user.role === "admin" ? "/admin" : "/dashboard", replace: true });
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AppHeader />

      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 -z-10 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 10%, oklch(0.86 0.18 95 / 0.25), transparent 45%), radial-gradient(circle at 85% 40%, oklch(0.78 0.13 82 / 0.2), transparent 50%)",
          }}
        />
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/5 px-3 py-1 text-xs font-medium uppercase tracking-wider text-gold">
              <Zap className="h-3 w-3" /> 24/7 Roadside Ready
            </span>
            <h1 className="mt-6 text-5xl font-bold tracking-tight sm:text-6xl">
              Trusted mechanics, <span className="gold-text-gradient">one tap away.</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Repair Locator helps vehicle owners locate verified repair shops nearby — with live
              distance, ratings, and instant contact.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button size="lg" asChild>
                <Link to="/signup">
                  <Search className="mr-2 h-5 w-5" /> Find a Mechanic
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/login">I have an account</Link>
              </Button>
            </div>
          </div>

          <div className="mx-auto mt-20 grid max-w-5xl gap-6 sm:grid-cols-3">
            {[
              {
                icon: MapPin,
                title: "Real-time Locator",
                body: "Interactive map with verified shops around your location.",
              },
              {
                icon: Shield,
                title: "Verified Pros",
                body: "Every mechanic is reviewed and rated by real drivers.",
              },
              {
                icon: Smartphone,
                title: "Installable PWA",
                body: "Add to your home screen for one-tap access.",
              },
            ].map((f) => (
              <div key={f.title} className="surface-elevated rounded-2xl p-6">
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl gold-gradient">
                  <f.icon className="h-5 w-5 text-background" />
                </div>
                <h3 className="text-lg font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.body}</p>
              </div>
            ))}
          </div>

          <div className="mx-auto mt-16 flex max-w-2xl items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-gold text-gold" /> 4.9 avg rating
            </div>
            <div>1,200+ mechanics</div>
            <div>50k+ jobs completed</div>
          </div>
        </div>
      </section>
    </div>
  );
}
