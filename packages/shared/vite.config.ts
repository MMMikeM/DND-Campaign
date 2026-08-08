import { defineConfig } from "vite-plus"

export default defineConfig({
	pack: {
		entry: ["src/*.ts"],
		format: ["esm"],
		platform: "node",
		target: "node22",
		dts: true,
		sourcemap: true,
		clean: true,
		outDir: "dist",
	},
})
