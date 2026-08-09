import { defineConfig } from "vite-plus"

export default defineConfig({
	pack: {
		attw: {
			profile: "esm-only",
		},
		exports: true,
		entry: {
			db: "src/db/index.ts",
			"entities/*": "src/entities/*.ts",
			enums: "src/enums.ts",
		},
		format: ["esm"],
		platform: "node",
		dts: true,
		clean: true,
		outDir: "dist",
	},
})
