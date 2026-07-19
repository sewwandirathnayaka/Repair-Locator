import { createServerFn } from "@tanstack/react-start";
import type { Garage, GarageStatus, HelpRequest, HelpRequestStatus } from "@/types";
import { KURUNEGALA_CENTER, KURUNEGALA_RADIUS_KM } from "@/types";

// ─── Haversine distance helper ────────────────────────────────────────────────
const RADIUS_EARTH_KM = 6371;

function getDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const toRad = (n: number) => (n * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return Math.round(RADIUS_EARTH_KM * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) * 10) / 10;
}

// ─── Garage document → typed Garage ──────────────────────────────────────────
function docToGarage(
  s: Record<string, unknown>,
  refLat = KURUNEGALA_CENTER.lat,
  refLng = KURUNEGALA_CENTER.lng,
): Garage {
  const lat = (s.lat as number) || 0;
  const lng = (s.lng as number) || 0;
  return {
    id: (s.id as string) || String(s._id),
    ownerClerkId: (s.ownerClerkId as string) || "",
    name: (s.name as string) || "",
    specialty: (s.specialty as string) || "",
    address: (s.address as string) || "",
    phone: (s.phone as string) || "",
    rating: (s.rating as number) || 0,
    availableMechanics: (s.availableMechanics as number) ?? 0,
    totalMechanics: (s.totalMechanics as number) ?? 1,
    open: (s.open as boolean) ?? false,
    status: (s.status as GarageStatus) ?? "pending",
    distanceKm: getDistanceKm(refLat, refLng, lat, lng),
    lat,
    lng,
    nvqCertificateBase64: s.nvqCertificateBase64 as string | undefined,
    nvqCertificateName: s.nvqCertificateName as string | undefined,
    services: s.services as string[] | undefined,
    createdAt: s.createdAt as string | undefined,
  };
}

// ─── Mock fallback garages (Kurunegala-based) ────────────────────────────────
function getMockGarages(lat: number, lng: number): Garage[] {
  const base = [
    {
      id: "g1",
      name: "Kurunegala Auto Care",
      specialty: "Engine & Transmission",
      phone: "+94 37 222 1001",
      address: "125/A, Colombo Rd, Kurunegala",
      rating: 4.9,
      open: true,
      availableMechanics: 3,
      totalMechanics: 4,
      lat: 7.4842,
      lng: 80.3627,
    },
    {
      id: "g2",
      name: "Wayamba Garage",
      specialty: "Brakes & Suspension",
      phone: "+94 37 222 2002",
      address: "34, Kandy Rd, Kurunegala",
      rating: 4.7,
      open: true,
      availableMechanics: 2,
      totalMechanics: 3,
      lat: 7.4795,
      lng: 80.358,
    },
    {
      id: "g3",
      name: "North Gate Motors",
      specialty: "Electrical & AC",
      phone: "+94 37 222 3003",
      address: "88, Puttalam Rd, Kurunegala",
      rating: 4.6,
      open: true,
      availableMechanics: 1,
      totalMechanics: 2,
      lat: 7.4905,
      lng: 80.3555,
    },
    {
      id: "g4",
      name: "Precision Diesel Works",
      specialty: "Diesel & Heavy Vehicles",
      phone: "+94 37 222 4004",
      address: "12, Dambulla Rd, Kurunegala",
      rating: 4.8,
      open: false,
      availableMechanics: 0,
      totalMechanics: 3,
      lat: 7.475,
      lng: 80.365,
    },
    {
      id: "g5",
      name: "Torque Masters",
      specialty: "Performance & Tuning",
      phone: "+94 37 222 5005",
      address: "67, Maho Rd, Kurunegala",
      rating: 4.5,
      open: true,
      availableMechanics: 2,
      totalMechanics: 2,
      lat: 7.488,
      lng: 80.37,
    },
  ];
  return base
    .map((g) => ({
      ...g,
      ownerClerkId: "seed",
      status: "approved" as GarageStatus,
      distanceKm: getDistanceKm(lat, lng, g.lat, g.lng),
    }))
    .sort((a, b) => a.distanceKm - b.distanceKm);
}

