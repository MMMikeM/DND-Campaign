import type { Config } from "@react-router/dev/config"

export default {
	// Server-side render by default
	ssr: true,
	prerender: true,

	// Custom application directory path
	appDirectory: "./app",

	// No additional configuration needed for aliases - they're handled by
	// vite-tsconfig-paths plugin in vite.config.ts
} satisfies Config
