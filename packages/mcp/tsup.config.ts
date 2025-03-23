import { defineConfig } from "tsup"

export default defineConfig({
	entry: ["src/index.ts"],
	splitting: false,
	sourcemap: true,
	clean: true,
	env: {
		NODE_ENV: "production",
	},
	external: ["drizzle-orm", "drizzle-zod", "@swc/helpers"],
})
