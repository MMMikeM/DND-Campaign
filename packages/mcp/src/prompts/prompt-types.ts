// prompt-types.ts
import type { EmbeddedResource, GetPromptResult, PromptMessage, TextContent } from "@modelcontextprotocol/sdk/types.js"
import type { z } from "zod/v4"

export type PromptCategory = "npc" | "faction" | "quest" | "location" | "world" | "campaign"

/**
 * Enhanced prompt definition using proper MCP SDK types
 * Note: Handler takes 'unknown' to match MCP SDK expectations, but should validate with schema
 */
export interface PromptDefinition<T extends z.ZodTypeAny = z.ZodTypeAny> {
	/** Human-readable description of what this prompt does */
	description: string
	/** Zod schema for validating prompt arguments */
	schema: T
	/** Handler function that processes arguments and returns MCP-compliant result */
	handler: (args: unknown) => Promise<GetPromptResult>
}

export type { GetPromptResult, PromptMessage, TextContent, EmbeddedResource }

/**
 * Helper functions for creating MCP-compliant prompt messages
 */
export const createTextMessage = (role: "user" | "assistant", text: string): PromptMessage => ({
	role,
	content: {
		type: "text",
		text,
	},
})

export const createResourceMessage = (
	role: "user" | "assistant",
	uri: string,
	text: string,
	mimeType = "application/json",
): PromptMessage => ({
	role,
	content: {
		type: "resource",
		resource: {
			uri,
			text,
			mimeType,
		},
	},
})

export const createPromptResult = (messages: PromptMessage[], description?: string): GetPromptResult => ({
	messages,
	...(description && { description }),
})

/**
 * Helper to create type-safe prompt handlers that validate arguments with Zod
 * This provides internal type safety while maintaining MCP SDK compatibility
 */
export const createTypedHandler = <T extends z.ZodTypeAny>(
	schema: T,
	handler: (args: z.infer<T>) => Promise<GetPromptResult>,
) => {
	return async (args: unknown): Promise<GetPromptResult> => {
		const parseResult = schema.safeParse(args)
		if (!parseResult.success) {
			return createPromptResult(
				[createTextMessage("assistant", `❌ Invalid arguments: ${parseResult.error.message}`)],
				"Invalid arguments",
			)
		}
		return handler(parseResult.data)
	}
}
