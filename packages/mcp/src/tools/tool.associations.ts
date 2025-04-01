import { createInsertSchema } from "drizzle-zod"
import {
	type CamelToSnakeCase,
	createEntityActionDescription,
	createEntityHandler,
	id,
	jsonArray,
	optionalId,
	type ToolDefinition,
	ToolHandlerReturn,
} from "./tool.utils"
import { tables } from "@tome-master/shared"
import { z } from "zod"
import { zodToMCP } from "../zodToMcp"

const {
	assocationTables: {
		clues,
		items,
		factionQuests,
		questNpcs,
		factionInfluence,
		questHookNpcs,
		questHooks,
		regionConnections,
	},
} = tables

type ToolNames = keyof typeof tables.assocationTables

type AssociationToolNames = `manage_${CamelToSnakeCase<ToolNames>}`

// Schema Definitions
const schemas = {
	clues: createInsertSchema(clues, {
			description: jsonArray.describe("Detailed narrative description of the clue, its appearance, and context in point form"),
			reveals: jsonArray.describe("Specific information or plot points revealed when players discover this clue"),
			discoveryCondition: jsonArray.describe("Requirements or actions needed for players to discover this clue (perception checks, specific interactions, etc.)"),
			creativePrompts: jsonArray.describe("Ideas for GMs to expand upon or incorporate this clue into their campaign"),
			id: (s) => s.optional().describe("The ID of the clue to update (omit to create new)"),
			factionId: optionalId.describe("The ID of the faction connected to this clue (if any)"),
			locationId: optionalId.describe("The ID of the location where this clue can be found (if any)"),
			npcId: optionalId.describe("The ID of the NPC who provides or is connected to this clue (if any)"),
			questStageId: id.describe("The ID of the quest stage this clue is relevant to"),
	}).strict(),

	factionQuests: createInsertSchema(factionQuests, {
			interest: jsonArray.describe("The faction's motivations and objectives regarding this quest in point form"),
			id: optionalId.describe("The ID of the faction-quest relationship to update (omit to create new)"),
			factionId: id.describe("The ID of the faction involved with the quest"),
			questId: id.describe("The ID of the quest the faction is associated with"),
			role: (s) => s.describe("The faction's specific role in the quest (e.g., benefactor, adversary, ally, manipulator)"),
	}).strict(),

	items: createInsertSchema(items, {
			description: jsonArray.describe("Detailed physical description of the item including appearance, properties, and history in point form"),
			creativePrompts: jsonArray.describe("Ideas for GMs to incorporate this item meaningfully into their campaign"),
			id: optionalId.describe("The ID of the item to update (omit to create new)"),
			locationId: optionalId.describe("The ID of the location where this item can be found (if any)"),
			questId: optionalId.describe("The ID of the quest this item is relevant to (if any)"),
			factionId: optionalId.describe("The ID of the faction that owns or seeks this item (if any)"),
			npcId: optionalId.describe("The ID of the NPC who possesses or is connected to this item (if any)"),
			stageId: optionalId.describe("The ID of the quest stage where this item becomes relevant (if any)"),
			name: (s) => s.describe("The name or title of the item"),
			type: (s) => s.describe("The category of item (weapon, armor, magical artifact, quest item, tool, etc.)"),
			significance: (s) => s.describe("The narrative importance of the item to the story or campaign"),
	}).strict(),

	questNpcs: createInsertSchema(questNpcs, {
			creativePrompts: jsonArray.describe("Ideas for GMs to roleplay this NPC within the context of the quest"),
			description: jsonArray.describe("The NPC's appearance, demeanor, and behavior specific to this quest in point form"),
			dramaticMoments: jsonArray.describe("Key scenes or interactions where this NPC plays a significant role in the quest"),
			hiddenAspects: jsonArray.describe("Secret motivations, knowledge, or traits the NPC conceals from players"),
			id: optionalId.describe("The ID of the quest-NPC relationship to update (omit to create new)"),
			npcId: id.describe("The ID of the NPC involved in the quest"),
			questId: optionalId.describe("The ID of the quest the NPC is involved with"),
			importance: (s) => s.describe("The significance of the NPC to the quest (minor, supporting, major, critical)"),
			role: (s) => s.describe("The NPC's specific function in the quest (questgiver, ally, villain, informant, etc.)"),
	}).strict(),

	factionInfluence: createInsertSchema(factionInfluence, {
			description: jsonArray.describe("How the faction exerts its influence and what effects this has in point form"),
			creativePrompts: jsonArray.describe("Ideas for GMs to demonstrate this faction's influence in gameplay"),
			id: optionalId.describe("The ID of the faction influence record to update (omit to create new)"),
			factionId: id.describe("The ID of the faction exerting influence"),
			questId: optionalId.describe("The ID of the quest affected by this faction's influence (if any)"),
			influenceLevel: (s) => s.describe("The strength and scope of influence (e.g., minor, moderate, major, dominant)"),
			locationId: optionalId.describe("The ID of the specific location affected by this faction's influence (if any)"),
			regionId: optionalId.describe("The ID of the region where this faction exerts influence (if any)"),
	}).strict(),

	questHookNpcs: createInsertSchema(questHookNpcs, {
			id: optionalId.describe("The ID of the hook-NPC relationship to update (omit to create new)"),
			npcId: id.describe("The ID of the NPC who delivers or is connected to this quest hook"),
			dialogueHint: (s) => s.describe("Sample dialogue or conversation cues the NPC might use to introduce the quest"),
			hookId: id.describe("The ID of the quest hook this NPC is connected to"),
			relationship: (s) => s.describe("The NPC's connection to the quest hook (witness, participant, messenger, etc.)"),
			trustRequired: (s) => s.describe("Level of trust players must establish with this NPC to access the hook (none, low, medium, high)"),
	}).strict(),

	questHooks: createInsertSchema(questHooks, {
			description: jsonArray.describe("Detailed narrative of how this hook introduces the quest to players in point form"),
			creativePrompts: jsonArray.describe("Ideas for GMs to introduce this hook organically into their campaign"),
			discoveryCondition: jsonArray.describe("Circumstances or requirements for players to encounter this hook"),
			hookContent: jsonArray.describe("Specific information or clues provided by this hook about the quest"),
			id: optionalId.describe("The ID of the quest hook to update (omit to create new)"),
			hookType: (s) => s.describe("The category of hook (rumor, npc_interaction, location_discovery)"),
			stageId: id.describe("The ID of the quest stage this hook leads to"),
			factionId: optionalId.describe("The ID of the faction involved with this hook (if any)"),
			locationId: optionalId.describe("The ID of the location where this hook can be found (if any)"),
			itemId: optionalId.describe("The ID of an item that serves as or connects to this hook (if any)"),
			presentation: (s) => s.describe("How the hook is presented to players (subtle, clear, urgent, mysterious)"),
			source: (s) => s.describe("Origin of the hook (tavern rumor, posted notice, messenger, found item, etc.)"),
	}).strict(),

	regionConnections: createInsertSchema(regionConnections, {
			description: jsonArray.describe("Detailed narrative description of the route's appearance and features in point form"),
			creativePrompts: jsonArray.describe("Ideas for GMs to make travel along this route interesting"),
			travelHazards: jsonArray.describe("Dangers or challenges travelers might face along this route"),
			pointsOfInterest: jsonArray.describe("Notable landmarks or locations along the route"),
			id: optionalId.describe("The ID of the region connection to update (omit to create new)"),
			controllingFaction: optionalId.describe("The ID of the faction that controls or patrols this route (if any)"),
			relationId: id.describe("The ID of the region relation this connection represents"),
			routeType: (s) => s.describe("The physical nature of the route (road, river, mountain pass, sea route, portal, wilderness)"),
			travelDifficulty: (s) => s.describe("How challenging the route is to traverse (trivial, easy, moderate, difficult, treacherous)"),
			travelTime: (s) => s.describe("Typical duration required to travel this route (hours, days, weeks)"),
	}).strict(),
} satisfies Record<ToolNames, z.ZodSchema<unknown>>

