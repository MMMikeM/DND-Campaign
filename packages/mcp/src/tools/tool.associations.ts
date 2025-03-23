import { createInsertSchema } from "drizzle-zod"
import { z } from "zod"
import zodToMCP from "../zodToMcp"
import {
	createEntityActionDescription,
	createEntityHandler,
	jsonArray,
	type ToolDefinition,
} from "./tool.utils"

import {
	npcLocations,
	npcFactions,
	npcQuests,
	locationFactions,
	npcAreas,
	questNpcs,
	questLocations,
	questFactions,
	questClues,
	npcSignificantItems,
} from "@tome-master/shared"

// Association Tool Types
export type AssociationToolNames =
	| "manage_location_faction"
	| "manage_npc_faction"
	| "manage_npc_location"
	| "manage_npc_quest"
	| "manage_quest_location"
	| "manage_quest_npc"
	| "manage_quest_faction"
	| "manage_quest_clue"
	| "manage_area_npc"
	| "manage_npc_significant_item"

// Schema Definitions
const schemas = {
	// NPC Association Schemas
	npcLocationSchema: createInsertSchema(npcLocations, {
		id: z.number().optional(),
		context: jsonArray,
	}),

	npcFactionSchema: createInsertSchema(npcFactions, {
		id: z.number().optional(),
		role: z.string(),
		status: z.enum(["leader", "member", "associate", "former"]),
	}),

	npcQuestSchema: createInsertSchema(npcQuests, {
		id: z.number().optional(),
		role: z.string(),
		notes: jsonArray,
	}),

	// Location Association Schemas
	locationFactionSchema: createInsertSchema(locationFactions, {
		id: z.number().optional(),
		description: jsonArray,
	}),

	npcAreaschema: createInsertSchema(npcAreas, {
		id: z.number().optional(),
		activity: jsonArray,
	}),

	// Quest Association Schemas
	questNpcSchema: createInsertSchema(questNpcs, {
		id: z.number().optional(),
		role: z.string(),
		notes: jsonArray,
	}),

	questLocationSchema: createInsertSchema(questLocations, {
		id: z.number().optional(),
		description: jsonArray,
		stage: z.number().optional(),
	}),

	questFactionSchema: createInsertSchema(questFactions, {
		id: z.number().optional(),
		role: z.string(),
		interest: jsonArray,
	}),

	questClueSchema: createInsertSchema(questClues, {
		id: z.number().optional(),
		description: jsonArray,
		discoveryCondition: jsonArray.optional(),
		pointsTo: jsonArray,
	}),

	npcSignificantItemSchema: createInsertSchema(npcSignificantItems, {
		id: z.number().optional(),
		description: jsonArray,
		significance: z.string(),
	}),
}

