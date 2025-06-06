const itemTypes = ["weapon", "armor", "tool", "treasure", "document", "key_item", "consumable"] as const
const rarityLevels = ["common", "uncommon", "rare", "very_rare", "legendary", "artifact"] as const
const narrativeRoles = [
	"utility_tool",
	"quest_key",
	"emotional_anchor",
	"thematic_symbol",
	"simple_reward",
	"macguffin",
] as const
const perceivedSimplicityLevels = ["what_it_seems", "deceptively_simple", "obviously_complex"] as const

const itemRelationshipTypes = [
	"part_of_set",
	"key_for",
	"activates",
	"counterpart_to",
	"synergizes_with",
	"opposes",
	"transforms_into",
	"contains",
	"powers",
	"owned_by",
	"created_by",
	"guarded_by",
	"sought_by",
	"connected_to",
	"empowers",
	"weakens",
	"reveals",
	"conceals",
] as const

const targetEntityTypes = [
	"item",
	"npc",
	"faction",
	"site",
	"quest",
	"conflict",
	"narrative_destination",
	"world_concept",
] as const

export const enums = {
	itemRelationshipTypes,
	itemTypes,
	narrativeRoles,
	perceivedSimplicityLevels,
	rarityLevels,
	targetEntityTypes,
}
