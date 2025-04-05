import { defineConfig } from "drizzle-kit"
import "dotenv/config"

// Get database URL from environment variable or use default
const dbUrl = process.env.DATABASE_URL || "postgres://postgres:postgres@localhost:5432/dnd_campaign"

export default defineConfig({
	dialect: "postgresql",
	dbCredentials: {
		url: dbUrl,
	},
	schema: [
		"/Users/mikemurray/Development/DND-Campaign/packages/shared/src/schemas/regions/tables.ts",
		"/Users/mikemurray/Development/DND-Campaign/packages/shared/src/schemas/factions/tables.ts",
		"/Users/mikemurray/Development/DND-Campaign/packages/shared/src/schemas/quests/tables.ts",
		"/Users/mikemurray/Development/DND-Campaign/packages/shared/src/schemas/npc/tables.ts",
		"/Users/mikemurray/Development/DND-Campaign/packages/shared/src/schemas/associations/tables.ts",
		"/Users/mikemurray/Development/DND-Campaign/packages/shared/src/schemas/story/tables.ts",
	],
	out: "./drizzle",
})
