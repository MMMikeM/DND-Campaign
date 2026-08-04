import { reactRouter } from "@react-router/dev/vite"
import tailwindcss from "@tailwindcss/vite"
// import { reactRouterDevTools } from "react-router-devtools"
import { defineConfig } from "vite-plus"

export default defineConfig({

	plugins: [
		tailwindcss(),
		// reactRouterDevTools(),
		reactRouter(),
	],
	resolve: {
		tsconfigPaths: true
	},
	ssr: {
		external: ["node:fs", "node:path"],
	},
})
