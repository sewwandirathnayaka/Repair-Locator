import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useAuth } from "@/context/AuthContext";
import { useSignUp } from "@clerk/tanstack-start";
import { MailCheck } from "lucide-react";

export const Route = createFileRoute("/verify-email")({ component: VerifyPage });

function VerifyPage() {
  const { user } = useAuth();
  const { signUp, isLoaded } = useSignUp();
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  async function onVerify() {
    if (!isLoaded || !signUp) return;
    setLoading(true);
    try {
      const result = await signUp.attemptEmailAddressVerification({ code });
      if (result.status === "complete") {
        toast.success("Email verified! Welcome aboard.");
        navigate({ to: "/dashboard" });
      } else {
        toast.error("Verification incomplete. Please try again.");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Verification failed");
    } finally {
      setLoading(false);
    }
  }

  async function onResend() {
    if (!isLoaded || !signUp) return;
    try {
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      toast.success("New code sent to your email.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Resend failed");
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <div className="mx-auto flex max-w-md flex-col items-center px-4 py-16 text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl gold-gradient">
          <MailCheck className="h-7 w-7 text-background" />
        </div>
        <h1 className="text-3xl font-bold">Verify your email</h1>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          We sent a 6-digit code to your email. Enter it below to activate your account.
        </p>

        <div className="surface-elevated mt-8 w-full rounded-2xl p-6">
          <InputOTP maxLength={6} value={code} onChange={setCode}>
            <InputOTPGroup className="mx-auto">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <InputOTPSlot key={i} index={i} />
              ))}
            </InputOTPGroup>
          </InputOTP>
          <Button
            onClick={onVerify}
            className="mt-6 w-full"
            disabled={loading || code.length !== 6}
          >
            {loading ? "Verifying…" : "Verify email"}
          </Button>
          <button onClick={onResend} className="mt-3 text-sm text-gold hover:underline">
            Resend code
          </button>
        </div>
      </div>
    </div>
  );
}
