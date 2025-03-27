import { defineConfig } from "drizzle-kit"

export default defineConfig({
	dialect: "sqlite",
	dbCredentials: {
		url: "/Users/mikemurray/Development/DND-Campaign/dnddb.sqlite",
	},
	schema: [
		"/Users/mikemurray/Development/DND-Campaign/packages/shared/src/schemas/regions/tables.ts",
		"/Users/mikemurray/Development/DND-Campaign/packages/shared/src/schemas/factions/tables.ts",
		"/Users/mikemurray/Development/DND-Campaign/packages/shared/src/schemas/quests/tables.ts",
		"/Users/mikemurray/Development/DND-Campaign/packages/shared/src/schemas/npc/tables.ts",
		"/Users/mikemurray/Development/DND-Campaign/packages/shared/src/schemas/associations/tables.ts",
		"/Users/mikemurray/Development/DND-Campaign/packages/shared/src/schemas/story/tables.ts",
	],
})
