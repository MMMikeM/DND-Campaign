import { createInsertSchema } from "drizzle-zod"
import { tables } from "@tome-master/shared"
import { z } from "zod"
import { AssociationTools } from "./association-tools"

const {
	assocationTables: {
		clues,
		items,
		factionQuestInvolvement,
		npcQuestRoles,
		factionRegionalPower,
		questHookNpcs,
		questIntroductions,
		regionConnectionDetails,
	},
} = tables

export const schemas = {
	manage_clues: createInsertSchema(clues, {
		description: (s) =>
			s.describe("Detailed narrative description of the clue, its appearance, and context in point form"),
		reveals: (s) => s.describe("Specific information or plot points revealed when players discover this clue"),
		discoveryCondition: (s) =>
			s.describe(
				"Requirements or actions needed for players to discover this clue (perception checks, specific interactions, etc.)",
			),
		creativePrompts: (s) => s.describe("Ideas for GMs to expand upon or incorporate this clue into their campaign"),
		id: (s) => s.optional().describe("The ID of the clue to update (omit to create new)"),
		factionId: (s) => s.optional().describe("The ID of the faction connected to this clue (if any)"),
		locationId: (s) => s.optional().describe("The ID of the location where this clue can be found (if any)"),
		npcId: (s) => s.optional().describe("The ID of the NPC who provides or is connected to this clue (if any)"),
		questStageId: (s) => s.describe("The ID of the quest stage this clue is relevant to"),
	})
		.omit({ embedding: true })
		.strict()
		.describe("A piece of information or evidence that players can discover during their adventure"),

	manage_faction_quest_involvement: createInsertSchema(factionQuestInvolvement, {
		interest: (s) => s.describe("The faction's motivations and objectives regarding this quest in point form"),
		id: (s) => s.optional().describe("The ID of the faction-quest relationship to update (omit to create new)"),
		factionId: (s) => s.describe("The ID of the faction involved with the quest"),
		questId: (s) => s.describe("The ID of the quest the faction is associated with"),
		role: (s) =>
			s.describe("The faction's specific role in the quest (e.g., benefactor, adversary, ally, manipulator)"),
	})
		.strict()
		.describe("The relationship between a faction and a quest, detailing their involvement and interests"),

	manage_items: createInsertSchema(items, {
		description: (s) =>
			s.describe(
				"Detailed physical description of the item including appearance, properties, and history in point form",
			),
		creativePrompts: (s) => s.describe("Ideas for GMs to incorporate this item meaningfully into their campaign"),
		id: (s) => s.optional().describe("The ID of the item to update (omit to create new)"),
		locationId: (s) => s.optional().describe("The ID of the location where this item can be found (if any)"),
		questId: (s) => s.optional().describe("The ID of the quest this item is relevant to (if any)"),
		factionId: (s) => s.optional().describe("The ID of the faction that owns or seeks this item (if any)"),
		npcId: (s) => s.optional().describe("The ID of the NPC who possesses or is connected to this item (if any)"),
		stageId: (s) => s.optional().describe("The ID of the quest stage where this item becomes relevant (if any)"),
		name: (s) => s.describe("The name or title of the item"),
		type: (s) => s.describe("The category of item (weapon, armor, magical artifact, quest item, tool, etc.)"),
		significance: (s) => s.describe("The narrative importance of the item to the story or campaign"),
	})
		.omit({ embedding: true })
		.strict()
		.describe("An object or entity that players can interact with, use, or acquire during their adventure"),

	manage_npc_quest_roles: createInsertSchema(npcQuestRoles, {
		creativePrompts: (s) => s.describe("Ideas for GMs to roleplay this NPC within the context of the quest"),
		description: (s) => s.describe("The NPC's appearance, demeanor, and behavior specific to this quest in point form"),
		dramaticMoments: (s) =>
			s.describe("Key scenes or interactions where this NPC plays a significant role in the quest"),
		hiddenAspects: (s) => s.describe("Secret motivations, knowledge, or traits the NPC conceals from players"),
		id: (s) => s.optional().describe("The ID of the quest-NPC relationship to update (omit to create new)"),
		npcId: (s) => s.describe("The ID of the NPC involved in the quest"),
		questId: (s) => s.optional().describe("The ID of the quest the NPC is involved with"),
		importance: (s) => s.describe("The significance of the NPC to the quest (minor, supporting, major, critical)"),
		role: (s) => s.describe("The NPC's specific function in the quest (questgiver, ally, villain, informant, etc.)"),
	}).strict(),

	manage_faction_regional_power: createInsertSchema(factionRegionalPower, {
		description: (s) => s.describe("How the faction exerts its influence and what effects this has in point form"),
		creativePrompts: (s) => s.describe("Ideas for GMs to demonstrate this faction's influence in gameplay"),
		id: (s) => s.optional().describe("The ID of the faction influence record to update (omit to create new)"),
		factionId: (s) => s.describe("The ID of the faction exerting influence"),
		questId: (s) => s.optional().describe("The ID of the quest affected by this faction's influence (if any)"),
		powerLevel: (s) => s.describe("The strength and scope of influence (e.g., minor, moderate, major, dominant)"),
		locationId: (s) =>
			s.optional().describe("The ID of the specific location affected by this faction's influence (if any)"),
		regionId: (s) => s.optional().describe("The ID of the region where this faction exerts influence (if any)"),
	}).strict(),

	manage_quest_hook_npcs: createInsertSchema(questHookNpcs, {
		id: (s) => s.optional().describe("The ID of the hook-NPC relationship to update (omit to create new)"),
		npcId: (s) => s.describe("The ID of the NPC who delivers or is connected to this quest hook"),
		dialogueHint: (s) => s.describe("Sample dialogue or conversation cues the NPC might use to introduce the quest"),
		hookId: (s) => s.describe("The ID of the quest hook this NPC is connected to"),
		relationship: (s) => s.describe("The NPC's connection to the quest hook (witness, participant, messenger, etc.)"),
		trustRequired: (s) =>
			s.describe("Level of trust players must establish with this NPC to access the hook (none, low, medium, high)"),
	}).strict(),

	manage_quest_introductions: createInsertSchema(questIntroductions, {
		description: (s) => s.describe("Detailed narrative of how this hook introduces the quest to players in point form"),
		creativePrompts: (s) => s.describe("Ideas for GMs to introduce this hook organically into their campaign"),
		discoveryCondition: (s) => s.describe("Circumstances or requirements for players to encounter this hook"),
		hookContent: (s) => s.describe("Specific information or clues provided by this hook about the quest"),
		id: (s) => s.optional().describe("The ID of the quest hook to update (omit to create new)"),
		introductionType: (s) => s.describe("The category of hook (rumor, npc_interaction, location_discovery)"),
		stageId: (s) => s.describe("The ID of the quest stage this hook leads to"),
		factionId: (s) => s.optional().describe("The ID of the faction involved with this hook (if any)"),
		locationId: (s) => s.optional().describe("The ID of the location where this hook can be found (if any)"),
		itemId: (s) => s.optional().describe("The ID of an item that serves as or connects to this hook (if any)"),
		presentationStyle: (s) => s.describe("How the hook is presented to players (subtle, clear, urgent, mysterious)"),
		source: (s) => s.describe("Origin of the hook (tavern rumor, posted notice, messenger, found item, etc.)"),
	}).strict(),

	manage_region_connection_details: createInsertSchema(regionConnectionDetails, {
		description: (s) =>
			s.describe("Detailed narrative description of the route's appearance and features in point form"),
		creativePrompts: (s) => s.describe("Ideas for GMs to make travel along this route interesting"),
		travelHazards: (s) => s.describe("Dangers or challenges travelers might face along this route"),
		pointsOfInterest: (s) => s.describe("Notable landmarks or locations along the route"),
		id: (s) => s.optional().describe("The ID of the region connection to update (omit to create new)"),
		controllingFaction: (s) =>
			s.optional().describe("The ID of the faction that controls or patrols this route (if any)"),
		relationId: (s) => s.describe("The ID of the region relation this connection represents"),
		routeType: (s) =>
			s.describe("The physical nature of the route (road, river, mountain pass, sea route, portal, wilderness)"),
		travelDifficulty: (s) =>
			s.describe("How challenging the route is to traverse (trivial, easy, moderate, difficult, treacherous)"),
		travelTime: (s) => s.describe("Typical duration required to travel this route (hours, days, weeks)"),
	}).strict(),
} satisfies Record<AssociationTools, z.ZodSchema<unknown>>
