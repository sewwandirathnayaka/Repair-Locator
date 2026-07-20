import { o as __toESM } from "../_runtime.mjs";
import { m as require_react } from "../_libs/@clerk/clerk-react+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { _ as Link, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { w as useAuth } from "./AuthContext-mG2zIe-Y.mjs";
import { b as MapPin, d as Star, f as Smartphone, m as Search, p as Shield, t as Zap } from "../_libs/lucide-react.mjs";
import { n as Button, t as AppHeader } from "./AppHeader-D8mzsOX_.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-MUwQfheR.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Landing() {
	const { user } = useAuth();
	const navigate = useNavigate();
	(0, import_react.useEffect)(() => {
		if (user) navigate({
			to: user.role === "admin" ? "/admin" : "/dashboard",
			replace: true
		});
	}, [user, navigate]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background text-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppHeader, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "relative overflow-hidden",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-0 -z-10 opacity-30",
				style: { backgroundImage: "radial-gradient(circle at 20% 10%, oklch(0.86 0.18 95 / 0.25), transparent 45%), radial-gradient(circle at 85% 40%, oklch(0.78 0.13 82 / 0.2), transparent 50%)" }
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mx-auto max-w-3xl text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/5 px-3 py-1 text-xs font-medium uppercase tracking-wider text-gold",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "h-3 w-3" }), " 24/7 Roadside Ready"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
								className: "mt-6 text-5xl font-bold tracking-tight sm:text-6xl",
								children: ["Trusted mechanics, ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "gold-text-gradient",
									children: "one tap away."
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-6 text-lg text-muted-foreground",
								children: "Repair Locator helps vehicle owners locate verified repair shops nearby — with live distance, ratings, and instant contact."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-8 flex flex-wrap items-center justify-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "lg",
									asChild: true,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: "/signup",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "mr-2 h-5 w-5" }), " Find a Mechanic"]
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "lg",
									variant: "outline",
									asChild: true,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/login",
										children: "I have an account"
									})
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mx-auto mt-20 grid max-w-5xl gap-6 sm:grid-cols-3",
						children: [
							{
								icon: MapPin,
								title: "Real-time Locator",
								body: "Interactive map with verified shops around your location."
							},
							{
								icon: Shield,
								title: "Verified Pros",
								body: "Every mechanic is reviewed and rated by real drivers."
							},
							{
								icon: Smartphone,
								title: "Installable PWA",
								body: "Add to your home screen for one-tap access."
							}
						].map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "surface-elevated rounded-2xl p-6",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl gold-gradient",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(f.icon, { className: "h-5 w-5 text-background" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-lg font-semibold",
									children: f.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-sm text-muted-foreground",
									children: f.body
								})
							]
						}, f.title))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mx-auto mt-16 flex max-w-2xl items-center justify-center gap-6 text-sm text-muted-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "h-4 w-4 fill-gold text-gold" }), " 4.9 avg rating"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: "1,200+ mechanics" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: "50k+ jobs completed" })
						]
					})
				]
			})]
		})]
	});
}
//#endregion
export { Landing as component };
