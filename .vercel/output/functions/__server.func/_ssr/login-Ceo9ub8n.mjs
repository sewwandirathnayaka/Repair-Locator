import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { r as SignIn$1 } from "./AuthContext-mG2zIe-Y.mjs";
import { t as AppHeader } from "./AppHeader-D8mzsOX_.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-Ceo9ub8n.js
var import_jsx_runtime = require_jsx_runtime();
function LoginPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background flex flex-col",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppHeader, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex-1 flex items-center justify-center p-4 py-12",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignIn$1, {
				routing: "hash",
				signUpUrl: "/signup",
				fallbackRedirectUrl: "/dashboard",
				forceRedirectUrl: "/dashboard"
			})
		})]
	});
}
//#endregion
export { LoginPage as component };
