import { discoverySubtlety } from "../shared-enums"

const seedDeliveryMethods = [
	"npc_dialogue",
	"item_description",
	"environmental_detail",
	"document_snippet",
	"rumor",
	"dream_vision",
	"symbol_motif",
	"player_intuition_prompt",
	" overheard_conversation",
] as const

const foreshadowedEntityType = [
	"quest",
	"npc",
	"narrative_event",
	"conflict",
	"item",
	"narrative_destination",
	"world_concept",
	"faction",
	"site",
	"abstract_theme",
	"specific_reveal",
] as const

export const enums = {
	discoverySubtlety,
	foreshadowedEntityType,
	seedDeliveryMethods,
}