// Association Tool Definitions
export const associationToolDefinitions: Record<AssociationToolNames, ToolDefinition> = {
	manage_clues: {
		description: createEntityActionDescription("clue"),
		inputSchema: zodToMCP(schemas.clues),
		handler: createEntityHandler(clues, schemas.clues, "clue"),
	},
	manage_faction_quests: {
		description: createEntityActionDescription("faction-quest"),
		inputSchema: zodToMCP(schemas.factionQuests),
		handler: createEntityHandler(factionQuests, schemas.factionQuests, "faction-quest"),
	},
	manage_items: {
		description: createEntityActionDescription("item"),
		inputSchema: zodToMCP(schemas.items),
		handler: createEntityHandler(items, schemas.items, "item"),
	},
	manage_quest_npcs: {
		description: createEntityActionDescription("quest-npc"),
		inputSchema: zodToMCP(schemas.questNpcs),
		handler: createEntityHandler(questNpcs, schemas.questNpcs, "quest-npc"),
	},
	manage_faction_influence: {
		description: createEntityActionDescription("faction-influence"),
		inputSchema: zodToMCP(schemas.factionInfluence),
		handler: createEntityHandler(factionInfluence, schemas.factionInfluence, "faction-influence"),
	},
	manage_quest_hook_npcs: {
		description: createEntityActionDescription("quest-hook-npc"),
		inputSchema: zodToMCP(schemas.questHookNpcs),
		handler: createEntityHandler(questHookNpcs, schemas.questHookNpcs, "quest-hook-npc"),
	},
	manage_quest_hooks: {
		description: createEntityActionDescription("quest-hook"),
		inputSchema: zodToMCP(schemas.questHooks),
		handler: createEntityHandler(questHooks, schemas.questHooks, "quest-hook"),
	},
	manage_region_connections: {
		description: createEntityActionDescription("region-connection"),
		inputSchema: zodToMCP(schemas.regionConnections),
		handler: createEntityHandler(regionConnections, schemas.regionConnections, "region-connection"),
	},
}
