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
	run: {
		tasks: {
			build: "vp pack",
			check: "tsc --noEmit",
			lint: "vp lint",
			"lint:fix": { command: "vp lint --fix", cache: false },
			test: "vp test",
			"db:generate": { command: "drizzle-kit generate", cache: false },
			"db:migrate": { command: "drizzle-kit migrate", dependsOn: ["db:generate"], cache: false },
		},
	},
})
