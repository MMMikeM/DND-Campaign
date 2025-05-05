// embeddings/tables.ts
import { pgTable } from "drizzle-orm/pg-core"
import { embeddingVector, pk } from "../../db/utils"

export const embeddings = pgTable("embeddings", {
	id: pk(),
	embedding: embeddingVector("embedding").notNull(),
})
