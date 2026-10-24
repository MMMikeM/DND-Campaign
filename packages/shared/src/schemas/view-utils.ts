import { type SQL, type SQLWrapper, sql } from "drizzle-orm"
import type { PgColumn } from "drizzle-orm/pg-core"

type NamedEntity = { id: PgColumn; name: PgColumn }

/** An entity as `{ id, name }` JSON — the SQL counterpart of the `nameAndId` query fragment. */
export const entityJson = (entity: NamedEntity) => sql`jsonb_build_object('id', ${entity.id}, 'name', ${entity.name})`

/**
 * {@link entityJson} for a left-joined entity, or SQL NULL when the FK is unset.
 *
 * The CASE is load-bearing: on a left-join miss `jsonb_build_object` still yields
 * `{"id": null, "name": null}`, which survives `jsonb_agg` and pollutes the search
 * vector. Guarding on the FK makes an unset reference genuinely absent.
 */
export const entityJsonWhen = (fk: PgColumn, entity: NamedEntity) =>
	sql`CASE WHEN ${fk} IS NOT NULL THEN ${entityJson(entity)} END`

/** One arm of an exclusive arc, as a `'key', value` pair for `jsonb_build_object`. */
export const optionalEntityJson = (key: string, fk: PgColumn, entity: NamedEntity) =>
	sql`${sql.raw(`'${key}'`)}, ${entityJsonWhen(fk, entity)}`

/** Joins `'key', value` pairs into a single `jsonb_build_object(...)` call. */
export const jsonObject = (pairs: SQL[]) => sql`jsonb_build_object(${sql.join(pairs, sql`, `)})`

/** Aggregates rows into a JSON array, dropping the null row a left join leaves behind. */
export const jsonAgg = (value: SQL, presence: PgColumn) =>
	sql`COALESCE(jsonb_agg(DISTINCT ${value}) FILTER (WHERE ${presence} IS NOT NULL), '[]'::jsonb)`

/** Every string value nested anywhere in a JSON document, space-separated. Keys, numbers and booleans are skipped. */
export const deepText = (json: SQLWrapper) =>
	sql`COALESCE((SELECT string_agg(v #>> '{}', ' ') FROM jsonb_path_query(${json}, 'strict $.** ? (@.type() == "string")') AS v), '')`

/** A search vector ranking the entity's own text (weight A) above its related entities' (weight B). */
export const weightedSearchVector = (primary: SQLWrapper, secondary: SQLWrapper) =>
	sql`setweight(to_tsvector('english', ${deepText(primary)}), 'A') || setweight(to_tsvector('english', ${deepText(secondary)}), 'B')`
