//#region node_modules/.nitro/vite/services/ssr/assets/__23tanstack-start-server-fn-resolver-DXn_OdSO.js
var manifest = {
	"0afe5372adfe5c4719a4fd4e3d8e84ebe420eec59999cdf9bb1e9ec85e0bb856": {
		functionName: "rejectGarageFn_createServerFn_handler",
		importer: () => import("./_ssr/db-C4SrmxH8.mjs")
	},
	"166e19e42f0ee38bc0bd6d68e758646dbd35bbe8f94cbaafaeba37beb22e8ec1": {
		functionName: "getAllGaragesFn_createServerFn_handler",
		importer: () => import("./_ssr/db-C4SrmxH8.mjs")
	},
	"27de64ffc9f83906bdf95c3b5062e56a16de9cf399d68ac5d3739c187d1fc02d": {
		functionName: "closeHelpRequestFn_createServerFn_handler",
		importer: () => import("./_ssr/db-C4SrmxH8.mjs")
	},
	"2c2d3d90f1c5d87db2087412ea6c6592e612be4034ad55a7383841177ea09dcb": {
		functionName: "deleteGarageFn_createServerFn_handler",
		importer: () => import("./_ssr/db-C4SrmxH8.mjs")
	},
	"2c8b7f04a8f1c735030b61b0417d7fee79683717676ab9be19293acf8dba07a5": {
		functionName: "syncClerkUserFn_createServerFn_handler",
		importer: () => import("./_ssr/db-C4SrmxH8.mjs")
	},
	"5b60425f94c013b229759d11acd19ead29b24aaddb8ee83f927b7870ce8b5c82": {
		functionName: "getAllHelpRequestsFn_createServerFn_handler",
		importer: () => import("./_ssr/db-C4SrmxH8.mjs")
	},
	"5f049d4aaa742d985c023e0943154dcbcc996891a33943558bcbe622983fa9bc": {
		functionName: "getNearbyMechanicsFn_createServerFn_handler",
		importer: () => import("./_ssr/db-C4SrmxH8.mjs")
	},
	"7c8b76823756fbecb5dd37524bd891e05d8c78d603c80a9cbd65fcb430847c5c": {
		functionName: "updateMechanicLocationFn_createServerFn_handler",
		importer: () => import("./_ssr/db-C4SrmxH8.mjs")
	},
	"92b44394057b3187a21437a0744dd5f6d9b87f87fe54f5917a832514dce5ffb0": {
		functionName: "deleteHelpRequestFn_createServerFn_handler",
		importer: () => import("./_ssr/db-C4SrmxH8.mjs")
	},
	"965c56ad7d21f8f3743f0ff01ab35f1b1e1a2c67530c230b398cbbaae012d668": {
		functionName: "updateGarageAvailabilityFn_createServerFn_handler",
		importer: () => import("./_ssr/db-C4SrmxH8.mjs")
	},
	"9a0df68e804b580f14ad547977314f7d5e87a1c6a2346a702fbddcfaefe56f53": {
		functionName: "getPendingGaragesFn_createServerFn_handler",
		importer: () => import("./_ssr/db-C4SrmxH8.mjs")
	},
	"9cb52376439a543154d1f2de783f970e9160069d5855893c06f5cb9cec525eb0": {
		functionName: "approveGarageFn_createServerFn_handler",
		importer: () => import("./_ssr/db-C4SrmxH8.mjs")
	},
	"afbad1d896cb0ff1f13e3c2704c66a1630ded745ac2f860efebc320e9aed2986": {
		functionName: "registerGarageFn_createServerFn_handler",
		importer: () => import("./_ssr/db-C4SrmxH8.mjs")
	},
	"c6ec7b80c823a6d9a237f1f84fe39db965580045c13ab684342f4f04e90e70b6": {
		functionName: "getActiveRequestsFn_createServerFn_handler",
		importer: () => import("./_ssr/db-C4SrmxH8.mjs")
	},
	"db10a6bef7d27fdd6db375bc5d88b8641e78750ec8376f5d8469985b8b7ed2c6": {
		functionName: "updateHelpRequestFn_createServerFn_handler",
		importer: () => import("./_ssr/db-C4SrmxH8.mjs")
	},
	"dc9a2bd00a014cfec5fed6ae4946b7babc4739725553be1e7a350d34cc0e3f42": {
		functionName: "getMyHelpRequestFn_createServerFn_handler",
		importer: () => import("./_ssr/db-C4SrmxH8.mjs")
	},
	"e292013e4d686c0c53e1a7057e3ffacf3ceeb600db14d464ab629138c5f8739a": {
		functionName: "getGarageIncomeFn_createServerFn_handler",
		importer: () => import("./_ssr/db-C4SrmxH8.mjs")
	},
	"ee46add18379c23631413d152766e98d55db3ca6d667f450f66684cdd4ef0e99": {
		functionName: "createHelpRequestFn_createServerFn_handler",
		importer: () => import("./_ssr/db-C4SrmxH8.mjs")
	},
	"ffbd8e0d9e5a21ebd8b90ac0b8bcb3a9f4314f6e230600adabadc4e1980057fa": {
		functionName: "getMyGarageFn_createServerFn_handler",
		importer: () => import("./_ssr/db-C4SrmxH8.mjs")
	}
};
async function getServerFnById(id, access) {
	const serverFnInfo = manifest[id];
	if (!serverFnInfo) throw new Error("Server function info not found for " + id);
	const fnModule = serverFnInfo.module ?? await serverFnInfo.importer();
	if (!fnModule) throw new Error("Server function module not resolved for " + id);
	const action = fnModule[serverFnInfo.functionName];
	if (!action) throw new Error("Server function module export not resolved for serverFn ID: " + id);
	return action;
}
//#endregion
export { getServerFnById as t };
