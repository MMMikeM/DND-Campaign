// narrative/relations.ts
import { relations } from "drizzle-orm"
import { narrativeForeshadowing } from "../foreshadowing/tables"
import { quests } from "../quests/tables"
import { worldStateChanges } from "../world/tables"
import { destinationContribution, narrativeDestinations } from "./tables"

export const narrativeRelations = relations(narrativeDestinations, ({ many }) => ({
	destinationContributions: many(destinationContribution),
	worldStateChanges: many(worldStateChanges, {
		relationName: "worldChangesForDestination",
	}),
	foreshadowing: many(narrativeForeshadowing, {
		relationName: "foreshadowingEntries",
	}),
}))

export const destinationContributionRelations = relations(destinationContribution, ({ one }) => ({
	destination: one(narrativeDestinations, {
		fields: [destinationContribution.destinationId],
		references: [narrativeDestinations.id],
	}),
	quest: one(quests, {
		fields: [destinationContribution.questId],
		references: [quests.id],
	}),
}))
