import { defineConfig } from "tsup"

export default defineConfig({
	entry: ["src/index.ts"],
	format: ["esm"], // Build as ES module
	splitting: false,
	sourcemap: true,
	clean: true,
	env: {
		NODE_ENV: "production",
	},
	external: ["drizzle-orm", "drizzle-zod", "@swc/helpers", "@tome-master/shared"],
})