// ═════════════════════════════════════════════════════════════════════════════
// 1. Get approved Kurunegala garages — Owner map
// ═════════════════════════════════════════════════════════════════════════════
export const getNearbyMechanicsFn = createServerFn({ method: "POST" })
  .validator((v: unknown) => v as { lat?: number; lng?: number })
  .handler(async (ctx): Promise<Garage[]> => {
    const payload = ctx.data ?? {};
    const refLat = payload.lat ?? KURUNEGALA_CENTER.lat;
    const refLng = payload.lng ?? KURUNEGALA_CENTER.lng;

    try {
      const { getDb } = await import("@/lib/mongodb");
      const db = await getDb();

      const shops = await db.collection("shops").find({ status: "approved" }).toArray();

      if (shops.length === 0) {
        console.log("No approved shops in DB — serving mock garages");
        return getMockGarages(refLat, refLng);
      }

      return (shops as Record<string, unknown>[])
        .map((s) => docToGarage(s, refLat, refLng))
        .filter(
          (g) =>
            getDistanceKm(KURUNEGALA_CENTER.lat, KURUNEGALA_CENTER.lng, g.lat, g.lng) <=
            KURUNEGALA_RADIUS_KM,
        )
        .sort((a, b) => a.distanceKm - b.distanceKm);
    } catch (error) {
      console.error("getNearbyMechanicsFn DB error:", (error as Error).message);
      return getMockGarages(refLat, refLng);
    }
  });

