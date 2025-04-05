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

type EmbeddingSize = "sm" | "md" | "lg"
const dimensionsMap: Record<EmbeddingSize, number> = {
	sm: 768,
	md: 1536,
	lg: 3072,
}

export const embeddingVector = (size: EmbeddingSize = "sm", name: string = "embedding") => {
	const dimensions = dimensionsMap[size]
	if (!dimensions) {
		throw new Error(`Invalid embedding size: ${size}. Valid sizes are 'sm', 'md', 'lg'.`)
	}
	return vector(name, { dimensions })
}
