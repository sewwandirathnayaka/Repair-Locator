import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useUser, useClerk } from "@clerk/tanstack-start";
import { syncClerkUserFn } from "@/server-fns/db";
import type { AuthUser, UserRole, GarageStatus } from "@/types";

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  logOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL as string | undefined;

export function AuthProvider({ children }: { children: ReactNode }) {
  const { user: clerkUser, isLoaded: userLoaded } = useUser();
  const { signOut } = useClerk();

  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userLoaded) return;

    if (clerkUser) {
      const email = clerkUser.primaryEmailAddress?.emailAddress || "";
      const name = clerkUser.fullName || email.split("@")[0];

      // Determine role: admin email → admin, else check unsafeMetadata or publicMetadata
      let role: UserRole;
      if (ADMIN_EMAIL && email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
        role = "admin";
      } else {
        role =
          (clerkUser.unsafeMetadata?.role as UserRole) ||
          (clerkUser.publicMetadata?.role as UserRole) ||
          "owner";
      }

      const garageStatus = clerkUser.publicMetadata?.garageStatus as GarageStatus | undefined;

      const localUser: AuthUser = {
        id: clerkUser.id,
        name,
        email,
        role,
        verified: true,
        garageStatus,
      };

      setUser(localUser);

      // Sync to MongoDB
      (async () => {
        try {
          await syncClerkUserFn({ data: { clerkId: clerkUser.id, name, email, role } });
        } catch (err) {
          console.warn("Failed to sync user to MongoDB:", err);
        }
      })();
    } else {
      setUser(null);
    }
    setLoading(false);
  }, [clerkUser, userLoaded]);

  const logOut = async () => {
    await signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading: loading || !userLoaded, logOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
