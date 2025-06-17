import { defineConfig } from "drizzle-kit"

// Get database URL from environment variable or use default
const dbUrl = process.env.DATABASE_URL || "postgres://postgres:postgres@localhost:5432/dnd_campaign"

export default defineConfig({
	dialect: "postgresql",
	dbCredentials: {
		url: dbUrl,
	},
	schema: [
		"/Users/mikemurray/Development/DND-Campaign/packages/shared/src/schemas/**/tables.ts",
		"/Users/mikemurray/Development/DND-Campaign/packages/shared/src/schemas/**/views.ts",
		"/Users/mikemurray/Development/DND-Campaign/packages/shared/src/schemas/search-view.ts",
	],
	out: "./drizzle",
})
