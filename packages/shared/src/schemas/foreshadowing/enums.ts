import { discoverySubtlety, narrativeWeight } from "../shared-enums"

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

export const enums = {
	discoverySubtlety,
	narrativeWeight,
	seedDeliveryMethods,
}
