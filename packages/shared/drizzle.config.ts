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
		// Views (including the search materialized view) are hand-maintained in
		// migration SQL and deliberately excluded from generation.
	],
	out: "./drizzle",
	// kit v1 manages ALL schemas by default; pin to public to keep 0.x behavior
	schemaFilter: ["public"],
})
