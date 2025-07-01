import * as factionRelations from "../schemas/factions/relations"
import * as itemRelations from "../schemas/items/relations"
import * as questRelations from "../schemas/quests/relations"
import * as regionRelations from "../schemas/regions/relations"
import * as questStageRelations from "../schemas/stages/relations"
import * as conflictRelations from "./conflicts/relations"
import * as consequenceRelations from "./consequences/relations"
import * as foreshadowingRelations from "./foreshadowing/relations"
import * as loreRelations from "./lore/relations"
import * as mapRelations from "./maps/relations"
import * as npcRelations from "./npcs/relations"

export const relations = {
	conflictRelations,
	consequenceRelations,
	factionRelations,
	foreshadowingRelations,
	itemRelations,
	loreRelations,
	mapRelations,
	npcRelations,
	questRelations,
	questStageRelations,
	regionRelations,
}

import * as factionTables from "../schemas/factions/tables"
import * as itemTables from "../schemas/items/tables"
import * as questTables from "../schemas/quests/tables"
import * as regionTables from "../schemas/regions/tables"
import * as questStageTables from "../schemas/stages/tables"
import * as conflictTables from "./conflicts/tables"
import * as consequenceTables from "./consequences/tables"
import * as foreshadowingTables from "./foreshadowing/tables"
import * as loreTables from "./lore/tables"
import * as mapTables from "./maps/tables"
import * as npcTables from "./npcs/tables"

export const tables = {
	conflictTables,
	consequenceTables,
	factionTables,
	foreshadowingTables,
	itemTables,
	loreTables,
	mapTables,
	npcTables,
	questStageTables,
	questTables,
	regionTables,
}

import * as conflictViews from "./conflicts/views"
import * as consequenceViews from "./consequences/views"
import * as factionViews from "./factions/views"
import * as foreshadowingViews from "./foreshadowing/views"
import * as itemViews from "./items/views"
import * as loreViews from "./lore/views"
import * as npcViews from "./npcs/views"
import * as questViews from "./quests/views"
import * as regionViews from "./regions/views"
import { searchIndex } from "./search-view"
import * as stageViews from "./stages/views"

export const views = {
	conflictViews,
	consequenceViews,
	factionViews,
	foreshadowingViews,
	itemViews,
	loreViews,
	npcViews,
	questViews,
	regionViews,
	searchIndex,
	stageViews,
}
