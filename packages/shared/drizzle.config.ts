import { defineConfig } from "drizzle-kit"

export default defineConfig({
	dialect: "sqlite",
	dbCredentials: {
		url: "/Users/mikemurray/Development/new/packages/shared/dnddb.sqlite",
	},
	out: "/Users/mikemurray/Development/new/packages/shared/drizzle",
	schema: "/Users/mikemurray/Development/new/packages/shared/src/schemas/index.ts",
})
