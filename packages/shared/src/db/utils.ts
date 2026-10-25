import { sql } from "drizzle-orm"
import { type AnyPgColumn, customType, integer, type PgColumn, serial, text } from "drizzle-orm/pg-core"

const list = (description: string) => text(description).array().notNull()

const nullableFk = (description: string, referencedColumnOrThunk: PgColumn | (() => AnyPgColumn)) => {
	const refThunk =
		typeof referencedColumnOrThunk === "function" ? referencedColumnOrThunk : () => referencedColumnOrThunk

	return integer(description).references(refThunk, { onDelete: "set null" })
}

/**
 * One arm of an exclusive arc: nullable, since the other arms are null, but deleted with its
 * target. SET NULL would leave every arm null, which the arc's exactly-one CHECK rejects, and
 * that rejection fails the DELETE of the target.
 */
const arcFk = (description: string, referencedColumnOrThunk: PgColumn | (() => AnyPgColumn)) => {
	const refThunk =
		typeof referencedColumnOrThunk === "function" ? referencedColumnOrThunk : () => referencedColumnOrThunk

	return integer(description).references(refThunk, { onDelete: "cascade" })
}

const cascadeFk = (description: string, referencedColumnOrThunk: PgColumn | (() => AnyPgColumn)) => {
	const refThunk =
		typeof referencedColumnOrThunk === "function" ? referencedColumnOrThunk : () => referencedColumnOrThunk
	return integer(description).references(refThunk, { onDelete: "cascade" }).notNull()
}

const string = (description: string) => text(description).notNull()

const nullableString = (description: string) => text(description)

const oneOf = <const T extends readonly [string, ...string[]]>(description: string, options: T) =>
	text(description, { enum: options }).notNull()

const nullableOneOf = <const T extends readonly [string, ...string[]]>(description: string, options: T) =>
	text(description, { enum: options })

const manyOf = <const T extends readonly [string, ...string[]]>(description: string, options: T) =>
	text(description, { enum: options }).array().notNull()

const pk = () => serial("id").primaryKey()

const asciiSlug = sql`btrim(regexp_replace(regexp_replace(lower(regexp_replace(normalize(name, NFKD), '[\\u0300-\\u036f]', '', 'g')), '[^a-z0-9_[:space:]-]', '', 'g'), '[[:space:]-]+', '-', 'g'), '-')`

/** Slugs JavaScript's `Number()` reads as an integer, which react's `bySlugOrId` would take for an id. */
const numericSlug = "^(0x[0-9a-f]+|0b[01]+|0o[0-7]+|([0-9]+(e[0-9]+)?)?)$"

/**
 * The name as a URL segment, unique per table. A name that leaves nothing, or only a
 * number, falls back to the row's id, which `bySlugOrId` resolves to this same row.
 */
const slug = () =>
	text("slug")
		.notNull()
		.unique()
		.generatedAlwaysAs(sql`CASE WHEN ${asciiSlug} ~ '${sql.raw(numericSlug)}' THEN id::text ELSE ${asciiSlug} END`)

// Custom bytea type for binary image data
const bytea = customType<{ data: Buffer; notNull: true; default: false }>({
	dataType: () => "bytea",
})

export { list, nullableFk, arcFk, cascadeFk, string, nullableString, oneOf, nullableOneOf, manyOf, pk, slug, bytea }
