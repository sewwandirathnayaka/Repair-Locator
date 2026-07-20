import { o as __toESM } from "../_runtime.mjs";
import { m as require_react } from "../_libs/@clerk/clerk-react+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { h as getMyGarageFn, w as useAuth, y as registerGarageFn } from "./AuthContext-mG2zIe-Y.mjs";
import { D as CircleAlert, E as CircleCheck, a as Upload, b as MapPin, g as Phone, i as Users, r as Wrench } from "../_libs/lucide-react.mjs";
import { n as Button, t as AppHeader } from "./AppHeader-D8mzsOX_.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as Label, t as Input } from "./label-W_FRS3pT.mjs";
import { t as KURUNEGALA_CENTER } from "./types-C5anW29c.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/register-CxCT4e3L.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var SPECIALTIES = [
	"Engine & Transmission",
	"Brakes & Suspension",
	"Electrical & AC",
	"Diesel & Heavy Vehicles",
	"Performance & Tuning",
	"Tyres & Wheel Alignment",
	"Body Repair & Painting",
	"General Service & Maintenance"
];
function GarageRegisterPage() {
	const { user, loading } = useAuth();
	const navigate = useNavigate();
	const fileRef = (0, import_react.useRef)(null);
	const [form, setForm] = (0, import_react.useState)({
		name: "",
		address: "",
		phone: "",
		specialty: SPECIALTIES[0],
		lat: KURUNEGALA_CENTER.lat,
		lng: KURUNEGALA_CENTER.lng,
		totalMechanics: 1
	});
	const [nvqFile, setNvqFile] = (0, import_react.useState)(null);
	const [submitting, setSubmitting] = (0, import_react.useState)(false);
	const [checking, setChecking] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		if (loading) return;
		if (!user) {
			navigate({
				to: "/login",
				replace: true
			});
			return;
		}
		if (user.role === "owner") {
			navigate({
				to: "/dashboard",
				replace: true
			});
			return;
		}
		if (user.role === "admin") {
			navigate({
				to: "/admin",
				replace: true
			});
			return;
		}
		getMyGarageFn({ data: { clerkId: user.id } }).then((g) => {
			if (g) navigate({
				to: "/mechanic/pending",
				replace: true
			});
			else setChecking(false);
		}).catch(() => {
			setChecking(false);
		});
	}, [
		user,
		loading,
		navigate
	]);
	function handleFile(e) {
		const file = e.target.files?.[0];
		if (!file) return;
		if (file.size > 5 * 1024 * 1024) {
			toast.error("File too large — max 5MB");
			return;
		}
		const reader = new FileReader();
		reader.onload = () => {
			setNvqFile({
				name: file.name,
				base64: reader.result
			});
		};
		reader.readAsDataURL(file);
	}
	async function onSubmit(e) {
		e.preventDefault();
		if (!user) return;
		if (!nvqFile) {
			toast.error("Please upload your NVQ certificate");
			return;
		}
		if (!form.name.trim()) {
			toast.error("Please enter your garage name");
			return;
		}
		if (!form.address.trim()) {
			toast.error("Please enter your garage address");
			return;
		}
		setSubmitting(true);
		try {
			const result = await registerGarageFn({ data: {
				ownerClerkId: user.id,
				name: form.name,
				address: form.address,
				phone: form.phone,
				specialty: form.specialty,
				lat: form.lat,
				lng: form.lng,
				totalMechanics: form.totalMechanics,
				nvqCertificateBase64: nvqFile.base64,
				nvqCertificateName: nvqFile.name
			} });
			if (result?.success) {
				toast.success("Garage registered! Awaiting admin approval.");
				navigate({
					to: "/mechanic/pending",
					replace: true
				});
			} else toast.error(result?.error ?? "Registration failed. Please try again.");
		} catch (err) {
			console.error("registerGarageFn error:", err);
			toast.error("Something went wrong. Please try again.");
		} finally {
			setSubmitting(false);
		}
	}
	if (loading || checking) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen bg-background flex items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "text-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gold/30 border-t-gold" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Loading..."
			})]
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppHeader, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto max-w-2xl px-4 py-10",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm uppercase tracking-wider text-gold",
							children: "Mechanic Registration"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "mt-1 text-3xl font-bold",
							children: "Register Your Garage"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-muted-foreground",
							children: "Fill in your garage details. An admin will review and approve your application."
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-6 flex items-start gap-3 rounded-xl border border-gold/30 bg-gold/5 p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "mt-0.5 h-5 w-5 shrink-0 text-gold" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-medium text-gold",
							children: "Kurunegala Area Only"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-0.5 text-muted-foreground",
							children: "This platform currently serves the Kurunegala town area. Make sure your garage is within 6km of Kurunegala town center."
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit,
					className: "space-y-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "surface-elevated rounded-2xl p-6 space-y-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
									className: "font-semibold text-lg flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wrench, { className: "h-5 w-5 text-gold" }), " Garage Details"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "garage-name",
										children: "Garage / Shop Name *"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "garage-name",
										required: true,
										placeholder: "e.g. Silva Auto Works",
										value: form.name,
										onChange: (e) => setForm((f) => ({
											...f,
											name: e.target.value
										}))
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "specialty",
										children: "Main Specialty *"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
										id: "specialty",
										required: true,
										className: "w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring",
										value: form.specialty,
										onChange: (e) => setForm((f) => ({
											...f,
											specialty: e.target.value
										})),
										children: SPECIALTIES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: s,
											children: s
										}, s))
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
										htmlFor: "total-mechanics",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "inline h-4 w-4 mr-1" }), "Total Mechanics at Garage *"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "total-mechanics",
										type: "number",
										min: 1,
										max: 50,
										required: true,
										value: form.totalMechanics,
										onChange: (e) => setForm((f) => ({
											...f,
											totalMechanics: Number(e.target.value)
										}))
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "surface-elevated rounded-2xl p-6 space-y-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
									className: "font-semibold text-lg flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-5 w-5 text-gold" }), " Location & Contact"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "address",
										children: "Street Address *"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "address",
										required: true,
										placeholder: "e.g. 125/A, Colombo Rd, Kurunegala",
										value: form.address,
										onChange: (e) => setForm((f) => ({
											...f,
											address: e.target.value
										}))
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
										htmlFor: "phone",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "inline h-4 w-4 mr-1" }), "Phone Number *"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "phone",
										type: "tel",
										required: true,
										placeholder: "+94 37 XXX XXXX",
										value: form.phone,
										onChange: (e) => setForm((f) => ({
											...f,
											phone: e.target.value
										}))
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "lat",
											children: "Latitude"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "lat",
											type: "number",
											step: "0.0001",
											required: true,
											value: form.lat,
											onChange: (e) => setForm((f) => ({
												...f,
												lat: Number(e.target.value)
											}))
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "lng",
											children: "Longitude"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "lng",
											type: "number",
											step: "0.0001",
											required: true,
											value: form.lng,
											onChange: (e) => setForm((f) => ({
												...f,
												lng: Number(e.target.value)
											}))
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: "Kurunegala center: lat 7.4818, lng 80.3609. Your garage should be within 6km of this point."
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "surface-elevated rounded-2xl p-6 space-y-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
									className: "font-semibold text-lg flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-5 w-5 text-gold" }), " NVQ Certificate"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-muted-foreground",
									children: "Upload your NVQ (National Vocational Qualification) certificate. Accepted formats: PDF, JPG, PNG (max 5MB)."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									ref: fileRef,
									type: "file",
									accept: ".pdf,.jpg,.jpeg,.png",
									className: "hidden",
									onChange: handleFile
								}),
								nvqFile ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3 rounded-xl border border-primary/40 bg-primary/5 p-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-5 w-5 text-primary shrink-0" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm font-medium",
											children: nvqFile.name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-muted-foreground",
											children: "Uploaded successfully"
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											type: "button",
											variant: "ghost",
											size: "sm",
											className: "ml-auto",
											onClick: () => setNvqFile(null),
											children: "Remove"
										})
									]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => fileRef.current?.click(),
									className: "w-full rounded-xl border-2 border-dashed border-border p-8 text-center hover:border-gold/40 hover:bg-gold/5 transition-colors",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "mx-auto mb-2 h-8 w-8 text-muted-foreground" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm font-medium",
											children: "Click to upload NVQ certificate"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-1 text-xs text-muted-foreground",
											children: "PDF, JPG, PNG — max 5MB"
										})
									]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							className: "w-full",
							size: "lg",
							disabled: submitting,
							children: submitting ? "Submitting..." : "Submit for Admin Approval"
						})
					]
				})
			]
		})]
	});
}
//#endregion
export { GarageRegisterPage as component };
