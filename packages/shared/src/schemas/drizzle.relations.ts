import { relations } from "drizzle-orm"
import { factionRelationships, factions } from "./faction.schema"
import { locationEncounters, locations, locationRelations, locationAreas } from "./location.schema"
import { npcRelationships, npcs } from "./npc.schema"
import { questStages, quests, questDecisions, relatedQuests } from "./quest.schema"
import {
	locationFactions,
	npcFactions,
	questFactions,
	npcLocations,
	questLocations,
	questNpcs,
	questClues,
	npcQuests,
	npcSignificantItems,
	npcAreas,
} from "./relations.schema"

export const locationEncountersRelations = relations(locationEncounters, ({ one }) => ({
	location: one(locations, {
		fields: [locationEncounters.locationId],
		references: [locations.id],
	}),
}))

export const questStagesRelations = relations(questStages, ({ one, many }) => ({
	quest: one(quests, {
		fields: [questStages.questId],
		references: [quests.id],
	}),

	// Decisions in this stage
	decisions: many(questDecisions),
}))

export const questDecisionsRelations = relations(questDecisions, ({ one }) => ({
	stage: one(questStages, {
		fields: [questDecisions.questStageId],
		references: [questStages.id],
	}),
}))

export const factionsRelations = relations(factions, ({ one, many }) => ({
	relationships: many(factionRelationships, { relationName: "relationships" }),
	otherRelationships: many(factionRelationships, { relationName: "otherRelationships" }),
	locations: many(locationFactions),
	members: many(npcFactions),
	quests: many(questFactions),
}))

export const locationsRelations = relations(locations, ({ one, many }) => ({
	areas: many(locationAreas),
	encounters: many(locationEncounters),
	relations: many(locationRelations, { relationName: "locationRelations" }),
	relatedTo: many(locationRelations, {
		relationName: "relatedLocations",
	}),
	factions: many(locationFactions),
	npcs: many(npcLocations),
	quests: many(questLocations),
}))

export const locationAreasRelations = relations(locationAreas, ({ one, many }) => ({
	location: one(locations, {
		fields: [locationAreas.locationId],
		references: [locations.id],
	}),
	npcs: many(npcAreas),
}))

export const questsRelations = relations(quests, ({ one, many }) => ({
	stages: many(questStages),
	relatedQuests: many(relatedQuests, { relationName: "questRelations" }),
	relatedToQuests: many(relatedQuests, { relationName: "relatedToQuest" }),
	locations: many(questLocations),
	npcs: many(questNpcs),
	factions: many(questFactions),
	clues: many(questClues),
}))

export const npcsRelations = relations(npcs, ({ one, many }) => ({
	relationships: many(npcRelationships, { relationName: "npcRelationships" }),
	relatedTo: many(npcRelationships, { relationName: "relatedToNpc" }),
	factions: many(npcFactions),
	locations: many(npcLocations),
	areas: many(npcAreas),
	quests: many(npcQuests),
	significantItems: many(npcSignificantItems),
}))

export const npcFactionsRelations = relations(npcFactions, ({ one }) => ({
	npc: one(npcs, {
		fields: [npcFactions.npcId],
		references: [npcs.id],
	}),
	faction: one(factions, {
		fields: [npcFactions.factionId],
		references: [factions.id],
	}),
}))

export const npcLocationsRelations = relations(npcLocations, ({ one }) => ({
	npc: one(npcs, {
		fields: [npcLocations.npcId],
		references: [npcs.id],
	}),
	location: one(locations, {
		fields: [npcLocations.locationId],
		references: [locations.id],
	}),
}))

export const npcQuestsRelations = relations(npcQuests, ({ one }) => ({
	npc: one(npcs, {
		fields: [npcQuests.npcId],
		references: [npcs.id],
	}),
	quest: one(quests, {
		fields: [npcQuests.questId],
		references: [quests.id],
	}),
}))

