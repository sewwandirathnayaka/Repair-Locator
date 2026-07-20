import "./@clerk/clerk-react+[...].mjs";
//#region node_modules/@clerk/shared/dist/runtime/getEnvVariable-BSXrgsT3.mjs
var hasCloudflareProxyContext = (context) => {
	return !!context?.cloudflare?.env;
};
var hasCloudflareContext = (context) => {
	return !!context?.env;
};
/**
* Retrieves an environment variable across runtime environments.
*
* @param name - The environment variable name to retrieve.
* @param context - Optional context object that may contain environment values.
* @returns The environment variable value or empty string if not found.
*/
var getEnvVariable = (name, context) => {
	if (typeof process !== "undefined" && process.env && typeof process.env[name] === "string") return process.env[name];
	if (typeof import.meta !== "undefined" && typeof {
		"BASE_URL": "/",
		"DEV": false,
		"MODE": "production",
		"PROD": true,
		"SSR": true,
		"TSS_DEV_SERVER": "false",
		"TSS_DEV_SSR_STYLES_BASEPATH": "/",
		"TSS_DEV_SSR_STYLES_ENABLED": "true",
		"TSS_DISABLE_CSRF_MIDDLEWARE_WARNING": "false",
		"TSS_INLINE_CSS_ENABLED": "false",
		"TSS_ROUTER_BASEPATH": "",
		"TSS_SERVER_FN_BASE": "/_serverFn/",
		"VITE_ADMIN_EMAIL": "sewwandirathnayaka.ati@gmail.com",
		"VITE_CLERK_PUBLISHABLE_KEY": "pk_test_bW92aW5nLXRhcGlyLTQxLmNsZXJrLmFjY291bnRzLmRldiQ"
	}[name] === "string") return {
		"BASE_URL": "/",
		"DEV": false,
		"MODE": "production",
		"PROD": true,
		"SSR": true,
		"TSS_DEV_SERVER": "false",
		"TSS_DEV_SSR_STYLES_BASEPATH": "/",
		"TSS_DEV_SSR_STYLES_ENABLED": "true",
		"TSS_DISABLE_CSRF_MIDDLEWARE_WARNING": "false",
		"TSS_INLINE_CSS_ENABLED": "false",
		"TSS_ROUTER_BASEPATH": "",
		"TSS_SERVER_FN_BASE": "/_serverFn/",
		"VITE_ADMIN_EMAIL": "sewwandirathnayaka.ati@gmail.com",
		"VITE_CLERK_PUBLISHABLE_KEY": "pk_test_bW92aW5nLXRhcGlyLTQxLmNsZXJrLmFjY291bnRzLmRldiQ"
	}[name];
	if (hasCloudflareProxyContext(context)) return context.cloudflare.env[name] || "";
	if (hasCloudflareContext(context)) return context.env[name] || "";
	if (context && typeof context[name] === "string") return context[name];
	try {
		return globalThis[name];
	} catch {}
	return "";
};
//#endregion
export { getEnvVariable as t };