// ═════════════════════════════════════════════════════════════════════════════
// 2. Register a new garage (mechanic signup)
// ═════════════════════════════════════════════════════════════════════════════
export const registerGarageFn = createServerFn({ method: "POST" })
  .validator(
    (v: unknown) =>
      v as {
        ownerClerkId: string;
        name: string;
        address: string;
        phone: string;
        specialty: string;
        lat: number;
        lng: number;
        totalMechanics: number;
        nvqCertificateBase64?: string;
        nvqCertificateName?: string;
      },
  )
  .handler(async (ctx): Promise<{ success: boolean; garageId?: string; error?: string }> => {
    const payload = ctx.data;

    if (!payload.ownerClerkId) return { success: false, error: "Missing ownerClerkId" };

    try {
      const { getDb } = await import("@/lib/mongodb");
      const db = await getDb();

      // Check if this mechanic already has a garage
      const existing = await db.collection("shops").findOne({ ownerClerkId: payload.ownerClerkId });
      if (existing) {
        console.log(`Mechanic ${payload.ownerClerkId} already has garage: ${existing.id}`);
        return { success: true, garageId: (existing.id as string) || String(existing._id) };
      }

      const garageId = `g_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      const now = new Date().toISOString();

      await db.collection("shops").insertOne({
        id: garageId,
        ownerClerkId: payload.ownerClerkId,
        name: payload.name.trim(),
        address: payload.address.trim(),
        phone: payload.phone.trim(),
        specialty: payload.specialty,
        lat: Number(payload.lat),
        lng: Number(payload.lng),
        totalMechanics: Number(payload.totalMechanics),
        availableMechanics: 0,
        rating: 0,
        open: false,
        status: "pending",
        nvqCertificateBase64: payload.nvqCertificateBase64 ?? null,
        nvqCertificateName: payload.nvqCertificateName ?? null,
        location: { type: "Point", coordinates: [Number(payload.lng), Number(payload.lat)] },
        createdAt: now,
        updatedAt: now,
      });

      console.log(`✅ New garage registered: ${garageId} by ${payload.ownerClerkId}`);
      return { success: true, garageId };
    } catch (error) {
      console.error("registerGarageFn error:", error);
      return { success: false, error: (error as Error).message };
    }
  });

// ═════════════════════════════════════════════════════════════════════════════
// 3. Get pending garage applications — Admin only
// ═════════════════════════════════════════════════════════════════════════════
export const getPendingGaragesFn = createServerFn({ method: "POST" }).handler(
  async (): Promise<Garage[]> => {
    try {
      const { getDb } = await import("@/lib/mongodb");
      const db = await getDb();

      const shops = await db
        .collection("shops")
        .find({ status: "pending" })
        .sort({ createdAt: -1 })
        .toArray();

      console.log(`Admin: ${shops.length} pending applications fetched`);
      return (shops as Record<string, unknown>[]).map((s) => docToGarage(s));
    } catch (error) {
      console.error("getPendingGaragesFn error:", (error as Error).message);
      return [];
    }
  },
);

// ═════════════════════════════════════════════════════════════════════════════
// 4. Get ALL garages — Admin overview
// ═════════════════════════════════════════════════════════════════════════════
export const getAllGaragesFn = createServerFn({ method: "POST" }).handler(
  async (): Promise<Garage[]> => {
    try {
      const { getDb } = await import("@/lib/mongodb");
      const db = await getDb();

      const shops = await db.collection("shops").find({}).sort({ createdAt: -1 }).toArray();

      console.log(`Admin: ${shops.length} total garages fetched`);
      return (shops as Record<string, unknown>[]).map((s) => docToGarage(s));
    } catch (error) {
      console.error("getAllGaragesFn error:", (error as Error).message);
      return [];
    }
  },
);

// ═════════════════════════════════════════════════════════════════════════════
// 5. Approve garage — Admin action
// ═════════════════════════════════════════════════════════════════════════════
export const approveGarageFn = createServerFn({ method: "POST" })
  .validator((v: unknown) => v as { garageId: string })
  .handler(async (ctx): Promise<{ success: boolean }> => {
    const { garageId } = ctx.data;
    if (!garageId) return { success: false };

    try {
      const { getDb } = await import("@/lib/mongodb");
      const db = await getDb();

      const result = await db.collection("shops").updateOne(
        { id: garageId },
        {
          $set: {
            status: "approved",
            open: true,
            approvedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        },
      );

      const ok = result.modifiedCount > 0;
      console.log(`Admin APPROVED garage ${garageId}: ${ok ? "✅" : "❌ not found"}`);
      return { success: ok };
    } catch (error) {
      console.error("approveGarageFn error:", error);
      return { success: false };
    }
  });

// ═════════════════════════════════════════════════════════════════════════════
// 6. Reject garage — Admin action
// ═════════════════════════════════════════════════════════════════════════════
export const rejectGarageFn = createServerFn({ method: "POST" })
  .validator((v: unknown) => v as { garageId: string; reason?: string })
  .handler(async (ctx): Promise<{ success: boolean }> => {
    const { garageId, reason } = ctx.data;
    if (!garageId) return { success: false };

    try {
      const { getDb } = await import("@/lib/mongodb");
      const db = await getDb();

      const result = await db.collection("shops").updateOne(
        { id: garageId },
        {
          $set: {
            status: "rejected",
            open: false,
            rejectedAt: new Date().toISOString(),
            rejectionReason: reason ?? "Does not meet platform requirements",
            updatedAt: new Date().toISOString(),
          },
        },
      );

      const ok = result.modifiedCount > 0;
      console.log(`Admin REJECTED garage ${garageId}: ${ok ? "✅" : "❌ not found"}`);
      return { success: ok };
    } catch (error) {
      console.error("rejectGarageFn error:", error);
      return { success: false };
    }
  });

// ═════════════════════════════════════════════════════════════════════════════
// 7. Get mechanic's own garage profile — uses POST so clerkId can be in body
// ═════════════════════════════════════════════════════════════════════════════
export const getMyGarageFn = createServerFn({ method: "POST" })
  .validator((v: unknown) => v as { clerkId: string })
  .handler(async (ctx): Promise<Garage | null> => {
    const { clerkId } = ctx.data;
    if (!clerkId) return null;

    try {
      const { getDb } = await import("@/lib/mongodb");
      const db = await getDb();

      const shop = await db.collection("shops").findOne({ ownerClerkId: clerkId });
      if (!shop) {
        console.log(`No garage found for mechanic ${clerkId}`);
        return null;
      }

      return docToGarage(shop as Record<string, unknown>);
    } catch (error) {
      console.error("getMyGarageFn error:", (error as Error).message);
      return null;
    }
  });

// ═════════════════════════════════════════════════════════════════════════════
// 8. Update garage live availability — Mechanic dashboard
// ═════════════════════════════════════════════════════════════════════════════
export const updateGarageAvailabilityFn = createServerFn({ method: "POST" })
  .validator((v: unknown) => v as { garageId: string; availableMechanics: number; open: boolean })
  .handler(async (ctx): Promise<{ success: boolean }> => {
    const { garageId, availableMechanics, open } = ctx.data;

    if (!garageId) return { success: false };

    try {
      const { getDb } = await import("@/lib/mongodb");
      const db = await getDb();

      const result = await db.collection("shops").updateOne(
        { id: garageId },
        {
          $set: {
            availableMechanics: Math.max(0, Number(availableMechanics)),
            open: Boolean(open),
            updatedAt: new Date().toISOString(),
          },
        },
      );

      const ok = result.modifiedCount > 0;
      console.log(
        `Garage ${garageId} availability updated: ${availableMechanics} available, open=${open} → ${ok ? "✅" : "❌"}`,
      );
      return { success: ok };
    } catch (error) {
      console.error("updateGarageAvailabilityFn error:", error);
      return { success: false };
    }
  });

// ═════════════════════════════════════════════════════════════════════════════
// 9. Sync Clerk user to MongoDB users collection
// ═════════════════════════════════════════════════════════════════════════════
export const syncClerkUserFn = createServerFn({ method: "POST" })
  .validator(
    (v: unknown) =>
      v as { clerkId: string; name: string; email: string; role: "owner" | "mechanic" | "admin" },
  )
  .handler(async (ctx): Promise<{ success: boolean }> => {
    const payload = ctx.data;

    if (!payload.clerkId) return { success: false };

    try {
      const { getDb } = await import("@/lib/mongodb");
      const db = await getDb();

      await db.collection("users").updateOne(
        { clerkId: payload.clerkId },
        {
          $set: {
            name: payload.name,
            email: payload.email,
            role: payload.role,
            updatedAt: new Date(),
          },
          $setOnInsert: {
            clerkId: payload.clerkId,
            createdAt: new Date(),
          },
        },
        { upsert: true },
      );

      console.log(`✅ User synced: ${payload.email} (${payload.role})`);
      return { success: true };
    } catch (error) {
      console.warn("syncClerkUserFn skipped:", (error as Error).message);
      return { success: false };
    }
  });

// ═════════════════════════════════════════════════════════════════════════════
// 10. Create help request — Owner sends SOS to nearby mechanics
// ═════════════════════════════════════════════════════════════════════════════
export const createHelpRequestFn = createServerFn({ method: "POST" })
  .validator(
    (v: unknown) =>
      v as {
        ownerId: string;
        ownerName: string;
        ownerPhone: string;
        description: string;
        lat: number;
        lng: number;
      },
  )
  .handler(async (ctx): Promise<{ success: boolean; requestId?: string; error?: string }> => {
    const payload = ctx.data;
    if (!payload.ownerId) return { success: false, error: "Missing ownerId" };

    try {
      const { getDb } = await import("@/lib/mongodb");
      const db = await getDb();

      // Cancel any existing active request from this owner
      await db
        .collection("help_requests")
        .updateMany(
          { ownerId: payload.ownerId, status: { $in: ["pending", "accepted"] } },
          { $set: { status: "cancelled", updatedAt: new Date().toISOString() } },
        );

      const requestId = `req_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
      const now = new Date();
      const expiresAt = new Date(now.getTime() + 2 * 60 * 60 * 1000); // 2 hours

      await db.collection("help_requests").insertOne({
        id: requestId,
        ownerId: payload.ownerId,
        ownerName: payload.ownerName,
        ownerPhone: payload.ownerPhone,
        description: payload.description,
        lat: Number(payload.lat),
        lng: Number(payload.lng),
        status: "pending",
        acceptedByGarageId: null,
        createdAt: now.toISOString(),
        expiresAt: expiresAt.toISOString(),
      });

      console.log(`✅ Help request created: ${requestId} by ${payload.ownerId}`);
      return { success: true, requestId };
    } catch (error) {
      console.error("createHelpRequestFn error:", error);
      return { success: false, error: (error as Error).message };
    }
  });

