import { tables } from "@tome-master/shared"
import { createInsertSchema } from "drizzle-zod"
import { z } from "zod/v4"
import { type CreateTableNames, id, type Schema } from "./utils/tool.utils"

const {
	npcTables: { npcs, npcRelationships, npcFactionMemberships, npcSiteAssociations, enums },
} = tables

const {
	adaptabilityLevels,
	alignments,
	availabilityLevels,
	characterComplexityProfiles,
	cprScores,
	genders,
	playerPerceptionGoals,
	races,
	trustLevels,
	wealthLevels,
	npcFactionRoles,
	npcStatuses,
	relationshipStrengths,
	relationshipTypes,
	siteAssociationTypes,
} = enums

type TableNames = CreateTableNames<typeof tables.npcTables>

export const tableEnum = [
	"npcs",
	"npcRelationships",
	"npcFactionMemberships",
	"npcSiteAssociations",
] as const satisfies TableNames

export const schemas = {
	npcs: createInsertSchema(npcs, {
		adaptability: z
			.enum(adaptabilityLevels)
			.describe("Response to new situations (rigid, reluctant, flexible, opportunistic)"),
		age: (s) => s.describe("Approximate age or age range"),
		alignment: z.enum(alignments).describe("Moral stance (lawful good through chaotic evil)"),
		appearance: (s) => s.describe("Physical traits, clothing, and distinctive features in point form"),
		attitude: (s) => s.describe("General outlook and typical emotional state"),
		availability: z.enum(availabilityLevels).describe("How often this NPC can be encountered"),
		avoidTopics: (s) => s.describe("Subjects that make this NPC uncomfortable or defensive"),
		background: (s) => s.describe("Life history and formative experiences"),
		biases: (s) => s.describe("Prejudices and preconceptions that affect judgment"),
		capability: z.enum(cprScores).describe("Competence level (low, medium, high)"),
		complexityProfile: z.enum(characterComplexityProfiles).describe("Character complexity archetype"),
		currentGoals: (s) => s.describe("Current objectives and motivations"),
		dialogue: (s) => s.describe("Signature phrases and speech patterns for roleplaying"),
		disposition: (s) => s.describe("Default attitude toward strangers"),
		drives: (s) => s.describe("Core motivations and desires that inspire actions"),
		fears: (s) => s.describe("Specific phobias and threats that concern this NPC"),
		gender: z.enum(genders).describe("Gender identity (male, female, non-humanoid)"),
		knowledge: (s) => s.describe("Information and secrets players might discover"),
		mannerisms: (s) => s.describe("Distinctive gestures and behavioral quirks"),
		name: (s) => s.describe("Full name or primary identifier"),
		occupation: (s) => s.describe("Profession, role, or primary activity"),
		personalityTraits: (s) => s.describe("Key character aspects and psychological qualities"),
		playerPerceptionGoal: z.enum(playerPerceptionGoals).describe("Intended player perception of this NPC"),
		preferredTopics: (s) => s.describe("Subjects this NPC eagerly discusses"),
		proactivity: z.enum(cprScores).describe("Initiative level (low, medium, high)"),
		quirk: (s) => s.describe("Single odd habit or trait that stands out"),
		race: z.enum(races).describe("Species or ancestry (human, elf, dwarf, etc.)"),
		relatability: z.enum(cprScores).describe("How relatable this NPC is (low, medium, high)"),
		rumours: (s) => s.describe("Gossip and stories others tell about this character"),
		secrets: (s) => s.describe("Hidden information unknown to most others"),
		socialStatus: z.enum(npcStatuses).describe("Position in social hierarchy"),
		trustLevel: z.enum(trustLevels).describe("Willingness to trust others (none, low, medium, high)"),
		voiceNotes: (s) => s.describe("Vocal qualities and accent for roleplaying"),
		wealth: z.enum(wealthLevels).describe("Economic status (destitute, poor, moderate, rich, wealthy)"),
		creativePrompts: (s) => s.describe("GM ideas for using this NPC in the campaign"),
		description: (s) => s.describe("Key characteristics and role in point form"),
		gmNotes: (s) => s.describe("GM-only information about this NPC"),
		tags: (s) => s.describe("Tags for this NPC"),
	})
		.omit({ id: true })
		.strict()
		.describe("Characters with distinct personalities who interact with players as allies, enemies, or contacts"),

	npcFactionMemberships: createInsertSchema(npcFactionMemberships, {
		npcId: id.describe("ID of the NPC in this relationship"),
		factionId: id.describe("ID of the faction this NPC belongs to"),
		justification: (s) => s.describe("Reason for allegiance (belief, gain, blackmail, family ties)"),
		loyalty: z.enum(trustLevels).describe("Dedication level to faction's interests"),
		rank: (s) => s.describe("Formal title or hierarchical position"),
		role: z.enum(npcFactionRoles).describe("Function within faction (leader, enforcer, spy, advisor)"),
		secrets: (s) => s.describe("Hidden information about their faction involvement"),
		creativePrompts: (s) => s.describe("GM ideas for using this faction relationship"),
		description: (s) => s.describe("Description of this faction relationship"),
		gmNotes: (s) => s.describe("GM-only notes about this faction relationship"),
		tags: (s) => s.describe("Tags for this faction relationship"),
	})
		.omit({ id: true })
		.strict()
		.describe("Establishes NPC membership in factions, creating loyalties that influence their actions"),

	npcSiteAssociations: createInsertSchema(npcSiteAssociations, {
		npcId: id.describe("ID of the NPC who can be found here"),
		siteId: id.describe("ID of the site where this NPC can be encountered"),
		associationType: z.enum(siteAssociationTypes).describe("Type of association with this site"),
		isCurrent: z.boolean().describe("Whether this is the NPC's current location"),
		description: (s) => s.describe("How and why the NPC frequents this place and their activities"),
		creativePrompts: (s) => s.describe("Story hooks involving this NPC at this site"),
		gmNotes: (s) => s.describe("GM-only notes about this site association"),
		tags: (s) => s.describe("Tags for this site association"),
	})
		.omit({ id: true })
		.strict()
		.describe("Maps where NPCs can be encountered, helping GMs place characters consistently in the world"),

	npcRelationships: createInsertSchema(npcRelationships, {
		sourceNpcId: id.describe("ID of the primary NPC in this relationship"),
		targetNpcId: id.describe("ID of the secondary NPC in this relationship"),
		relationshipType: z.enum(relationshipTypes).describe("Connection type (family, friend, rival, mentor, enemy)"),
		strength: z
			.enum(relationshipStrengths)
			.describe("Relationship intensity (weak, moderate, friendly, strong, unbreakable, hostile, war)"),
		creativePrompts: (s) => s.describe("Story possibilities involving both NPCs"),
		description: (s) => s.describe("Current relationship status and visible dynamics"),
		gmNotes: (s) => s.describe("GM-only notes about this relationship"),
		history: (s) => s.describe("Past interactions and shared experiences"),
		narrativeTensions: (s) => s.describe("Points of conflict or dramatic potential"),
		relationshipDynamics: (s) => s.describe("How these NPCs typically interact with each other"),
		sharedGoals: (s) => s.describe("Common objectives uniting these NPCs"),
		tags: (s) => s.describe("Tags for this relationship"),
	})
		.omit({ id: true })
		.strict()
		.describe("Defines connections between NPCs, creating social networks and potential storylines")
		.refine((data) => data.sourceNpcId !== data.targetNpcId, {
			message: "An NPC cannot have a relationship with itself",
			path: ["targetNpcId"],
		}),
} as const satisfies Schema<TableNames[number]>
