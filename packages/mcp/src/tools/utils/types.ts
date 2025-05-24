import type { RunResult } from "@tome-master/shared"
import type { PgColumn, PgTable } from "drizzle-orm/pg-core"
import type { z } from "zod/v4"

// Shared type for Drizzle tables assumed to have an 'id' column
export type PgTableWithId = PgTable & {
	id: PgColumn
}

export type ToolHandlerReturn = RunResult | Record<string, unknown> | Record<string, unknown>[]

export type ToolDefinition = {
	description: string
	inputSchema: z.core.JSONSchema.BaseSchema
	handler: ToolHandler
}

export type ToolHandler = (args?: Record<string, unknown>) => Promise<ToolHandlerReturn>

type DropTrailingS<T extends string> = T extends `${infer Base}s` ? Base : T

type CamelToSnakeCase<S extends string> = S extends `${infer T}${infer U}`
	? `${T extends Capitalize<T> ? "_" : ""}${Lowercase<T>}${CamelToSnakeCase<U>}`
	: S

export type CreateEntityGetters<T extends Record<string, unknown>> = {
	[K in `all_${CamelToSnakeCase<Extract<Exclude<keyof T, "enums">, string>>}`]: () => Promise<unknown[]>
} & {
	[K in `${DropTrailingS<CamelToSnakeCase<Extract<Exclude<keyof T, "enums">, string>>>}_by_id`]: (
		id: number,
	) => Promise<unknown>
}
