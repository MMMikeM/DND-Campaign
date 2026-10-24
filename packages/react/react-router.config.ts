import type { Config } from "@react-router/dev/config"

export default {
	// Server-side render by default
	ssr: true,
	// API routes read live data per request; a prerendered copy is served for every query string, frozen at build time.
	prerender: ({ getStaticPaths }) => getStaticPaths().filter((path) => !path.startsWith("/api/")),

	// Custom application directory path
	appDirectory: "./app",
} satisfies Config
