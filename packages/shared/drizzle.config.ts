import { defineConfig } from "drizzle-kit"

// Get database URL from environment variable or use default
const dbUrl = process.env.DATABASE_URL || "postgres://postgres:postgres@localhost:5432/dnd_campaign"

export default defineConfig({
	dialect: "postgresql",
	dbCredentials: {
		url: dbUrl,
	},
	schema: [
		"./src/schemas/**/tables.ts",
		// Removing these makes the next generate drop every view, which is how
		// 20250701055741_deep_crystal deleted search.
		"./src/schemas/**/views.ts",
		"./src/schemas/search-view.ts",
	],
	out: "./drizzle",
	// kit v1 manages ALL schemas by default; pin to public to keep 0.x behavior
	schemaFilter: ["public"],
})
