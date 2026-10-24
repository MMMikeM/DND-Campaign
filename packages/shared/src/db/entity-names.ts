import { sql } from "drizzle-orm"
import type { NodePgDatabase } from "drizzle-orm/node-postgres"
import type { PgColumn, PgTable } from "drizzle-orm/pg-core"
import type { EntityRef } from "../search"
import { conflicts } from "../schemas/conflicts/tables"
import { consequences } from "../schemas/consequences/tables"
import { factions } from "../schemas/factions/tables"
import { foreshadowing } from "../schemas/foreshadowing/tables"
import { items } from "../schemas/items/tables"
import { lore } from "../schemas/lore/tables"
import { npcs } from "../schemas/npcs/tables"
import { quests } from "../schemas/quests/tables"
import { areas, regions, sites } from "../schemas/regions/tables"
import { questStageDecisions, questStages } from "../schemas/stages/tables"

type NamedTable = PgTable & { id: PgColumn; name: PgColumn; slug: PgColumn }

const searchableTables: Record<string, NamedTable> = {
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

/**
 * Every searchable entity's name, read from the base tables rather than `search_index`,
 * so a name is findable the moment it is written instead of after the next refresh.
 */
export const selectEntityNames = async (db: NodePgDatabase<any>): Promise<EntityRef[]> => {
	const selects = Object.entries(searchableTables).map(
		([tableName, table]) =>
			sql`SELECT ${table.id} AS id, ${sql.raw(`'${tableName}'`)} AS "table", ${table.name} AS name, ${table.slug} AS slug FROM ${table}`,
	)
	const { rows } = await db.execute<EntityRef>(sql.join(selects, sql` UNION ALL `))
	return rows
}
