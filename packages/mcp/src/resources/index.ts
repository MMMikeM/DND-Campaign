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
}
