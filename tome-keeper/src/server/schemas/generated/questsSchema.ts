import { z } from "zod";

/**Schema for quest definition files in the Shattered Spire campaign*/
export const QuestsFileSchema = z.object({ 
/**The title of the quest collection*/
"title": z.string().describe("The title of the quest collection"), 
/**Version number of the quest file*/
"version": z.string().describe("Version number of the quest file"), 
/**Description of the quest collection*/
"description": z.string().describe("Description of the quest collection"), 
/**Category of the quests in this file (Main, Side, Faction, Personal, or Generic)*/
"category": z.enum(["Main Quests","Side Quests","Faction Quests","Personal Quests","Generic Quests"]).describe("Category of the quests in this file (Main, Side, Faction, Personal, or Generic)"), 
/**Array of quest objects*/
"quests": z.array(z.object({ 
/**Unique identifier for the quest*/
"id": z.string().regex(new RegExp("^[A-Z]{2}[0-9]{3}$")).describe("Unique identifier for the quest"), 
/**Title of the quest*/
"title": z.string().describe("Title of the quest"), 
/**NPCs associated with this quest*/
"associated_npc": z.array(z.string()).describe("NPCs associated with this quest").optional(), 
/**Type of quest (e.g., Delivery, Escort, Investigation)*/
"type": z.string().describe("Type of quest (e.g., Delivery, Escort, Investigation)"), 
/**Difficulty level of the quest*/
"difficulty": z.enum(["Easy","Medium","Hard","Very Hard","Legendary"]).describe("Difficulty level of the quest"), 
/**Detailed description of the quest*/
"description": z.string().describe("Detailed description of the quest"), 
/**Whether this quest can be adapted to different settings*/
"adaptable": z.boolean().describe("Whether this quest can be adapted to different settings").optional() }).catchall(z.any())).describe("Array of quest objects") }).strict().describe("Schema for quest definition files in the Shattered Spire campaign")

// Export TypeScript type
export type QuestsFile = z.infer<typeof QuestsFileSchema>;