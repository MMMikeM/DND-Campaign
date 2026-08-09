import * as conflictables from "../schemas/conflicts/tables"
import * as consequenceTables from "../schemas/consequences/tables"
import * as factionTables from "../schemas/factions/tables"
import * as foreshadowingTables from "../schemas/foreshadowing/tables"
import * as itemTables from "../schemas/items/tables"
import * as loreTables from "../schemas/lore/tables"
import * as mapTables from "../schemas/maps/tables"
import * as npcTables from "../schemas/npcs/tables"
import * as questTables from "../schemas/quests/tables"
import * as regionTables from "../schemas/regions/tables"
import * as stageTables from "../schemas/stages/tables"

export const tables = {
	...conflictables,
	...consequenceTables,
	...factionTables,
	...foreshadowingTables,
	...itemTables,
	...loreTables,
	...mapTables,
	...npcTables,
	...questTables,
	...regionTables,
	...stageTables,
}
