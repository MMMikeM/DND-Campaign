// embeddings/tables.ts
import { pgTable } from "drizzle-orm/pg-core"
import { pk, embeddingVector } from "../../db/utils.js"

export const embeddings = pgTable("embeddings", {
	id: pk(),
	embedding: embeddingVector("embedding").notNull(),
})
