import type { StandardSchemaWithJSON } from "@modelcontextprotocol/server"
import { z } from "zod/v4"

/**
 * Wraps a zod schema in a StandardSchemaWithJSON facade that memoizes the
 * JSON Schema conversion per process.
 *
 * createMcpHandler builds a fresh McpServer per request (the sessionless
 * model), and the SDK's per-server conversion memo dies with each instance.
 * Zod 4.4 schemas also don't implement `~standard.jsonSchema`, so the SDK's
 * fallback reconverts from scratch on every call. Registering through this
 * facade pays each conversion once for the life of the process.
 *
 * The cached JSON object is shared across requests; the SDK reads it but
 * never mutates it.
 */
export function withCachedJsonSchema<S extends z.ZodType>(schema: S): StandardSchemaWithJSON<z.input<S>, z.output<S>> {
	const cache = new Map<string, Record<string, unknown>>()
	const convert = (io: "input" | "output") => (options: { readonly target: string }) => {
		const key = `${io}:${options.target}`
		let json = cache.get(key)
		if (json === undefined) {
			json = z.toJSONSchema(schema, { target: options.target as "draft-2020-12", io })
			cache.set(key, json)
		}
		return json
	}

	return {
		"~standard": {
			...schema["~standard"],
			jsonSchema: { input: convert("input"), output: convert("output") },
		},
	} as StandardSchemaWithJSON<z.input<S>, z.output<S>>
}
