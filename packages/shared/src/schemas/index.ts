import * as factionRelations from "../schemas/factions/relations"
import * as itemRelations from "../schemas/items/relations"
import * as questRelations from "../schemas/quests/relations"
import * as questStageRelations from "../schemas/quests/stages/relations"
import * as regionRelations from "../schemas/regions/relations"
import * as conflictRelations from "./conflicts/relations"
import * as foreshadowingRelations from "./foreshadowing/relations"
import * as mapRelations from "./maps/relations"
import * as narrativeRelations from "./narrative-destinations/relations"
import * as eventRelations from "./narrative-events/relations"
import * as npcRelations from "./npcs/relations"
import * as worldbuildingRelations from "./world-concepts/relations"

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

import * as factionTables from "../schemas/factions/tables"
import * as itemTables from "../schemas/items/tables"
import * as questStageTables from "../schemas/quests/stages/tables"
import * as questTables from "../schemas/quests/tables"
import * as regionTables from "../schemas/regions/tables"
import * as conflictTables from "./conflicts/tables"
import * as foreshadowingTables from "./foreshadowing/tables"
import * as mapTables from "./maps/tables"
import * as narrativeTables from "./narrative-destinations/tables"
import * as eventTables from "./narrative-events/tables"
import * as npcTables from "./npcs/tables"
import * as worldbuildingTables from "./world-concepts/tables"

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
