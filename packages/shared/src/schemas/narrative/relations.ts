// narrative/relations.ts
import { relations } from "drizzle-orm"
import { narrativeArcs, arcMembership } from "./tables.js"
import { quests } from "../quests/tables.js"
import { narrativeForeshadowing } from "../foreshadowing/tables.js"
import { worldStateChanges } from "../world/tables.js"

export const narrativeArcsRelations = relations(narrativeArcs, ({ many }) => ({
	// Members of this arc
	members: many(arcMembership, { relationName: "arcMembers" }),

	// Related content
	foreshadowing: many(narrativeForeshadowing, { relationName: "arcForeshadowing" }),
	worldChanges: many(worldStateChanges, { relationName: "arcWorldChanges" }),
}))

export const arcMembershipRelations = relations(arcMembership, ({ one }) => ({
	// Parent arc
	arc: one(narrativeArcs, {
		fields: [arcMembership.arcId],
		references: [narrativeArcs.id],
		relationName: "arcMembers",
	}),

	// Member quest
	quest: one(quests, {
		fields: [arcMembership.questId],
		references: [quests.id],
		relationName: "questArcs",
	}),
}))
