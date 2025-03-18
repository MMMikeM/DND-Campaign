// Export all entity schemas
import * as relations from "./relations.schema.js"
export * from "./quests/quest.schema.js"
export * from "./npcs/npc.schema.js"
export * from "./factions/faction.schema.js"
export * from "./locations/location.schema.js"

export { createQuestOperations } from "./quests/quest-operations.js"
export { createNPCOperations } from "./npcs/npc-operations.js"
export { createFactionOperations } from "./factions/faction-operations.js"
export { createLocationOperations } from "./locations/location-operations.js"
