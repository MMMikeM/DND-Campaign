/**
 * Prompt Types and MCP Integration
 *
 * Provides type definitions and helper functions for creating MCP-compliant
 * prompt messages with type safety and standardized formatting.
 */

import type { GetPromptResult, PromptArgument, PromptMessage } from "@modelcontextprotocol/sdk/types.js"
import { z } from "zod/v4"

/**
 * Enhanced prompt definition using proper MCP SDK types
 */
export interface PromptDefinition<T extends z.ZodTypeAny = z.ZodTypeAny> {
	/** Human-readable description of what this prompt does */
	description: string
	/** Zod schema for validating prompt arguments */
	schema: T
	/** MCP-compatible argument definitions for discovery */
	arguments: PromptArgument[]
	/** Handler function that processes arguments and returns MCP-compliant result */
	handler: (args: unknown) => Promise<GetPromptResult>
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

/**
 * Creates a complete prompt definition with automatic argument extraction from Zod schema
 */
export const createPromptDefinition = <T extends z.ZodObject<Record<string, z.ZodAny>>>(
	description: string,
	schema: T,
	handler: (args: z.infer<T>) => Promise<GetPromptResult>,
): PromptDefinition<T> => {
	return {
		description,
		schema,
		arguments: extractArgsFromZodSchema(schema),
		handler: createTypedHandler(schema, handler),
	}
}

/**
 * Extracts argument information from a Zod schema
 */
export const extractArgsFromZodSchema = <T extends z.ZodObject>(schema: T): PromptArgument[] => {
	const result: PromptArgument[] = []

	// Get the shape of the schema
	const shape = schema.shape

	// Process each property in the schema
	for (const [name, field] of Object.entries(shape)) {
		// Extract description
		let description = name
		if (field instanceof z.ZodType) {
			// Try to extract description from the field
			const desc = field.description
			if (desc) {
				description = desc
			}
		}

		// Determine if the field is required
		const isOptional = field instanceof z.ZodOptional || field instanceof z.ZodDefault

		result.push({
			name,
			description,
			required: !isOptional,
		})
	}

	return result
}
