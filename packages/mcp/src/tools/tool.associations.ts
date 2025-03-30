import { createInsertSchema } from "drizzle-zod"
import zodToMCP from "../zodToMcp"
import {
	type CamelToSnakeCase,
	createEntityActionDescription,
	createEntityHandler,
	jsonArray,
	type ToolDefinition,
	ToolHandlerReturn,
} from "./tool.utils"
import { tables } from "@tome-master/shared"
import z from "zod"

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
		description: jsonArray,
		reveals: jsonArray,
		discoveryCondition: jsonArray,
		creativePrompts: jsonArray,
	}).strict(),
	factionQuests: createInsertSchema(factionQuests, {
		interest: jsonArray,
	}).strict(),
	items: createInsertSchema(items, {
		description: jsonArray,
		locationId: z.number().optional(),
		questId: z.number().optional(),
		creativePrompts: jsonArray,
	}).strict(),
	questNpcs: createInsertSchema(questNpcs, {
		creativePrompts: jsonArray,
		description: jsonArray,
		dramaticMoments: jsonArray,
		hiddenAspects: jsonArray,
	}).strict(),
	factionInfluence: createInsertSchema(factionInfluence, {
		description: jsonArray,
		creativePrompts: jsonArray,
	}).strict(),
	questHookNpcs: createInsertSchema(questHookNpcs, {}).strict(),
	questHooks: createInsertSchema(questHooks, {
		description: jsonArray,
		creativePrompts: jsonArray,
		discoveryCondition: jsonArray,
		hookContent: jsonArray,
	}).strict(),
	regionConnections: createInsertSchema(regionConnections, {
		description: jsonArray,
		creativePrompts: jsonArray,
		travelHazards: jsonArray,
		pointsOfInterest: jsonArray,
	}).strict(),
} satisfies Record<ToolNames, z.ZodSchema<unknown>>

// Association Tool Definitions
export const associationToolDefinitions: Record<AssociationToolNames, ToolDefinition> = {
	manage_clues: {
		description: createEntityActionDescription("clue"),
		inputSchema: zodToMCP(schemas.clues, {
			id: "The ID of the association to update (omit to create new)",
			description: "The description of the clue, in point form",
			discoveryCondition: "The condition that must be met to discover the clue",
			factionId: "The ID of the faction that owns the clue",
			locationId: "The ID of the location that the clue is found in",
			npcId: "The ID of the NPC that the clue is found by",
			questStageId: "The ID of the quest stage that the clue is found in",
			reveals: "The information that is revealed when the clue is discovered",
		}),
		handler: createEntityHandler(clues, schemas.clues, "clue"),
	},
	manage_faction_quests: {
		description: createEntityActionDescription("faction-quest"),
		inputSchema: zodToMCP(schemas.factionQuests, {
			id: "The ID of the association to update (omit to create new)",
			factionId: "The ID of the faction that owns the quest",
			interest: "The interest of the faction in the quest",
			questId: "The ID of the quest that the faction is associated with",
			role: "The role of the faction in the quest",
		}),
		handler: createEntityHandler(factionQuests, schemas.factionQuests, "faction-quest"),
	},
	manage_items: {
		description: createEntityActionDescription("item"),
		inputSchema: zodToMCP(schemas.items, {
			id: "The ID of the association to update (omit to create new)",
			factionId: "The ID of the faction that owns the item",
			locationId: "The ID of the location that the item is found in",
			npcId: "The ID of the NPC that the item is associated with",
			questId: "The ID of the quest that the item is associated with",
			stageId: "The ID of the stage that the item is found in",
			description: "The description of the item, in point form",
			name: "The name of the item",
			type: "The type of the item",
		}),
		handler: createEntityHandler(items, schemas.items, "item"),
	},
	manage_quest_npcs: {
		description: createEntityActionDescription("quest-npc"),
		inputSchema: zodToMCP(schemas.questNpcs, {
			id: "The ID of the association to update (omit to create new)",
			npcId: "The required ID of the NPC that the quest is associated with",
			questId: "The required ID of the quest that the NPC is associated with",
			creativePrompts: "The creative prompts for the NPC",
			description: "The description of the NPC, in point form",
			dramaticMoments: "The dramatic moments of the NPC",
			hiddenAspects: "The hidden aspects of the NPC",
			importance: "The importance of the NPC in the quest",
			role: "The role of the NPC in the quest",
		}),
		handler: createEntityHandler(questNpcs, schemas.questNpcs, "quest-npc"),
	},
	manage_faction_influence: {
		description: createEntityActionDescription("faction-influence"),
		inputSchema: zodToMCP(schemas.factionInfluence, {
			id: "The ID of the association to update (omit to create new)",
			factionId: "The ID of the faction that owns the influence",
			questId: "The ID of the quest that the influence is associated with",
			creativePrompts: "The creative prompts for the influence",
			description: "The description of the influence, in point form",
			influenceLevel: "The level of influence that the faction has in the quest",
			locationId: "The optional ID of the location that the influence is associated with",
			regionId: "The required ID of the region that the influence is associated with",
		}),
		handler: createEntityHandler(factionInfluence, schemas.factionInfluence, "faction-influence"),
	},
	manage_quest_hook_npcs: {
		description: createEntityActionDescription("quest-hook-npc"),
		inputSchema: zodToMCP(schemas.questHookNpcs, {
			id: "The ID of the association to update (omit to create new)",
			npcId: "The ID of the NPC that the quest hook is associated with",
			dialogueHint: "The dialogue hint of the NPC in the quest hook",
			hookId: "The ID of the quest hook that the NPC is associated with",
			relationship: "The relationship of the NPC in the quest hook",
			trustRequired: "The trust required for the NPC in the quest hook",
		}),
		handler: createEntityHandler(questHookNpcs, schemas.questHookNpcs, "quest-hook-npc"),
	},
	manage_quest_hooks: {
		description: createEntityActionDescription("quest-hook"),
		inputSchema: zodToMCP(schemas.questHooks, {
			id: "The ID of the association to update (omit to create new)",
			hookType: "The type of quest hook",
			stageId: "The required ID of the stage that the hook is associated with",
			factionId: "The optional ID of the faction that the hook is possibly associated with",
			locationId: "The optional ID of the location that the hook is possibly associated with",
			itemId: "The optional ID of the item that the hook is possibly associated with",
			presentation: "The presentation of the quest hook",
			source: "The source of the quest hook",
			creativePrompts: "The creative prompts for the quest hook",
			description: "The description of the quest hook",
			discoveryCondition: "The condition that must be met to discover the quest hook",
			hookContent: "The content of the quest hook",
		}),
		handler: createEntityHandler(questHooks, schemas.questHooks, "quest-hook"),
	},
	manage_region_connections: {
		description: createEntityActionDescription("region-connection"),
		inputSchema: zodToMCP(schemas.regionConnections, {
			id: "The ID of the association to update (omit to create new)",
			travelHazards: "The travel hazards of the region connection",
			pointsOfInterest: "The points of interest of the region connection",
			controllingFaction: "The name of the faction that controls the region connection",
			creativePrompts: "The creative prompts for the region connection",
			description: "The description of the region connection",
			relationId: "The ID of the relation that the region connection is associated with",
			routeType: "The type of route for the region connection",
			travelDifficulty: "The difficulty of travel for the region connection",
			travelTime: "The time it takes to travel the region connection",
		}),
		handler: createEntityHandler(regionConnections, schemas.regionConnections, "region-connection"),
	},
}
