import { customType, integer, type PgColumn, serial, text, vector } from "drizzle-orm/pg-core"

export const list = (description: string) => text(description).array().notNull()

export const nullableFk = (description: string, id: PgColumn) =>
	integer(description).references(() => id, { onDelete: "set null" })

export const cascadeFk = (description: string, id: PgColumn) =>
	integer(description)
		.references(() => id, { onDelete: "cascade" })
		.notNull()

export const string = (description: string) => text(description).notNull()

export const nullableString = (description: string) => text(description)

export const oneOf = (description: string, options: readonly [string, ...string[]]) =>
	text(description, { enum: options }).notNull()

export const pk = () => serial("id").primaryKey()

export const embeddingVector = (name: string = "embedding") => {
	return vector(name, { dimensions: 3072 })
}

// Custom bytea type for binary image data
export const bytea = customType<{ data: Buffer; notNull: false; default: false }>({
	dataType() {
		return "bytea"
	},
})
