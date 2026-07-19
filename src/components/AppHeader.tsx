import { Link, useNavigate } from "@tanstack/react-router";
import { Wrench, LogOut, Sun, Moon } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { Button } from "@/components/ui/button";

export function AppHeader() {
  const { user, logOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg gold-gradient">
            <Wrench className="h-5 w-5 text-background" strokeWidth={2.5} />
          </div>
          <span className="text-lg font-semibold tracking-tight">
            Repair <span className="gold-text-gradient">Locator</span>
          </span>
        </Link>

        <div className="flex items-center gap-2">
          {/* Dark / Light mode toggle */}
          <button
            id="theme-toggle"
            onClick={toggleTheme}
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background/50 text-muted-foreground transition-all hover:border-gold/40 hover:bg-gold/10 hover:text-gold"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {user ? (
            <>
              <div className="hidden text-right sm:block">
                <div className="text-sm font-medium">{user.name}</div>
                <div className="text-xs uppercase tracking-wider text-gold">{user.role}</div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  logOut();
                  navigate({ to: "/login" });
                }}
              >
                <LogOut className="mr-1 h-4 w-4" />
                Sign out
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/login">Log in</Link>
              </Button>
              <Button size="sm" asChild>
                <Link to="/signup">Sign up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
