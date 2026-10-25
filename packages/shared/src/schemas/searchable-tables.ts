import type { PgColumn, PgTable } from "drizzle-orm/pg-core"
import { conflicts } from "./conflicts/tables"
import { consequences } from "./consequences/tables"
import { factions } from "./factions/tables"
import { foreshadowing } from "./foreshadowing/tables"
import { items } from "./items/tables"
import { lore } from "./lore/tables"
import { npcs } from "./npcs/tables"
import { quests } from "./quests/tables"
import { areas, regions, sites } from "./regions/tables"
import { questStageDecisions, questStages } from "./stages/tables"

type NamedTable = PgTable & { id: PgColumn; name: PgColumn; slug: PgColumn }

export const searchableTables: Record<string, NamedTable> = {
	areas,
	conflicts,
	consequences,
	factions,
	foreshadowing,
	items,
	lore,
	npcs,
	quest_stage_decisions: questStageDecisions,
	quest_stages: questStages,
	quests,
	regions,
	sites,
}
