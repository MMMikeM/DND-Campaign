import * as conflictRelations from "../schemas/conflict/relations"
import * as eventRelations from "../schemas/events/relations"
import * as factionRelations from "../schemas/factions/relations"
import * as itemRelations from "../schemas/items/relations"
import * as narrativeRelations from "../schemas/narrative/relations"
import * as npcRelations from "../schemas/npc/relations"
import * as questRelations from "../schemas/quests/relations"
import * as questStageRelations from "../schemas/quests/stages/relations"
import * as regionRelations from "../schemas/regions/relations"
import * as worldbuildingRelations from "../schemas/worldbuilding/relations"
import * as foreshadowingRelations from "./foreshadowing/relations"
import * as mapRelations from "./maps/relations"

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
	worldbuildingRelations,
	mapRelations,
}

import * as conflictTables from "../schemas/conflict/tables"
import * as eventTables from "../schemas/events/tables"
import * as factionTables from "../schemas/factions/tables"
import * as itemTables from "../schemas/items/tables"
import * as narrativeTables from "../schemas/narrative/tables"
import * as npcTables from "../schemas/npc/tables"
import * as questStageTables from "../schemas/quests/stages/tables"
import * as questTables from "../schemas/quests/tables"
import * as regionTables from "../schemas/regions/tables"
import * as worldbuildingTables from "../schemas/worldbuilding/tables"
import * as foreshadowingTables from "./foreshadowing/tables"
import * as mapTables from "./maps/tables"

export const tables = {
	conflictTables,
	eventTables,
	factionTables,
	foreshadowingTables,
	itemTables,
	narrativeTables,
	npcTables,
	questTables,
	questStageTables,
	regionTables,
	worldbuildingTables,
	mapTables,
}
