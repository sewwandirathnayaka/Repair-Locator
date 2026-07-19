import { useQuery } from "@tanstack/react-query";
import { getNearbyMechanicsFn } from "@/server-fns/db";
import type { Coords, Garage } from "@/types";
import { KURUNEGALA_CENTER } from "@/types";

/**
 * Fetches approved garages in the Kurunegala area from the server.
 * Falls back to mock data if MongoDB is unavailable.
 */
export function useMechanics(coords: Coords | null) {
  const effectiveCoords: Coords = coords ?? KURUNEGALA_CENTER;

  return useQuery<Garage[]>({
    queryKey: ["mechanics", effectiveCoords.lat, effectiveCoords.lng],
    queryFn: async () => {
      const result = await getNearbyMechanicsFn({
        data: { lat: effectiveCoords.lat, lng: effectiveCoords.lng },
      });

      if (Array.isArray(result)) return result;
      // Handle any wrapped response objects (TanStack Start serialization)
      if (
        result &&
        typeof result === "object" &&
        "data" in result &&
        Array.isArray((result as Record<string, unknown>).data)
      ) {
        return (result as Record<string, unknown>).data as Garage[];
      }
      return [];
    },
    staleTime: 30_000,
    retry: 1,
  });
}
