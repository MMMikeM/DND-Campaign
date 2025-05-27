// embeddings/tables.ts
import { pgTable, timestamp } from "drizzle-orm/pg-core"
import { embeddingVector, pk } from "../../db/utils"

export const embeddings = pgTable("embeddings", {
	id: pk(),
	embedding: embeddingVector("embedding").notNull(),
	updatedAt: timestamp()
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull(),
})
