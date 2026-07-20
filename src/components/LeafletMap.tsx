import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle, Polyline } from "react-leaflet";
import L from "leaflet";
import type { Mechanic, Coords } from "@/types";
import type { HelpRequest } from "@/types";
import { useTheme } from "@/context/ThemeContext";

// ─── Custom SVG marker icons ──────────────────────────────────────────────────

function createShopIcon(isSelected: boolean) {
  const color = isSelected ? "#f5e642" : "#c9a227";
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 40" width="32" height="40">
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000" flood-opacity="0.5"/>
      </filter>
      <path filter="url(#shadow)"
        d="M16 0C7.163 0 0 7.163 0 16c0 10.5 14 24 16 24s16-13.5 16-24C32 7.163 24.837 0 16 0z"
        fill="${color}"/>
      <circle cx="16" cy="15" r="7" fill="${isSelected ? "#1a1a0e" : "#2a2010"}"/>
      <path d="M12 13h8M12 15h8M13 11v8" stroke="${color}" stroke-width="1.8" stroke-linecap="round"/>
    </svg>
  `;
  return L.divIcon({
    html: svg,
    className: "",
    iconSize: [32, 40],
    iconAnchor: [16, 40],
    popupAnchor: [0, -42],
  });
}

// ─── Light-green pulsing user location icon ───────────────────────────────────
function createUserIcon() {
  const html = `
    <div style="position:relative;width:32px;height:32px;display:flex;align-items:center;justify-content:center;">
      <div class="user-ping-ring" style="
        position:absolute;width:32px;height:32px;border-radius:50%;
        background:rgba(74,222,128,0.35);border:2px solid rgba(74,222,128,0.6);">
      </div>
      <div style="
        width:16px;height:16px;border-radius:50%;
        background:linear-gradient(135deg,#4ade80,#16a34a);
        border:3px solid #fff;
        box-shadow:0 0 10px rgba(74,222,128,0.7);">
      </div>
    </div>`;
  return L.divIcon({ html, className: "", iconSize: [32, 32], iconAnchor: [16, 16] });
}

// ─── Red SOS icon for vehicle in distress ────────────────────────────────────
function createSosIcon() {
  const html = `
    <div style="position:relative;width:36px;height:36px;display:flex;align-items:center;justify-content:center;">
      <div style="
        position:absolute;width:36px;height:36px;border-radius:50%;
        background:rgba(239,68,68,0.3);border:2px solid rgba(239,68,68,0.7);
        animation:user-ping 1.2s cubic-bezier(0,0,0.2,1) infinite;">
      </div>
      <div style="
        width:18px;height:18px;border-radius:50%;
        background:linear-gradient(135deg,#ef4444,#b91c1c);
        border:3px solid #fff;
        box-shadow:0 0 12px rgba(239,68,68,0.8);">
      </div>
    </div>`;
  return L.divIcon({ html, className: "", iconSize: [36, 36], iconAnchor: [18, 18] });
}

// ─── Recenter helper ──────────────────────────────────────────────────────────
function RecenterMap({ coords }: { coords: Coords }) {
  const map = useMap();
  const prev = useRef<Coords | null>(null);
  useEffect(() => {
    if (!prev.current || prev.current.lat !== coords.lat || prev.current.lng !== coords.lng) {
      map.setView([coords.lat, coords.lng], map.getZoom(), { animate: true });
      prev.current = coords;
    }
  }, [coords, map]);
  return null;
}

// ─── Tile layer switcher ──────────────────────────────────────────────────────
function ThemedTileLayer() {
  const { theme } = useTheme();
  return theme === "light" ? (
    <TileLayer
      url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
      maxZoom={20}
    />
  ) : (
    <TileLayer
      url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
      maxZoom={20}
    />
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────
interface LeafletMapProps {
  mechanics: Mechanic[];
  selectedId?: string | null;
  onSelect?: (id: string) => void;
  userCoords: Coords;
  activeRequest?: HelpRequest | null;
  onRequestMechanic?: (garageId: string) => void;
}

export function LeafletMap({
  mechanics,
  selectedId,
  onSelect,
  userCoords,
  activeRequest,
  onRequestMechanic,
}: LeafletMapProps) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-border h-full w-full">
      <MapContainer
        center={[userCoords.lat, userCoords.lng]}
        zoom={14}
        style={{ height: "100%", width: "100%", borderRadius: "0.75rem" }}
        zoomControl={false}
        attributionControl={false}
      >
        <LocateControl coords={userCoords} />
        <ThemedTileLayer />
        <RecenterMap coords={userCoords} />

        {/* User location — light green pulsing marker */}
        <Marker position={[userCoords.lat, userCoords.lng]} icon={createUserIcon()}>
          <Popup className="leaflet-popup-gold">
            <div style={{ fontFamily: "Inter, sans-serif", minWidth: "140px" }}>
              <p style={{ fontWeight: 700, marginBottom: "4px", color: "#4ade80" }}>
                📍 Your Location
              </p>
              <p style={{ fontSize: "11px", color: "#aaa" }}>
                lat {userCoords.lat.toFixed(4)}, lng {userCoords.lng.toFixed(4)}
              </p>
            </div>
          </Popup>
        </Marker>

        {/* Accuracy ring around user — green tint */}
        <Circle
          center={[userCoords.lat, userCoords.lng]}
          radius={150}
          pathOptions={{
            color: "#4ade80",
            fillColor: "#4ade80",
            fillOpacity: 0.06,
            weight: 1.5,
            dashArray: "4 4",
          }}
        />

        {/* Active help request — SOS marker + polyline to nearest garage */}
        {activeRequest && (
          <>
            <Marker position={[activeRequest.lat, activeRequest.lng]} icon={createSosIcon()}>
              <Popup>
                <div style={{ fontFamily: "Inter, sans-serif", minWidth: "160px" }}>
                  <p style={{ fontWeight: 700, color: "#ef4444", marginBottom: "4px" }}>
                    🚨 Help Requested
                  </p>
                  <p style={{ fontSize: "12px", color: "#aaa", marginBottom: "6px" }}>
                    {activeRequest.description}
                  </p>
                  <p style={{ fontSize: "11px", color: "#ccc" }}>📞 {activeRequest.ownerPhone}</p>
                </div>
              </Popup>
            </Marker>
            {/* Dashed line from user to SOS if different */}
            {(activeRequest.lat !== userCoords.lat || activeRequest.lng !== userCoords.lng) && (
              <Polyline
                positions={[
                  [userCoords.lat, userCoords.lng],
                  [activeRequest.lat, activeRequest.lng],
                ]}
                pathOptions={{ color: "#ef4444", weight: 2.5, dashArray: "8 6", opacity: 0.7 }}
              />
            )}
          </>
        )}

        {/* Mechanic / garage markers */}
        {mechanics.map((m) => {
          const showRoute = activeRequest && selectedId === m.id;
          return (
            <Marker
              key={m.id}
              position={[m.lat, m.lng]}
              icon={createShopIcon(selectedId === m.id)}
              eventHandlers={{ click: () => onSelect?.(m.id) }}
            >
              <Popup>
                <div style={{ minWidth: "190px", fontFamily: "Inter, sans-serif" }}>
                  <p style={{ fontWeight: 700, marginBottom: "4px", color: "#f5e642" }}>{m.name}</p>
                  <p style={{ fontSize: "12px", color: "#aaa", marginBottom: "6px" }}>
                    {m.specialty}
                  </p>
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      fontSize: "11px",
                      color: "#ccc",
                      marginBottom: "6px",
                    }}
                  >
                    <span>⭐ {m.rating || "New"}</span>
                    <span>📍 {m.distanceKm} km</span>
                    <span style={{ color: m.open ? "#4ade80" : "#f87171" }}>
                      {m.open ? "● Open" : "● Closed"}
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: "11px",
                      marginBottom: "10px",
                      color: (m.availableMechanics ?? 0) > 0 ? "#4ade80" : "#f87171",
                    }}
                  >
                    👷{" "}
                    {(m.availableMechanics ?? 0) > 0
                      ? `${m.availableMechanics} mechanic${m.availableMechanics > 1 ? "s" : ""} available`
                      : "No mechanics available now"}
                  </div>
                  <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                    <a
                      href={`tel:${m.phone}`}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                        background: "linear-gradient(135deg, #f5e642, #c9a227)",
                        color: "#1a1a0e",
                        padding: "5px 10px",
                        borderRadius: "6px",
                        fontSize: "11px",
                        fontWeight: 600,
                        textDecoration: "none",
                      }}
                    >
                      📞 Call
                    </a>
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&origin=${userCoords.lat},${userCoords.lng}&destination=${m.lat},${m.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                        background: "rgba(74,222,128,0.15)",
                        border: "1px solid rgba(74,222,128,0.4)",
                        color: "#4ade80",
                        padding: "5px 10px",
                        borderRadius: "6px",
                        fontSize: "11px",
                        fontWeight: 600,
                        textDecoration: "none",
                      }}
                    >
                      🧭 Directions
                    </a>
                    {onRequestMechanic && m.open && (m.availableMechanics ?? 0) > 0 && (
                      <button
                        onClick={() => onRequestMechanic(m.id)}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                          background: "rgba(239,68,68,0.15)",
                          border: "1px solid rgba(239,68,68,0.5)",
                          color: "#f87171",
                          padding: "5px 10px",
                          borderRadius: "6px",
                          fontSize: "11px",
                          fontWeight: 600,
                          cursor: "pointer",
                          width: "100%",
                          marginTop: "2px",
                          justifyContent: "center",
                        }}
                      >
                        🚨 Request Help
                      </button>
                    )}
                  </div>
                </div>
              </Popup>
              {/* Direction line from garage to SOS vehicle */}
              {showRoute && (
                <Polyline
                  positions={[
                    [m.lat, m.lng],
                    [activeRequest!.lat, activeRequest!.lng],
                  ]}
                  pathOptions={{ color: "#f5e642", weight: 3, dashArray: "10 6", opacity: 0.85 }}
                />
              )}
            </Marker>
          );
        })}
      </MapContainer>

      {/* Legend */}
      <div className="absolute top-3 left-3 z-[1000] flex items-center gap-3 rounded-lg border border-border bg-background/80 px-3 py-1.5 text-xs text-muted-foreground backdrop-blur-sm shadow-md">
        <span className="inline-flex items-center gap-1.5">
          <span
            className="inline-block h-2.5 w-2.5 rounded-full"
            style={{ background: "#4ade80" }}
          />
          You
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span
            className="inline-block h-2.5 w-2.5 rounded-full"
            style={{ background: "#f5e642" }}
          />
          Garage
        </span>
        {activeRequest && (
          <span className="inline-flex items-center gap-1.5">
            <span
              className="inline-block h-2.5 w-2.5 rounded-full"
              style={{ background: "#ef4444" }}
            />
            SOS
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Locate Control component ────────────────────────────────────────────────
function LocateControl({ coords }: { coords: Coords }) {
  const map = useMap();
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        map.setView([coords.lat, coords.lng], 15, { animate: true });
      }}
      className="absolute top-4 right-3 z-[1000] flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background shadow-md hover:bg-muted"
      title="Locate Me"
      aria-label="Locate Me"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-primary"
      >
        <circle cx="12" cy="12" r="10"></circle>
        <circle cx="12" cy="12" r="3"></circle>
      </svg>
    </button>
  );
}
