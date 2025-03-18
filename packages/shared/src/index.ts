// Export database initialization and utilities
export * from "./db/index.js"

export {
	getFactionSchema,
	FactionSchema,
	newFactionSchema,
	updateFactionSchema,
} from "./entities/factions/faction.schema.js"
export {
	NpcSchema,
	newNpcSchema,
	updateNpcSchema,
	getNpcSchema,
} from "./entities/npcs/npc.schema.js"
export {
	QuestSchema,
	newQuestSchema,
	updateQuestSchema,
	getQuestSchema,
} from "./entities/quests/quest.schema.js"
export {
	LocationSchema,
	newLocationSchema,
	updateLocationSchema,
	getLocationSchema,
} from "./entities/locations/location.schema.js"
