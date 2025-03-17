import { z } from "zod";

/**Schema for quest definition files in the Shattered Spire campaign*/
export const QuestsFileSchema = z.object({ 
/**The title of the quest collection*/
"title": z.string().describe("The title of the quest collection"), 
/**Version number of the quest file*/
"version": z.string().describe("Version number of the quest file"), 
/**Description of the quest collection*/
"description": z.string().describe("Description of the quest collection"), 
/**Category of the quests in this file*/
"category": z.enum(["Main Quests","Side Quests","Faction Quests","Personal Quests","Generic Quests"]).describe("Category of the quests in this file"), 
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
/**Sequential stages of the quest*/
"quest_stages": z.array(z.object({ 
/**Stage number*/
"stage": z.number().int().describe("Stage number"), 
/**Title of this stage*/
"title": z.string().describe("Title of this stage"), 
/**List of objectives for this stage*/
"objectives": z.array(z.string()).describe("List of objectives for this stage"), 
/**Different ways to complete this stage*/
"completion_paths": z.object({}).describe("Different ways to complete this stage") })).describe("Sequential stages of the quest").optional(), 
/**Major decisions that affect quest outcome*/
"key_decision_points": z.array(z.object({ 
/**Stage where decision occurs*/
"stage": z.number().int().describe("Stage where decision occurs"), 
/**The decision to be made*/
"decision": z.string().describe("The decision to be made"), "choices": z.array(z.object({ 
/**Description of the choice*/
"choice": z.string().describe("Description of the choice"), 
/**Consequences of this choice*/
"consequences": z.string().describe("Consequences of this choice") })) })).describe("Major decisions that affect quest outcome").optional(), 
/**Possible plot twists*/
"potential_twists": z.array(z.string()).describe("Possible plot twists").optional(), 
/**Possible rewards for completing the quest*/
"rewards": z.object({ "standard": z.array(z.string()).optional() }).describe("Possible rewards for completing the quest").optional(), 
/**Quest IDs that can follow this quest*/
"follow_up_quests": z.array(z.string().regex(new RegExp("^[A-Z]{2}[0-9]{3}$"))).describe("Quest IDs that can follow this quest").optional(), 
/**Quest IDs that are related to this quest*/
"related_quests": z.array(z.string().regex(new RegExp("^[A-Z]{2}[0-9]{3}$"))).describe("Quest IDs that are related to this quest").optional(), 
/**Whether this quest can be adapted to different settings*/
"adaptable": z.boolean().describe("Whether this quest can be adapted to different settings").optional() })).describe("Array of quest objects") }).describe("Schema for quest definition files in the Shattered Spire campaign")

// Export TypeScript type
export type QuestsFile = z.infer<typeof QuestsFileSchema>;