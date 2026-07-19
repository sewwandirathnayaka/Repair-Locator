import { MapPin, Navigation } from "lucide-react";
import type { Mechanic } from "@/types";

interface Props {
  mechanics: Mechanic[];
  selectedId?: string | null;
  onSelect?: (id: string) => void;
}

/**
 * Static SVG map placeholder styled to fit the gold/black theme.
 * Swap for Leaflet's <MapContainer /> when wiring live geolocation:
 *   import { MapContainer, TileLayer, Marker } from "react-leaflet";
 */
export function MapPlaceholder({ mechanics, selectedId, onSelect }: Props) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-border bg-card">
      <div
        className="relative aspect-[16/10] w-full"
        style={{
          backgroundImage:
            "radial-gradient(circle at 30% 30%, oklch(0.22 0.02 85) 0%, transparent 55%), radial-gradient(circle at 70% 70%, oklch(0.2 0.015 90) 0%, transparent 60%), linear-gradient(135deg, oklch(0.16 0.01 90), oklch(0.13 0.008 90))",
        }}
      >
        {/* grid lines */}
        <svg
          className="absolute inset-0 h-full w-full opacity-20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="oklch(0.78 0.13 82)"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* "you are here" */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="relative">
            <div className="absolute inset-0 animate-ping rounded-full bg-primary/40" />
            <div className="relative h-4 w-4 rounded-full border-2 border-background gold-gradient" />
          </div>
        </div>

        {/* mechanic pins */}
        {mechanics.slice(0, 5).map((m, i) => {
          const angle = (i / 5) * Math.PI * 2;
          const r = 26 + (m.distanceKm % 3) * 6;
          const x = 50 + Math.cos(angle) * r;
          const y = 50 + Math.sin(angle) * r;
          const active = selectedId === m.id;
          return (
            <button
              key={m.id}
              onClick={() => onSelect?.(m.id)}
              className="absolute -translate-x-1/2 -translate-y-full transition-transform hover:scale-110"
              style={{ left: `${x}%`, top: `${y}%` }}
              aria-label={m.name}
            >
              <MapPin
                className={`h-7 w-7 drop-shadow-lg ${active ? "text-primary" : "text-gold"}`}
                fill={active ? "currentColor" : "none"}
                strokeWidth={2}
              />
            </button>
          );
        })}

        <div className="absolute bottom-3 right-3 flex items-center gap-1 rounded-md border border-border bg-background/70 px-2 py-1 text-xs text-muted-foreground backdrop-blur">
          <Navigation className="h-3 w-3 text-gold" />
          Leaflet map placeholder
        </div>
      </div>
    </div>
  );
}
