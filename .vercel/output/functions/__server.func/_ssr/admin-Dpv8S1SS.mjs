import { o as __toESM } from "../_runtime.mjs";
import { m as require_react } from "../_libs/@clerk/clerk-react+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as approveGarageFn, b as rejectGarageFn, c as deleteGarageFn, f as getAllGaragesFn, l as deleteHelpRequestFn, p as getAllHelpRequestsFn, v as getPendingGaragesFn, w as useAuth } from "./AuthContext-mG2zIe-Y.mjs";
import { C as FileText, E as CircleCheck, T as CircleX, b as MapPin, g as Phone, i as Users, j as Activity, r as Wrench, s as Trash2, w as Clock } from "../_libs/lucide-react.mjs";
import { n as Button, r as cn, t as AppHeader } from "./AppHeader-D8mzsOX_.mjs";
import { t as Badge } from "./badge-D-882LVm.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { i as Trigger, n as List, r as Root2, t as Content } from "../_libs/radix-ui__react-tabs.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-Dpv8S1SS.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Tabs = Root2;
var TabsList = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(List, {
	ref,
	className: cn("inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground", className),
	...props
}));
TabsList.displayName = List.displayName;
var TabsTrigger = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trigger, {
	ref,
	className: cn("inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow", className),
	...props
}));
TabsTrigger.displayName = Trigger.displayName;
var TabsContent = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content, {
	ref,
	className: cn("mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", className),
	...props
}));
TabsContent.displayName = Content.displayName;
function StatCard({ icon: Icon, label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "surface-elevated rounded-xl p-4 sm:p-5 flex flex-col justify-between",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between mb-2 sm:mb-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg gold-gradient shrink-0",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4 sm:h-5 sm:w-5 text-background" })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-2xl sm:text-3xl font-bold",
				children: value
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs sm:text-sm text-muted-foreground leading-tight",
			children: label
		})]
	});
}
function AdminDashboard() {
	const { user, loading } = useAuth();
	const navigate = useNavigate();
	const [pendingGarages, setPendingGarages] = (0, import_react.useState)([]);
	const [allGarages, setAllGarages] = (0, import_react.useState)([]);
	const [helpRequests, setHelpRequests] = (0, import_react.useState)([]);
	const [fetching, setFetching] = (0, import_react.useState)(true);
	const [actionLoading, setActionLoading] = (0, import_react.useState)(null);
	const [viewNvq, setViewNvq] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (!loading && !user) navigate({
			to: "/login",
			replace: true
		});
		else if (!loading && user?.role !== "admin") navigate({
			to: "/dashboard",
			replace: true
		});
	}, [
		user,
		loading,
		navigate
	]);
	(0, import_react.useEffect)(() => {
		if (!user || user.role !== "admin") return;
		const unwrap = (r) => {
			if (Array.isArray(r)) return r;
			if (r && typeof r === "object" && "data" in r && Array.isArray(r.data)) return r.data;
			return [];
		};
		Promise.all([
			getPendingGaragesFn({ data: void 0 }),
			getAllGaragesFn({ data: void 0 }),
			getAllHelpRequestsFn({ data: void 0 })
		]).then(([pending, all, reqs]) => {
			setPendingGarages(unwrap(pending));
			setAllGarages(unwrap(all));
			setHelpRequests(unwrap(reqs));
		}).catch((err) => {
			console.error("Admin fetch error:", err);
			toast.error("Failed to load admin data.");
		}).finally(() => setFetching(false));
	}, [user]);
	async function handleApprove(garageId) {
		setActionLoading(garageId + "_approve");
		try {
			await approveGarageFn({ data: { garageId } });
			toast.success("Garage approved! It is now live on the map.");
			setPendingGarages((p) => p.filter((g) => g.id !== garageId));
			setAllGarages((a) => a.map((g) => g.id === garageId ? {
				...g,
				status: "approved"
			} : g));
		} catch {
			toast.error("Failed to approve. Try again.");
		} finally {
			setActionLoading(null);
		}
	}
	async function handleReject(garageId) {
		setActionLoading(garageId + "_reject");
		try {
			await rejectGarageFn({ data: {
				garageId,
				reason: "Does not meet requirements"
			} });
			toast.success("Garage rejected.");
			setPendingGarages((p) => p.filter((g) => g.id !== garageId));
			setAllGarages((a) => a.map((g) => g.id === garageId ? {
				...g,
				status: "rejected"
			} : g));
		} catch {
			toast.error("Failed to reject. Try again.");
		} finally {
			setActionLoading(null);
		}
	}
	async function handleDeleteGarage(garageId) {
		if (!confirm("Are you sure you want to completely delete this mechanic? This cannot be undone.")) return;
		setActionLoading(garageId + "_delete");
		try {
			await deleteGarageFn({ data: { garageId } });
			toast.success("Mechanic deleted successfully.");
			setPendingGarages((p) => p.filter((g) => g.id !== garageId));
			setAllGarages((a) => a.filter((g) => g.id !== garageId));
		} catch {
			toast.error("Failed to delete mechanic.");
		} finally {
			setActionLoading(null);
		}
	}
	async function handleDeleteRequest(requestId) {
		if (!confirm("Are you sure you want to delete this help request?")) return;
		setActionLoading(requestId + "_delete");
		try {
			await deleteHelpRequestFn({ data: { requestId } });
			toast.success("Help request deleted.");
			setHelpRequests((r) => r.filter((x) => x.id !== requestId));
		} catch {
			toast.error("Failed to delete request.");
		} finally {
			setActionLoading(null);
		}
	}
	if (!user) return null;
	const approvedCount = allGarages.filter((g) => g.status === "approved").length;
	allGarages.filter((g) => g.status === "rejected").length;
	const ownersMap = /* @__PURE__ */ new Map();
	helpRequests.forEach((req) => {
		const existing = ownersMap.get(req.ownerId) || {
			id: req.ownerId,
			name: req.ownerName,
			phone: req.ownerPhone,
			requests: 0
		};
		existing.requests++;
		ownersMap.set(req.ownerId, existing);
	});
	const ownersList = Array.from(ownersMap.values());
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background pb-20",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto max-w-7xl px-4 py-8 sm:px-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-8",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm uppercase tracking-wider text-gold",
								children: "Admin Console"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "mt-1 text-3xl font-bold sm:text-4xl",
								children: "Platform Overview"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm text-muted-foreground",
								children: "Kurunegala Area — Repair Locator Admin"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
								icon: Clock,
								label: "Pending Apps",
								value: pendingGarages.length
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
								icon: CircleCheck,
								label: "Approved",
								value: approvedCount
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
								icon: Activity,
								label: "Requests",
								value: helpRequests.length
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
								icon: Users,
								label: "Owners",
								value: ownersList.length
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
						defaultValue: "mechanics",
						className: "w-full",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
								className: "mb-6 grid w-full grid-cols-3 bg-muted/50 p-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
										value: "mechanics",
										className: "text-[10px] sm:text-sm data-[state=active]:gold-gradient data-[state=active]:text-background",
										children: "Mechanics"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
										value: "owners",
										className: "text-[10px] sm:text-sm data-[state=active]:gold-gradient data-[state=active]:text-background",
										children: "Owners"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
										value: "works",
										className: "text-[10px] sm:text-sm data-[state=active]:gold-gradient data-[state=active]:text-background",
										children: "Works"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
								value: "mechanics",
								className: "space-y-8 animate-in fade-in-50 duration-500",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
									className: "surface-elevated rounded-2xl p-6",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mb-4 flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
											className: "text-lg font-semibold flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-5 w-5 text-gold" }), " Pending Applications"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
											variant: "outline",
											className: "border-gold/40 text-gold",
											children: [pendingGarages.length, " pending"]
										})]
									}), fetching ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "space-y-3",
										children: [1, 2].map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "animate-pulse h-24 rounded-xl bg-muted/40" }, n))
									}) : pendingGarages.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-col items-center justify-center py-12 text-muted-foreground",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "mb-3 h-8 w-8 opacity-30" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm",
											children: "No pending applications"
										})]
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "space-y-4",
										children: pendingGarages.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "rounded-xl border border-border bg-background/40 p-4",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "space-y-1.5",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "flex items-center gap-2",
															children: [
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wrench, { className: "h-4 w-4 text-gold shrink-0" }),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	className: "font-semibold",
																	children: g.name
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
																	variant: "secondary",
																	className: "text-xs",
																	children: g.specialty
																})
															]
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "flex items-center gap-2 text-xs text-muted-foreground",
															children: [
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-3 w-3 shrink-0" }),
																" ",
																g.address
															]
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "flex items-center gap-2 text-xs text-muted-foreground",
															children: [
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "h-3 w-3 shrink-0" }),
																" ",
																g.phone
															]
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "flex items-center gap-2 text-xs text-muted-foreground",
															children: [
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-3 w-3 shrink-0" }),
																" ",
																g.totalMechanics,
																" mechanic(s) · Submitted",
																" ",
																g.createdAt ? new Date(g.createdAt).toLocaleDateString() : "recently"
															]
														})
													]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-2 flex-wrap",
													children: [
														g.nvqCertificateBase64 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
															size: "sm",
															variant: "outline",
															onClick: () => setViewNvq(g),
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "mr-1 h-4 w-4" }), " View NVQ"]
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
															size: "sm",
															variant: "outline",
															className: "border-destructive/50 text-destructive hover:bg-destructive/10",
															disabled: !!actionLoading,
															onClick: () => handleReject(g.id),
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "mr-1 h-4 w-4" }), " Reject"]
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
															size: "sm",
															className: "gold-gradient text-background",
															disabled: !!actionLoading,
															onClick: () => handleApprove(g.id),
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "mr-1 h-4 w-4" }), " Approve"]
														})
													]
												})]
											})
										}, g.id))
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
									className: "surface-elevated rounded-2xl p-6",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mb-4 flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
											className: "text-lg font-semibold flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wrench, { className: "h-5 w-5 text-gold" }), " All Registered Mechanics"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-xs text-muted-foreground",
											children: [allGarages.length, " total"]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "space-y-3",
										children: fetching ? [
											1,
											2,
											3
										].map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "animate-pulse h-16 rounded-xl bg-muted/40" }, n)) : allGarages.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "py-8 text-center text-sm text-muted-foreground",
											children: "No mechanics registered yet."
										}) : allGarages.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex flex-col sm:flex-row gap-3 sm:items-center justify-between rounded-lg border border-border bg-background/40 p-4",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "font-medium text-sm flex items-center gap-2",
												children: [g.name, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
													variant: g.status === "approved" ? "default" : g.status === "rejected" ? "destructive" : "secondary",
													className: g.status === "approved" ? "gold-gradient text-background border-0 text-[10px]" : "text-[10px]",
													children: g.status
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "text-xs text-muted-foreground mt-1",
												children: [
													g.specialty,
													" · ",
													g.address,
													" · ",
													g.phone
												]
											})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-3",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "text-xs text-muted-foreground whitespace-nowrap",
													children: [
														g.availableMechanics,
														"/",
														g.totalMechanics,
														" available"
													]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													size: "icon",
													variant: "destructive",
													className: "h-8 w-8 shrink-0",
													disabled: !!actionLoading,
													onClick: () => handleDeleteGarage(g.id),
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
												})]
											})]
										}, g.id))
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
								value: "owners",
								className: "animate-in fade-in-50 duration-500",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
									className: "surface-elevated rounded-2xl p-6",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
											className: "text-lg font-semibold flex items-center gap-2 mb-4",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-5 w-5 text-gold" }), " Vehicle Owners"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm text-muted-foreground mb-6",
											children: "List of users who have submitted help requests on the platform."
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "space-y-3",
											children: ownersList.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "py-8 text-center text-sm text-muted-foreground",
												children: "No vehicle owners found yet."
											}) : ownersList.map((owner) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-between rounded-lg border border-border bg-background/40 p-4",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "font-medium text-sm",
													children: owner.name
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "text-xs text-muted-foreground mt-1 flex items-center gap-1",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "h-3 w-3" }),
														" ",
														owner.phone
													]
												})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
													variant: "secondary",
													className: "bg-gold/10 text-gold hover:bg-gold/20",
													children: [owner.requests, " Request(s)"]
												})]
											}, owner.id))
										})
									]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
								value: "works",
								className: "animate-in fade-in-50 duration-500",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
									className: "surface-elevated rounded-2xl p-6",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
										className: "text-lg font-semibold flex items-center gap-2 mb-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "h-5 w-5 text-gold" }), " Ongoing Works & Requests"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "space-y-4 mt-6",
										children: helpRequests.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "py-8 text-center text-sm text-muted-foreground",
											children: "No help requests found."
										}) : helpRequests.map((req) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "relative rounded-xl border border-border bg-background/40 p-5",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex flex-col sm:flex-row gap-4 sm:justify-between",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "space-y-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex items-center gap-2",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "font-semibold text-sm",
															children: req.description
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
															variant: "outline",
															className: req.status === "accepted" ? "border-gold text-gold" : req.status === "pending" ? "border-orange-400 text-orange-400" : req.status === "done" ? "border-green-400 text-green-400" : "border-red-400 text-red-400",
															children: req.status
														})]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-xs text-muted-foreground",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
																	className: "text-foreground/70",
																	children: "Owner:"
																}),
																" ",
																req.ownerName,
																" ",
																"(",
																req.ownerPhone,
																")"
															] }),
															req.acceptedByGarageId && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
																	className: "text-foreground/70",
																	children: "Mechanic:"
																}),
																" ",
																allGarages.find((g) => g.id === req.acceptedByGarageId)?.name || req.acceptedByGarageId
															] }),
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																className: "sm:col-span-2",
																children: [
																	/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
																		className: "text-foreground/70",
																		children: "Time:"
																	}),
																	" ",
																	new Date(req.createdAt).toLocaleString()
																]
															})
														]
													})]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "flex items-center sm:items-start justify-end",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
														size: "sm",
														variant: "destructive",
														className: "h-8 shrink-0 flex items-center gap-1.5",
														disabled: !!actionLoading,
														onClick: () => handleDeleteRequest(req.id),
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" }), " Delete"]
													})
												})]
											})
										}, req.id))
									})]
								})
							})
						]
					})
				]
			}),
			viewNvq && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "surface-elevated w-full max-w-lg rounded-2xl p-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-4 flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
							className: "font-semibold",
							children: ["NVQ Certificate — ", viewNvq.name]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "sm",
							onClick: () => setViewNvq(null),
							children: "✕"
						})]
					}), viewNvq.nvqCertificateBase64?.startsWith("data:image") ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: viewNvq.nvqCertificateBase64,
						alt: "NVQ Certificate",
						className: "w-full rounded-xl border border-border"
					}) : viewNvq.nvqCertificateBase64?.startsWith("data:application/pdf") ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col items-center gap-3 py-8 text-muted-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-12 w-12" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm",
								children: "PDF Certificate"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: viewNvq.nvqCertificateBase64,
								download: viewNvq.nvqCertificateName || "nvq-certificate.pdf",
								className: "rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90",
								children: "Download Certificate"
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground text-center py-8",
						children: viewNvq.nvqCertificateName || "No certificate uploaded"
					})]
				})
			})
		]
	});
}
//#endregion
export { AdminDashboard as component };