// Association Tool Definitions
export const associationToolDefinitions: Record<AssociationToolNames, ToolDefinition> = {
	// NPC Location association
	manage_npc_location: {
		description: createEntityActionDescription("NPC-location"),
		inputSchema: zodToMCP(schemas.npcLocationSchema, {
			id: "The ID of the association to update (omit to create new)",
			npcId: "The ID of the NPC to manage with a location",
			locationId: "The ID of the location where the NPC can be found",
			context: "Array of context strings describing why/how the NPC is at this location",
		}),
		handler: createEntityHandler(npcLocations, schemas.npcLocationSchema, "NPC-location"),
	},

	// NPC Faction association
	manage_npc_faction: {
		description: createEntityActionDescription("NPC-faction"),
		inputSchema: zodToMCP(schemas.npcFactionSchema, {
			id: "The ID of the association to update (omit to create new)",
			npcId: "The ID of the NPC to manage with a faction",
			factionId: "The ID of the faction the NPC belongs to",
			role: "The NPC's specific role within the faction",
			status: "The NPC's standing in the faction (leader, member, manage, or former)",
		}),
		handler: createEntityHandler(npcFactions, schemas.npcFactionSchema, "NPC-faction"),
	},

	// NPC Quest association
	manage_npc_quest: {
		description: createEntityActionDescription("NPC-quest"),
		inputSchema: zodToMCP(schemas.npcQuestSchema, {
			id: "The ID of the association to update (omit to create new)",
			npcId: "The ID of the NPC to manage with a quest",
			questId: "The ID of the quest the NPC is involved with",
			role: "The role the NPC plays in the quest",
			notes: "Additional notes about the NPC's involvement in the quest",
		}),
		handler: createEntityHandler(npcQuests, schemas.npcQuestSchema, "NPC-quest"),
	},

	// Location Faction association
	manage_location_faction: {
		description: createEntityActionDescription("location-faction"),
		inputSchema: zodToMCP(schemas.locationFactionSchema, {
			id: "The ID of the association to update (omit to create new)",
			locationId: "The ID of the location to manage with a faction",
			factionId: "The ID of the faction with presence at this location",
			influence: "The level of influence the faction has at this location",
			description: "Details about the faction's presence and operations in this location",
		}),
		handler: createEntityHandler(
			locationFactions,
			schemas.locationFactionSchema,
			"location-faction",
		),
	},

	// Area NPC association
	manage_area_npc: {
		description: createEntityActionDescription("area-NPC"),
		inputSchema: zodToMCP(schemas.npcAreaschema, {
			id: "The ID of the association to update (omit to create new)",
			locationId: "The ID of the parent location",
			areaId: "The ID of the specific area within the location",
			npcId: "The ID of the NPC found in this area",
			activity: "What the NPC is doing in this specific area",
		}),
		handler: createEntityHandler(npcAreas, schemas.npcAreaschema, "area-NPC"),
	},

	// Quest NPC association
	manage_quest_npc: {
		description: createEntityActionDescription("quest-NPC"),
		inputSchema: zodToMCP(schemas.questNpcSchema, {
			id: "The ID of the association to update (omit to create new)",
			questId: "The ID of the quest to manage with an NPC",
			npcId: "The ID of the NPC involved in the quest",
			role: "The specific role the NPC plays in the quest",
			importance: "How important the NPC is to the quest (minor, supporting, major, critical)",
			notes: "Additional notes about the NPC's involvement",
		}),
		handler: createEntityHandler(questNpcs, schemas.questNpcSchema, "quest-NPC"),
	},

	// Quest Location association
	manage_quest_location: {
		description: createEntityActionDescription("quest-location"),
		inputSchema: zodToMCP(schemas.questLocationSchema, {
			id: "The ID of the association to update (omit to create new)",
			questId: "The ID of the quest to manage with a location",
			locationId: "The ID of the location where quest activities take place",
			description: "Details of what quest-related events occur at this location",
			stage: "Optional quest stage number when this location becomes relevant",
		}),
		handler: createEntityHandler(questLocations, schemas.questLocationSchema, "quest-location"),
	},

	// Quest Faction association
	manage_quest_faction: {
		description: createEntityActionDescription("quest-faction"),
		inputSchema: zodToMCP(schemas.questFactionSchema, {
			id: "The ID of the association to update (omit to create new)",
			questId: "The ID of the quest to manage with a faction",
			factionId: "The ID of the faction involved in the quest",
			role: "How the faction is involved in the quest (e.g., sponsor, antagonist, affected party)",
			interest: "Why the faction is interested in the quest's outcome",
		}),
		handler: createEntityHandler(questFactions, schemas.questFactionSchema, "quest-faction"),
	},

	// Quest Clue association
	manage_quest_clue: {
		description: createEntityActionDescription("quest-clue"),
		inputSchema: zodToMCP(schemas.questClueSchema, {
			id: "The ID of the association to update (omit to create new)",
			questId: "The ID of the quest this clue belongs to",
			description: "The content and details of the clue",
			locationId: "Optional ID of the location where this clue can be found",
			npcId: "Optional ID of the NPC who possesses this clue",
			discoveryCondition: "Circumstances required for players to discover this clue",
			pointsTo: "What aspect of the quest this clue reveals or hints at",
		}),
		handler: createEntityHandler(questClues, schemas.questClueSchema, "quest-clue"),
	},

	// NPC Significant Item association
	manage_npc_significant_item: {
		description: createEntityActionDescription("NPC-item"),
		inputSchema: zodToMCP(schemas.npcSignificantItemSchema, {
			id: "The ID of the association to update (omit to create new)",
			npcId: "The ID of the NPC who possesses the item",
			name: "The name of the significant item",
			description: "Physical description and properties of the item",
			type: "The type of item (weapon, artifact, heirloom, etc.)",
			significance: "Why this item is important to the NPC or plot",
			questId: "Optional ID of a quest this item is relevant to",
		}),
		handler: createEntityHandler(npcSignificantItems, schemas.npcSignificantItemSchema, "NPC-item"),
	},
}
