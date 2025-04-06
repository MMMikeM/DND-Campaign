// prompt-types.ts
import { z } from "zod"

// Type for prompt category
export type PromptCategory = "npc" | "faction" | "quest" | "location" | "world"

// Define the prompt definition structure
export interface PromptDefinition<T extends z.ZodTypeAny> {
	name: string
	category: PromptCategory
	description: string
	schema: T
	handler: (args: z.infer<T>) => Promise<PromptResult>
}

// The result format returned by prompt handlers
export interface PromptResult {
	messages: PromptMessage[]
	description?: string
}

export interface PromptMessage {
	role: "user" | "assistant"
	content:
		| {
				type: "text"
				text: string
		  }
		| {
				type: "resource"
				resource: {
					uri: string
					text: string
					mimeType: string
				}
		  }
}

// Type for MCP prompt argument format
export interface PromptArgument {
	name: string
	description: string
	required: boolean
}
