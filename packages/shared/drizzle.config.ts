import { defineConfig } from "drizzle-kit"

export default defineConfig({
	dialect: "sqlite",
	dbCredentials: {
		url: "/Users/mikemurray/Development/DND-Campaign/dnddb.sqlite",
	},
	out: "/Users/mikemurray/Development/DND-Campaign/packages/shared/drizzle",
	schema: "/Users/mikemurray/Development/DND-Campaign/packages/shared/src/schemas/index.ts",
})
