import { o as __toESM } from "../_runtime.mjs";
import { m as require_react } from "../_libs/@clerk/clerk-react+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { S as updateHelpRequestFn, _ as getNearbyMechanicsFn, g as getMyHelpRequestFn, o as closeHelpRequestFn, s as createHelpRequestFn, w as useAuth } from "./AuthContext-mG2zIe-Y.mjs";
import { A as BellRing, E as CircleCheck, _ as Navigation, b as MapPin, d as Star, g as Phone, h as Receipt, i as Users, m as Search, n as X, o as TriangleAlert, r as Wrench, w as Clock } from "../_libs/lucide-react.mjs";
import { n as Button, t as AppHeader } from "./AppHeader-D8mzsOX_.mjs";
import { t as Badge } from "./badge-D-882LVm.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as Label, t as Input } from "./label-W_FRS3pT.mjs";
import { t as KURUNEGALA_CENTER } from "./types-C5anW29c.mjs";
import { t as useGeolocation } from "./useGeolocation-CixJ_UuI.mjs";
import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard-Buan6eBh.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* Fetches approved garages in the Kurunegala area from the server.
* Falls back to mock data if MongoDB is unavailable.
*/
function useMechanics(coords) {
	const effectiveCoords = coords ?? KURUNEGALA_CENTER;
	return useQuery({
		queryKey: [
			"mechanics",
			effectiveCoords.lat,
			effectiveCoords.lng
		],
		queryFn: async () => {
			const result = await getNearbyMechanicsFn({ data: {
				lat: effectiveCoords.lat,
				lng: effectiveCoords.lng
			} });
			if (Array.isArray(result)) return result;
			if (result && typeof result === "object" && "data" in result && Array.isArray(result.data)) return result.data;
			return [];
		},
		staleTime: 3e4,
		retry: 1
	});
}
var LeafletMap = (0, import_react.lazy)(() => import("./LeafletMap-Dkg2OuEt.mjs").then((m) => ({ default: m.LeafletMap })));
function OwnerDashboard() {
	const { user, loading } = useAuth();
	const navigate = useNavigate();
	const { state: geoState, coords: userCoords } = useGeolocation(KURUNEGALA_CENTER);
	const { data: mechanics = [], isLoading } = useMechanics(userCoords);
	const [selected, setSelected] = (0, import_react.useState)(null);
	const [query, setQuery] = (0, import_react.useState)("");
	const [showSearchDropdown, setShowSearchDropdown] = (0, import_react.useState)(false);
	const [showRequestModal, setShowRequestModal] = (0, import_react.useState)(false);
	const [requestForm, setRequestForm] = (0, import_react.useState)({
		description: "",
		phone: ""
	});
	const [submittingRequest, setSubmittingRequest] = (0, import_react.useState)(false);
	const [activeRequest, setActiveRequest] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		const first = mechanics?.[0];
		if (first?.id && !selected) setSelected(first.id);
	}, [mechanics, selected]);
	(0, import_react.useEffect)(() => {
		if (!loading && !user) navigate({
			to: "/login",
			replace: true
		});
		else if (user?.role === "admin") navigate({
			to: "/admin",
			replace: true
		});
		else if (user?.role === "mechanic") navigate({
			to: "/mechanic/pending",
			replace: true
		});
	}, [
		user,
		loading,
		navigate
	]);
	(0, import_react.useEffect)(() => {
		if (!user || user.role !== "owner") return;
		const check = () => {
			getMyHelpRequestFn({ data: { ownerId: user.id } }).then((r) => setActiveRequest(r ?? null)).catch(() => {});
		};
		check();
		const timer = setInterval(check, 1e4);
		return () => clearInterval(timer);
	}, [user]);
	if (!user) return null;
	let filtered = mechanics.filter((m) => !query || m.name.toLowerCase().includes(query.toLowerCase()) || m.specialty.toLowerCase().includes(query.toLowerCase()));
	if (activeRequest?.status === "accepted" && activeRequest.acceptedByGarageId) filtered = mechanics.filter((m) => m.id === activeRequest.acceptedByGarageId).map((m) => {
		if (activeRequest.mechanicLat && activeRequest.mechanicLng) return {
			...m,
			lat: activeRequest.mechanicLat,
			lng: activeRequest.mechanicLng
		};
		return m;
	});
	async function handleSubmitRequest(e) {
		e.preventDefault();
		if (!user) return;
		if (!requestForm.description.trim()) {
			toast.error("Please describe the problem");
			return;
		}
		setSubmittingRequest(true);
		try {
			if ((await createHelpRequestFn({ data: {
				ownerId: user.id,
				ownerName: user.name,
				ownerPhone: requestForm.phone || "Not provided",
				description: requestForm.description,
				lat: userCoords.lat,
				lng: userCoords.lng
			} }))?.success) {
				toast.success("🚨 Help request sent! Nearby mechanics will be notified.");
				setShowRequestModal(false);
				const req = await getMyHelpRequestFn({ data: { ownerId: user.id } });
				setActiveRequest(req ?? null);
			} else toast.error("Failed to send request. Try again.");
		} catch {
			toast.error("Something went wrong.");
		} finally {
			setSubmittingRequest(false);
		}
	}
	async function handleCancelRequest() {
		if (!activeRequest) return;
		try {
			await updateHelpRequestFn({ data: {
				requestId: activeRequest.id,
				status: "cancelled"
			} });
			toast.success("Request cancelled.");
			setActiveRequest(null);
		} catch {
			toast.error("Failed to cancel request.");
		}
	}
	async function handleCloseBill() {
		if (!activeRequest) return;
		try {
			await closeHelpRequestFn({ data: { requestId: activeRequest.id } });
			setActiveRequest(null);
		} catch {
			setActiveRequest(null);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto max-w-7xl px-3 py-4 sm:px-6 sm:py-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mb-4 flex flex-col-reverse items-start justify-between gap-4 sm:mb-6 sm:flex-row sm:flex-wrap",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 mb-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs uppercase tracking-wider text-gold sm:text-sm",
									children: "Vehicle Owner"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-1 rounded-full border border-gold/30 bg-gold/5 px-2 py-0.5 text-[10px] font-medium text-gold sm:text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-3 w-3" }), " Kurunegala Area"]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
								className: "mt-1 text-2xl font-bold sm:text-3xl lg:text-4xl",
								children: [
									"Hi ",
									user.name.split(" ")[0],
									", need a repair?"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 flex flex-col items-start gap-1 text-sm text-muted-foreground sm:mt-2 sm:flex-row sm:items-center sm:gap-2 sm:text-base",
								children: ["Showing verified mechanics near Kurunegala town.", geoState.status === "success" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] text-primary sm:text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigation, { className: "h-3 w-3" }), " Live location active"]
								})]
							})
						] })
					}),
					activeRequest?.status === "accepted" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-6 flex items-center gap-3 rounded-xl border border-primary/40 bg-primary/10 p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-6 w-6 text-primary shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-semibold text-primary",
							children: "A mechanic is on their way!"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground mt-0.5",
							children: "Your request has been accepted. Please stay at your location."
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "relative z-[2000] mb-4 flex flex-col gap-2 sm:mb-6 sm:flex-row sm:gap-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "surface-elevated flex items-center rounded-xl px-2 py-0.5 sm:rounded-2xl",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "ml-2 h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "mechanic-search",
									placeholder: "Search by shop name or specialty (brakes, engine…)",
									value: query,
									onChange: (e) => {
										setQuery(e.target.value);
										setShowSearchDropdown(true);
									},
									onFocus: () => setShowSearchDropdown(true),
									onBlur: () => setTimeout(() => setShowSearchDropdown(false), 200),
									className: "h-10 border-0 bg-transparent text-sm shadow-none focus-visible:ring-0 sm:h-11 sm:text-sm"
								})]
							}), showSearchDropdown && query.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "absolute top-full left-0 right-0 mt-2 max-h-[300px] overflow-y-auto rounded-xl border border-border bg-background p-2 shadow-2xl surface-elevated",
								children: filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-4 text-center text-sm text-muted-foreground",
									children: [
										"No garages found for \"",
										query,
										"\""
									]
								}) : filtered.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => {
										setSelected(m.id);
										setQuery(m.name);
										setShowSearchDropdown(false);
									},
									className: "flex w-full flex-col gap-1 rounded-lg px-4 py-3 text-left transition-colors hover:bg-muted",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-semibold text-foreground",
											children: m.name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "flex items-center gap-1 text-xs text-primary",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-3 w-3" }),
												" ",
												m.availableMechanics
											]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-muted-foreground",
										children: m.specialty
									})]
								}, m.id))
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-6 lg:grid-cols-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "lg:col-span-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, {
								fallback: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "animate-pulse rounded-xl border border-border bg-card sm:rounded-2xl h-[55vh] lg:h-[520px]" }),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "relative h-[55vh] sm:h-[450px] lg:h-[520px] rounded-xl sm:rounded-2xl overflow-hidden shadow-sm",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LeafletMap, {
										mechanics: filtered,
										selectedId: selected,
										onSelect: setSelected,
										userCoords,
										activeRequest,
										onRequestMechanic: () => setShowRequestModal(true)
									})
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "fixed bottom-6 left-1/2 -translate-x-1/2 z-[400] flex w-[90%] sm:w-auto justify-center",
								children: !activeRequest ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative group w-full sm:w-auto",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -inset-1 rounded-full bg-gradient-to-r from-red-600 via-orange-500 to-red-600 opacity-70 blur-md group-hover:opacity-100 animate-pulse transition duration-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										id: "request-mechanic-btn",
										onClick: () => setShowRequestModal(true),
										size: "lg",
										className: "relative flex items-center justify-center w-full sm:w-auto rounded-full border border-white/20 bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-2xl hover:scale-[1.02] active:scale-95 transition-all duration-300 text-sm sm:text-base px-6 py-4 font-extrabold overflow-hidden",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-white/10 group-hover:bg-transparent transition-colors duration-300" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-5 w-5 mr-2 drop-shadow-md animate-bounce relative z-10" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "drop-shadow-md tracking-wider relative z-10",
												children: "REQUEST MECHANIC HELP"
											})
										]
									})]
								}) : activeRequest.status === "done" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl border border-green-500/40 bg-green-500/10 px-6 py-4 shadow-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-6 w-6 text-green-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-lg font-bold text-green-600 dark:text-green-400",
										children: "Repair Completed"
									})]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex w-full sm:w-auto items-center justify-between gap-4 rounded-2xl border border-destructive/40 bg-destructive/10 px-6 py-4 shadow-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BellRing, { className: "h-6 w-6 text-destructive animate-pulse" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-lg font-bold text-destructive",
											children: activeRequest.status === "pending" ? "Request Pending..." : "Request Accepted! 🎉"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: handleCancelRequest,
										className: "flex h-8 w-8 items-center justify-center rounded-full bg-destructive/20 text-destructive hover:bg-destructive hover:text-white transition-colors",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-5 w-5" })
									})]
								})
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3 lg:col-span-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-lg font-semibold",
									children: "Nearby Garages"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "outline",
									className: "border-gold/40 text-gold",
									children: "Live"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "max-h-[520px] space-y-3 overflow-y-auto pr-1",
								children: isLoading ? [
									1,
									2,
									3
								].map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "animate-pulse rounded-xl border border-border bg-card p-4",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-start justify-between gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "w-2/3 space-y-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-4 w-3/4 rounded bg-muted/60" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-3.5 w-1/2 rounded bg-muted/60" })]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-8 w-8 rounded-lg bg-muted/60" })]
									})
								}, n)) : filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col items-center justify-center rounded-xl border border-border bg-card py-12 text-center text-muted-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wrench, { className: "mb-3 h-8 w-8 opacity-30" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm",
										children: "No garages match your search."
									})]
								}) : filtered.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									id: `mechanic-card-${m.id}`,
									onClick: () => setSelected(m.id),
									className: `w-full text-left surface-elevated rounded-xl p-4 transition-all ${selected === m.id ? "border-gold ring-1 ring-gold/40 shadow-lg" : "hover:border-gold/40"}`,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-start justify-between gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "min-w-0 flex-1",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wrench, { className: "h-4 w-4 shrink-0 text-gold" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "truncate font-semibold",
														children: m.name
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "mt-1 text-sm text-muted-foreground",
													children: m.specialty
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: `mt-2 flex items-center gap-1 text-xs font-medium ${m.availableMechanics > 0 ? "text-primary" : "text-muted-foreground"}`,
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-3 w-3" }), m.availableMechanics > 0 ? `${m.availableMechanics} mechanic${m.availableMechanics > 1 ? "s" : ""} available` : "No mechanics available now"]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
															className: "flex items-center gap-1",
															children: [
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-3 w-3" }),
																" ",
																m.distanceKm,
																" km"
															]
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
															className: "flex items-center gap-1",
															children: [
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "h-3 w-3 fill-gold text-gold" }),
																" ",
																m.rating || "New"
															]
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
															className: `flex items-center gap-1 ${m.open ? "text-primary" : "text-destructive"}`,
															children: [
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-3 w-3" }),
																" ",
																m.open ? "Open" : "Closed"
															]
														})
													]
												})
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex flex-col gap-2 shrink-0",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
												href: `tel:${m.phone}`,
												onClick: (e) => e.stopPropagation(),
												className: "rounded-lg gold-gradient p-2 text-background hover:opacity-90",
												"aria-label": `Call ${m.name}`,
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "h-4 w-4" })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
												href: `https://www.google.com/maps/dir/?api=1&origin=${userCoords.lat},${userCoords.lng}&destination=${m.lat},${m.lng}`,
												target: "_blank",
												rel: "noopener noreferrer",
												onClick: (e) => e.stopPropagation(),
												className: "rounded-lg border border-primary/40 bg-primary/10 p-2 text-primary hover:bg-primary/20",
												"aria-label": `Directions to ${m.name}`,
												title: "Get Directions",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigation, { className: "h-4 w-4" })
											})]
										})]
									})
								}, m.id))
							})]
						})]
					})
				]
			}),
			showRequestModal && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full max-w-md surface-elevated rounded-2xl p-6 shadow-2xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between mb-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex h-9 w-9 items-center justify-center rounded-lg bg-destructive/20",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-5 w-5 text-destructive" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "font-bold text-lg",
									children: "Request Mechanic Help"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: "Nearby mechanics will be notified"
								})] })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setShowRequestModal(false),
								className: "text-muted-foreground hover:text-foreground",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-5 w-5" })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-4 flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/10 px-3 py-2 text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigation, { className: "h-3 w-3 text-primary shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-primary",
								children: [
									"Your location: ",
									userCoords.lat.toFixed(4),
									", ",
									userCoords.lng.toFixed(4)
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							onSubmit: handleSubmitRequest,
							className: "space-y-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "req-description",
										children: "What's wrong with your vehicle? *"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
										id: "req-description",
										required: true,
										rows: 3,
										placeholder: "e.g. Engine won't start, flat tyre on Colombo Rd near the bridge...",
										value: requestForm.description,
										onChange: (e) => setRequestForm((f) => ({
											...f,
											description: e.target.value
										})),
										className: "w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring resize-none"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "req-phone",
										children: "Your Contact Number"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "req-phone",
										type: "tel",
										placeholder: "+94 77 XXX XXXX",
										value: requestForm.phone,
										onChange: (e) => setRequestForm((f) => ({
											...f,
											phone: e.target.value
										}))
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex gap-3 pt-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										type: "button",
										variant: "outline",
										className: "flex-1",
										onClick: () => setShowRequestModal(false),
										children: "Cancel"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										type: "submit",
										className: "flex-1 bg-destructive/90 hover:bg-destructive text-white border-0",
										disabled: submittingRequest,
										children: submittingRequest ? "Sending..." : "🚨 Send SOS Request"
									})]
								})
							]
						})
					]
				})
			}),
			activeRequest?.status === "done" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-[9999] flex items-center justify-center bg-background/90 backdrop-blur-md p-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "surface-elevated w-full max-w-sm rounded-3xl p-8 shadow-2xl animate-in zoom-in-95 duration-300",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col items-center text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10 mb-4 border border-green-500/20",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Receipt, { className: "h-8 w-8 text-green-500" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-2xl font-bold mb-2",
								children: "Repair Completed"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground mb-6",
								children: "Your mechanic has successfully finished the repair. Here is the final bill."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "w-full rounded-2xl border border-border bg-background/50 p-5 mb-8",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between items-center mb-4 pb-4 border-b border-border/50",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-sm text-muted-foreground",
											children: "Mechanic"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-semibold",
											children: activeRequest.acceptedByGarageId ? mechanics.find((m) => m.id === activeRequest.acceptedByGarageId)?.name || "Mechanic" : "Mechanic"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between items-center mb-4 pb-4 border-b border-border/50",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-sm text-muted-foreground",
											children: "Issue"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-medium text-sm text-right line-clamp-1 max-w-[150px]",
											title: activeRequest.description,
											children: activeRequest.description
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between items-center pt-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-base font-semibold",
											children: "Total Cost"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-2xl font-bold text-gold",
											children: ["Rs. ", (activeRequest.cost || 0).toLocaleString()]
										})]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								onClick: handleCloseBill,
								size: "lg",
								className: "w-full h-12 text-base font-semibold gold-gradient text-background rounded-xl",
								children: "Close & Return"
							})
						]
					})
				})
			})
		]
	});
}
//#endregion
export { OwnerDashboard as component };
