import type { Config } from "@react-router/dev/config"

export default {
	// Server-side render by default
	ssr: true,
	prerender: true,

	// Custom application directory path
	appDirectory: "./app",
} satisfies Config