// ═════════════════════════════════════════════════════════════════════════════
// 11. Get owner's active help request
// ═════════════════════════════════════════════════════════════════════════════
export const getMyHelpRequestFn = createServerFn({ method: "POST" })
  .validator((v: unknown) => v as { ownerId: string })
  .handler(async (ctx): Promise<HelpRequest | null> => {
    const { ownerId } = ctx.data;
    if (!ownerId) return null;

    try {
      const { getDb } = await import("@/lib/mongodb");
      const db = await getDb();

      const req = await db
        .collection("help_requests")
        .findOne(
          { ownerId, status: { $in: ["pending", "accepted", "done"] } },
          { sort: { createdAt: -1 } },
        );

      if (!req) return null;

      return {
        id: req.id as string,
        ownerId: req.ownerId as string,
        ownerName: req.ownerName as string,
        ownerPhone: req.ownerPhone as string,
        description: req.description as string,
        lat: req.lat as number,
        lng: req.lng as number,
        status: req.status as HelpRequestStatus,
        acceptedByGarageId: req.acceptedByGarageId as string | undefined,
        mechanicLat: req.mechanicLat as number | undefined,
        mechanicLng: req.mechanicLng as number | undefined,
        cost: req.cost as number | undefined,
        createdAt: req.createdAt as string,
        expiresAt: req.expiresAt as string,
      };
    } catch (error) {
      console.error("getMyHelpRequestFn error:", error);
      return null;
    }
  });

