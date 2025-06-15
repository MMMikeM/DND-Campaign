// factions/relations.ts
import { relations } from "drizzle-orm"
import { conflictParticipants } from "../conflicts/tables"
import { foreshadowing } from "../foreshadowing/tables"
import { itemRelations } from "../items/tables"
import { loreLinks } from "../lore/tables"
import { narrativeDestinationParticipants } from "../narrative-destinations/tables"
import { consequences } from "../narrative-events/tables"
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
	consequences: many(consequences),
	narrativeDestinationInvolvement: many(narrativeDestinationParticipants),
	incomingForeshadowing: many(foreshadowing, { relationName: "foreshadowingForFaction" }),
	itemRelations: many(itemRelations),
	loreLinks: many(loreLinks),

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
