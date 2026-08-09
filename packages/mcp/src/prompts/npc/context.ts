import { logger } from "../.."
import { getFullContext } from "../baseContext"
import { cleanObject, isNameClash } from "../utils"
import { generateNPCCreationSuggestions } from "./suggestions"
import type { EnhancedNpcCreationArgs } from "./types"

export async function getBaseNPCContext(args: EnhancedNpcCreationArgs) {
	logger.info(args, "Gathering enhanced NPC creation context")

	try {
		const context = await getFullContext()

		const nameConflicts = context.npcs.filter((npc) => isNameClash(npc.name, args.name))

		if (nameConflicts.length > 0) {
			throw new Error(`NPC with name "${args.name}" already exists: ${nameConflicts.map((npc) => npc.name).join(", ")}`)
		}

		const relationshipSuggestions = generateNPCCreationSuggestions({ args, context })

		const data = {
			...context,
			relationshipSuggestions,
		}

		logger.info(data, "Enhanced NPC creation context gathered successfully")

		return cleanObject(data)
	} catch (error) {
		logger.error(
			{
				error:
					error instanceof Error
						? {
								name: error.name,
								message: error.message,
								stack: error.stack,
							}
						: error,
				npcArgs: args,
			},
			"Error gathering NPC creation context:",
		)
		throw new Error(
			`Failed to gather NPC creation context for "${args.name}": ${error instanceof Error ? error.message : String(error)}`,
		)
	}
}
