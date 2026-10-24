import { reactRouter } from "@react-router/dev/vite"
import tailwindcss from "@tailwindcss/vite"
// import { reactRouterDevTools } from "react-router-devtools"
import { defineConfig } from "vite-plus"

const buildDependencies = { task: "build", from: "dependencies" } as const

export default defineConfig({
	plugins: [
		tailwindcss(),
		// reactRouterDevTools(),
		reactRouter(),
	],
	resolve: {
		tsconfigPaths: true,
	},
	ssr: {
		external: ["node:fs", "node:path"],
	},
	run: {
		tasks: {
			// Typegen rewrites .react-router, so tracking it would make every run a cache miss.
			build: {
				command: "react-router build",
				dependsOn: [buildDependencies, "check"],
				cache: { input: [{ auto: true }, "!.react-router/**", "!build/**"] },
			},
			check: {
				command: "react-router typegen && tsc --noEmit",
				dependsOn: [buildDependencies],
				cache: { input: [{ auto: true }, "!.react-router/**"] },
			},
			lint: { command: "vp lint", dependsOn: [buildDependencies] },
			"lint:fix": { command: "vp lint --fix", dependsOn: [buildDependencies], cache: false },
			test: {
				command: "vp test",
				dependsOn: [buildDependencies],
				cache: { input: [{ auto: true }, "!.react-router/**"] },
			},
			dev: { command: "react-router dev", dependsOn: [buildDependencies], cache: false },
		},
	},
})
