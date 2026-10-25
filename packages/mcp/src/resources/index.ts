import { ResourceNotFoundError } from "@modelcontextprotocol/server"
import { db } from ".."
import { getFactionContext } from "../prompts/baseContext"
import { factionResponseResourceDefinition } from "./faction-response"
import { locationContextResourceDefinition } from "./location-context"
import { mapResourceDefinition } from "./map"
import { npcCreationResourceDefinition } from "./npc-creation"
import { npcDialogueResourceDefinition } from "./npc-dialogue-context"
import { questCreationResourceDefinition } from "./quest-creation"
import type { ResourceDefinition } from "./resource-types"

export const campaignResourceDefinitions: Record<string, ResourceDefinition> = {
	"npc-creation": npcCreationResourceDefinition,
	"quest-creation": questCreationResourceDefinition,
	"faction-response": factionResponseResourceDefinition,
	"npc-dialogue-context": npcDialogueResourceDefinition,
	map: mapResourceDefinition,
	"location-context": locationContextResourceDefinition,
	"faction-context": {
		name: "Faction Context",
		description: "Provides context about a specific faction, including its members, influence, and relationships.",
		uriTemplate: "campaign://faction/{factionId}",
		handler: async (uri: string) => {
			const factionId = Number(uri.split("/").pop())
			const [faction] = Number.isInteger(factionId) ? await getFactionContext(factionId) : []
			if (!faction) {
				throw new ResourceNotFoundError(uri, `Faction not found: ${uri}`)
			}
			return {
				uri,
				text: JSON.stringify(faction, null, 2),
				mimeType: "application/json",
			}
		},
		lister: async () => {
			const factions = await db.query.factions.findMany({ columns: { id: true, name: true } })
			return factions.map((faction) => ({
				uri: `campaign://faction/${faction.id}`,
				name: faction.name,
				description: `Context for ${faction.name}`,
				mimeType: "application/json",
			}))
		},
	},
}