export const locationFactionsRelations = relations(locationFactions, ({ one }) => ({
	location: one(locations, {
		fields: [locationFactions.locationId],
		references: [locations.id],
	}),
	faction: one(factions, {
		fields: [locationFactions.factionId],
		references: [factions.id],
	}),
}))

export const npcAreasRelations = relations(npcAreas, ({ one }) => ({
	npc: one(npcs, {
		fields: [npcAreas.npcId],
		references: [npcs.id],
	}),
	location: one(locations, {
		fields: [npcAreas.locationId],
		references: [locations.id],
	}),
	// For the area relation, you'd need to ensure locationAreas has the proper constraint
}))

export const questNpcsRelations = relations(questNpcs, ({ one }) => ({
	quest: one(quests, {
		fields: [questNpcs.questId],
		references: [quests.id],
	}),
	npc: one(npcs, {
		fields: [questNpcs.npcId],
		references: [npcs.id],
	}),
}))

export const questLocationsRelations = relations(questLocations, ({ one }) => ({
	quest: one(quests, {
		fields: [questLocations.questId],
		references: [quests.id],
	}),
	location: one(locations, {
		fields: [questLocations.locationId],
		references: [locations.id],
	}),
}))

export const questFactionsRelations = relations(questFactions, ({ one }) => ({
	quest: one(quests, {
		fields: [questFactions.questId],
		references: [quests.id],
	}),
	faction: one(factions, {
		fields: [questFactions.factionId],
		references: [factions.id],
	}),
}))

export const questCluesRelations = relations(questClues, ({ one }) => ({
	quest: one(quests, {
		fields: [questClues.questId],
		references: [quests.id],
	}),
	// Optional relations that might be null
	location: one(locations, {
		fields: [questClues.locationId],
		references: [locations.id],
	}),
	npc: one(npcs, {
		fields: [questClues.npcId],
		references: [npcs.id],
	}),
}))

export const npcSignificantItemsRelations = relations(npcSignificantItems, ({ one }) => ({
	npc: one(npcs, {
		fields: [npcSignificantItems.npcId],
		references: [npcs.id],
	}),
	// Optional relation that might be null
	quest: one(quests, {
		fields: [npcSignificantItems.questId],
		references: [quests.id],
	}),
}))

// Self-referential relationships
export const factionRelationshipsRelations = relations(factionRelationships, ({ one }) => ({
	faction: one(factions, {
		fields: [factionRelationships.factionId],
		references: [factions.id],
		relationName: "relationships", // Match the relationName from many() side
	}),
	otherFaction: one(factions, {
		fields: [factionRelationships.otherFactionId],
		references: [factions.id],
		relationName: "otherRelationships", // Match the relationName from many() side
	}),
}))

export const relatedQuestsRelations = relations(relatedQuests, ({ one }) => ({
	quest: one(quests, {
		fields: [relatedQuests.questId],
		references: [quests.id],
		relationName: "questRelations",
	}),
	relatedQuest: one(quests, {
		fields: [relatedQuests.relatedQuestId],
		references: [quests.id],
		relationName: "relatedToQuest",
	}),
}))

export const locationRelationsRelations = relations(locationRelations, ({ one }) => ({
	location: one(locations, {
		fields: [locationRelations.locationId],
		references: [locations.id],
		relationName: "locationRelations",
	}),
	otherLocation: one(locations, {
		fields: [locationRelations.otherLocationId],
		references: [locations.id],
		relationName: "relatedLocations",
	}),
}))

// Only keep this one table for significant items

export const npcRelationshipsRelations = relations(npcRelationships, ({ one }) => ({
	npc: one(npcs, {
		fields: [npcRelationships.npcId],
		references: [npcs.id],
		relationName: "npcRelationships",
	}),
	relatedNpc: one(npcs, {
		fields: [npcRelationships.relatedNpcId],
		references: [npcs.id],
		relationName: "relatedToNpc",
	}),
}))
