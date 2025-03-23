import { text } from "drizzle-orm/sqlite-core"

// Create a custom JSON type for SQLite
export const jsonArray = (description: string) =>
	text(description, { mode: "json" }).$type<string[]>()
