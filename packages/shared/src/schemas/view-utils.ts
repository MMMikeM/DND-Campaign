import { type SQL, sql } from "drizzle-orm"
import type { PgColumn } from "drizzle-orm/pg-core"

type NamedEntity = { id: PgColumn; name: PgColumn }

/** An entity as `{ id, name }` JSON — the SQL counterpart of the `nameAndId` query fragment. */
export const entityJson = (entity: NamedEntity) => sql`jsonb_build_object('id', ${entity.id}, 'name', ${entity.name})`

/**
 * One arm of an exclusive arc, as a `'key', value` pair for `jsonb_build_object`.
 *
 * The CASE is load-bearing: on a left-join miss `jsonb_build_object` still yields
 * `{"id": null, "name": null}`, which survives `jsonb_agg` and pollutes the search
 * vector. Guarding on the FK makes an unset arm genuinely absent.
 */
export const optionalEntityJson = (key: string, fk: PgColumn, entity: NamedEntity) =>
	sql`${sql.raw(`'${key}'`)}, CASE WHEN ${fk} IS NOT NULL THEN ${entityJson(entity)} END`

/** Joins `'key', value` pairs into a single `jsonb_build_object(...)` call. */
export const jsonObject = (pairs: SQL[]) => sql`jsonb_build_object(${sql.join(pairs, sql`, `)})`

/** Aggregates rows into a JSON array, dropping the null row a left join leaves behind. */
export const jsonAgg = (value: SQL, presence: PgColumn) =>
	sql`COALESCE(jsonb_agg(DISTINCT ${value}) FILTER (WHERE ${presence} IS NOT NULL), '[]'::jsonb)`
