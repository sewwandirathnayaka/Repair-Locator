import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { SignUp } from "@clerk/tanstack-start";
import { AppHeader } from "@/components/AppHeader";
import { useState } from "react";
import { Wrench, Car } from "lucide-react";

export const Route = createFileRoute("/signup")({ component: SignupPage });

function SignupPage() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<"owner" | "mechanic" | null>(null);

  if (!selectedRole) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <AppHeader />
        <div className="flex-1 flex items-center justify-center p-4 py-12">
          <div className="w-full max-w-md">
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold">Join Repair Locator</h1>
              <p className="mt-2 text-sm text-muted-foreground">Who are you signing up as?</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button
                id="role-owner"
                onClick={() => setSelectedRole("owner")}
                className="surface-elevated flex flex-col items-center gap-3 rounded-2xl border-2 border-border p-8 transition-all hover:border-gold/60 hover:shadow-lg"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-xl gold-gradient">
                  <Car className="h-7 w-7 text-background" />
                </div>
                <div className="text-center">
                  <div className="font-semibold">Vehicle Owner</div>
                  <div className="mt-1 text-xs text-muted-foreground">Find nearby mechanics</div>
                </div>
              </button>

              <button
                id="role-mechanic"
                onClick={() => setSelectedRole("mechanic")}
                className="surface-elevated flex flex-col items-center gap-3 rounded-2xl border-2 border-border p-8 transition-all hover:border-gold/60 hover:shadow-lg"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-xl gold-gradient">
                  <Wrench className="h-7 w-7 text-background" />
                </div>
                <div className="text-center">
                  <div className="font-semibold">Mechanic / Garage</div>
                  <div className="mt-1 text-xs text-muted-foreground">Register your garage</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppHeader />
      <div className="flex-1 flex flex-col items-center justify-center p-4 py-12 gap-4">
        <button
          onClick={() => setSelectedRole(null)}
          className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
        >
          ← Change role
        </button>
        <div className="text-center mb-2">
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-xs font-medium text-gold">
            {selectedRole === "mechanic" ? (
              <Wrench className="h-3 w-3" />
            ) : (
              <Car className="h-3 w-3" />
            )}
            Signing up as {selectedRole === "mechanic" ? "Mechanic / Garage" : "Vehicle Owner"}
          </span>
        </div>
        <SignUp
          routing="hash"
          signInUrl="/login"
          fallbackRedirectUrl={selectedRole === "mechanic" ? "/mechanic/register" : "/dashboard"}
          forceRedirectUrl={selectedRole === "mechanic" ? "/mechanic/register" : "/dashboard"}
          unsafeMetadata={{ role: selectedRole }}
        />
      </div>
    </div>
  );
}
