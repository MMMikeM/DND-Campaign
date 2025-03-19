import { text } from "drizzle-orm/sqlite-core"

// Create a custom JSON type for SQLite
export const json = <T>(description: string) => text(description, { mode: "json" }).$type<T>()
