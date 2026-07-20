import { o as __toESM } from "../_runtime.mjs";
import { m as require_react } from "../_libs/@clerk/clerk-react+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ThemeContext-DREed0KF.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var ThemeContext = (0, import_react.createContext)({
	theme: "dark",
	toggleTheme: () => {}
});
function ThemeProvider({ children }) {
	const [theme, setTheme] = (0, import_react.useState)(() => {
		if (typeof window === "undefined") return "dark";
		return localStorage.getItem("rl-theme") || "dark";
	});
	(0, import_react.useEffect)(() => {
		const html = document.documentElement;
		if (theme === "light") {
			html.classList.add("light");
			html.classList.remove("dark");
		} else {
			html.classList.remove("light");
			html.classList.add("dark");
		}
		localStorage.setItem("rl-theme", theme);
	}, [theme]);
	function toggleTheme() {
		setTheme((t) => t === "dark" ? "light" : "dark");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeContext.Provider, {
		value: {
			theme,
			toggleTheme
		},
		children
	});
}
function useTheme() {
	return (0, import_react.useContext)(ThemeContext);
}
//#endregion
export { useTheme as n, ThemeProvider as t };
