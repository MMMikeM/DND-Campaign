// Export database utilities
export * from "./db/index.js";
export * from "./db/utils.js";

// Export all schemas
export * from "./schemas/index.js";

// Export database entities directly for use in other packages
export { quests } from "./schemas/quest.schema.js";
export { npcs } from "./schemas/npc.schema.js";
export { factions } from "./schemas/faction.schema.js";
