import { o as __toESM } from "../_runtime.mjs";
import { m as require_react } from "../_libs/@clerk/clerk-react+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/useGeolocation-CixJ_UuI.js
var import_react = /* @__PURE__ */ __toESM(require_react());
/**
* Wraps the browser Geolocation API with React state.
* Immediately requests position on mount with a 10-second timeout.
*
* @param fallback - Coordinates to use if geolocation is unavailable or denied.
*                   Defaults to New York City.
*/
function useGeolocation(fallback = {
	lat: 40.7128,
	lng: -74.006
}) {
	const [state, setState] = (0, import_react.useState)({ status: "loading" });
	(0, import_react.useEffect)(() => {
		if (!navigator.geolocation) {
			setState({
				status: "error",
				message: "Geolocation not supported by this browser."
			});
			return;
		}
		const id = navigator.geolocation.watchPosition((pos) => {
			setState({
				status: "success",
				coords: {
					lat: pos.coords.latitude,
					lng: pos.coords.longitude
				}
			});
		}, (err) => {
			setState({
				status: "error",
				message: err.message
			});
		}, {
			enableHighAccuracy: true,
			timeout: 1e4,
			maximumAge: 3e4
		});
		return () => navigator.geolocation.clearWatch(id);
	}, []);
	return {
		state,
		coords: state.status === "success" ? state.coords : fallback
	};
}
//#endregion
export { useGeolocation as t };
