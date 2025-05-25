// narrative/relations.ts
import { relations } from "drizzle-orm"
import { embeddings } from "../embeddings/tables"
import { worldStateChanges } from "../events/tables"
import { quests } from "../quests/tables"
import { destinationContribution, narrativeDestinations } from "./tables"

// narrative/relations.ts
export const narrativeRelations = relations(narrativeDestinations, ({ many, one }) => ({
	destinationContributions: many(destinationContribution, {
		relationName: "destinationContributions",
	}),
	worldStateChanges: many(worldStateChanges, {
		relationName: "worldChangesForDestination",
	}),
	embedding: one(embeddings, {
		fields: [narrativeDestinations.embeddingId],
		references: [embeddings.id],
	}),
}))

export const destinationContributionRelations = relations(destinationContribution, ({ one }) => ({
	destination: one(narrativeDestinations, {
		fields: [destinationContribution.destinationId],
		references: [narrativeDestinations.id],
		relationName: "destinationContributions",
	}),
	quest: one(quests, {
		fields: [destinationContribution.questId],
		references: [quests.id],
		relationName: "questDestinationContributions",
	}),
}))
