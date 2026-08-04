import { defineConfig } from "vite-plus"

export default defineConfig({
	pack: {
		entry: ["src/index.ts"],
		format: ["esm"],
		platform: "node",
		target: "node22",
		sourcemap: true,
		clean: true,
		env: {
			NODE_ENV: "production",
		},
		deps: {
			neverBundle: ["drizzle-orm", "drizzle-zod", "@swc/helpers", "@tome-master/shared"],
		},
	},
})
