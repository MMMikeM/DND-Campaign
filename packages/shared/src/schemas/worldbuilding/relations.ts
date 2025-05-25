// worldbuilding/relations.ts
import { relations } from "drizzle-orm"
import { embeddings } from "../embeddings/tables"
import { worldConcepts } from "./tables"

export const worldConceptsRelations = relations(worldConcepts, ({ one }) => ({
	embedding: one(embeddings, {
		fields: [worldConcepts.embeddingId],
		references: [embeddings.id],
	}),
	// Note: causedBy and ledTo are list fields, not proper foreign keys
	// Self-referential relations would require proper junction tables
}))
