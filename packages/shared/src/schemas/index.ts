import * as factionRelations from "../schemas/factions/relations"
import * as itemRelations from "../schemas/items/relations"
import * as questRelations from "../schemas/quests/relations"
import * as questStageRelations from "../schemas/quests/stages/relations"
import * as regionRelations from "../schemas/regions/relations"
import * as conflictRelations from "./conflicts/relations"
import * as foreshadowingRelations from "./foreshadowing/relations"
import * as loreRelations from "./lore/relations"
import * as mapRelations from "./maps/relations"
import * as narrativeDestinationRelations from "./narrative-destinations/relations"
import * as narrativeEventRelations from "./narrative-events/relations"
import * as npcRelations from "./npcs/relations"

export const relations = {
	conflictRelations,
	narrativeEventRelations,
	factionRelations,
	foreshadowingRelations,
	itemRelations,
	narrativeDestinationRelations,
	npcRelations,
	questRelations,
	questStageRelations,
	regionRelations,
	loreRelations,
	mapRelations,
}

import * as factionTables from "../schemas/factions/tables"
import * as itemTables from "../schemas/items/tables"
import * as questStageTables from "../schemas/quests/stages/tables"
import * as questTables from "../schemas/quests/tables"
import * as regionTables from "../schemas/regions/tables"
import * as conflictTables from "./conflicts/tables"
import * as foreshadowingTables from "./foreshadowing/tables"
import * as loreTables from "./lore/tables"
import * as mapTables from "./maps/tables"
import * as narrativeDestinationTables from "./narrative-destinations/tables"
import * as narrativeEventTables from "./narrative-events/tables"
import * as npcTables from "./npcs/tables"

export const tables = {
	conflictTables,
	narrativeEventTables,
	factionTables,
	foreshadowingTables,
	itemTables,
	narrativeDestinationTables,
	npcTables,
	questTables,
	questStageTables,
	regionTables,
	loreTables,
	mapTables,
}
