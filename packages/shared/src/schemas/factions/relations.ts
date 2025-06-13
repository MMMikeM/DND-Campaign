// factions/relations.ts
import { relations } from "drizzle-orm"
import { conflictParticipants } from "../conflicts/tables"
import { foreshadowing } from "../foreshadowing/tables"
import { itemRelationships } from "../items/tables"
import { destinationParticipantInvolvement } from "../narrative-destinations/tables"
import { consequences } from "../narrative-events/tables"
import { npcFactionMemberships } from "../npcs/tables"
import { questHooks, questParticipants } from "../quests/tables"
import { areas, regions, sites } from "../regions/tables"
import { worldConceptLinks } from "../world-concepts/tables"
import { factionAgendas, factionDiplomacy, factionInfluence, factions } from "./tables"

export const factionsRelations = relations(factions, ({ many, one }) => ({
	outgoingRelationships: many(factionDiplomacy, { relationName: "sourceFaction" }),
	incomingRelationships: many(factionDiplomacy, { relationName: "targetFaction" }),

	agendas: many(factionAgendas, { relationName: "factionAgendas" }),
	members: many(npcFactionMemberships, { relationName: "factionMembers" }),
	questHooks: many(questHooks, { relationName: "factionQuestHooks" }),
	questParticipation: many(questParticipants, { relationName: "factionQuestParticipation" }),
	influence: many(factionInfluence, { relationName: "factionInfluence" }),
	conflicts: many(conflictParticipants, { relationName: "factionConflicts" }),
	consequences: many(consequences, { relationName: "consequencesAffectingFaction" }),
	destinationInvolvement: many(destinationParticipantInvolvement, { relationName: "factionDestinationInvolvement" }),
	foreshadowingSeeds: many(foreshadowing, { relationName: "foreshadowedFaction" }),
	itemRelationships: many(itemRelationships, { relationName: "factionItemRelationships" }),
	worldConceptLinks: many(worldConceptLinks, { relationName: "factionWorldConceptLinks" }),

	primaryHqSite: one(sites, {
		fields: [factions.hqSiteId],
		references: [sites.id],
		relationName: "factionHq",
	}),
}))

export const factionDiplomacyRelations = relations(factionDiplomacy, ({ one }) => ({
	sourceFaction: one(factions, {
		fields: [factionDiplomacy.sourceFactionId],
		references: [factions.id],
		relationName: "sourceFaction",
	}),
	targetFaction: one(factions, {
		fields: [factionDiplomacy.targetFactionId],
		references: [factions.id],
		relationName: "targetFaction",
	}),
}))

export const factionAgendaRelations = relations(factionAgendas, ({ one }) => ({
	faction: one(factions, {
		fields: [factionAgendas.factionId],
		references: [factions.id],
		relationName: "factionAgendas",
	}),
}))

export const factionInfluenceRelations = relations(factionInfluence, ({ one }) => ({
	faction: one(factions, {
		fields: [factionInfluence.factionId],
		references: [factions.id],
		relationName: "factionInfluence",
	}),
	region: one(regions, {
		fields: [factionInfluence.regionId],
		references: [regions.id],
		relationName: "influenceInRegion",
	}),
	area: one(areas, {
		fields: [factionInfluence.areaId],
		references: [areas.id],
		relationName: "influenceInArea",
	}),
	site: one(sites, {
		fields: [factionInfluence.siteId],
		references: [sites.id],
		relationName: "influenceAtSite",
	}),
}))
