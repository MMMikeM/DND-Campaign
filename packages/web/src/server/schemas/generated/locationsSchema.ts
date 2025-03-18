import { z } from "zod";

/**Schema for location definition files in the Shattered Spire campaign*/
export const LocationsFileSchema = z.object({ 
/**The title of the location collection*/
"title": z.string().describe("The title of the location collection"), 
/**Version number of the location file*/
"version": z.string().describe("Version number of the location file"), 
/**Description of the location collection*/
"description": z.string().describe("Description of the location collection").optional(), 
/**Map of location objects keyed by location ID*/
"locations": z.object({}).describe("Map of location objects keyed by location ID") }).describe("Schema for location definition files in the Shattered Spire campaign")

// Export TypeScript type
export type LocationsFile = z.infer<typeof LocationsFileSchema>;