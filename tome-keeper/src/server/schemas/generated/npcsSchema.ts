import { z } from "zod";

/**Schema for NPC definition files in the Shattered Spire campaign*/
export const NpcsFileSchema = z.object({ 
/**The title of the NPC collection*/
"title": z.string().describe("The title of the NPC collection"), 
/**Version number of the NPC file*/
"version": z.string().describe("Version number of the NPC file"), 
/**Description of the NPC collection*/
"description": z.string().describe("Description of the NPC collection"), 
/**Array of NPC objects*/
"npcs": z.array(z.object({ 
/**Unique identifier for the NPC*/
"id": z.string().describe("Unique identifier for the NPC").optional(), 
/**Name of the NPC*/
"name": z.string().describe("Name of the NPC"), 
/**Race of the NPC*/
"race": z.string().describe("Race of the NPC").optional(), 
/**Gender of the NPC*/
"gender": z.string().describe("Gender of the NPC").optional(), 
/**Primary occupation of the NPC*/
"occupation": z.string().describe("Primary occupation of the NPC").optional(), 
/**Primary role of the NPC*/
"role": z.string().describe("Role or position of the NPC").optional(), 
/**Physical description and personality of the NPC*/
"description": z.union([z.string(), z.array(z.string())]).describe("Physical description and personality of the NPC").optional(), 
/**Personality traits of the NPC*/
"personality": z.union([z.string(), z.array(z.string())]).describe("Personality traits of the NPC").optional(),
/**Background story of the NPC*/
"background": z.string().describe("Background story of the NPC").optional(), 
/**What motivates this NPC*/
"motivation": z.string().describe("What motivates this NPC").optional(), 
/**The faction this NPC belongs to*/
"faction": z.string().describe("The faction this NPC belongs to").optional(),
/**Secret information about the NPC*/
"secret": z.string().describe("Secret information about the NPC").optional(),
/**Game statistics for the NPC*/
"stats": z.string().describe("Game statistics for the NPC").optional(),
/**Quests associated with this NPC*/
"quests": z.union([z.string(), z.array(z.string())]).describe("Quests associated with this NPC").optional(),
/**Relationships with other characters or factions*/
"relationships": z.union([z.string(), z.array(z.string())]).describe("Relationships with other characters or factions").optional(),
/**Locations where the NPC can be found*/
"location": z.string().describe("Location where the NPC can be found").optional(),
/**Items in the NPC's inventory*/
"inventory": z.union([z.string(), z.array(z.string())]).describe("Items in the NPC's inventory").optional()
}).catchall(z.any())).describe("Array of NPC objects"),
/**Generic NPCs for general use*/
"generic_npcs": z.any().optional().describe("Generic NPCs for general use")
}).catchall(z.any()).describe("Schema for NPC definition files in the Shattered Spire campaign")

// Export TypeScript type
export type NpcsFile = z.infer<typeof NpcsFileSchema>;