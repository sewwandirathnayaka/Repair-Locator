import { o as __toESM } from "../_runtime.mjs";
import { a as OrganizationProfile, c as UserProfile, d as buildErrorThrower, i as OrganizationList, l as setErrorThrowerOptions, m as require_react, n as ClerkProvider, o as SignIn, r as dist_exports$1, s as SignUp, t as useRoutingProps, u as isTruthy } from "../_libs/@clerk/clerk-react+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as getServerFnById } from "../__23tanstack-start-server-fn-resolver-DXn_OdSO.mjs";
import { b as useParams, l as useLocation, p as ScriptOnce, v as useRouteContext, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as createServerFn, i as TSS_SERVER_FUNCTION } from "./createServerFn-CIHAFgYl.mjs";
import { t as getEnvVariable } from "../_libs/clerk__shared.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/AuthContext-mG2zIe-Y.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var __copyProps = (to, from, except, desc) => {
	if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
		key = keys[i];
		if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
			get: ((k) => from[k]).bind(null, key),
			enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
		});
	}
	return to;
};
var __reExport = (target, mod, secondTarget) => (__copyProps(target, mod, "default"), secondTarget && __copyProps(secondTarget, mod, "default"));
var createErrorMessage = (msg) => {
	return `\u{1F512} Clerk: ${msg.trim()}

For more info, check out the docs: https://clerk.com/docs,
or come say hi in our discord server: https://clerk.com/discord

`;
};
createErrorMessage(`
  You're calling 'getAuth()' from a server function, without providing the ctx object.
  Example:

  export const someServerFunction = createServerFn('GET', async (_payload, ctx) => {
    const auth = getAuth(ctx);
    ...
  });
  `);
createErrorMessage(`
It looks like you're trying to use Clerk without configuring the Clerk handler.

To fix this, make sure you have the \`clerkHandler()\` configure in you SSR entry file (example: app/ssr.tsx).

For more info, check out the docs: https://github.com/clerk/javascript/tree/main/packages/tanstack-start#setup-clerkhandler-in-the-ssr-entrypoint,
    `);
