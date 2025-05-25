import * as conflictRelations from "../schemas/conflict/relations"
import * as eventRelations from "../schemas/events/relations"
import * as factionRelations from "../schemas/factions/relations"
import * as investigationRelations from "../schemas/investigation/relations"
import * as itemRelations from "../schemas/items/relations"
import * as narrativeRelations from "../schemas/narrative/relations"
import * as npcRelations from "../schemas/npc/relations"
import * as questRelations from "../schemas/quests/relations"
import * as regionRelations from "../schemas/regions/relations"
import * as worldbuildingRelations from "../schemas/worldbuilding/relations"

export const relations = {
	conflictRelations,
	eventRelations,
	factionRelations,
	investigationRelations,
	itemRelations,
	narrativeRelations,
	npcRelations,
	questRelations,
	regionRelations,
	worldbuildingRelations,
}

import * as conflictTables from "../schemas/conflict/tables"
import * as embeddingTables from "../schemas/embeddings/tables"
import * as eventTables from "../schemas/events/tables"
import * as factionTables from "../schemas/factions/tables"
import * as investigationTables from "../schemas/investigation/tables"
import * as itemTables from "../schemas/items/tables"
import * as narrativeTables from "../schemas/narrative/tables"
import * as npcTables from "../schemas/npc/tables"
import * as questTables from "../schemas/quests/tables"
import * as regionTables from "../schemas/regions/tables"
import * as worldbuildingTables from "../schemas/worldbuilding/tables"

export const tables = {
	conflictTables,
	embeddingTables,
	eventTables,
	factionTables,
	investigationTables,
	itemTables,
	narrativeTables,
	npcTables,
	questTables,
	regionTables,
	worldbuildingTables,
}
