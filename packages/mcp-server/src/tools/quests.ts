import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { quests, npcs } from "@tome-keeper/shared";
import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import zodToMCP from "src/zodToMcp.js";

type ToolNames = "mcp_dnd_create_quest" | "mcp_dnd_get_quest" | "mcp_dnd_create_npc" | "associate_npc_quest" | "get_quest_npcs" | "mcp_dnd_update_quest";

export const questTools: Array<Tool & {name: ToolNames}> = [{
      name: "mcp_dnd_create_quest",
      description: "Create a new quest",
      inputSchema: zodToMCP(createInsertSchema(quests)),
    },
    {
      name: "mcp_dnd_get_quest",
      description: "Get a quest by ID",
      inputSchema: {
        type: "object",
        properties: {
          id: { type: "number" },
        },
        required: ["id"],
      },
    },
    {
      name: "mcp_dnd_create_npc",
      description: "Create a new NPC",
      inputSchema: zodToMCP(createInsertSchema(npcs)),
    },
    {
      name: "associate_npc_quest",
      description: "Associate an NPC with a quest",
      inputSchema: {
        type: "object",
        properties: {
          npcId: { type: "number" },
          questId: { type: "number" },
        },
        required: ["npcId", "questId"],
      },
    },
    {
      name: "get_quest_npcs",
      description: "Get all NPCs associated with a quest",
      inputSchema: {
        type: "object",
        properties: {
          questId: { type: "number" },
        },
        required: ["questId"],
      },
    },
    {
      name: "mcp_dnd_update_quest",
      description: "Update an existing quest",
      inputSchema: zodToMCP(createUpdateSchema(quests))}]
