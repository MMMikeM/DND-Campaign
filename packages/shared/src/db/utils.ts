import { serial, type PgColumn, text } from "drizzle-orm/pg-core"
import { vector } from "drizzle-orm/pg-core"

// Create a text array type for PostgreSQL
export const list = (description: string) => text(description).array().notNull()

export const nullableFk = (description: string, id: PgColumn) =>
	serial(description).references(() => id, { onDelete: "set null" })

export const cascadeFk = (description: string, id: PgColumn) =>
	serial(description).references(() => id, { onDelete: "cascade" })

export const string = (description: string) => text(description).notNull()

export const nullableString = (description: string) => text(description)

export const oneOf = (description: string, options: readonly [string, ...string[]]) =>
	text(description, { enum: options }).notNull()

export const pk = () => serial("id").primaryKey()

export const embeddingVector = (name: string = "embedding") => {
	return vector(name, { dimensions: 3072 })
}
