import { o as __toESM } from "../_runtime.mjs";
import { m as require_react } from "../_libs/@clerk/clerk-react+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { u as dist_exports, w as useAuth } from "./AuthContext-mG2zIe-Y.mjs";
import { x as MailCheck, y as Minus } from "../_libs/lucide-react.mjs";
import { n as Button, r as cn, t as AppHeader } from "./AppHeader-D8mzsOX_.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as jt, t as Lt } from "../_libs/input-otp.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/verify-email-BSEEOZ9X.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var InputOTP = import_react.forwardRef(({ className, containerClassName, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lt, {
	ref,
	containerClassName: cn("flex items-center gap-2 has-[:disabled]:opacity-50", containerClassName),
	className: cn("disabled:cursor-not-allowed", className),
	...props
}));
InputOTP.displayName = "InputOTP";
var InputOTPGroup = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	ref,
	className: cn("flex items-center", className),
	...props
}));
InputOTPGroup.displayName = "InputOTPGroup";
var InputOTPSlot = import_react.forwardRef(({ index, className, ...props }, ref) => {
	const { char, hasFakeCaret, isActive } = import_react.useContext(jt).slots[index];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref,
		className: cn("relative flex h-9 w-9 items-center justify-center border-y border-r border-input text-sm shadow-sm transition-all first:rounded-l-md first:border-l last:rounded-r-md", isActive && "z-10 ring-1 ring-ring", className),
		...props,
		children: [char, hasFakeCaret && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "pointer-events-none absolute inset-0 flex items-center justify-center",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-4 w-px animate-caret-blink bg-foreground duration-1000" })
		})]
	});
});
InputOTPSlot.displayName = "InputOTPSlot";
var InputOTPSeparator = import_react.forwardRef(({ ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	ref,
	role: "separator",
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, {})
}));
InputOTPSeparator.displayName = "InputOTPSeparator";
function VerifyPage() {
	const { user } = useAuth();
	const { signUp, isLoaded } = (0, dist_exports.useSignUp)();
	const navigate = useNavigate();
	const [code, setCode] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(false);
	async function onVerify() {
		if (!isLoaded || !signUp) return;
		setLoading(true);
		try {
			if ((await signUp.attemptEmailAddressVerification({ code })).status === "complete") {
				toast.success("Email verified! Welcome aboard.");
				navigate({ to: "/dashboard" });
			} else toast.error("Verification incomplete. Please try again.");
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Verification failed");
		} finally {
			setLoading(false);
		}
	}
	async function onResend() {
		if (!isLoaded || !signUp) return;
		try {
			await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
			toast.success("New code sent to your email.");
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Resend failed");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppHeader, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex max-w-md flex-col items-center px-4 py-16 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-4 flex h-14 w-14 items-center justify-center rounded-2xl gold-gradient",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MailCheck, { className: "h-7 w-7 text-background" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-3xl font-bold",
					children: "Verify your email"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 max-w-sm text-sm text-muted-foreground",
					children: "We sent a 6-digit code to your email. Enter it below to activate your account."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "surface-elevated mt-8 w-full rounded-2xl p-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InputOTP, {
							maxLength: 6,
							value: code,
							onChange: setCode,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InputOTPGroup, {
								className: "mx-auto",
								children: [
									0,
									1,
									2,
									3,
									4,
									5
								].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InputOTPSlot, { index: i }, i))
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: onVerify,
							className: "mt-6 w-full",
							disabled: loading || code.length !== 6,
							children: loading ? "Verifying…" : "Verify email"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: onResend,
							className: "mt-3 text-sm text-gold hover:underline",
							children: "Resend code"
						})
					]
				})
			]
		})]
	});
}
//#endregion
export { VerifyPage as component };
