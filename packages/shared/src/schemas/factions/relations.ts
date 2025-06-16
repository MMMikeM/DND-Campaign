// factions/relations.ts
import { relations, sql } from "drizzle-orm"
import { conflictParticipants } from "../conflicts/tables"
import { foreshadowing } from "../foreshadowing/tables"
import { itemRelations } from "../items/tables"
import { loreLinks } from "../lore/tables"
import { narrativeDestinationParticipants } from "../narrative-destinations/tables"
import { consequences } from "../narrative-events/tables"
import { npcFactionMemberships } from "../npcs/tables"
import { questHooks, questParticipants } from "../quests/tables"
import { areas, regionConnections, regions, sites } from "../regions/tables"
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

	// Soft relations for polymorphic relatedEntityType/relatedEntityId
	relatedRegion: one(regions, {
		relationName: "FactionInfluenceRegion",
		fields: [factionInfluence.relatedEntityId],
		references: [regions.id],
		// @ts-expect-error - Drizzle doesn't have proper types for where conditions in relations yet
		where: sql`${factionInfluence.relatedEntityType} = 'region'`,
	}),

	relatedRegionConnection: one(regionConnections, {
		relationName: "FactionInfluenceRegionConnection",
		fields: [factionInfluence.relatedEntityId],
		references: [regionConnections.id],
		// @ts-expect-error - Drizzle doesn't have proper types for where conditions in relations yet
		where: sql`${factionInfluence.relatedEntityType} = 'region_connection'`,
	}),

	relatedArea: one(areas, {
		relationName: "FactionInfluenceArea",
		fields: [factionInfluence.relatedEntityId],
		references: [areas.id],
		// @ts-expect-error - Drizzle doesn't have proper types for where conditions in relations yet
		where: sql`${factionInfluence.relatedEntityType} = 'area'`,
	}),

	relatedSite: one(sites, {
		relationName: "FactionInfluenceSite",
		fields: [factionInfluence.relatedEntityId],
		references: [sites.id],
		// @ts-expect-error - Drizzle doesn't have proper types for where conditions in relations yet
		where: sql`${factionInfluence.relatedEntityType} = 'site'`,
	}),
}))
