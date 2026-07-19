import { createFileRoute } from "@tanstack/react-router";
import { SignIn } from "@clerk/tanstack-start";
import { AppHeader } from "@/components/AppHeader";

export const Route = createFileRoute("/login")({ component: LoginPage });

function LoginPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppHeader />
      <div className="flex-1 flex items-center justify-center p-4 py-12">
        <SignIn
          routing="hash"
          signUpUrl="/signup"
          fallbackRedirectUrl="/dashboard"
          forceRedirectUrl="/dashboard"
        />
      </div>
    </div>
  );
}
