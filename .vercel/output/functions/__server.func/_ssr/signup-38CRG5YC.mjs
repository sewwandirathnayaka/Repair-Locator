import { o as __toESM } from "../_runtime.mjs";
import { m as require_react } from "../_libs/@clerk/clerk-react+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as SignUp$1 } from "./AuthContext-mG2zIe-Y.mjs";
import { O as Car, r as Wrench } from "../_libs/lucide-react.mjs";
import { t as AppHeader } from "./AppHeader-D8mzsOX_.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/signup-38CRG5YC.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SignupPage() {
	useNavigate();
	const [selectedRole, setSelectedRole] = (0, import_react.useState)(null);
	if (!selectedRole) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background flex flex-col",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppHeader, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex-1 flex items-center justify-center p-4 py-12",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "w-full max-w-md",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-8 text-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-3xl font-bold",
						children: "Join Repair Locator"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted-foreground",
						children: "Who are you signing up as?"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						id: "role-owner",
						onClick: () => setSelectedRole("owner"),
						className: "surface-elevated flex flex-col items-center gap-3 rounded-2xl border-2 border-border p-8 transition-all hover:border-gold/60 hover:shadow-lg",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex h-14 w-14 items-center justify-center rounded-xl gold-gradient",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Car, { className: "h-7 w-7 text-background" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-semibold",
								children: "Vehicle Owner"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1 text-xs text-muted-foreground",
								children: "Find nearby mechanics"
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						id: "role-mechanic",
						onClick: () => setSelectedRole("mechanic"),
						className: "surface-elevated flex flex-col items-center gap-3 rounded-2xl border-2 border-border p-8 transition-all hover:border-gold/60 hover:shadow-lg",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex h-14 w-14 items-center justify-center rounded-xl gold-gradient",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wrench, { className: "h-7 w-7 text-background" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-semibold",
								children: "Mechanic / Garage"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1 text-xs text-muted-foreground",
								children: "Register your garage"
							})]
						})]
					})]
				})]
			})
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background flex flex-col",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppHeader, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex-1 flex flex-col items-center justify-center p-4 py-12 gap-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setSelectedRole(null),
					className: "text-xs text-muted-foreground hover:text-foreground flex items-center gap-1",
					children: "← Change role"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-center mb-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-xs font-medium text-gold",
						children: [
							selectedRole === "mechanic" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wrench, { className: "h-3 w-3" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Car, { className: "h-3 w-3" }),
							"Signing up as ",
							selectedRole === "mechanic" ? "Mechanic / Garage" : "Vehicle Owner"
						]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignUp$1, {
					routing: "hash",
					signInUrl: "/login",
					fallbackRedirectUrl: selectedRole === "mechanic" ? "/mechanic/register" : "/dashboard",
					forceRedirectUrl: selectedRole === "mechanic" ? "/mechanic/register" : "/dashboard",
					unsafeMetadata: { role: selectedRole }
				})
			]
		})]
	});
}
//#endregion
export { SignupPage as component };
