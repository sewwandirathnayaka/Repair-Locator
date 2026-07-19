import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { Wrench, MapPin, Phone, Upload, Users, CheckCircle2, AlertCircle } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { registerGarageFn, getMyGarageFn } from "@/server-fns/db";
import { toast } from "sonner";
import { KURUNEGALA_CENTER } from "@/types";

export const Route = createFileRoute("/mechanic/register")({ component: GarageRegisterPage });

const SPECIALTIES = [
  "Engine & Transmission",
  "Brakes & Suspension",
  "Electrical & AC",
  "Diesel & Heavy Vehicles",
  "Performance & Tuning",
  "Tyres & Wheel Alignment",
  "Body Repair & Painting",
  "General Service & Maintenance",
];

function GarageRegisterPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name: "",
    address: "",
    phone: "",
    specialty: SPECIALTIES[0],
    lat: KURUNEGALA_CENTER.lat,
    lng: KURUNEGALA_CENTER.lng,
    totalMechanics: 1,
  });
  const [nvqFile, setNvqFile] = useState<{ name: string; base64: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [checking, setChecking] = useState(true);

  // Auth redirect + garage existence check — all in useEffect (not during render)
  useEffect(() => {
    if (loading) return;

    if (!user) {
      navigate({ to: "/login", replace: true });
      return;
    }
    if (user.role === "owner") {
      navigate({ to: "/dashboard", replace: true });
      return;
    }
    if (user.role === "admin") {
      navigate({ to: "/admin", replace: true });
      return;
    }

    // mechanic role — check if garage already exists
    getMyGarageFn({ data: { clerkId: user.id } })
      .then((g) => {
        if (g) {
          navigate({ to: "/mechanic/pending", replace: true });
        } else {
          setChecking(false);
        }
      })
      .catch(() => {
        // If check fails, show the form anyway
        setChecking(false);
      });
  }, [user, loading, navigate]);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File too large — max 5MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setNvqFile({ name: file.name, base64: reader.result as string });
    };
    reader.readAsDataURL(file);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    if (!nvqFile) {
      toast.error("Please upload your NVQ certificate");
      return;
    }
    if (!form.name.trim()) {
      toast.error("Please enter your garage name");
      return;
    }
    if (!form.address.trim()) {
      toast.error("Please enter your garage address");
      return;
    }

    setSubmitting(true);
    try {
      const result = await registerGarageFn({
        data: {
          ownerClerkId: user.id,
          name: form.name,
          address: form.address,
          phone: form.phone,
          specialty: form.specialty,
          lat: form.lat,
          lng: form.lng,
          totalMechanics: form.totalMechanics,
          nvqCertificateBase64: nvqFile.base64,
          nvqCertificateName: nvqFile.name,
        },
      });
      if (result?.success) {
        toast.success("Garage registered! Awaiting admin approval.");
        navigate({ to: "/mechanic/pending", replace: true });
      } else {
        toast.error(result?.error ?? "Registration failed. Please try again.");
      }
    } catch (err) {
      console.error("registerGarageFn error:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  // Show loading spinner while checking auth / garage existence
  if (loading || checking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gold/30 border-t-gold" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="mx-auto max-w-2xl px-4 py-10">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-wider text-gold">Mechanic Registration</p>
          <h1 className="mt-1 text-3xl font-bold">Register Your Garage</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Fill in your garage details. An admin will review and approve your application.
          </p>
        </div>

        {/* Info Banner */}
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-gold/30 bg-gold/5 p-4">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
          <div className="text-sm">
            <p className="font-medium text-gold">Kurunegala Area Only</p>
            <p className="mt-0.5 text-muted-foreground">
              This platform currently serves the Kurunegala town area. Make sure your garage is
              within 6km of Kurunegala town center.
            </p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          {/* Garage Details */}
          <div className="surface-elevated rounded-2xl p-6 space-y-4">
            <h2 className="font-semibold text-lg flex items-center gap-2">
              <Wrench className="h-5 w-5 text-gold" /> Garage Details
            </h2>

            <div className="space-y-2">
              <Label htmlFor="garage-name">Garage / Shop Name *</Label>
              <Input
                id="garage-name"
                required
                placeholder="e.g. Silva Auto Works"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialty">Main Specialty *</Label>
              <select
                id="specialty"
                required
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                value={form.specialty}
                onChange={(e) => setForm((f) => ({ ...f, specialty: e.target.value }))}
              >
                {SPECIALTIES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="total-mechanics">
                <Users className="inline h-4 w-4 mr-1" />
                Total Mechanics at Garage *
              </Label>
              <Input
                id="total-mechanics"
                type="number"
                min={1}
                max={50}
                required
                value={form.totalMechanics}
                onChange={(e) => setForm((f) => ({ ...f, totalMechanics: Number(e.target.value) }))}
              />
            </div>
          </div>

          {/* Location & Contact */}
          <div className="surface-elevated rounded-2xl p-6 space-y-4">
            <h2 className="font-semibold text-lg flex items-center gap-2">
              <MapPin className="h-5 w-5 text-gold" /> Location & Contact
            </h2>

            <div className="space-y-2">
              <Label htmlFor="address">Street Address *</Label>
              <Input
                id="address"
                required
                placeholder="e.g. 125/A, Colombo Rd, Kurunegala"
                value={form.address}
                onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">
                <Phone className="inline h-4 w-4 mr-1" />
                Phone Number *
              </Label>
              <Input
                id="phone"
                type="tel"
                required
                placeholder="+94 37 XXX XXXX"
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="lat">Latitude</Label>
                <Input
                  id="lat"
                  type="number"
                  step="0.0001"
                  required
                  value={form.lat}
                  onChange={(e) => setForm((f) => ({ ...f, lat: Number(e.target.value) }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lng">Longitude</Label>
                <Input
                  id="lng"
                  type="number"
                  step="0.0001"
                  required
                  value={form.lng}
                  onChange={(e) => setForm((f) => ({ ...f, lng: Number(e.target.value) }))}
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Kurunegala center: lat 7.4818, lng 80.3609. Your garage should be within 6km of this
              point.
            </p>
          </div>

          {/* NVQ Certificate Upload */}
          <div className="surface-elevated rounded-2xl p-6 space-y-4">
            <h2 className="font-semibold text-lg flex items-center gap-2">
              <Upload className="h-5 w-5 text-gold" /> NVQ Certificate
            </h2>
            <p className="text-sm text-muted-foreground">
              Upload your NVQ (National Vocational Qualification) certificate. Accepted formats:
              PDF, JPG, PNG (max 5MB).
            </p>
            <input
              ref={fileRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              className="hidden"
              onChange={handleFile}
            />
            {nvqFile ? (
              <div className="flex items-center gap-3 rounded-xl border border-primary/40 bg-primary/5 p-4">
                <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                <div>
                  <p className="text-sm font-medium">{nvqFile.name}</p>
                  <p className="text-xs text-muted-foreground">Uploaded successfully</p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="ml-auto"
                  onClick={() => setNvqFile(null)}
                >
                  Remove
                </Button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="w-full rounded-xl border-2 border-dashed border-border p-8 text-center hover:border-gold/40 hover:bg-gold/5 transition-colors"
              >
                <Upload className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
                <p className="text-sm font-medium">Click to upload NVQ certificate</p>
                <p className="mt-1 text-xs text-muted-foreground">PDF, JPG, PNG — max 5MB</p>
              </button>
            )}
          </div>

          <Button type="submit" className="w-full" size="lg" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit for Admin Approval"}
          </Button>
        </form>
      </main>
    </div>
  );
}
