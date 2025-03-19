import { defineConfig } from "drizzle-kit"
import * as dotenv from "dotenv"
import * as path from "node:path"
import { fileURLToPath } from "node:url"

const getDbPath = () =>
	path.join(path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../"), "dnddb.sqlite")

// Load environment variables
dotenv.config()

export default defineConfig({
	dialect: "sqlite",
	dbCredentials: {
		url: getDbPath(),
	},
	out: path.join(__dirname, "db/drizzle"),
	schema: path.join(__dirname, "src/schemas/**/**.schema.ts"),
})
