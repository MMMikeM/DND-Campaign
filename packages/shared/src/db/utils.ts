import { integer, type SQLiteColumn, text } from "drizzle-orm/sqlite-core"

// Create a custom JSON type for SQLite
export const list = (description: string) =>
	text(description, { mode: "json" }).$type<string[]>().notNull()

export const nullableFk = (description: string, id: SQLiteColumn) =>
	integer(description).references(() => id, { onDelete: "set null" })

export const cascadeFk = (description: string, id: SQLiteColumn) =>
	integer(description)
		.notNull()
		.references(() => id, { onDelete: "cascade" })

export const string = (description: string) =>
	text(description).notNull()

export const nullableString = (description: string) =>	
	text(description)

export const oneOf = (description: string, options: readonly [string, ...string[]]) => text(description, { enum: options }).notNull()

export const pk = () => (integer("id").primaryKey({ autoIncrement: true }))