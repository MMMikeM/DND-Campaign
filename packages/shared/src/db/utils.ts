import { type AnyPgColumn, customType, integer, type PgColumn, serial, text, vector } from "drizzle-orm/pg-core"

const list = (description: string) => text(description).array().notNull()

const nullableFk = (description: string, referencedColumnOrThunk: PgColumn | (() => AnyPgColumn)) => {
	const refThunk =
		typeof referencedColumnOrThunk === "function" ? referencedColumnOrThunk : () => referencedColumnOrThunk

	return integer(description).references(refThunk, { onDelete: "set null" })
}

const cascadeFk = (description: string, referencedColumnOrThunk: PgColumn | (() => AnyPgColumn)) => {
	const refThunk =
		typeof referencedColumnOrThunk === "function" ? referencedColumnOrThunk : () => referencedColumnOrThunk
	return integer(description).references(refThunk, { onDelete: "cascade" }).notNull()
}

const string = (description: string) => text(description).notNull()

const nullableString = (description: string) => text(description)

const oneOf = (description: string, options: readonly [string, ...string[]]) =>
	text(description, { enum: options }).notNull()

const nullableOneOf = (description: string, options: readonly [string, ...string[]]) =>
	text(description, { enum: options })

const manyOf = (description: string, options: readonly [string, ...string[]]) =>
	text(description, { enum: options }).array().notNull()

const pk = () => serial("id").primaryKey()

const embeddingVector = (name: string = "embedding") => {
	return vector(name, { dimensions: 3072 })
}

// Custom bytea type for binary image data
const bytea = customType<{ data: Buffer; notNull: false; default: false }>({
	dataType() {
		return "bytea"
	},
})


export {
	list,
	nullableFk,
	cascadeFk,
	string,
	nullableString,
	oneOf,
	nullableOneOf,
	manyOf,
	pk,
	embeddingVector,
	bytea,
}