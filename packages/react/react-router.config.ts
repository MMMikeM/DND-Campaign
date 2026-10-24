import type { Config } from "@react-router/dev/config"

export default {
	// Server-side render by default
	ssr: true,
	// Only the dashboard has no loader. A prerendered page or API route is a build-time snapshot,
	// served even after the data changes (and for API routes, for every query string).
	prerender: ["/"],

	// Custom application directory path
	appDirectory: "./app",
} satisfies Config
