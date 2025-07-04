import path from "node:path"
import { reactRouter } from "@react-router/dev/vite"
import tailwindcss from "@tailwindcss/vite"
// import { reactRouterDevTools } from "react-router-devtools"
import { defineConfig } from "vite"
import tsconfigPaths from "vite-tsconfig-paths"

export default defineConfig({
	plugins: [
		tailwindcss(),
		{
			name: "vite-plugin-path-alias-fix",
			config(config) {
				config.resolve = config.resolve || {}
				config.resolve.alias = config.resolve.alias || {}

				Object.assign(config.resolve.alias, {
					"~": path.resolve(__dirname, "./app"),
					"~/": path.resolve(__dirname, "./app/"),
					"~/components": path.resolve(__dirname, "./app/components"),
					"~/hooks": path.resolve(__dirname, "./app/hooks"),
					"~/lib": path.resolve(__dirname, "./app/lib"),
				})
			},
		},
		// reactRouterDevTools(),
		reactRouter(),
		tsconfigPaths(),
	],
	resolve: {
		alias: {
			"~": path.resolve(__dirname, "./app"),
			"@app": path.resolve(__dirname, "./app"),
			"@components": path.resolve(__dirname, "./app/components"),
			"@ui": path.resolve(__dirname, "./app/components/ui"),
			"@hooks": path.resolve(__dirname, "./app/hooks"),
			"@lib": path.resolve(__dirname, "./app/lib"),
		},
	},
	ssr: {
		external: ["node:fs", "node:path"],
	},
})
