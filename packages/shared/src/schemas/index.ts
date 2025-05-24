import * as associationRelations from "../schemas/associations/relations"
import * as conflictRelations from "../schemas/conflict/relations"
import * as eventRelations from "../schemas/events/relations"
import * as factionRelations from "../schemas/factions/relations"
import * as foreshadowingRelations from "../schemas/foreshadowing/relations"
import * as narrativeRelations from "../schemas/narrative/relations"
import * as npcRelations from "../schemas/npc/relations"
import * as questRelations from "../schemas/quests/relations"
import * as regionRelations from "../schemas/regions/relations"
import * as worldRelations from "../schemas/world/relations"

export const relations = {
	associationRelations,
	conflictRelations,
	eventRelations,
	factionRelations,
	foreshadowingRelations,
	narrativeRelations,
	npcRelations,
	questRelations,
	regionRelations,
	worldRelations,
}

import * as associationTables from "../schemas/associations/tables"
import * as conflictTables from "../schemas/conflict/tables"
import * as embeddingTables from "../schemas/embeddings/tables"
import * as eventTables from "../schemas/events/tables"
import * as factionTables from "../schemas/factions/tables"
import * as foreshadowingTables from "../schemas/foreshadowing/tables"
import * as narrativeTables from "../schemas/narrative/tables"
import * as npcTables from "../schemas/npc/tables"
import * as questTables from "../schemas/quests/tables"
import * as regionTables from "../schemas/regions/tables"
import * as worldTables from "../schemas/world/tables"

export const tables = {
	associationTables,
	conflictTables,
	embeddingTables,
	eventTables,
	factionTables,
	foreshadowingTables,
	narrativeTables,
	npcTables,
	questTables,
	regionTables,
	worldTables,
}
