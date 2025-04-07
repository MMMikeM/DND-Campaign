// Export database utilities
export * from "./db/index.js"
export * from "./db/utils.js"

export * from "./lib/embeddings.js"

// Export all schema tables and relations
import * as associationTables from "./schemas/associations/tables.js"
import * as associationRelations from "./schemas/associations/relations.js"
import * as conflictTables from "./schemas/conflict/tables.js"
import * as conflictRelations from "./schemas/conflict/relations.js"
import * as factionTables from "./schemas/factions/tables.js"
import * as factionRelations from "./schemas/factions/relations.js"
import * as foreshadowingTables from "./schemas/foreshadowing/tables.js"
import * as foreshadowingRelations from "./schemas/foreshadowing/relations.js"
import * as narrativeTables from "./schemas/narrative/tables.js"
import * as narrativeRelations from "./schemas/narrative/relations.js"
import * as npcTables from "./schemas/npc/tables.js"
import * as npcRelations from "./schemas/npc/relations.js"
import * as questTables from "./schemas/quests/tables.js"
import * as questRelations from "./schemas/quests/relations.js"
import * as regionTables from "./schemas/regions/tables.js"
import * as regionRelations from "./schemas/regions/relations.js"
import * as worldTables from "./schemas/world/tables.js"
import * as worldRelations from "./schemas/world/relations.js"
import * as embeddingTables from "./schemas/embeddings/tables.js"
// Assuming no relations for embeddings table yet

export const tables = {
	associationTables: associationTables, // Corrected typo
	conflictTables: conflictTables,
	factionTables: factionTables,
	foreshadowingTables: foreshadowingTables,
	narrativeTables: narrativeTables,
	npcTables: npcTables,
	questTables: questTables,
	regionTables: regionTables,
	worldTables: worldTables,
	embeddingTables: embeddingTables,
}

export const relations = {
	associationRelations,
	conflictRelations,
	factionRelations,
	foreshadowingRelations,
	narrativeRelations,
	npcRelations,
	questRelations,
	regionRelations,
	worldRelations,
	// No embedding relations exported yet
}

// Also export common enums if needed, e.g., from common.ts
export * from "./schemas/common.js"