// ═════════════════════════════════════════════════════════════════════════════
// 12. Get active requests near a garage — for mechanic polling
// ═════════════════════════════════════════════════════════════════════════════
export const getActiveRequestsFn = createServerFn({ method: "POST" })
  .validator((v: unknown) => v as { garageId?: string; garageLat: number; garageLng: number })
  .handler(async (ctx): Promise<HelpRequest[]> => {
    const { garageId, garageLat, garageLng } = ctx.data;

    try {
      const { getDb } = await import("@/lib/mongodb");
      const db = await getDb();

      // Pending requests OR requests accepted by this garage that haven't expired
      const query = {
        $or: [
          { status: "pending" },
          ...(garageId ? [{ status: "accepted", acceptedByGarageId: garageId }] : []),
        ],
        expiresAt: { $gt: new Date().toISOString() },
      };

      const reqs = await db
        .collection("help_requests")
        .find(query)
        .sort({ createdAt: -1 })
        .toArray();

      return (reqs as Record<string, unknown>[])
        .map((r) => ({
          id: r.id as string,
          ownerId: r.ownerId as string,
          ownerName: r.ownerName as string,
          ownerPhone: r.ownerPhone as string,
          description: r.description as string,
          lat: r.lat as number,
          lng: r.lng as number,
          status: r.status as HelpRequestStatus,
          acceptedByGarageId: r.acceptedByGarageId as string | undefined,
          mechanicLat: r.mechanicLat as number | undefined,
          mechanicLng: r.mechanicLng as number | undefined,
          cost: r.cost as number | undefined,
          distanceKm: garageLat
            ? getDistanceKm(garageLat, garageLng, r.lat as number, r.lng as number)
            : undefined,
          createdAt: r.createdAt as string,
          expiresAt: r.expiresAt as string,
        }))
        .filter((r) => !garageLat || (r.distanceKm ?? 0) <= KURUNEGALA_RADIUS_KM)
        .sort((a, b) => (a.distanceKm ?? 0) - (b.distanceKm ?? 0));
    } catch (error) {
      console.error("getActiveRequestsFn error:", error);
      return [];
    }
  });

