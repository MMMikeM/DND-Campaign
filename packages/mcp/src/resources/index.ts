import { getFactionContext } from "../prompts/baseContext"
import { campaignSeedSchema, handleCampaignSeed } from "./campaign-seed"
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
			const factionId = uri.split("/").pop()
			const factions = await getFactionContext()
			const faction = factions.find((f) => f.id === Number(factionId))
			return {
				uri,
				content: JSON.stringify(faction, null, 2),
				mimeType: "application/json",
			}
		},
		lister: async () => {
			const factions = await getFactionContext()
			return factions.map((faction) => ({
				uri: `campaign://faction/${faction.id}`,
				name: faction.name,
				description: `Context for ${faction.name}`,
				mimeType: "application/json",
			}))
		},
	},
	"campaign-seed": {
		name: "Campaign Seed",
		description: "Seeds the campaign with initial lore, narrative events, destinations, and foreshadowing.",
		uriTemplate: "file://**/*.seed.json",
		handler: async (uri: string, content?: string) => {
			if (!content) {
				throw new Error("Content is required for campaign seed")
			}
			const seedData = campaignSeedSchema.parse(JSON.parse(content))
			await handleCampaignSeed(seedData)
			return {
				uri,
				content: "Campaign seeded successfully.",
				mimeType: "text/plain",
			}
		},
	},
}
