import { c as createServerFn, i as TSS_SERVER_FUNCTION } from "./createServerFn-CIHAFgYl.mjs";
import { t as KURUNEGALA_CENTER } from "./types-C5anW29c.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/db-C4SrmxH8.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var RADIUS_EARTH_KM = 6371;
function getDistanceKm(lat1, lon1, lat2, lon2) {
	const toRad = (n) => n * Math.PI / 180;
	const dLat = toRad(lat2 - lat1);
	const dLon = toRad(lon2 - lon1);
	const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
	return Math.round(RADIUS_EARTH_KM * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) * 10) / 10;
}
function docToGarage(s, refLat = KURUNEGALA_CENTER.lat, refLng = KURUNEGALA_CENTER.lng) {
	const lat = s.lat || 0;
	const lng = s.lng || 0;
	return {
		id: s.id || String(s._id),
		ownerClerkId: s.ownerClerkId || "",
		name: s.name || "",
		specialty: s.specialty || "",
		address: s.address || "",
		phone: s.phone || "",
		rating: s.rating || 0,
		availableMechanics: s.availableMechanics ?? 0,
		totalMechanics: s.totalMechanics ?? 1,
		open: s.open ?? false,
		status: s.status ?? "pending",
		distanceKm: getDistanceKm(refLat, refLng, lat, lng),
		lat,
		lng,
		nvqCertificateBase64: s.nvqCertificateBase64,
		nvqCertificateName: s.nvqCertificateName,
		services: s.services,
		createdAt: s.createdAt
	};
}
function getMockGarages(lat, lng) {
	return [
		{
			id: "g1",
			name: "Kurunegala Auto Care",
			specialty: "Engine & Transmission",
			phone: "+94 37 222 1001",
			address: "125/A, Colombo Rd, Kurunegala",
			rating: 4.9,
			open: true,
			availableMechanics: 3,
			totalMechanics: 4,
			lat: 7.4842,
			lng: 80.3627
		},
		{
			id: "g2",
			name: "Wayamba Garage",
			specialty: "Brakes & Suspension",
			phone: "+94 37 222 2002",
			address: "34, Kandy Rd, Kurunegala",
			rating: 4.7,
			open: true,
			availableMechanics: 2,
			totalMechanics: 3,
			lat: 7.4795,
			lng: 80.358
		},
		{
			id: "g3",
			name: "North Gate Motors",
			specialty: "Electrical & AC",
			phone: "+94 37 222 3003",
			address: "88, Puttalam Rd, Kurunegala",
			rating: 4.6,
			open: true,
			availableMechanics: 1,
			totalMechanics: 2,
			lat: 7.4905,
			lng: 80.3555
		},
		{
			id: "g4",
			name: "Precision Diesel Works",
			specialty: "Diesel & Heavy Vehicles",
			phone: "+94 37 222 4004",
			address: "12, Dambulla Rd, Kurunegala",
			rating: 4.8,
			open: false,
			availableMechanics: 0,
			totalMechanics: 3,
			lat: 7.475,
			lng: 80.365
		},
		{
			id: "g5",
			name: "Torque Masters",
			specialty: "Performance & Tuning",
			phone: "+94 37 222 5005",
			address: "67, Maho Rd, Kurunegala",
			rating: 4.5,
			open: true,
			availableMechanics: 2,
			totalMechanics: 2,
			lat: 7.488,
			lng: 80.37
		}
	].map((g) => ({
		...g,
		ownerClerkId: "seed",
		status: "approved",
		distanceKm: getDistanceKm(lat, lng, g.lat, g.lng)
	})).sort((a, b) => a.distanceKm - b.distanceKm);
}
var getNearbyMechanicsFn_createServerFn_handler = createServerRpc({
	id: "5f049d4aaa742d985c023e0943154dcbcc996891a33943558bcbe622983fa9bc",
	name: "getNearbyMechanicsFn",
	filename: "src/server-fns/db.ts"
}, (opts) => getNearbyMechanicsFn.__executeServer(opts));
var getNearbyMechanicsFn = createServerFn({ method: "POST" }).validator((v) => v).handler(getNearbyMechanicsFn_createServerFn_handler, async (ctx) => {
	const payload = ctx.data ?? {};
	const refLat = payload.lat ?? KURUNEGALA_CENTER.lat;
	const refLng = payload.lng ?? KURUNEGALA_CENTER.lng;
	try {
		const { getDb } = await import("./mongodb-C37L07qF.mjs");
		const shops = await (await getDb()).collection("shops").find({ status: "approved" }).toArray();
		if (shops.length === 0) {
			console.log("No approved shops in DB — serving mock garages");
			return getMockGarages(refLat, refLng);
		}
		return shops.map((s) => docToGarage(s, refLat, refLng)).filter((g) => getDistanceKm(KURUNEGALA_CENTER.lat, KURUNEGALA_CENTER.lng, g.lat, g.lng) <= 6).sort((a, b) => a.distanceKm - b.distanceKm);
	} catch (error) {
		console.error("getNearbyMechanicsFn DB error:", error.message);
		return getMockGarages(refLat, refLng);
	}
});
var registerGarageFn_createServerFn_handler = createServerRpc({
	id: "afbad1d896cb0ff1f13e3c2704c66a1630ded745ac2f860efebc320e9aed2986",
	name: "registerGarageFn",
	filename: "src/server-fns/db.ts"
}, (opts) => registerGarageFn.__executeServer(opts));
var registerGarageFn = createServerFn({ method: "POST" }).validator((v) => v).handler(registerGarageFn_createServerFn_handler, async (ctx) => {
	const payload = ctx.data;
	if (!payload.ownerClerkId) return {
		success: false,
		error: "Missing ownerClerkId"
	};
	try {
		const { getDb } = await import("./mongodb-C37L07qF.mjs");
		const db = await getDb();
		const existing = await db.collection("shops").findOne({ ownerClerkId: payload.ownerClerkId });
		if (existing) {
			console.log(`Mechanic ${payload.ownerClerkId} already has garage: ${existing.id}`);
			return {
				success: true,
				garageId: existing.id || String(existing._id)
			};
		}
		const garageId = `g_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
		const now = (/* @__PURE__ */ new Date()).toISOString();
		await db.collection("shops").insertOne({
			id: garageId,
			ownerClerkId: payload.ownerClerkId,
			name: payload.name.trim(),
			address: payload.address.trim(),
			phone: payload.phone.trim(),
			specialty: payload.specialty,
			lat: Number(payload.lat),
			lng: Number(payload.lng),
			totalMechanics: Number(payload.totalMechanics),
			availableMechanics: 0,
			rating: 0,
			open: false,
			status: "pending",
			nvqCertificateBase64: payload.nvqCertificateBase64 ?? null,
			nvqCertificateName: payload.nvqCertificateName ?? null,
			location: {
				type: "Point",
				coordinates: [Number(payload.lng), Number(payload.lat)]
			},
			createdAt: now,
			updatedAt: now
		});
		console.log(`✅ New garage registered: ${garageId} by ${payload.ownerClerkId}`);
		return {
			success: true,
			garageId
		};
	} catch (error) {
		console.error("registerGarageFn error:", error);
		return {
			success: false,
			error: error.message
		};
	}
});
var getPendingGaragesFn_createServerFn_handler = createServerRpc({
	id: "9a0df68e804b580f14ad547977314f7d5e87a1c6a2346a702fbddcfaefe56f53",
	name: "getPendingGaragesFn",
	filename: "src/server-fns/db.ts"
}, (opts) => getPendingGaragesFn.__executeServer(opts));
var getPendingGaragesFn = createServerFn({ method: "POST" }).handler(getPendingGaragesFn_createServerFn_handler, async () => {
	try {
		const { getDb } = await import("./mongodb-C37L07qF.mjs");
		const shops = await (await getDb()).collection("shops").find({ status: "pending" }).sort({ createdAt: -1 }).toArray();
		console.log(`Admin: ${shops.length} pending applications fetched`);
		return shops.map((s) => docToGarage(s));
	} catch (error) {
		console.error("getPendingGaragesFn error:", error.message);
		return [];
	}
});
var getAllGaragesFn_createServerFn_handler = createServerRpc({
	id: "166e19e42f0ee38bc0bd6d68e758646dbd35bbe8f94cbaafaeba37beb22e8ec1",
	name: "getAllGaragesFn",
	filename: "src/server-fns/db.ts"
}, (opts) => getAllGaragesFn.__executeServer(opts));
var getAllGaragesFn = createServerFn({ method: "POST" }).handler(getAllGaragesFn_createServerFn_handler, async () => {
	try {
		const { getDb } = await import("./mongodb-C37L07qF.mjs");
		const shops = await (await getDb()).collection("shops").find({}).sort({ createdAt: -1 }).toArray();
		console.log(`Admin: ${shops.length} total garages fetched`);
		return shops.map((s) => docToGarage(s));
	} catch (error) {
		console.error("getAllGaragesFn error:", error.message);
		return [];
	}
});
var approveGarageFn_createServerFn_handler = createServerRpc({
	id: "9cb52376439a543154d1f2de783f970e9160069d5855893c06f5cb9cec525eb0",
	name: "approveGarageFn",
	filename: "src/server-fns/db.ts"
}, (opts) => approveGarageFn.__executeServer(opts));
var approveGarageFn = createServerFn({ method: "POST" }).validator((v) => v).handler(approveGarageFn_createServerFn_handler, async (ctx) => {
	const { garageId } = ctx.data;
	if (!garageId) return { success: false };
	try {
		const { getDb } = await import("./mongodb-C37L07qF.mjs");
		const ok = (await (await getDb()).collection("shops").updateOne({ id: garageId }, { $set: {
			status: "approved",
			open: true,
			approvedAt: (/* @__PURE__ */ new Date()).toISOString(),
			updatedAt: (/* @__PURE__ */ new Date()).toISOString()
		} })).modifiedCount > 0;
		console.log(`Admin APPROVED garage ${garageId}: ${ok ? "✅" : "❌ not found"}`);
		return { success: ok };
	} catch (error) {
		console.error("approveGarageFn error:", error);
		return { success: false };
	}
});
var rejectGarageFn_createServerFn_handler = createServerRpc({
	id: "0afe5372adfe5c4719a4fd4e3d8e84ebe420eec59999cdf9bb1e9ec85e0bb856",
	name: "rejectGarageFn",
	filename: "src/server-fns/db.ts"
}, (opts) => rejectGarageFn.__executeServer(opts));
var rejectGarageFn = createServerFn({ method: "POST" }).validator((v) => v).handler(rejectGarageFn_createServerFn_handler, async (ctx) => {
	const { garageId, reason } = ctx.data;
	if (!garageId) return { success: false };
	try {
		const { getDb } = await import("./mongodb-C37L07qF.mjs");
		const ok = (await (await getDb()).collection("shops").updateOne({ id: garageId }, { $set: {
			status: "rejected",
			open: false,
			rejectedAt: (/* @__PURE__ */ new Date()).toISOString(),
			rejectionReason: reason ?? "Does not meet platform requirements",
			updatedAt: (/* @__PURE__ */ new Date()).toISOString()
		} })).modifiedCount > 0;
		console.log(`Admin REJECTED garage ${garageId}: ${ok ? "✅" : "❌ not found"}`);
		return { success: ok };
	} catch (error) {
		console.error("rejectGarageFn error:", error);
		return { success: false };
	}
});
var getMyGarageFn_createServerFn_handler = createServerRpc({
	id: "ffbd8e0d9e5a21ebd8b90ac0b8bcb3a9f4314f6e230600adabadc4e1980057fa",
	name: "getMyGarageFn",
	filename: "src/server-fns/db.ts"
}, (opts) => getMyGarageFn.__executeServer(opts));
var getMyGarageFn = createServerFn({ method: "POST" }).validator((v) => v).handler(getMyGarageFn_createServerFn_handler, async (ctx) => {
	const { clerkId } = ctx.data;
	if (!clerkId) return null;
	try {
		const { getDb } = await import("./mongodb-C37L07qF.mjs");
		const shop = await (await getDb()).collection("shops").findOne({ ownerClerkId: clerkId });
		if (!shop) {
			console.log(`No garage found for mechanic ${clerkId}`);
			return null;
		}
		return docToGarage(shop);
	} catch (error) {
		console.error("getMyGarageFn error:", error.message);
		return null;
	}
});
var updateGarageAvailabilityFn_createServerFn_handler = createServerRpc({
	id: "965c56ad7d21f8f3743f0ff01ab35f1b1e1a2c67530c230b398cbbaae012d668",
	name: "updateGarageAvailabilityFn",
	filename: "src/server-fns/db.ts"
}, (opts) => updateGarageAvailabilityFn.__executeServer(opts));
var updateGarageAvailabilityFn = createServerFn({ method: "POST" }).validator((v) => v).handler(updateGarageAvailabilityFn_createServerFn_handler, async (ctx) => {
	const { garageId, availableMechanics, open } = ctx.data;
	if (!garageId) return { success: false };
	try {
		const { getDb } = await import("./mongodb-C37L07qF.mjs");
		const ok = (await (await getDb()).collection("shops").updateOne({ id: garageId }, { $set: {
			availableMechanics: Math.max(0, Number(availableMechanics)),
			open: Boolean(open),
			updatedAt: (/* @__PURE__ */ new Date()).toISOString()
		} })).modifiedCount > 0;
		console.log(`Garage ${garageId} availability updated: ${availableMechanics} available, open=${open} → ${ok ? "✅" : "❌"}`);
		return { success: ok };
	} catch (error) {
		console.error("updateGarageAvailabilityFn error:", error);
		return { success: false };
	}
});
var syncClerkUserFn_createServerFn_handler = createServerRpc({
	id: "2c8b7f04a8f1c735030b61b0417d7fee79683717676ab9be19293acf8dba07a5",
	name: "syncClerkUserFn",
	filename: "src/server-fns/db.ts"
}, (opts) => syncClerkUserFn.__executeServer(opts));
var syncClerkUserFn = createServerFn({ method: "POST" }).validator((v) => v).handler(syncClerkUserFn_createServerFn_handler, async (ctx) => {
	const payload = ctx.data;
	if (!payload.clerkId) return { success: false };
	try {
		const { getDb } = await import("./mongodb-C37L07qF.mjs");
		await (await getDb()).collection("users").updateOne({ clerkId: payload.clerkId }, {
			$set: {
				name: payload.name,
				email: payload.email,
				role: payload.role,
				updatedAt: /* @__PURE__ */ new Date()
			},
			$setOnInsert: {
				clerkId: payload.clerkId,
				createdAt: /* @__PURE__ */ new Date()
			}
		}, { upsert: true });
		console.log(`✅ User synced: ${payload.email} (${payload.role})`);
		return { success: true };
	} catch (error) {
		console.warn("syncClerkUserFn skipped:", error.message);
		return { success: false };
	}
});
var createHelpRequestFn_createServerFn_handler = createServerRpc({
	id: "ee46add18379c23631413d152766e98d55db3ca6d667f450f66684cdd4ef0e99",
	name: "createHelpRequestFn",
	filename: "src/server-fns/db.ts"
}, (opts) => createHelpRequestFn.__executeServer(opts));
var createHelpRequestFn = createServerFn({ method: "POST" }).validator((v) => v).handler(createHelpRequestFn_createServerFn_handler, async (ctx) => {
	const payload = ctx.data;
	if (!payload.ownerId) return {
		success: false,
		error: "Missing ownerId"
	};
	try {
		const { getDb } = await import("./mongodb-C37L07qF.mjs");
		const db = await getDb();
		await db.collection("help_requests").updateMany({
			ownerId: payload.ownerId,
			status: { $in: ["pending", "accepted"] }
		}, { $set: {
			status: "cancelled",
			updatedAt: (/* @__PURE__ */ new Date()).toISOString()
		} });
		const requestId = `req_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
		const now = /* @__PURE__ */ new Date();
		const expiresAt = new Date(now.getTime() + 7200 * 1e3);
		await db.collection("help_requests").insertOne({
			id: requestId,
			ownerId: payload.ownerId,
			ownerName: payload.ownerName,
			ownerPhone: payload.ownerPhone,
			description: payload.description,
			lat: Number(payload.lat),
			lng: Number(payload.lng),
			status: "pending",
			acceptedByGarageId: null,
			createdAt: now.toISOString(),
			expiresAt: expiresAt.toISOString()
		});
		console.log(`✅ Help request created: ${requestId} by ${payload.ownerId}`);
		return {
			success: true,
			requestId
		};
	} catch (error) {
		console.error("createHelpRequestFn error:", error);
		return {
			success: false,
			error: error.message
		};
	}
});
var getMyHelpRequestFn_createServerFn_handler = createServerRpc({
	id: "dc9a2bd00a014cfec5fed6ae4946b7babc4739725553be1e7a350d34cc0e3f42",
	name: "getMyHelpRequestFn",
	filename: "src/server-fns/db.ts"
}, (opts) => getMyHelpRequestFn.__executeServer(opts));
var getMyHelpRequestFn = createServerFn({ method: "POST" }).validator((v) => v).handler(getMyHelpRequestFn_createServerFn_handler, async (ctx) => {
	const { ownerId } = ctx.data;
	if (!ownerId) return null;
	try {
		const { getDb } = await import("./mongodb-C37L07qF.mjs");
		const req = await (await getDb()).collection("help_requests").findOne({
			ownerId,
			status: { $in: [
				"pending",
				"accepted",
				"done"
			] }
		}, { sort: { createdAt: -1 } });
		if (!req) return null;
		return {
			id: req.id,
			ownerId: req.ownerId,
			ownerName: req.ownerName,
			ownerPhone: req.ownerPhone,
			description: req.description,
			lat: req.lat,
			lng: req.lng,
			status: req.status,
			acceptedByGarageId: req.acceptedByGarageId,
			mechanicLat: req.mechanicLat,
			mechanicLng: req.mechanicLng,
			cost: req.cost,
			createdAt: req.createdAt,
			expiresAt: req.expiresAt
		};
	} catch (error) {
		console.error("getMyHelpRequestFn error:", error);
		return null;
	}
});
var getActiveRequestsFn_createServerFn_handler = createServerRpc({
	id: "c6ec7b80c823a6d9a237f1f84fe39db965580045c13ab684342f4f04e90e70b6",
	name: "getActiveRequestsFn",
	filename: "src/server-fns/db.ts"
}, (opts) => getActiveRequestsFn.__executeServer(opts));
var getActiveRequestsFn = createServerFn({ method: "POST" }).validator((v) => v).handler(getActiveRequestsFn_createServerFn_handler, async (ctx) => {
	const { garageId, garageLat, garageLng } = ctx.data;
	try {
		const { getDb } = await import("./mongodb-C37L07qF.mjs");
		const db = await getDb();
		const query = {
			$or: [{ status: "pending" }, ...garageId ? [{
				status: "accepted",
				acceptedByGarageId: garageId
			}] : []],
			expiresAt: { $gt: (/* @__PURE__ */ new Date()).toISOString() }
		};
		return (await db.collection("help_requests").find(query).sort({ createdAt: -1 }).toArray()).map((r) => ({
			id: r.id,
			ownerId: r.ownerId,
			ownerName: r.ownerName,
			ownerPhone: r.ownerPhone,
			description: r.description,
			lat: r.lat,
			lng: r.lng,
			status: r.status,
			acceptedByGarageId: r.acceptedByGarageId,
			mechanicLat: r.mechanicLat,
			mechanicLng: r.mechanicLng,
			cost: r.cost,
			distanceKm: garageLat ? getDistanceKm(garageLat, garageLng, r.lat, r.lng) : void 0,
			createdAt: r.createdAt,
			expiresAt: r.expiresAt
		})).filter((r) => !garageLat || (r.distanceKm ?? 0) <= 6).sort((a, b) => (a.distanceKm ?? 0) - (b.distanceKm ?? 0));
	} catch (error) {
		console.error("getActiveRequestsFn error:", error);
		return [];
	}
});
var updateHelpRequestFn_createServerFn_handler = createServerRpc({
	id: "db10a6bef7d27fdd6db375bc5d88b8641e78750ec8376f5d8469985b8b7ed2c6",
	name: "updateHelpRequestFn",
	filename: "src/server-fns/db.ts"
}, (opts) => updateHelpRequestFn.__executeServer(opts));
var updateHelpRequestFn = createServerFn({ method: "POST" }).validator((v) => v).handler(updateHelpRequestFn_createServerFn_handler, async (ctx) => {
	const { requestId, status, garageId, cost } = ctx.data;
	if (!requestId) return { success: false };
	try {
		const { getDb } = await import("./mongodb-C37L07qF.mjs");
		const result = await (await getDb()).collection("help_requests").updateOne({ id: requestId }, { $set: {
			status,
			...garageId ? { acceptedByGarageId: garageId } : {},
			...cost !== void 0 ? { cost } : {},
			updatedAt: (/* @__PURE__ */ new Date()).toISOString()
		} });
		console.log(`Help request ${requestId} → ${status}: ${result.modifiedCount > 0 ? "✅" : "❌"}`);
		return { success: result.modifiedCount > 0 };
	} catch (error) {
		console.error("updateHelpRequestFn error:", error);
		return { success: false };
	}
});
var updateMechanicLocationFn_createServerFn_handler = createServerRpc({
	id: "7c8b76823756fbecb5dd37524bd891e05d8c78d603c80a9cbd65fcb430847c5c",
	name: "updateMechanicLocationFn",
	filename: "src/server-fns/db.ts"
}, (opts) => updateMechanicLocationFn.__executeServer(opts));
var updateMechanicLocationFn = createServerFn({ method: "POST" }).validator((v) => v).handler(updateMechanicLocationFn_createServerFn_handler, async (ctx) => {
	const { requestId, lat, lng } = ctx.data;
	if (!requestId) return { success: false };
	try {
		const { getDb } = await import("./mongodb-C37L07qF.mjs");
		return { success: (await (await getDb()).collection("help_requests").updateOne({
			id: requestId,
			status: "accepted"
		}, { $set: {
			mechanicLat: lat,
			mechanicLng: lng,
			updatedAt: (/* @__PURE__ */ new Date()).toISOString()
		} })).modifiedCount > 0 };
	} catch (error) {
		console.error("updateMechanicLocationFn error:", error);
		return { success: false };
	}
});
var deleteGarageFn_createServerFn_handler = createServerRpc({
	id: "2c2d3d90f1c5d87db2087412ea6c6592e612be4034ad55a7383841177ea09dcb",
	name: "deleteGarageFn",
	filename: "src/server-fns/db.ts"
}, (opts) => deleteGarageFn.__executeServer(opts));
var deleteGarageFn = createServerFn({ method: "POST" }).validator((v) => v).handler(deleteGarageFn_createServerFn_handler, async (ctx) => {
	const { garageId } = ctx.data;
	if (!garageId) return {
		success: false,
		error: "Missing ID"
	};
	try {
		const { getDb } = await import("./mongodb-C37L07qF.mjs");
		const db = await getDb();
		const result = await db.collection("shops").deleteOne({ id: garageId });
		await db.collection("help_requests").updateMany({
			acceptedByGarageId: garageId,
			status: "accepted"
		}, { $set: {
			status: "pending",
			acceptedByGarageId: null,
			updatedAt: (/* @__PURE__ */ new Date()).toISOString()
		} });
		return { success: result.deletedCount > 0 };
	} catch (error) {
		console.error("deleteGarageFn error:", error);
		return {
			success: false,
			error: error.message
		};
	}
});
var getAllHelpRequestsFn_createServerFn_handler = createServerRpc({
	id: "5b60425f94c013b229759d11acd19ead29b24aaddb8ee83f927b7870ce8b5c82",
	name: "getAllHelpRequestsFn",
	filename: "src/server-fns/db.ts"
}, (opts) => getAllHelpRequestsFn.__executeServer(opts));
var getAllHelpRequestsFn = createServerFn({ method: "POST" }).validator((v) => v).handler(getAllHelpRequestsFn_createServerFn_handler, async () => {
	try {
		const { getDb } = await import("./mongodb-C37L07qF.mjs");
		return (await (await getDb()).collection("help_requests").find({}).sort({ createdAt: -1 }).toArray()).map((r) => ({
			id: r.id,
			ownerId: r.ownerId,
			ownerName: r.ownerName,
			ownerPhone: r.ownerPhone,
			description: r.description,
			lat: r.lat,
			lng: r.lng,
			status: r.status,
			acceptedByGarageId: r.acceptedByGarageId,
			mechanicLat: r.mechanicLat,
			mechanicLng: r.mechanicLng,
			createdAt: r.createdAt,
			expiresAt: r.expiresAt
		}));
	} catch (error) {
		console.error("getAllHelpRequestsFn error:", error);
		return [];
	}
});
var deleteHelpRequestFn_createServerFn_handler = createServerRpc({
	id: "92b44394057b3187a21437a0744dd5f6d9b87f87fe54f5917a832514dce5ffb0",
	name: "deleteHelpRequestFn",
	filename: "src/server-fns/db.ts"
}, (opts) => deleteHelpRequestFn.__executeServer(opts));
var deleteHelpRequestFn = createServerFn({ method: "POST" }).validator((v) => v).handler(deleteHelpRequestFn_createServerFn_handler, async (ctx) => {
	const { requestId } = ctx.data;
	if (!requestId) return {
		success: false,
		error: "Missing ID"
	};
	try {
		const { getDb } = await import("./mongodb-C37L07qF.mjs");
		return { success: (await (await getDb()).collection("help_requests").deleteOne({ id: requestId })).deletedCount > 0 };
	} catch (error) {
		console.error("deleteHelpRequestFn error:", error);
		return {
			success: false,
			error: error.message
		};
	}
});
var getGarageIncomeFn_createServerFn_handler = createServerRpc({
	id: "e292013e4d686c0c53e1a7057e3ffacf3ceeb600db14d464ab629138c5f8739a",
	name: "getGarageIncomeFn",
	filename: "src/server-fns/db.ts"
}, (opts) => getGarageIncomeFn.__executeServer(opts));
var getGarageIncomeFn = createServerFn({ method: "POST" }).validator((v) => v).handler(getGarageIncomeFn_createServerFn_handler, async (ctx) => {
	const { garageId } = ctx.data;
	if (!garageId) return 0;
	try {
		const { getDb } = await import("./mongodb-C37L07qF.mjs");
		return (await (await getDb()).collection("help_requests").find({
			acceptedByGarageId: garageId,
			status: { $in: ["done", "closed"] }
		}).toArray()).reduce((sum, req) => sum + (Number(req.cost) || 0), 0);
	} catch (error) {
		console.error("getGarageIncomeFn error:", error);
		return 0;
	}
});
var closeHelpRequestFn_createServerFn_handler = createServerRpc({
	id: "27de64ffc9f83906bdf95c3b5062e56a16de9cf399d68ac5d3739c187d1fc02d",
	name: "closeHelpRequestFn",
	filename: "src/server-fns/db.ts"
}, (opts) => closeHelpRequestFn.__executeServer(opts));
var closeHelpRequestFn = createServerFn({ method: "POST" }).validator((v) => v).handler(closeHelpRequestFn_createServerFn_handler, async (ctx) => {
	const { requestId } = ctx.data;
	if (!requestId) return { success: false };
	try {
		const { getDb } = await import("./mongodb-C37L07qF.mjs");
		await (await getDb()).collection("help_requests").updateOne({ id: requestId }, { $set: {
			status: "closed",
			updatedAt: (/* @__PURE__ */ new Date()).toISOString()
		} });
		return { success: true };
	} catch (error) {
		console.error("closeHelpRequestFn error:", error);
		return { success: false };
	}
});
//#endregion
export { approveGarageFn_createServerFn_handler, closeHelpRequestFn_createServerFn_handler, createHelpRequestFn_createServerFn_handler, deleteGarageFn_createServerFn_handler, deleteHelpRequestFn_createServerFn_handler, getActiveRequestsFn_createServerFn_handler, getAllGaragesFn_createServerFn_handler, getAllHelpRequestsFn_createServerFn_handler, getGarageIncomeFn_createServerFn_handler, getMyGarageFn_createServerFn_handler, getMyHelpRequestFn_createServerFn_handler, getNearbyMechanicsFn_createServerFn_handler, getPendingGaragesFn_createServerFn_handler, registerGarageFn_createServerFn_handler, rejectGarageFn_createServerFn_handler, syncClerkUserFn_createServerFn_handler, updateGarageAvailabilityFn_createServerFn_handler, updateHelpRequestFn_createServerFn_handler, updateMechanicLocationFn_createServerFn_handler };
