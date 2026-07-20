import { o as __toESM } from "../_runtime.mjs";
import { m as require_react } from "../_libs/@clerk/clerk-react+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { h as getMyGarageFn, w as useAuth } from "./AuthContext-mG2zIe-Y.mjs";
import { E as CircleCheck, T as CircleX, b as MapPin, g as Phone, r as Wrench, w as Clock } from "../_libs/lucide-react.mjs";
import { n as Button, t as AppHeader } from "./AppHeader-D8mzsOX_.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/pending-Du7daySf.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function MechanicPendingPage() {
	const { user, loading } = useAuth();
	const navigate = useNavigate();
	const [garage, setGarage] = (0, import_react.useState)(null);
	const [fetchingGarage, setFetchingGarage] = (0, import_react.useState)(true);
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
			else if (g.status === "approved") navigate({
				to: "/mechanic/dashboard",
				replace: true
			});
			else setGarage(g);
		}).catch(() => {}).finally(() => setFetchingGarage(false));
	}, [user, navigate]);
	if (loading || fetchingGarage) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen bg-background flex items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-center text-muted-foreground",
			children: "Checking status..."
		})
	});
	const status = garage?.status ?? "pending";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppHeader, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto flex max-w-lg flex-col items-center px-4 py-20 text-center",
			children: [
				status === "pending" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mb-6 flex h-20 w-20 items-center justify-center rounded-full border-4 border-gold/30 bg-gold/10",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-10 w-10 text-gold animate-pulse" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-3xl font-bold",
						children: "Application Under Review"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-muted-foreground",
						children: "Your garage registration has been submitted. Our admin team will review your NVQ certificate and approve your account shortly."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8 w-full surface-elevated rounded-2xl p-5 text-left space-y-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs uppercase tracking-wider text-gold font-medium",
							children: "Your Submission"
						}), garage ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wrench, { className: "h-4 w-4 text-muted-foreground shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-medium",
										children: garage.name
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 text-muted-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-4 w-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: garage.address })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 text-muted-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "h-4 w-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: garage.phone })]
								})
							]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: "No garage found. Please register first."
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-6 text-xs text-muted-foreground",
						children: "Refresh the page to check your approval status."
					})
				] }),
				status === "approved" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mb-6 flex h-20 w-20 items-center justify-center rounded-full border-4 border-primary/30 bg-primary/10",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-10 w-10 text-primary" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-3xl font-bold",
						children: "You're Approved!"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-muted-foreground",
						children: "Your garage is now live on Repair Locator."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "mt-8",
						onClick: () => navigate({ to: "/mechanic/dashboard" }),
						children: "Go to My Garage Dashboard"
					})
				] }),
				status === "rejected" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mb-6 flex h-20 w-20 items-center justify-center rounded-full border-4 border-destructive/30 bg-destructive/10",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "h-10 w-10 text-destructive" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-3xl font-bold",
						children: "Application Rejected"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-muted-foreground",
						children: "Unfortunately, your garage registration was not approved. Please contact the admin for more information."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						className: "mt-8",
						onClick: () => navigate({ to: "/mechanic/register" }),
						children: "Re-apply"
					})
				] })
			]
		})]
	});
}
//#endregion
export { MechanicPendingPage as component };
