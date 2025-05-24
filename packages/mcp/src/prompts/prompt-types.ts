// prompt-types.ts
import type { z } from "zod/v4"

export type PromptCategory = "npc" | "faction" | "quest" | "location" | "world" | "campaign"

export interface PromptDefinition<T extends z.ZodTypeAny> {
	name: string
	category: PromptCategory
	description: string
	schema: T
	handler: (args: unknown) => Promise<PromptResult>
}

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

export interface PromptArgument {
	name: string
	description: string
	required: boolean
}
