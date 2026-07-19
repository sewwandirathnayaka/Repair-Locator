/**
 * Centralized TypeScript types for Repair Locator.
 * These match the MongoDB schema (shops, users, bookings collections).
 */

// ─── Auth ───────────────────────────────────────────────────────────────────

export type UserRole = "owner" | "mechanic" | "admin";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  verified: boolean;
  garageStatus?: GarageStatus; // only for mechanic role
}

// ─── Garage / Shop ────────────────────────────────────────────────────────────

export type GarageStatus = "pending" | "approved" | "rejected";

export interface Garage {
  id: string;
  /** Clerk user ID of the mechanic/garage owner */
  ownerClerkId: string;
  name: string;
  address: string;
  phone: string;
  specialty: string;
  /** WGS-84 latitude */
  lat: number;
  /** WGS-84 longitude */
  lng: number;
  /** Straight-line distance from user's location in km (computed at query time) */
  distanceKm: number;
  /** Admin approval status */
  status: GarageStatus;
  /** Currently available mechanics at this garage */
  availableMechanics: number;
  /** Total mechanics registered at this garage */
  totalMechanics: number;
  /** Average customer rating (0–5) */
  rating: number;
  /** Whether the garage is currently open */
  open: boolean;
  /** NVQ certificate stored as base64 data URL */
  nvqCertificateBase64?: string;
  /** Original certificate file name */
  nvqCertificateName?: string;
  /** Services offered */
  services?: string[];
  createdAt?: string;
}

/** Alias — Mechanic is a Garage from the owner/map perspective */
export type Mechanic = Garage;

// ─── Booking ─────────────────────────────────────────────────────────────────

export type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled";

export interface Booking {
  id: string;
  userId: string;
  shopId: string;
  status: BookingStatus;
  scheduledAt: string;
  notes?: string;
  createdAt: string;
}

// ─── Geolocation ─────────────────────────────────────────────────────────────

export interface Coords {
  lat: number;
  lng: number;
}

// ─── Kurunegala area constants ────────────────────────────────────────────────

/** Kurunegala town center coordinates */
export const KURUNEGALA_CENTER: Coords = { lat: 7.4818, lng: 80.3609 };

/** Radius in km for the Kurunegala area filter */
export const KURUNEGALA_RADIUS_KM = 6;

// ─── Help Request (vehicle owner → mechanic) ──────────────────────────────────

export type HelpRequestStatus = "pending" | "accepted" | "done" | "closed" | "cancelled";

export interface HelpRequest {
  id: string;
  ownerId: string;
  ownerName: string;
  ownerPhone: string;
  description: string;
  lat: number;
  lng: number;
  status: HelpRequestStatus;
  acceptedByGarageId?: string;
  mechanicLat?: number; // live tracking lat
  mechanicLng?: number; // live tracking lng
  distanceKm?: number; // distance from mechanic's garage to vehicle
  cost?: number; // billing cost in LKR
  createdAt: string;
  expiresAt: string;
}
