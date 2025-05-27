import * as conflictRelations from "../schemas/conflict/relations"
import * as eventRelations from "../schemas/events/relations"
import * as factionRelations from "../schemas/factions/relations"
import * as itemRelations from "../schemas/items/relations"
import * as narrativeRelations from "../schemas/narrative/relations"
import * as npcRelations from "../schemas/npc/relations"
import * as questRelations from "../schemas/quests/relations"
import * as questStageRelations from "../schemas/quests/stages/relations"
import * as regionRelations from "../schemas/regions/relations"
import * as regionSiteRelations from "../schemas/regions/sites/relations"
import * as worldbuildingRelations from "../schemas/worldbuilding/relations"
import * as foreshadowingRelations from "./foreshadowing/relations"

export const relations = {
	conflictRelations,
	eventRelations,
	factionRelations,
	foreshadowingRelations,
	itemRelations,
	narrativeRelations,
	npcRelations,
	questRelations,
	questStageRelations,
	regionRelations,
	regionSiteRelations,
	worldbuildingRelations,
}

import * as conflictTables from "../schemas/conflict/tables"
import * as embeddingTables from "../schemas/embeddings/tables"
import * as eventTables from "../schemas/events/tables"
import * as factionTables from "../schemas/factions/tables"
import * as itemTables from "../schemas/items/tables"
import * as narrativeTables from "../schemas/narrative/tables"
import * as npcTables from "../schemas/npc/tables"
import * as questStageTables from "../schemas/quests/stages/tables"
import * as questTables from "../schemas/quests/tables"
import * as regionSiteTables from "../schemas/regions/sites/tables"
import * as regionTables from "../schemas/regions/tables"
import * as worldbuildingTables from "../schemas/worldbuilding/tables"
import * as foreshadowingTables from "./foreshadowing/tables"

export const tables = {
	conflictTables,
	embeddingTables,
	eventTables,
	factionTables,
	foreshadowingTables,
	itemTables,
	narrativeTables,
	npcTables,
	questTables,
	questStageTables,
	regionTables,
	regionSiteTables,
	worldbuildingTables,
}
