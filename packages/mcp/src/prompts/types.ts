/**
 * Prompt Types and MCP Integration
 *
 * Provides type definitions and helper functions for creating MCP-compliant
 * prompt messages with type safety and standardized formatting.
 */

import type { GetPromptResult, PromptMessage } from "@modelcontextprotocol/server"
import type { z } from "zod/v4"

/**
 * Enhanced prompt definition using proper MCP SDK types
 */
// biome-ignore lint/suspicious/noExplicitAny: the default keeps heterogeneous prompt records assignable
export interface PromptDefinition<T extends z.ZodObject<any> = any> {
	/** Human-readable description of what this prompt does */
	description: string
	/** Zod schema for validating prompt arguments; the SDK validates and derives discovery metadata from it */
	schema: T
	/** Handler function that receives schema-validated arguments and returns MCP-compliant result */
	handler: (args: z.infer<T>) => Promise<GetPromptResult>
}

export type { GetPromptResult }

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
 * Creates a complete prompt definition; the SDK validates arguments and derives
 * discovery metadata from the Zod schema at registration time
 */
export const createPromptDefinition = <T extends z.ZodObject<any>>(
	description: string,
	schema: T,
	handler: (args: z.infer<T>) => Promise<GetPromptResult>,
): PromptDefinition<T> => {
	return {
		description,
		schema,
		handler,
	}
}
