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
"race": z.string().describe("Race of the NPC"), 
/**Gender of the NPC*/
"gender": z.string().describe("Gender of the NPC"), 
/**Primary occupation of the NPC*/
"occupation": z.string().describe("Primary occupation of the NPC"), 
/**Role or position of the NPC*/
"role": z.string().describe("Role or position of the NPC").optional(), 
/**Physical description and personality of the NPC*/
"description": z.array(z.string()).describe("Physical description and personality of the NPC"), 
/**A quirky or unusual trait of the NPC*/
"quirk": z.string().describe("A quirky or unusual trait of the NPC").optional(), 
/**Personality traits of the NPC*/
"personality": z.array(z.string()).describe("Personality traits of the NPC"), 
/**Background story of the NPC*/
"background": z.string().describe("Background story of the NPC"), 
/**What motivates this NPC*/
"motivation": z.string().describe("What motivates this NPC"), 
/**Secret information about the NPC*/
"secret": z.string().describe("Secret information about the NPC"), 
/**Game statistics for the NPC*/
"stats": z.string().describe("Game statistics for the NPC"), 
/**Quests associated with this NPC*/
"quests": z.array(z.object({ 
/**ID of the quest*/
"id": z.string().describe("ID of the quest"), 
/**Description of the quest relationship*/
"description": z.string().describe("Description of the quest relationship") })).describe("Quests associated with this NPC").optional(), 
/**Relationships with other characters or factions*/
"relationships": z.array(z.object({ 
/**ID of the related character or faction*/
"id": z.string().describe("ID of the related character or faction"), 
/**Description of the relationship*/
"description": z.string().describe("Description of the relationship") })).describe("Relationships with other characters or factions").optional(), 
/**Locations where the NPC can be found*/
"location": z.array(z.object({ 
/**ID of the location*/
"id": z.string().describe("ID of the location"), 
/**Description of the NPC's presence at this location*/
"description": z.string().describe("Description of the NPC's presence at this location") })).describe("Locations where the NPC can be found").optional(), 
/**Items in the NPC's inventory*/
"inventory": z.array(z.string()).describe("Items in the NPC's inventory").optional() }).catchall(z.any())).describe("Array of NPC objects"), 
/**Generic NPCs for general use*/
"generic_npcs": z.any().describe("Generic NPCs for general use").optional() }).strict().describe("Schema for NPC definition files in the Shattered Spire campaign")

// Export TypeScript type
export type NpcsFile = z.infer<typeof NpcsFileSchema>;