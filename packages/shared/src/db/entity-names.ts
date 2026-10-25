import { sql } from "drizzle-orm"
import type { NodePgDatabase } from "drizzle-orm/node-postgres"
import type { EntityRef } from "../search"
import { searchableTables } from "../schemas/searchable-tables"

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
