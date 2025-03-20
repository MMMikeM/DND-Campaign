import { defineConfig } from "drizzle-kit"
import * as dotenv from "dotenv"
import * as path from "node:path"
import { fileURLToPath } from "node:url"

// Load environment variables
dotenv.config()

export default defineConfig({
	dialect: "sqlite",
	dbCredentials: {
		url: "/Users/mikemurray/Development/DND-Campaign/packages/shared/dnddb.sqlite",
	},
	out: "/Users/mikemurray/Development/DND-Campaign/packages/shared/drizzle",
	schema: "/Users/mikemurray/Development/DND-Campaign/packages/shared/src/schemas/index.ts",
})
