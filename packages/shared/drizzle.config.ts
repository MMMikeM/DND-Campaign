import type { Config } from "drizzle-kit"
import * as dotenv from "dotenv"
import * as path from "node:path"

// Load environment variables
dotenv.config()

export default {
	schema: "./src/entities/**/**.schema.ts",
	out: "./drizzle",
	driver: "better-sqlite",
	dbCredentials: {
		url: process.env.DB_PATH || path.join(process.cwd(), "data.sqlite"),
	},
} satisfies Config
