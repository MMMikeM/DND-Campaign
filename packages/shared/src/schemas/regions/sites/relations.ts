import { relations } from "drizzle-orm"
import { embeddings } from "../../embeddings/tables"
import { consequences } from "../../events/tables"
import { discoverableElements } from "../../investigation/tables"
import { items } from "../../items/tables"
import { npcSites } from "../../npc/tables"
import { questHooks, questStages } from "../../quests/tables"
import { areas } from "../tables"
import { siteEncounters, siteLinks, siteSecrets, sites } from "./tables"

export const sitesRelations = relations(sites, ({ one, many }) => ({
	outgoingRelations: many(siteLinks, { relationName: "sourceSite" }),
	incomingRelations: many(siteLinks, { relationName: "targetSite" }),

	area: one(areas, {
		fields: [sites.areaId],
		references: [areas.id],
		relationName: "areaSites",
	}),

	encounters: many(siteEncounters, { relationName: "siteEncounters" }),
	secrets: many(siteSecrets, { relationName: "siteSecrets" }),
	npcs: many(npcSites, { relationName: "siteNpcs" }),
	items: many(items, { relationName: "siteItems" }),
	discoverableElements: many(discoverableElements, { relationName: "siteDiscoverableElements" }),
	questStages: many(questStages, { relationName: "siteQuestStages" }),
	questHooks: many(questHooks, { relationName: "siteQuestHooks" }),
	consequences: many(consequences, { relationName: "consequencesAtSite" }),

	embedding: one(embeddings, {
		fields: [sites.embeddingId],
		references: [embeddings.id],
	}),
}))

export const siteLinksRelations = relations(siteLinks, ({ one }) => ({
	sourceSite: one(sites, {
		fields: [siteLinks.siteId],
		references: [sites.id],
		relationName: "sourceSite",
	}),
	targetSite: one(sites, {
		fields: [siteLinks.otherSiteId],
		references: [sites.id],
		relationName: "targetSite",
	}),
}))

export const siteEncountersRelations = relations(siteEncounters, ({ one }) => ({
	site: one(sites, {
		fields: [siteEncounters.siteId],
		references: [sites.id],
		relationName: "siteEncounters",
	}),
	embedding: one(embeddings, {
		fields: [siteEncounters.embeddingId],
		references: [embeddings.id],
	}),
}))

export const siteSecretsRelations = relations(siteSecrets, ({ one }) => ({
	site: one(sites, {
		fields: [siteSecrets.siteId],
		references: [sites.id],
		relationName: "siteSecrets",
	}),
	embedding: one(embeddings, {
		fields: [siteSecrets.embeddingId],
		references: [embeddings.id],
	}),
}))
