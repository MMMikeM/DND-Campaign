import { defineConfig } from "vite-plus"

const buildDependencies = { task: "build", from: "dependencies" } as const

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
	run: {
		tasks: {
			build: { command: "vp pack", dependsOn: [buildDependencies] },
			check: { command: "tsc --noEmit", dependsOn: [buildDependencies] },
			lint: { command: "vp lint", dependsOn: [buildDependencies] },
			"lint:fix": { command: "vp lint --fix", dependsOn: [buildDependencies], cache: false },
			test: { command: "vp test", dependsOn: [buildDependencies] },
			dev: { command: "vpx --watch src/index.ts", dependsOn: [buildDependencies], cache: false },
		},
	},
})
