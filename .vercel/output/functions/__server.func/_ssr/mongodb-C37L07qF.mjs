import { t as require_lib } from "../_libs/mongodb.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/mongodb-C37L07qF.js
var import_lib = require_lib();
var uri = process.env.MONGODB_URI || "";
var dbName = process.env.MONGODB_DB_NAME || "repair_locator";
var _client = null;
var _db = null;
/**
* Returns a cached (or new) MongoDB Db instance.
* Safe to call multiple times — reuses the same connection.
*/
async function getDb() {
	if (_db && _client) try {
		await _client.db("admin").command({ ping: 1 });
		return _db;
	} catch {
		_client = null;
		_db = null;
	}
	if (!uri) throw new Error("MONGODB_URI is not defined in environment variables.");
	_client = new import_lib.MongoClient(uri, {
		connectTimeoutMS: 15e3,
		socketTimeoutMS: 45e3,
		serverSelectionTimeoutMS: 15e3,
		maxPoolSize: 10
	});
	await _client.connect();
	_db = _client.db(dbName);
	try {
		const collectionNames = (await _db.listCollections().toArray()).map((c) => c.name);
		if (!collectionNames.includes("shops")) {
			console.log("Creating 'shops' collection...");
			await _db.createCollection("shops");
		}
		if (!collectionNames.includes("users")) {
			await _db.createCollection("users");
			await _db.collection("users").createIndex({ clerkId: 1 }, { unique: true });
		}
		await _db.collection("shops").createIndex({ location: "2dsphere" });
		await _db.collection("shops").createIndex({ status: 1 });
		await _db.collection("shops").createIndex({ ownerClerkId: 1 }, {
			unique: true,
			sparse: true
		});
		if (await _db.collection("shops").countDocuments() === 0) {
			console.log("Seeding Kurunegala garage database...");
			await _db.collection("shops").insertMany([
				{
					id: "g1",
					ownerClerkId: "seed_g1",
					name: "Kurunegala Auto Care",
					specialty: "Engine & Transmission",
					address: "125/A, Colombo Rd, Kurunegala",
					phone: "+94 37 222 1001",
					rating: 4.9,
					availableMechanics: 3,
					totalMechanics: 4,
					open: true,
					status: "approved",
					lat: 7.4842,
					lng: 80.3627,
					location: {
						type: "Point",
						coordinates: [80.3627, 7.4842]
					},
					createdAt: (/* @__PURE__ */ new Date()).toISOString()
				},
				{
					id: "g2",
					ownerClerkId: "seed_g2",
					name: "Wayamba Garage",
					specialty: "Brakes & Suspension",
					address: "34, Kandy Rd, Kurunegala",
					phone: "+94 37 222 2002",
					rating: 4.7,
					availableMechanics: 2,
					totalMechanics: 3,
					open: true,
					status: "approved",
					lat: 7.4795,
					lng: 80.358,
					location: {
						type: "Point",
						coordinates: [80.358, 7.4795]
					},
					createdAt: (/* @__PURE__ */ new Date()).toISOString()
				},
				{
					id: "g3",
					ownerClerkId: "seed_g3",
					name: "North Gate Motors",
					specialty: "Electrical & AC",
					address: "88, Puttalam Rd, Kurunegala",
					phone: "+94 37 222 3003",
					rating: 4.6,
					availableMechanics: 1,
					totalMechanics: 2,
					open: true,
					status: "approved",
					lat: 7.4905,
					lng: 80.3555,
					location: {
						type: "Point",
						coordinates: [80.3555, 7.4905]
					},
					createdAt: (/* @__PURE__ */ new Date()).toISOString()
				},
				{
					id: "g4",
					ownerClerkId: "seed_g4",
					name: "Precision Diesel Works",
					specialty: "Diesel & Heavy Vehicles",
					address: "12, Dambulla Rd, Kurunegala",
					phone: "+94 37 222 4004",
					rating: 4.8,
					availableMechanics: 0,
					totalMechanics: 3,
					open: false,
					status: "approved",
					lat: 7.475,
					lng: 80.365,
					location: {
						type: "Point",
						coordinates: [80.365, 7.475]
					},
					createdAt: (/* @__PURE__ */ new Date()).toISOString()
				},
				{
					id: "g5",
					ownerClerkId: "seed_g5",
					name: "Torque Masters",
					specialty: "Performance & Tuning",
					address: "67, Maho Rd, Kurunegala",
					phone: "+94 37 222 5005",
					rating: 4.5,
					availableMechanics: 2,
					totalMechanics: 2,
					open: true,
					status: "approved",
					lat: 7.488,
					lng: 80.37,
					location: {
						type: "Point",
						coordinates: [80.37, 7.488]
					},
					createdAt: (/* @__PURE__ */ new Date()).toISOString()
				}
			]);
			console.log("✅ Kurunegala garages seeded successfully.");
		}
		console.log("✅ MongoDB indexes verified.");
	} catch (setupErr) {
		console.error("❌ MongoDB setup error:", setupErr);
	}
	return _db;
}
//#endregion
export { getDb };
