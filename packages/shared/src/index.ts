// Export database initialization and utilities
export * from "./db/index.js"

export {
	getFactionSchema,
	FactionSchema,
	newFactionSchema,
	updateFactionSchema,
} from "./entities/factions/faction.zod.js"
export {
	NpcSchema,
	newNpcSchema,
	updateNpcSchema,
	getNpcSchema,
} from "./entities/npcs/npc.zod.js"
export {
	QuestSchema,
	newQuestSchema,
	updateQuestSchema,
	getQuestSchema,
} from "./entities/quests/quest.zod.js"
export {
	LocationSchema,
	newLocationSchema,
	updateLocationSchema,
	getLocationSchema,
} from "./entities/locations/location.zod.js"
