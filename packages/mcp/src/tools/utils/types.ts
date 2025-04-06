export type ToolHandlerReturn = RunResult | Record<string, unknown> | Record<string, unknown>[]

export type ToolDefinition = {
	description: string
	inputSchema: ReturnType<typeof zodToJsonSchema>
	handler: ToolHandler
}

export type ToolHandler = (args?: Record<string, unknown>) => Promise<ToolHandlerReturn>

export type ToolHandlers<T extends PropertyKey> = Record<T, ToolHandler>

export type DropTrailingS<T extends string> = T extends `${infer Base}s` ? Base : T

export type CamelToSnakeCase<S extends string> = S extends `${infer T}${infer U}`
	? `${T extends Capitalize<T> ? "_" : ""}${Lowercase<T>}${CamelToSnakeCase<U>}`
	: S

export type CreateTableTools<T extends Record<string, unknown>> =
	`manage_${CamelToSnakeCase<Extract<Exclude<keyof T, "enums">, string>>}`

export type CreateEntityGetters<T extends Record<string, unknown>> = {
	[K in `all_${CamelToSnakeCase<Extract<Exclude<keyof T, "enums">, string>>}`]: () => Promise<any[]>
} & {
	[K in `${DropTrailingS<CamelToSnakeCase<Extract<Exclude<keyof T, "enums">, string>>>}_by_id`]: (
		id: number,
	) => Promise<any>
}
