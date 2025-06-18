import { fuzzy } from "fast-fuzzy"
import { logger } from "../.."
import { getFullContext } from "../baseContext"
import { cleanObject } from "../utils"
import { generateNPCCreationSuggestions } from "./suggestions"
import type { EnhancedNpcCreationArgs } from "./types"

export async function getBaseNPCContext(args: EnhancedNpcCreationArgs) {
	logger.info("Gathering enhanced NPC creation context", args)

	try {
		const context = await getFullContext()

		const nameConflicts = context.npcs.filter((npc) => fuzzy(args.name, npc.name) > 0.5)

		if (nameConflicts.length > 0) {
			throw new Error(`NPC with name "${args.name}" already exists: ${nameConflicts.map((npc) => npc.name).join(", ")}`)
		}

		const relationshipSuggestions = generateNPCCreationSuggestions({ args, context })

		const data = {
			...context,
			relationshipSuggestions,
		}

		logger.info("Enhanced NPC creation context gathered successfully", data)

		return cleanObject(data)
	} catch (error) {
		logger.error("Error gathering NPC creation context:", {
			error:
				error instanceof Error
					? {
							name: error.name,
							message: error.message,
							stack: error.stack,
						}
					: error,
			npcArgs: args,
		})
		throw new Error(
			`Failed to gather NPC creation context for "${args.name}": ${error instanceof Error ? error.message : String(error)}`,
		)
	}
}
