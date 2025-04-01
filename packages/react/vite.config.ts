import { reactRouter } from "@react-router/dev/vite"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from "vite"
import tsconfigPaths from "vite-tsconfig-paths"
import path from "node:path"

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

			// "better-sqlite3": "better-sqlite3/lib/index.js",
		},
	},
	// Handle SQLite and other native dependencies
	ssr: {
		// Mark better-sqlite3 as external to avoid bundling issues
		external: ["better-sqlite3", "better-sqlite3/lib/index.js", "node:fs", "node:path"],
	},
})
