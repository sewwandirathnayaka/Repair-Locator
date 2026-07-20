import { o as __toESM } from "../_runtime.mjs";
import { m as require_react } from "../_libs/@clerk/clerk-react+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { C as updateMechanicLocationFn, S as updateHelpRequestFn, d as getActiveRequestsFn, h as getMyGarageFn, m as getGarageIncomeFn, w as useAuth, x as updateGarageAvailabilityFn } from "./AuthContext-mG2zIe-Y.mjs";
import { E as CircleCheck, _ as Navigation, b as MapPin, c as ToggleRight, d as Star, g as Phone, i as Users, k as Bell, l as ToggleLeft, o as TriangleAlert, r as Wrench, w as Clock } from "../_libs/lucide-react.mjs";
import { n as Button, t as AppHeader } from "./AppHeader-D8mzsOX_.mjs";
import { t as Badge } from "./badge-D-882LVm.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as KURUNEGALA_CENTER } from "./types-C5anW29c.mjs";
import { t as useGeolocation } from "./useGeolocation-CixJ_UuI.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard-IT9pwo3v.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function MechanicDashboardPage() {
	const { user, loading } = useAuth();
	const navigate = useNavigate();
	const [garage, setGarage] = (0, import_react.useState)(null);
	const [fetching, setFetching] = (0, import_react.useState)(true);
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [available, setAvailable] = (0, import_react.useState)(0);
	const [isOpen, setIsOpen] = (0, import_react.useState)(false);
	const [helpRequests, setHelpRequests] = (0, import_react.useState)([]);
	const [prevCount, setPrevCount] = (0, import_react.useState)(0);
	const [acceptingId, setAcceptingId] = (0, import_react.useState)(null);
	const notifiedIds = (0, import_react.useRef)(/* @__PURE__ */ new Set());
	const [totalIncome, setTotalIncome] = (0, import_react.useState)(0);
	const [completingRequest, setCompletingRequest] = (0, import_react.useState)(null);
	const [repairCost, setRepairCost] = (0, import_react.useState)("");
	const { coords: mechanicCoords } = useGeolocation(KURUNEGALA_CENTER);
	(0, import_react.useEffect)(() => {
		if (!loading && !user) navigate({
			to: "/login",
			replace: true
		});
		if (!loading && user?.role === "owner") navigate({
			to: "/dashboard",
			replace: true
		});
		if (!loading && user?.role === "admin") navigate({
			to: "/admin",
			replace: true
		});
	}, [
		user,
		loading,
		navigate
	]);
	(0, import_react.useEffect)(() => {
		if (!user) return;
		getMyGarageFn({ data: { clerkId: user.id } }).then((g) => {
			if (!g) navigate({
				to: "/mechanic/register",
				replace: true
			});
			else if (g.status !== "approved") navigate({
				to: "/mechanic/pending",
				replace: true
			});
			else {
				setGarage(g);
				setAvailable(g.availableMechanics ?? 0);
				setIsOpen(g.open ?? false);
				getGarageIncomeFn({ data: { garageId: g.id } }).then(setTotalIncome).catch(() => {});
			}
		}).catch(() => {}).finally(() => setFetching(false));
	}, [user, navigate]);
	(0, import_react.useEffect)(() => {
		if (!garage) return;
		const poll = () => {
			getActiveRequestsFn({ data: {
				garageId: garage.id,
				garageLat: garage.lat,
				garageLng: garage.lng
			} }).then((reqs) => {
				const incoming = reqs.filter((r) => r.status === "pending" && !notifiedIds.current.has(r.id));
				if (incoming.length > 0) incoming.forEach((r) => {
					notifiedIds.current.add(r.id);
					toast(`🚨 New help request! ${r.ownerName} needs assistance — ${r.distanceKm?.toFixed(1) ?? "?"}km away`, {
						duration: 1e4,
						action: {
							label: "View",
							onClick: () => {
								const el = document.getElementById("requests-section");
								if (el) {
									el.scrollIntoView({ behavior: "smooth" });
									setTimeout(() => window.scrollTo({
										top: el.getBoundingClientRect().top + window.scrollY - 100,
										behavior: "smooth"
									}), 50);
								}
							}
						}
					});
				});
				setHelpRequests(reqs);
				setPrevCount(reqs.length);
			}).catch(() => {});
		};
		poll();
		const timer = setInterval(poll, 5e3);
		return () => clearInterval(timer);
	}, [garage]);
	(0, import_react.useEffect)(() => {
		const acceptedRequests = helpRequests.filter((r) => r.status === "accepted");
		if (acceptedRequests.length === 0) return;
		const pushLocation = () => {
			for (const req of acceptedRequests) updateMechanicLocationFn({ data: {
				requestId: req.id,
				lat: mechanicCoords.lat,
				lng: mechanicCoords.lng
			} }).catch(() => {});
		};
		pushLocation();
		const timer = setInterval(pushLocation, 5e3);
		return () => clearInterval(timer);
	}, [helpRequests, mechanicCoords]);
	async function handleSave() {
		if (!garage) return;
		setSaving(true);
		try {
			if ((await updateGarageAvailabilityFn({ data: {
				garageId: garage.id,
				availableMechanics: available,
				open: isOpen
			} }))?.success) {
				setGarage((g) => g ? {
					...g,
					availableMechanics: available,
					open: isOpen
				} : g);
				toast.success("Availability updated successfully!");
			} else toast.error("Failed to update. Please try again.");
		} catch {
			toast.error("Something went wrong.");
		} finally {
			setSaving(false);
		}
	}
	async function handleAcceptRequest(req) {
		if (!garage) return;
		if (req.status === "accepted") {
			setCompletingRequest(req);
			setRepairCost("");
			return;
		}
		setAcceptingId(req.id);
		try {
			if ((await updateHelpRequestFn({ data: {
				requestId: req.id,
				status: "accepted",
				garageId: garage.id
			} }))?.success) {
				toast.success(`✅ You accepted the request from ${req.ownerName}`);
				setHelpRequests((prev) => prev.map((r) => r.id === req.id ? {
					...r,
					status: "accepted",
					acceptedByGarageId: garage.id
				} : r));
			} else toast.error("Failed to accept request.");
		} catch {
			toast.error("Something went wrong.");
		} finally {
			setAcceptingId(null);
		}
	}
	async function submitCompletion(e) {
		e.preventDefault();
		if (!garage || !completingRequest) return;
		const cost = Number(repairCost);
		if (isNaN(cost) || cost < 0) {
			toast.error("Please enter a valid cost.");
			return;
		}
		setAcceptingId(completingRequest.id);
		try {
			if ((await updateHelpRequestFn({ data: {
				requestId: completingRequest.id,
				status: "done",
				garageId: garage.id,
				cost
			} }))?.success) {
				toast.success(`🎉 Request completed! Billed ${cost} LKR.`);
				setHelpRequests((prev) => prev.filter((r) => r.id !== completingRequest.id));
				setTotalIncome((prev) => prev + cost);
				setCompletingRequest(null);
			} else toast.error("Failed to complete request.");
		} catch {
			toast.error("Something went wrong.");
		} finally {
			setAcceptingId(null);
		}
	}
	if (loading || fetching) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen bg-background flex items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "text-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gold/30 border-t-gold" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Loading your garage..."
			})]
		})
	});
	if (!garage) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto max-w-4xl px-4 py-8 sm:px-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-8 flex flex-wrap items-start justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm uppercase tracking-wider text-gold",
								children: "Mechanic Dashboard"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "mt-1 text-3xl font-bold",
								children: garage.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-muted-foreground flex items-center gap-1 text-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-3 w-3" }),
									" ",
									garage.address
								]
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => {
								if (helpRequests.length > 0) {
									const el = document.getElementById("requests-section");
									if (el) {
										el.scrollIntoView({ behavior: "smooth" });
										setTimeout(() => window.scrollTo({
											top: el.getBoundingClientRect().top + window.scrollY - 100,
											behavior: "smooth"
										}), 50);
									}
								}
							},
							className: "relative hover:scale-105 transition-transform",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: `flex h-11 w-11 items-center justify-center rounded-xl border ${helpRequests.length > 0 ? "border-destructive/50 bg-destructive/10 shadow-sm shadow-destructive/20" : "border-border bg-card"}`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: `h-5 w-5 ${helpRequests.length > 0 ? "text-destructive animate-pulse" : "text-muted-foreground"}` })
							}), helpRequests.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white shadow-sm",
								children: helpRequests.length
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-6 md:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "surface-elevated rounded-2xl p-6 space-y-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
									className: "font-semibold text-lg flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wrench, { className: "h-5 w-5 text-gold" }), " Garage Status"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between rounded-xl border border-border p-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-medium",
										children: "Garage Open"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground mt-0.5",
										children: isOpen ? "Accepting customers" : "Currently closed"
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => setIsOpen((v) => !v),
										className: "text-3xl transition-transform hover:scale-105",
										"aria-label": "Toggle open status",
										children: isOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleRight, { className: "h-9 w-9 text-primary" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleLeft, { className: "h-9 w-9 text-muted-foreground" })
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "flex items-center gap-1 text-sm font-medium",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-4 w-4 text-gold" }), "Available Mechanics Right Now"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-3",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => setAvailable((v) => Math.max(0, v - 1)),
												className: "flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background text-xl font-bold hover:border-gold/40 hover:text-gold transition-colors",
												children: "−"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex-1 rounded-lg border border-border bg-background py-2 text-center text-2xl font-bold",
												children: [available, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "text-sm font-normal text-muted-foreground ml-1",
													children: ["/ ", garage.totalMechanics]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => setAvailable((v) => Math.min(garage.totalMechanics, v + 1)),
												className: "flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background text-xl font-bold hover:border-gold/40 hover:text-gold transition-colors",
												children: "+"
											})
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									className: "w-full",
									size: "lg",
									onClick: handleSave,
									disabled: saving,
									children: saving ? "Saving..." : "Update Availability"
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "surface-elevated rounded-2xl p-6 flex flex-col justify-center bg-gradient-to-br from-green-500/10 to-emerald-500/5 border border-green-500/20",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
										className: "font-semibold text-lg flex items-center gap-2 mb-2 text-green-600 dark:text-green-400",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xl",
											children: "💰"
										}), " Total Earnings"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-4xl font-bold text-green-600 dark:text-green-400 tracking-tight",
										children: ["Rs. ", totalIncome.toLocaleString()]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground mt-2 opacity-80",
										children: "from completed jobs on this platform"
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "surface-elevated rounded-2xl p-6 space-y-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
									className: "font-semibold text-lg flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "h-5 w-5 text-gold" }), " Garage Details"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-3 text-sm",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card shrink-0",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wrench, { className: "h-4 w-4 text-gold" })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs text-muted-foreground",
												children: "Specialty"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "font-medium",
												children: garage.specialty
											})] })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card shrink-0",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "h-4 w-4 text-gold" })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs text-muted-foreground",
												children: "Phone"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "font-medium",
												children: garage.phone
											})] })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card shrink-0",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4 text-primary" })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs text-muted-foreground",
												children: "Status"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
												className: "mt-0.5 border-primary/40 bg-primary/10 text-primary",
												children: "Approved ✓"
											})] })]
										})
									]
								})]
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 surface-elevated rounded-2xl p-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between mb-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
								className: "font-semibold text-lg flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-5 w-5 text-destructive" }), "Nearby Help Requests"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-muted-foreground",
								children: "Auto-refreshes every 5 seconds"
							})]
						}), helpRequests.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col items-center justify-center py-10 text-center text-muted-foreground",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "mb-3 h-8 w-8 opacity-25" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-medium",
									children: "No active requests right now"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs mt-1",
									children: "When a vehicle owner nearby needs help, it will appear here."
								})
							]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-3",
							children: helpRequests.map((req) => {
								const isAccepted = req.status === "accepted";
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: `flex items-start gap-4 rounded-xl border p-4 ${isAccepted ? "border-primary/40 bg-primary/5" : "border-destructive/30 bg-destructive/5"}`,
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: `flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 ${isAccepted ? "border-primary/40 bg-primary/10 text-primary" : "border-destructive/40 bg-destructive/10 text-destructive"}`,
											children: isAccepted ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-5 w-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-5 w-5" })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex-1 min-w-0",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex flex-wrap items-center gap-2 mb-1",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "font-semibold",
															children: req.ownerName
														}),
														isAccepted && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
															variant: "outline",
															className: "border-primary/50 text-primary text-[10px] h-5",
															children: "Accepted"
														}),
														req.distanceKm !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
															className: "inline-flex items-center gap-1 rounded-full border border-gold/30 bg-gold/10 px-2 py-0.5 text-xs text-gold",
															children: [
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigation, { className: "h-3 w-3" }),
																" ",
																req.distanceKm.toFixed(1),
																" km away"
															]
														})
													]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-sm text-muted-foreground mb-1",
													children: req.description
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-3 text-xs text-muted-foreground",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "flex items-center gap-1",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "h-3 w-3" }),
															" ",
															req.ownerPhone
														]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "flex items-center gap-1",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-3 w-3" }),
															" ",
															new Date(req.createdAt).toLocaleTimeString()
														]
													})]
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex flex-col gap-2 shrink-0",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												size: "sm",
												className: isAccepted ? "bg-green-600 hover:bg-green-700 text-white" : "bg-primary/90 hover:bg-primary text-primary-foreground",
												disabled: acceptingId === req.id,
												onClick: () => handleAcceptRequest(req),
												children: acceptingId === req.id ? "..." : isAccepted ? "Complete" : "Accept"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
												href: `https://www.google.com/maps/dir/?api=1&destination=${req.lat},${req.lng}`,
												target: "_blank",
												rel: "noopener noreferrer",
												className: "flex items-center justify-center gap-1 rounded-md border border-border px-2 py-1 text-xs text-muted-foreground hover:border-gold/40 hover:text-gold transition-colors",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigation, { className: "h-3 w-3" }), " Go"]
											})]
										})
									]
								}, req.id);
							})
						})]
					})
				]
			}),
			completingRequest && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: submitCompletion,
					className: "surface-elevated w-full max-w-sm rounded-2xl p-6 shadow-2xl animate-in fade-in-0 zoom-in-95",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
							className: "font-semibold text-xl mb-3 flex items-center gap-2 text-gold",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-6 w-6" }), " Finish Repair"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-muted-foreground mb-5",
							children: [
								"Enter the total repair cost for",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: "text-foreground",
									children: completingRequest.ownerName
								}),
								". This will be sent as a digital bill to their device."
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-sm font-medium mb-1 block",
								children: "Repair Cost (LKR)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground",
									children: "Rs."
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "number",
									required: true,
									min: "0",
									value: repairCost,
									onChange: (e) => setRepairCost(e.target.value),
									placeholder: "2500",
									className: "w-full rounded-xl border border-border bg-background/50 pl-10 pr-4 py-3 font-semibold focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
								})]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-3 pt-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									variant: "outline",
									className: "flex-1",
									onClick: () => setCompletingRequest(null),
									children: "Cancel"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "submit",
									className: "flex-1 gold-gradient text-background",
									disabled: acceptingId === completingRequest.id,
									children: acceptingId === completingRequest.id ? "Sending..." : "Send Bill"
								})]
							})]
						})
					]
				})
			})
		]
	});
}
//#endregion
export { MechanicDashboardPage as component };