var warnPackageRenaming = () => {
	console.warn("[@clerk/tanstack-start] Warning: This package has moved to @clerk/tanstack-react-start. Please switch to the new package, as this is the last release under this package name.");
};
var isClient = () => typeof window !== "undefined";
buildErrorThrower({ packageName: "@clerk/tanstack-start" });
var ClerkOptionsCtx = import_react.createContext(void 0);
ClerkOptionsCtx.displayName = "ClerkOptionsCtx";
var ClerkOptionsProvider = (props) => {
	const { children, options } = props;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClerkOptionsCtx.Provider, {
		value: { value: options },
		children
	});
};
var useAwaitableNavigate = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const resolveFunctionsRef = import_react.useRef([]);
	const resolveAll = () => {
		resolveFunctionsRef.current.forEach((resolve) => resolve());
		resolveFunctionsRef.current.splice(0, resolveFunctionsRef.current.length);
	};
	const [_, startTransition] = (0, import_react.useTransition)();
	import_react.useEffect(() => {
		resolveAll();
	}, [location]);
	return (options) => {
		return new Promise((res) => {
			startTransition(() => {
				resolveFunctionsRef.current.push(res);
				res(navigate(options));
			});
		});
	};
};
var getPublicEnvVariables = (context) => {
	const getValue = (name) => {
		return getEnvVariable(`VITE_${name}`, context) || getEnvVariable(name, context);
	};
	return {
		publishableKey: getValue("CLERK_PUBLISHABLE_KEY"),
		domain: getValue("CLERK_DOMAIN"),
		isSatellite: isTruthy(getValue("CLERK_IS_SATELLITE")),
		proxyUrl: getValue("CLERK_PROXY_URL"),
		signInUrl: getValue("CLERK_SIGN_IN_URL"),
		signUpUrl: getValue("CLERK_SIGN_UP_URL"),
		clerkJsUrl: getValue("CLERK_JS_URL") || getValue("CLERK_JS"),
		clerkJsVariant: getValue("CLERK_JS_VARIANT"),
		clerkJsVersion: getValue("CLERK_JS_VERSION"),
		telemetryDisabled: isTruthy(getValue("CLERK_TELEMETRY_DISABLED")),
		telemetryDebug: isTruthy(getValue("CLERK_TELEMETRY_DEBUG")),
		afterSignInUrl: getValue("CLERK_AFTER_SIGN_IN_URL"),
		afterSignUpUrl: getValue("CLERK_AFTER_SIGN_UP_URL")
	};
};
var pickFromClerkInitState = (clerkInitState) => {
	const { __clerk_ssr_state, __publishableKey, __proxyUrl, __domain, __isSatellite, __signInUrl, __signUpUrl, __afterSignInUrl, __afterSignUpUrl, __clerkJSUrl, __clerkJSVersion, __telemetryDisabled, __telemetryDebug, __signInForceRedirectUrl, __signUpForceRedirectUrl, __signInFallbackRedirectUrl, __signUpFallbackRedirectUrl } = clerkInitState || {};
	return {
		clerkSsrState: __clerk_ssr_state,
		publishableKey: __publishableKey,
		proxyUrl: __proxyUrl,
		domain: __domain,
		isSatellite: !!__isSatellite,
		signInUrl: __signInUrl,
		signUpUrl: __signUpUrl,
		afterSignInUrl: __afterSignInUrl,
		afterSignUpUrl: __afterSignUpUrl,
		clerkJSUrl: __clerkJSUrl,
		clerkJSVersion: __clerkJSVersion,
		telemetry: {
			disabled: __telemetryDisabled,
			debug: __telemetryDebug
		},
		signInForceRedirectUrl: __signInForceRedirectUrl,
		signUpForceRedirectUrl: __signUpForceRedirectUrl,
		signInFallbackRedirectUrl: __signInFallbackRedirectUrl,
		signUpFallbackRedirectUrl: __signUpFallbackRedirectUrl
	};
};
var mergeWithPublicEnvs = (restInitState) => {
	return {
		...restInitState,
		publishableKey: restInitState.publishableKey || getPublicEnvVariables().publishableKey,
		domain: restInitState.domain || getPublicEnvVariables().domain,
		isSatellite: restInitState.isSatellite || getPublicEnvVariables().isSatellite,
		signInUrl: restInitState.signInUrl || getPublicEnvVariables().signInUrl,
		signUpUrl: restInitState.signUpUrl || getPublicEnvVariables().signUpUrl,
		afterSignInUrl: restInitState.afterSignInUrl || getPublicEnvVariables().afterSignInUrl,
		afterSignUpUrl: restInitState.afterSignUpUrl || getPublicEnvVariables().afterSignUpUrl,
		clerkJSUrl: restInitState.clerkJSUrl || getPublicEnvVariables().clerkJsUrl,
		clerkJSVersion: restInitState.clerkJSVersion || getPublicEnvVariables().clerkJsVersion,
		signInForceRedirectUrl: restInitState.signInForceRedirectUrl,
		clerkJSVariant: restInitState.clerkJSVariant || getPublicEnvVariables().clerkJsVariant
	};
};
var ClerkProvider_exports = /* @__PURE__ */ __exportAll({ ClerkProvider: () => ClerkProvider$1 });
__reExport(ClerkProvider_exports, dist_exports$1);
var SDK_METADATA = {
	name: "@clerk/tanstack-start",
	version: "0.11.5"
};
var awaitableNavigateRef = { current: void 0 };
function ClerkProvider$1({ children, ...providerProps }) {
	const awaitableNavigate = useAwaitableNavigate();
	const routerContext = useRouteContext({ strict: false });
	(0, import_react.useEffect)(() => {
		awaitableNavigateRef.current = awaitableNavigate;
	}, [awaitableNavigate]);
	const { clerkSsrState, ...restInitState } = pickFromClerkInitState((isClient() ? window.__clerk_init_state : routerContext?.clerkInitialState)?.__internal_clerk_state);
	const mergedProps = {
		...mergeWithPublicEnvs(restInitState),
		...providerProps
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScriptOnce, { children: `window.__clerk_init_state = ${JSON.stringify(routerContext?.clerkInitialState)};` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClerkOptionsProvider, {
		options: mergedProps,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClerkProvider, {
			initialState: clerkSsrState,
			sdkMetadata: SDK_METADATA,
			routerPush: (to) => awaitableNavigateRef.current?.({
				to,
				replace: false
			}),
			routerReplace: (to) => awaitableNavigateRef.current?.({
				to,
				replace: true
			}),
			...mergedProps,
			children
		})
	})] });
}
ClerkProvider$1.displayName = "ClerkProvider";
var usePathnameWithoutSplatRouteParams = () => {
	const { _splat } = useParams({ strict: false });
	const { pathname } = useLocation();
	const splatRouteParam = _splat || "";
	return `/${pathname.replace(splatRouteParam, "").replace(/\/$/, "").replace(/^\//, "").trim()}`;
};
var UserProfile$1 = Object.assign((props) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserProfile, { ...useRoutingProps("UserProfile", props, { path: usePathnameWithoutSplatRouteParams() }) });
}, { ...UserProfile });
var OrganizationProfile$1 = Object.assign((props) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrganizationProfile, { ...useRoutingProps("OrganizationProfile", props, { path: usePathnameWithoutSplatRouteParams() }) });
}, { ...OrganizationProfile });
var OrganizationList$1 = Object.assign((props) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrganizationList, { ...useRoutingProps("OrganizationList", props, { path: usePathnameWithoutSplatRouteParams() }) });
}, { ...OrganizationList });
var SignIn$1 = (props) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignIn, { ...useRoutingProps("SignIn", props, { path: usePathnameWithoutSplatRouteParams() }) });
};
var SignUp$1 = (props) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignUp, { ...useRoutingProps("SignUp", props, { path: usePathnameWithoutSplatRouteParams() }) });
};
var client_exports = /* @__PURE__ */ __exportAll({
	ClerkProvider: () => ClerkProvider$1,
	OrganizationList: () => OrganizationList$1,
	OrganizationProfile: () => OrganizationProfile$1,
	SignIn: () => SignIn$1,
	SignUp: () => SignUp$1,
	UserProfile: () => UserProfile$1
});
__reExport(client_exports, ClerkProvider_exports);
var dist_exports = /* @__PURE__ */ __exportAll({
	ClerkProvider: () => ClerkProvider$1,
	OrganizationList: () => OrganizationList$1,
	OrganizationProfile: () => OrganizationProfile$1,
	SignIn: () => SignIn$1,
	SignUp: () => SignUp$1,
	UserProfile: () => UserProfile$1
});
__reExport(dist_exports, client_exports);
warnPackageRenaming();
setErrorThrowerOptions({ packageName: "@clerk/tanstack-start" });
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var getNearbyMechanicsFn = createServerFn({ method: "POST" }).validator((v) => v).handler(createSsrRpc("5f049d4aaa742d985c023e0943154dcbcc996891a33943558bcbe622983fa9bc"));
var registerGarageFn = createServerFn({ method: "POST" }).validator((v) => v).handler(createSsrRpc("afbad1d896cb0ff1f13e3c2704c66a1630ded745ac2f860efebc320e9aed2986"));
var getPendingGaragesFn = createServerFn({ method: "POST" }).handler(createSsrRpc("9a0df68e804b580f14ad547977314f7d5e87a1c6a2346a702fbddcfaefe56f53"));
var getAllGaragesFn = createServerFn({ method: "POST" }).handler(createSsrRpc("166e19e42f0ee38bc0bd6d68e758646dbd35bbe8f94cbaafaeba37beb22e8ec1"));
var approveGarageFn = createServerFn({ method: "POST" }).validator((v) => v).handler(createSsrRpc("9cb52376439a543154d1f2de783f970e9160069d5855893c06f5cb9cec525eb0"));
var rejectGarageFn = createServerFn({ method: "POST" }).validator((v) => v).handler(createSsrRpc("0afe5372adfe5c4719a4fd4e3d8e84ebe420eec59999cdf9bb1e9ec85e0bb856"));
var getMyGarageFn = createServerFn({ method: "POST" }).validator((v) => v).handler(createSsrRpc("ffbd8e0d9e5a21ebd8b90ac0b8bcb3a9f4314f6e230600adabadc4e1980057fa"));
var updateGarageAvailabilityFn = createServerFn({ method: "POST" }).validator((v) => v).handler(createSsrRpc("965c56ad7d21f8f3743f0ff01ab35f1b1e1a2c67530c230b398cbbaae012d668"));
var syncClerkUserFn = createServerFn({ method: "POST" }).validator((v) => v).handler(createSsrRpc("2c8b7f04a8f1c735030b61b0417d7fee79683717676ab9be19293acf8dba07a5"));
var createHelpRequestFn = createServerFn({ method: "POST" }).validator((v) => v).handler(createSsrRpc("ee46add18379c23631413d152766e98d55db3ca6d667f450f66684cdd4ef0e99"));
var getMyHelpRequestFn = createServerFn({ method: "POST" }).validator((v) => v).handler(createSsrRpc("dc9a2bd00a014cfec5fed6ae4946b7babc4739725553be1e7a350d34cc0e3f42"));
var getActiveRequestsFn = createServerFn({ method: "POST" }).validator((v) => v).handler(createSsrRpc("c6ec7b80c823a6d9a237f1f84fe39db965580045c13ab684342f4f04e90e70b6"));
var updateHelpRequestFn = createServerFn({ method: "POST" }).validator((v) => v).handler(createSsrRpc("db10a6bef7d27fdd6db375bc5d88b8641e78750ec8376f5d8469985b8b7ed2c6"));
var updateMechanicLocationFn = createServerFn({ method: "POST" }).validator((v) => v).handler(createSsrRpc("7c8b76823756fbecb5dd37524bd891e05d8c78d603c80a9cbd65fcb430847c5c"));
var deleteGarageFn = createServerFn({ method: "POST" }).validator((v) => v).handler(createSsrRpc("2c2d3d90f1c5d87db2087412ea6c6592e612be4034ad55a7383841177ea09dcb"));
var getAllHelpRequestsFn = createServerFn({ method: "POST" }).validator((v) => v).handler(createSsrRpc("5b60425f94c013b229759d11acd19ead29b24aaddb8ee83f927b7870ce8b5c82"));
var deleteHelpRequestFn = createServerFn({ method: "POST" }).validator((v) => v).handler(createSsrRpc("92b44394057b3187a21437a0744dd5f6d9b87f87fe54f5917a832514dce5ffb0"));
var getGarageIncomeFn = createServerFn({ method: "POST" }).validator((v) => v).handler(createSsrRpc("e292013e4d686c0c53e1a7057e3ffacf3ceeb600db14d464ab629138c5f8739a"));
var closeHelpRequestFn = createServerFn({ method: "POST" }).validator((v) => v).handler(createSsrRpc("27de64ffc9f83906bdf95c3b5062e56a16de9cf399d68ac5d3739c187d1fc02d"));
var AuthContext = (0, import_react.createContext)(null);
var ADMIN_EMAIL = "sewwandirathnayaka.ati@gmail.com";
function AuthProvider({ children }) {
	const { user: clerkUser, isLoaded: userLoaded } = (0, dist_exports.useUser)();
	const { signOut } = (0, dist_exports.useClerk)();
	const [user, setUser] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		if (!userLoaded) return;
		if (clerkUser) {
			const email = clerkUser.primaryEmailAddress?.emailAddress || "";
			const name = clerkUser.fullName || email.split("@")[0];
			let role;
			if (email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) role = "admin";
			else role = clerkUser.unsafeMetadata?.role || clerkUser.publicMetadata?.role || "owner";
			const garageStatus = clerkUser.publicMetadata?.garageStatus;
			const localUser = {
				id: clerkUser.id,
				name,
				email,
				role,
				verified: true,
				garageStatus
			};
			setUser(localUser);
			(async () => {
				try {
					await syncClerkUserFn({ data: {
						clerkId: clerkUser.id,
						name,
						email,
						role
					} });
				} catch (err) {
					console.warn("Failed to sync user to MongoDB:", err);
				}
			})();
		} else setUser(null);
		setLoading(false);
	}, [clerkUser, userLoaded]);
	const logOut = async () => {
		await signOut();
		setUser(null);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthContext.Provider, {
		value: {
			user,
			loading: loading || !userLoaded,
			logOut
		},
		children
	});
}
function useAuth() {
	const ctx = (0, import_react.useContext)(AuthContext);
	if (!ctx) throw new Error("useAuth must be used within AuthProvider");
	return ctx;
}
//#endregion
export { updateMechanicLocationFn as C, updateHelpRequestFn as S, getNearbyMechanicsFn as _, approveGarageFn as a, rejectGarageFn as b, deleteGarageFn as c, getActiveRequestsFn as d, getAllGaragesFn as f, getMyHelpRequestFn as g, getMyGarageFn as h, SignUp$1 as i, deleteHelpRequestFn as l, getGarageIncomeFn as m, ClerkProvider$1 as n, closeHelpRequestFn as o, getAllHelpRequestsFn as p, SignIn$1 as r, createHelpRequestFn as s, AuthProvider as t, dist_exports as u, getPendingGaragesFn as v, useAuth as w, updateGarageAvailabilityFn as x, registerGarageFn as y };
