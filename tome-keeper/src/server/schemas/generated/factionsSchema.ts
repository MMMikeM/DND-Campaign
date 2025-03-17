import { z } from "zod";

/**Schema for faction definition files in the Shattered Spire campaign*/
export const FactionsFileSchema = z.object({ 
/**The title of the faction collection*/
"title": z.string().describe("The title of the faction collection"), 
/**Version number of the faction file*/
"version": z.string().describe("Version number of the faction file"), 
/**Description of the faction collection*/
"description": z.string().describe("Description of the faction collection"), 
/**Map of faction objects keyed by faction ID*/
"factions": z.record(z.object({ 
/**Name of the faction*/
"name": z.string().describe("Name of the faction").optional(), 
/**Type of faction (guild, government, criminal, etc.)*/
"type": z.string().describe("Type of faction (guild, government, criminal, etc.)"), 
/**General alignment of the faction*/
"alignment": z.string().describe("General alignment of the faction").optional(), 
/**Description of the faction*/
"description": z.string().describe("Description of the faction").optional(), 
/**Publicly stated goal of the faction*/
"public_goal": z.string().describe("Publicly stated goal of the faction").optional(), 
/**Hidden true goal of the faction*/
"true_goal": z.string().describe("Hidden true goal of the faction").optional(), 
/**Primary base of operations*/
"headquarters": z.string().describe("Primary base of operations").optional(), 
/**Areas controlled or influenced by the faction*/
"territory": z.string().describe("Areas controlled or influenced by the faction").optional(), 
/**Historical background of the faction*/
"history": z.string().describe("Historical background of the faction").optional(), 
/**Assets and resources available to the faction*/
"resources": z.array(z.string()).describe("Assets and resources available to the faction").optional(), 
/**Simple list of leadership NPCs*/
"leaders": z.array(z.string()).describe("Simple list of leadership NPCs").optional(), 
/**Detailed leadership NPCs with roles and descriptions*/
"leadership": z.array(z.object({ 
/**Name of the leader*/
"name": z.string().describe("Name of the leader"), 
/**Role or position within the faction*/
"role": z.string().describe("Role or position within the faction").optional(), 
/**Description of the leader*/
"description": z.string().describe("Description of the leader").optional(), 
/**Hidden information about the leader*/
"secret": z.string().describe("Hidden information about the leader").optional(), 
/**Game statistics reference for the leader*/
"stats": z.string().describe("Game statistics reference for the leader").optional(), 
/**Biographical information about the leader*/
"bio": z.string().describe("Biographical information about the leader").optional() })).describe("Detailed leadership NPCs with roles and descriptions").optional(), 
/**Faction members or member types*/
"members": z.array(z.object({ 
/**Name of the member or member type*/
"name": z.string().describe("Name of the member or member type"), 
/**Description of the member or member type*/
"description": z.string().describe("Description of the member or member type").optional(), 
/**Game statistics reference for the member*/
"stats": z.string().describe("Game statistics reference for the member").optional() })).describe("Faction members or member types").optional(), 
/**Other factions or groups that are allies*/
"allies": z.array(z.string()).describe("Other factions or groups that are allies").optional(), 
/**Other factions or groups that are enemies*/
"enemies": z.array(z.string()).describe("Other factions or groups that are enemies").optional(), 
/**Quests associated with this faction*/
"quests": z.array(z.string()).describe("Quests associated with this faction").optional(), 
/**Additional notes about the faction*/
"notes": z.string().describe("Additional notes about the faction").optional() }).strict()).describe("Map of faction objects keyed by faction ID"), 
/**Key individual NPCs not directly tied to factions*/
"key_npcs": z.record(z.object({ 
/**Role or occupation of the NPC*/
"role": z.string().describe("Role or occupation of the NPC").optional(), 
/**Primary location of the NPC*/
"location": z.string().describe("Primary location of the NPC").optional(), 
/**Description of the NPC*/
"description": z.string().describe("Description of the NPC").optional(), 
/**Primary motivation or goals of the NPC*/
"motivation": z.string().describe("Primary motivation or goals of the NPC").optional(), 
/**Hidden information about the NPC*/
"secret": z.string().describe("Hidden information about the NPC").optional(), 
/**Game statistics reference for the NPC*/
"stats": z.string().describe("Game statistics reference for the NPC").optional(), 
/**Relationships with other entities*/
"relationships": z.array(z.string()).describe("Relationships with other entities").optional(), 
/**Quests associated with this NPC*/
"quests": z.array(z.string()).describe("Quests associated with this NPC").optional() })).describe("Key individual NPCs not directly tied to factions").optional() }).strict().describe("Schema for faction definition files in the Shattered Spire campaign")

// Export TypeScript type
export type FactionsFile = z.infer<typeof FactionsFileSchema>;