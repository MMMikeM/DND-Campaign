import { fuzzy } from "fast-fuzzy"
import { db, logger } from "../.."
import { getFullContext } from "../baseContext"
import { cleanObject } from "../utils"
import { analyzeFactionGaps } from "./analysis"
import { generateFactionRelationshipSuggestions } from "./suggestions"
import type { FactionCreationArgs } from "./types"

export async function gatherFactionCreationContext(args: FactionCreationArgs) {
	logger.info("Gathering enhanced faction creation context", args)

	try {
		const context = await getFullContext()

		const nameConflicts = context.factions.filter((faction) => fuzzy(args.name, faction.name) > 0.5)

		if (nameConflicts.length > 0) {
			throw new Error(
				`Faction with name "${args.name}" already exists: ${nameConflicts.map((faction) => faction.name).join(", ")}`,
			)
		}

		const factionGaps = await analyzeFactionGaps(context)
		const relationshipSuggestions = generateFactionRelationshipSuggestions({ args, context, factionGaps })

		const data = {
			...context,
			factionGaps,
			relationshipSuggestions,
		}

		logger.info("Enhanced faction creation context gathered successfully")

		return cleanObject(data)
	} catch (error) {
		logger.error("Error gathering faction creation context:", {
			error:
				error instanceof Error
					? {
							name: error.name,
							message: error.message,
							stack: error.stack,
						}
					: error,
			factionArgs: args,
		})
		throw new Error(
			`Failed to gather faction creation context for "${args.name}": ${
				error instanceof Error ? error.message : String(error)
			}`,
		)
	}
}