// ═════════════════════════════════════════════════════════════════════════════
// 13. Mechanic accepts / cancels help request
// ═════════════════════════════════════════════════════════════════════════════
export const updateHelpRequestFn = createServerFn({ method: "POST" })
  .validator(
    (v: unknown) =>
      v as { requestId: string; status: HelpRequestStatus; garageId?: string; cost?: number },
  )
  .handler(async (ctx): Promise<{ success: boolean }> => {
    const { requestId, status, garageId, cost } = ctx.data;
    if (!requestId) return { success: false };

    try {
      const { getDb } = await import("@/lib/mongodb");
      const db = await getDb();

      const result = await db.collection("help_requests").updateOne(
        { id: requestId },
        {
          $set: {
            status,
            ...(garageId ? { acceptedByGarageId: garageId } : {}),
            ...(cost !== undefined ? { cost } : {}),
            updatedAt: new Date().toISOString(),
          },
        },
      );

      console.log(
        `Help request ${requestId} → ${status}: ${result.modifiedCount > 0 ? "✅" : "❌"}`,
      );
      return { success: result.modifiedCount > 0 };
    } catch (error) {
      console.error("updateHelpRequestFn error:", error);
      return { success: false };
    }
  });

// ═════════════════════════════════════════════════════════════════════════════
// 14. Update mechanic's live location during an active request
// ═════════════════════════════════════════════════════════════════════════════
export const updateMechanicLocationFn = createServerFn({ method: "POST" })
  .validator((v: unknown) => v as { requestId: string; lat: number; lng: number })
  .handler(async (ctx): Promise<{ success: boolean }> => {
    const { requestId, lat, lng } = ctx.data;
    if (!requestId) return { success: false };

    try {
      const { getDb } = await import("@/lib/mongodb");
      const db = await getDb();

      const result = await db.collection("help_requests").updateOne(
        { id: requestId, status: "accepted" },
        {
          $set: {
            mechanicLat: lat,
            mechanicLng: lng,
            updatedAt: new Date().toISOString(),
          },
        },
      );

      return { success: result.modifiedCount > 0 };
    } catch (error) {
      console.error("updateMechanicLocationFn error:", error);
      return { success: false };
    }
  });

// ═════════════════════════════════════════════════════════════════════════════
// 15. Admin: Delete Garage
// ═════════════════════════════════════════════════════════════════════════════
export const deleteGarageFn = createServerFn({ method: "POST" })
  .validator((v: unknown) => v as { garageId: string })
  .handler(async (ctx): Promise<{ success: boolean; error?: string }> => {
    const { garageId } = ctx.data;
    if (!garageId) return { success: false, error: "Missing ID" };

    try {
      const { getDb } = await import("@/lib/mongodb");
      const db = await getDb();

      // Delete the shop
      const result = await db.collection("shops").deleteOne({ id: garageId });

      // Also cancel any help requests assigned to this garage
      await db.collection("help_requests").updateMany(
        { acceptedByGarageId: garageId, status: "accepted" },
        {
          $set: {
            status: "pending",
            acceptedByGarageId: null,
            updatedAt: new Date().toISOString(),
          },
        },
      );

      return { success: result.deletedCount > 0 };
    } catch (error) {
      console.error("deleteGarageFn error:", error);
      return { success: false, error: (error as Error).message };
    }
  });

