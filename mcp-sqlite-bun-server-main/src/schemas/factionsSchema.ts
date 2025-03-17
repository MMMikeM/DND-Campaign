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
"factions": z.object({}).describe("Map of faction objects keyed by faction ID"), 
/**Key individual NPCs not directly tied to factions*/
"key_npcs": z.object({}).describe("Key individual NPCs not directly tied to factions").optional() }).describe("Schema for faction definition files in the Shattered Spire campaign")

// Export TypeScript type
export type FactionsFile = z.infer<typeof FactionsFileSchema>;