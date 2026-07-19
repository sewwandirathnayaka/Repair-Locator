import { useState, useEffect } from "react";
import type { Coords } from "@/types";

export type GeolocationState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; coords: Coords }
  | { status: "error"; message: string };

/**
 * Wraps the browser Geolocation API with React state.
 * Immediately requests position on mount with a 10-second timeout.
 *
 * @param fallback - Coordinates to use if geolocation is unavailable or denied.
 *                   Defaults to New York City.
 */
export function useGeolocation(fallback: Coords = { lat: 40.7128, lng: -74.006 }): {
  state: GeolocationState;
  /** Resolved coords — either real location or the fallback */
  coords: Coords;
} {
  const [state, setState] = useState<GeolocationState>({ status: "loading" });

  useEffect(() => {
    if (!navigator.geolocation) {
      setState({ status: "error", message: "Geolocation not supported by this browser." });
      return;
    }

    const id = navigator.geolocation.watchPosition(
      (pos) => {
        setState({
          status: "success",
          coords: { lat: pos.coords.latitude, lng: pos.coords.longitude },
        });
      },
      (err) => {
        setState({ status: "error", message: err.message });
      },
      { enableHighAccuracy: true, timeout: 10_000, maximumAge: 30_000 },
    );

    return () => navigator.geolocation.clearWatch(id);
  }, []);

  const coords: Coords = state.status === "success" ? state.coords : fallback;

  return { state, coords };
}
