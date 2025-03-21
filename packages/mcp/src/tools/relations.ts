import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import { locationFactions, npcFactions, npcLocations, npcQuests, questFaction, questLocations, RunResult } from "@tome-master/shared";
import { db, type ToolHandlers } from "../index";
import logger from "../logger";
import { z } from "zod";
import zodToMCP from "../zodToMcp";

type EntityType = "quest" | "npc" | "location" | "faction";

export type GetRelations = `get_${EntityType}_${EntityType}s`;


const inputSchema = (key: string) => zodToMCP(z.object({
	[key]: z.number()
}))

export const getByRelationTools: Array<Tool & { name: GetRelations }> = [
  // Quest relationships
  {
    name: "get_quest_npcs",
    description: "Get all NPCs for a quest",
    inputSchema: inputSchema("questId"),
  },
  {
    name: "get_quest_locations",
    description: "Get all locations for a quest",
    inputSchema: inputSchema("questId"),
  },
  {
    name: "get_quest_factions",
    description: "Get all factions for a quest",
    inputSchema: inputSchema("questId"),
  },
  
  // NPC relationships
  {
    name: "get_npc_quests",
    description: "Get all quests for an NPC",
    inputSchema: inputSchema("npcId"),
  },
  {
    name: "get_npc_locations",
    description: "Get all locations for an NPC",
    inputSchema: inputSchema("npcId"),
  },
  {
    name: "get_npc_factions",
    description: "Get all factions for an NPC",
    inputSchema: inputSchema("npcId"),
	},
  
  // Location relationships
  {
    name: "get_location_quests",
    description: "Get all quests for a location",
    inputSchema: inputSchema("locationId"),
  },
  {
    name: "get_location_npcs",
    description: "Get all NPCs for a location",
    inputSchema: inputSchema("locationId"),
  },
  {
    name: "get_location_factions",
    description: "Get all factions for a location",
    inputSchema: inputSchema("locationId"),
  },
  
  // Faction relationships
  {
    name: "get_faction_quests",
    description: "Get all quests for a faction",
    inputSchema: inputSchema("factionId"),
  },
  {
    name: "get_faction_npcs",
    description: "Get all NPCs for a faction",
    inputSchema: inputSchema("factionId"),
  },
  {
    name: "get_faction_locations",
    description: "Get all locations for a faction",
    inputSchema: inputSchema("factionId"),
  },
];

export const getByRelationToolHandlers: ToolHandlers<GetRelations> = {
	get_quest_npcs: async (args) => {
		const parsed = z.object({ questId: z.number() }).parse(args);
		logger.info("Getting NPCs for quest", { parsed });
		return await db.query.quests.findMany({
			with: {
				npcs: true,
			},
		});
	},

	get_quest_locations: async (args) => {
		const parsed = z.object({ questId: z.number() }).parse(args);
		logger.info("Getting locations for quest", { parsed });
		return await db.query.quests.findMany({
			with: {
				locations: true,
			},
		});
	},
	get_quest_factions: async (args) => {
		const parsed = z.object({ questId: z.number() }).parse(args);
		logger.info("Getting factions for quest", { parsed });
		return await db.query.quests.findMany({
			with: {
				factions: true,
			},
		});
	},
	get_location_npcs: async (args) => {
		const parsed = z.object({ locationId: z.number() }).parse(args);
		logger.info("Getting NPCs for location", { parsed });
		return await db.query.quests.findMany({
			with: {
				locations: true,
			},
		});
	},
	get_location_factions: async (args) => {
		const parsed = z.object({ locationId: z.number() }).parse(args);
		logger.info("Getting factions for location", { parsed });
		return await db.query.locations.findMany({
			with: {
				factions: true,
			},
		});
	},
	get_faction_npcs: async (args) => {
		const parsed = z.object({ factionId: z.number() }).parse(args);
		logger.info("Getting NPCs for faction", { parsed });
		return await db.query.factions.findMany({
			with: {
				npcs: true,
			},
		});
	},
	get_faction_locations: async (args) => {
		const parsed = z.object({ factionId: z.number() }).parse(args);
		logger.info("Getting locations for faction", { parsed });
		return await db.query.factions.findMany({
			with: {
				locations: true,
			},
		});
	},
	get_faction_quests: async (args) => {
		const parsed = z.object({ factionId: z.number() }).parse(args);
		logger.info("Getting quests for faction", { parsed });
		return await db.query.factions.findMany({
			with: {
				quests: true,
			},
		});
	},
	get_npc_quests: async (args) => {
		const parsed = z.object({ npcId: z.number() }).parse(args);
		logger.info("Getting quests for NPC", { parsed });
		return await db.query.npcs.findMany({
			with: {
				quests: true,
			},
		});
	},
	get_npc_locations: async (args) => {
		const parsed = z.object({ npcId: z.number() }).parse(args);
		logger.info("Getting locations for NPC", { parsed });
		return await db.query.npcs.findMany({
			with: {
				locations: true,
			},
		});
	},
	get_npc_factions: async (args) => {
		const parsed = z.object({ npcId: z.number() }).parse(args);
		logger.info("Getting factions for NPC", { parsed });
		return await db.query.npcs.findMany({
			with: {
				factions: true,
			},
		});
	},
	get_npc_npcs: async (args) => {
		const parsed = z.object({ npcId: z.number() }).parse(args);
		logger.info("Getting NPCs for NPC", { parsed });
		return await db.query.npcs.findMany({
			with: {
				npcs: true,
			},
		});
	},
	get_location_locations: (args) => {
		const parsed = z.object({ locationId: z.number() }).parse(args);
		logger.info("Getting locations for location", { parsed });
		return db.query.locations.findMany({
			with: {
				locations: true,
			},
		});
	},
	get_location_quests: async (args) => {
		const parsed = z.object({ locationId: z.number() }).parse(args);

		logger.info("Getting quests for location", { parsed });
		return await db.query.locations.findMany({
			with: {
				quests: true,
			},
		});
	},
	get_faction_factions: async (args) => {
		const parsed = z.object({ factionId: z.number() }).parse(args);
		logger.info("Getting factions for faction", { parsed });
		return await db.query.factions.findMany({
			with: {
				factions: true,
			},
		});
	},
	get_quest_quests: async (args) => {
		const parsed = z.object({ questId: z.number() }).parse(args);
		logger.info("Getting quests for quest", { parsed });
		return await db.query.quests.findMany({
			with: {
				quests: true,
			},
		});
	},
};