// ═════════════════════════════════════════════════════════════════════════════
// 16. Admin: Get all help requests
// ═════════════════════════════════════════════════════════════════════════════
export const getAllHelpRequestsFn = createServerFn({ method: "POST" })
  .validator((v: unknown) => v as Record<string, unknown>)
  .handler(async (): Promise<HelpRequest[]> => {
    try {
      const { getDb } = await import("@/lib/mongodb");
      const db = await getDb();

      const reqs = await db.collection("help_requests").find({}).sort({ createdAt: -1 }).toArray();

      return (reqs as Record<string, unknown>[]).map((r) => ({
        id: r.id as string,
        ownerId: r.ownerId as string,
        ownerName: r.ownerName as string,
        ownerPhone: r.ownerPhone as string,
        description: r.description as string,
        lat: r.lat as number,
        lng: r.lng as number,
        status: r.status as HelpRequestStatus,
        acceptedByGarageId: r.acceptedByGarageId as string | undefined,
        mechanicLat: r.mechanicLat as number | undefined,
        mechanicLng: r.mechanicLng as number | undefined,
        createdAt: r.createdAt as string,
        expiresAt: r.expiresAt as string,
      }));
    } catch (error) {
      console.error("getAllHelpRequestsFn error:", error);
      return [];
    }
  });

// ═════════════════════════════════════════════════════════════════════════════
// 17. Admin: Delete help request
// ═════════════════════════════════════════════════════════════════════════════
export const deleteHelpRequestFn = createServerFn({ method: "POST" })
  .validator((v: unknown) => v as { requestId: string })
  .handler(async (ctx): Promise<{ success: boolean; error?: string }> => {
    const { requestId } = ctx.data;
    if (!requestId) return { success: false, error: "Missing ID" };

    try {
      const { getDb } = await import("@/lib/mongodb");
      const db = await getDb();

      const result = await db.collection("help_requests").deleteOne({ id: requestId });
      return { success: result.deletedCount > 0 };
    } catch (error) {
      console.error("deleteHelpRequestFn error:", error);
      return { success: false, error: (error as Error).message };
    }
  });

// ═════════════════════════════════════════════════════════════════════════════
// 18. Mechanic: Get Total Income
// ═════════════════════════════════════════════════════════════════════════════
export const getGarageIncomeFn = createServerFn({ method: "POST" })
  .validator((v: unknown) => v as { garageId: string })
  .handler(async (ctx): Promise<number> => {
    const { garageId } = ctx.data;
    if (!garageId) return 0;

    try {
      const { getDb } = await import("@/lib/mongodb");
      const db = await getDb();

      const reqs = await db
        .collection("help_requests")
        .find({
          acceptedByGarageId: garageId,
          status: { $in: ["done", "closed"] },
        })
        .toArray();

      return reqs.reduce((sum, req) => sum + (Number(req.cost) || 0), 0);
    } catch (error) {
      console.error("getGarageIncomeFn error:", error);
      return 0;
    }
  });

// ═════════════════════════════════════════════════════════════════════════════
// 19. Owner: Close Bill
// ═════════════════════════════════════════════════════════════════════════════
export const closeHelpRequestFn = createServerFn({ method: "POST" })
  .validator((v: unknown) => v as { requestId: string })
  .handler(async (ctx): Promise<{ success: boolean }> => {
    const { requestId } = ctx.data;
    if (!requestId) return { success: false };

    try {
      const { getDb } = await import("@/lib/mongodb");
      const db = await getDb();

      await db
        .collection("help_requests")
        .updateOne(
          { id: requestId },
          { $set: { status: "closed", updatedAt: new Date().toISOString() } },
        );

      return { success: true };
    } catch (error) {
      console.error("closeHelpRequestFn error:", error);
      return { success: false };
    }
  });
