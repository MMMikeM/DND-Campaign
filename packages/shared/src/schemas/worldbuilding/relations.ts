// worldbuilding/relations.ts
import { relations } from "drizzle-orm"
import { embeddings } from "../embeddings/tables"
import { conceptRelationships, worldConcepts } from "./tables"

export const worldConceptsRelations = relations(worldConcepts, ({ one, many }) => ({
	embedding: one(embeddings, {
		fields: [worldConcepts.embeddingId],
		references: [embeddings.id],
	}),

	sourceOfConceptRelationships: many(conceptRelationships, {
		relationName: "sourceConceptInRelationship",
	}),
	targetInConceptRelationships: many(conceptRelationships, {
		relationName: "targetConceptInRelationship",
	}),
}))

export const conceptRelationshipsRelations = relations(conceptRelationships, ({ one }) => ({
	sourceConcept: one(worldConcepts, {
		fields: [conceptRelationships.sourceConceptId],
		references: [worldConcepts.id],
		relationName: "sourceConceptInRelationship",
	}),
	targetConcept: one(worldConcepts, {
		fields: [conceptRelationships.targetConceptId],
		references: [worldConcepts.id],
		relationName: "targetConceptInRelationship",
	}),
}))
