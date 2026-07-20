import { o as __toESM } from "../_runtime.mjs";
import { m as require_react } from "../_libs/@clerk/clerk-react+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as useTheme } from "./ThemeContext-DREed0KF.mjs";
import { t as require_leaflet_src } from "../_libs/leaflet.mjs";
import { a as MapContainer, i as Marker, n as Popup, o as Circle, r as Polyline, s as useMap, t as TileLayer } from "../_libs/react-leaflet.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/LeafletMap-f5507Qb6.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var import_leaflet_src = /* @__PURE__ */ __toESM(require_leaflet_src());
function createShopIcon(isSelected) {
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
	return import_leaflet_src.default.divIcon({
		html: svg,
		className: "",
		iconSize: [32, 40],
		iconAnchor: [16, 40],
		popupAnchor: [0, -42]
	});
}
function createUserIcon() {
	return import_leaflet_src.default.divIcon({
		html: `
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
    </div>`,
		className: "",
		iconSize: [32, 32],
		iconAnchor: [16, 16]
	});
}
function createSosIcon() {
	return import_leaflet_src.default.divIcon({
		html: `
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
    </div>`,
		className: "",
		iconSize: [36, 36],
		iconAnchor: [18, 18]
	});
}
function RecenterMap({ coords }) {
	const map = useMap();
	const prev = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		if (!prev.current || prev.current.lat !== coords.lat || prev.current.lng !== coords.lng) {
			map.setView([coords.lat, coords.lng], map.getZoom(), { animate: true });
			prev.current = coords;
		}
	}, [coords, map]);
	return null;
}
function ThemedTileLayer() {
	const { theme } = useTheme();
	return theme === "light" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TileLayer, {
		url: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
		attribution: "© <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors © <a href=\"https://carto.com/attributions\">CARTO</a>",
		maxZoom: 20
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TileLayer, {
		url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
		attribution: "© <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors © <a href=\"https://carto.com/attributions\">CARTO</a>",
		maxZoom: 20
	});
}
function LeafletMap({ mechanics, selectedId, onSelect, userCoords, activeRequest, onRequestMechanic }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative overflow-hidden rounded-xl border border-border h-full w-full",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(MapContainer, {
			center: [userCoords.lat, userCoords.lng],
			zoom: 14,
			style: {
				height: "100%",
				width: "100%",
				borderRadius: "0.75rem"
			},
			zoomControl: false,
			attributionControl: false,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LocateControl, { coords: userCoords }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemedTileLayer, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecenterMap, { coords: userCoords }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Marker, {
					position: [userCoords.lat, userCoords.lng],
					icon: createUserIcon(),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Popup, {
						className: "leaflet-popup-gold",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							style: {
								fontFamily: "Inter, sans-serif",
								minWidth: "140px"
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								style: {
									fontWeight: 700,
									marginBottom: "4px",
									color: "#4ade80"
								},
								children: "📍 Your Location"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								style: {
									fontSize: "11px",
									color: "#aaa"
								},
								children: [
									"lat ",
									userCoords.lat.toFixed(4),
									", lng ",
									userCoords.lng.toFixed(4)
								]
							})]
						})
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Circle, {
					center: [userCoords.lat, userCoords.lng],
					radius: 150,
					pathOptions: {
						color: "#4ade80",
						fillColor: "#4ade80",
						fillOpacity: .06,
						weight: 1.5,
						dashArray: "4 4"
					}
				}),
				activeRequest && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Marker, {
					position: [activeRequest.lat, activeRequest.lng],
					icon: createSosIcon(),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Popup, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						style: {
							fontFamily: "Inter, sans-serif",
							minWidth: "160px"
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								style: {
									fontWeight: 700,
									color: "#ef4444",
									marginBottom: "4px"
								},
								children: "🚨 Help Requested"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								style: {
									fontSize: "12px",
									color: "#aaa",
									marginBottom: "6px"
								},
								children: activeRequest.description
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								style: {
									fontSize: "11px",
									color: "#ccc"
								},
								children: ["📞 ", activeRequest.ownerPhone]
							})
						]
					}) })
				}), (activeRequest.lat !== userCoords.lat || activeRequest.lng !== userCoords.lng) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Polyline, {
					positions: [[userCoords.lat, userCoords.lng], [activeRequest.lat, activeRequest.lng]],
					pathOptions: {
						color: "#ef4444",
						weight: 2.5,
						dashArray: "8 6",
						opacity: .7
					}
				})] }),
				mechanics.map((m) => {
					const showRoute = activeRequest && selectedId === m.id;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Marker, {
						position: [m.lat, m.lng],
						icon: createShopIcon(selectedId === m.id),
						eventHandlers: { click: () => onSelect?.(m.id) },
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Popup, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							style: {
								minWidth: "190px",
								fontFamily: "Inter, sans-serif"
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									style: {
										fontWeight: 700,
										marginBottom: "4px",
										color: "#f5e642"
									},
									children: m.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									style: {
										fontSize: "12px",
										color: "#aaa",
										marginBottom: "6px"
									},
									children: m.specialty
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									style: {
										display: "flex",
										gap: "10px",
										fontSize: "11px",
										color: "#ccc",
										marginBottom: "6px"
									},
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["⭐ ", m.rating || "New"] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
											"📍 ",
											m.distanceKm,
											" km"
										] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											style: { color: m.open ? "#4ade80" : "#f87171" },
											children: m.open ? "● Open" : "● Closed"
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									style: {
										fontSize: "11px",
										marginBottom: "10px",
										color: (m.availableMechanics ?? 0) > 0 ? "#4ade80" : "#f87171"
									},
									children: [
										"👷",
										" ",
										(m.availableMechanics ?? 0) > 0 ? `${m.availableMechanics} mechanic${m.availableMechanics > 1 ? "s" : ""} available` : "No mechanics available now"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									style: {
										display: "flex",
										gap: "6px",
										flexWrap: "wrap"
									},
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
											href: `tel:${m.phone}`,
											style: {
												display: "inline-flex",
												alignItems: "center",
												gap: "4px",
												background: "linear-gradient(135deg, #f5e642, #c9a227)",
												color: "#1a1a0e",
												padding: "5px 10px",
												borderRadius: "6px",
												fontSize: "11px",
												fontWeight: 600,
												textDecoration: "none"
											},
											children: "📞 Call"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
											href: `https://www.google.com/maps/dir/?api=1&origin=${userCoords.lat},${userCoords.lng}&destination=${m.lat},${m.lng}`,
											target: "_blank",
											rel: "noopener noreferrer",
											style: {
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
												textDecoration: "none"
											},
											children: "🧭 Directions"
										}),
										onRequestMechanic && m.open && (m.availableMechanics ?? 0) > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => onRequestMechanic(m.id),
											style: {
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
												justifyContent: "center"
											},
											children: "🚨 Request Help"
										})
									]
								})
							]
						}) }), showRoute && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Polyline, {
							positions: [[m.lat, m.lng], [activeRequest.lat, activeRequest.lng]],
							pathOptions: {
								color: "#f5e642",
								weight: 3,
								dashArray: "10 6",
								opacity: .85
							}
						})]
					}, m.id);
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "absolute top-3 left-3 z-[1000] flex items-center gap-3 rounded-lg border border-border bg-background/80 px-3 py-1.5 text-xs text-muted-foreground backdrop-blur-sm shadow-md",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "inline-flex items-center gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "inline-block h-2.5 w-2.5 rounded-full",
						style: { background: "#4ade80" }
					}), "You"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "inline-flex items-center gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "inline-block h-2.5 w-2.5 rounded-full",
						style: { background: "#f5e642" }
					}), "Garage"]
				}),
				activeRequest && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "inline-flex items-center gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "inline-block h-2.5 w-2.5 rounded-full",
						style: { background: "#ef4444" }
					}), "SOS"]
				})
			]
		})]
	});
}
function LocateControl({ coords }) {
	const map = useMap();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		onClick: (e) => {
			e.preventDefault();
			e.stopPropagation();
			map.setView([coords.lat, coords.lng], 15, { animate: true });
		},
		className: "absolute top-4 right-3 z-[1000] flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background shadow-md hover:bg-muted",
		title: "Locate Me",
		"aria-label": "Locate Me",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			xmlns: "http://www.w3.org/2000/svg",
			width: "20",
			height: "20",
			viewBox: "0 0 24 24",
			fill: "none",
			stroke: "currentColor",
			strokeWidth: "2",
			strokeLinecap: "round",
			strokeLinejoin: "round",
			className: "text-primary",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "12",
				cy: "12",
				r: "10"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "12",
				cy: "12",
				r: "3"
			})]
		})
	});
}
//#endregion
export { LeafletMap };
