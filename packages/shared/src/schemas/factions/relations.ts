// factions/relations.ts
import { relations } from "drizzle-orm"
import { conflictParticipants } from "../conflicts/tables"
import { consequences } from "../consequences/tables"
import { foreshadowing } from "../foreshadowing/tables"
import { itemRelations } from "../items/tables"
import { loreLinks } from "../lore/tables"
import { npcFactionMemberships } from "../npcs/tables"
import { questHooks, questParticipants } from "../quests/tables"
import { areas, regions, sites } from "../regions/tables"
import { factionAgendas, factionDiplomacy, factionInfluence, factions } from "./tables"

export const factionsRelations = relations(factions, ({ many, one }) => ({
	outgoingRelations: many(factionDiplomacy, { relationName: "sourceFaction" }),
	incomingRelations: many(factionDiplomacy, { relationName: "targetFaction" }),

	agendas: many(factionAgendas),
	members: many(npcFactionMemberships),
	questHooks: many(questHooks),
	questParticipation: many(questParticipants),
	influence: many(factionInfluence),
	conflicts: many(conflictParticipants),
	affectingConsequences: many(consequences, { relationName: "ConsequenceAffectedFaction" }),
	incomingForeshadowing: many(foreshadowing, { relationName: "ForeshadowingTargetFaction" }),
	itemRelations: many(itemRelations),
	loreLinks: many(loreLinks, { relationName: "LoreLinkTargetFaction" }),

	primaryHqSite: one(sites, {
		fields: [factions.hqSiteId],
		references: [sites.id],
		relationName: "factionHq",
	}),
}))

export const factionDiplomacyRelations = relations(factionDiplomacy, ({ one }) => ({
	sourceFaction: one(factions, {
		relationName: "sourceFaction",
		fields: [factionDiplomacy.sourceFactionId],
		references: [factions.id],
	}),
	targetFaction: one(factions, {
		relationName: "targetFaction",
		fields: [factionDiplomacy.targetFactionId],
		references: [factions.id],
	}),
}))

export const factionAgendaRelations = relations(factionAgendas, ({ one }) => ({
	faction: one(factions, {
		fields: [factionAgendas.factionId],
		references: [factions.id],
	}),
}))

export const factionInfluenceRelations = relations(factionInfluence, ({ one }) => ({
	faction: one(factions, {
		fields: [factionInfluence.factionId],
		references: [factions.id],
	}),
	region: one(regions, {
		fields: [factionInfluence.regionId],
		references: [regions.id],
	}),
	area: one(areas, {
		fields: [factionInfluence.areaId],
		references: [areas.id],
	}),
	site: one(sites, {
		fields: [factionInfluence.siteId],
		references: [sites.id],
	}),
}))
