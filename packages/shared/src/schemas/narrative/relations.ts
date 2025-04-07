// narrative/relations.ts
import { relations } from "drizzle-orm"
import { narrativeArcs, arcMembership } from "./tables.js"
import { quests } from "../quests/tables.js"
import { narrativeForeshadowing } from "../foreshadowing/tables.js"
import { worldStateChanges } from "../world/tables.js"

export const narrativeArcsRelations = relations(narrativeArcs, ({ many }) => ({
	members: many(arcMembership, {
		relationName: "arcMembers",
	}),

	foreshadowing: many(narrativeForeshadowing, {
		relationName: "arcForeshadowing",
	}),

	worldChanges: many(worldStateChanges, {
		relationName: "worldChangesByArc",
	}),
}))

export const arcMembershipRelations = relations(arcMembership, ({ one }) => ({
	arc: one(narrativeArcs, {
		fields: [arcMembership.arcId],
		references: [narrativeArcs.id],
		relationName: "arcMembers",
	}),

	quest: one(quests, {
		fields: [arcMembership.questId],
		references: [quests.id],
		relationName: "questArcs",
	}),
}))
