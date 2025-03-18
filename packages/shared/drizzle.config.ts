import type { Config } from "drizzle-kit"
import * as dotenv from "dotenv"
import * as path from "node:path"

// Load environment variables
dotenv.config()

export default {
	schema: "./src/entities/**/**.schema.ts",
	out: "./drizzle",
	driver: "durable-sqlite",
	dialect: "sqlite",
} satisfies Config
