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
"locations": z.record(z.object({ 
/**Name of the location (optional, as the key is often used as the identifier)*/
"name": z.string().describe("Name of the location (optional, as the key is often used as the identifier)").optional(), 
/**Type of location (city, dungeon, wilderness, etc.)*/
"type": z.string().describe("Type of location (city, dungeon, wilderness, etc.)"), 
/**Region where the location is situated*/
"region": z.string().describe("Region where the location is situated").optional(), 
/**General description of the location*/
"description": z.string().describe("General description of the location"), 
/**Historical background of the location*/
"history": z.string().describe("Historical background of the location").optional(), 
/**Distinctive features of the location*/
"notable_features": z.array(z.string()).describe("Distinctive features of the location").optional(), 
/**NPCs associated with this location*/
"npcs": z.array(z.string()).describe("NPCs associated with this location").optional(), 
/**Factions with influence in this location*/
"factions": z.array(z.string()).describe("Factions with influence in this location").optional(), 
/**Specific places of interest within this location*/
"points_of_interest": z.array(z.object({ 
/**Name of the point of interest*/
"name": z.string().describe("Name of the point of interest").optional(), 
/**Description of the point of interest*/
"description": z.string().describe("Description of the point of interest").optional() })).describe("Specific places of interest within this location").optional(), 
/**Danger level of the location*/
"danger_level": z.string().describe("Danger level of the location").optional(), 
/**ID of the faction controlling this location*/
"faction_control": z.string().describe("ID of the faction controlling this location").optional(), 
/**IDs of other locations this location connects to*/
"connections": z.array(z.string()).describe("IDs of other locations this location connects to").optional(), 
/**Districts within this location*/
"districts": z.record(z.object({ 
/**Description of the district*/
"description": z.string().describe("Description of the district").optional(), 
/**Notable features in this district*/
"features": z.array(z.string()).describe("Notable features in this district").optional(), 
/**NPCs found in this district*/
"npcs": z.array(z.string()).describe("NPCs found in this district").optional() })).describe("Districts within this location").optional(), 
/**Areas within this location*/
"areas": z.record(z.object({ 
/**Description of the area*/
"description": z.string().describe("Description of the area").optional(), 
/**Notable features in this area*/
"features": z.array(z.string()).describe("Notable features in this area").optional(), 
/**Possible encounters in this area*/
"encounters": z.array(z.string()).describe("Possible encounters in this area").optional(), 
/**Treasures found in this area*/
"treasure": z.array(z.string()).describe("Treasures found in this area").optional(), 
/**NPCs found in this area*/
"npcs": z.array(z.string()).describe("NPCs found in this area").optional() })).describe("Areas within this location").optional(), 
/**Quests associated with this location*/
"quests": z.record(z.object({ 
/**Title of the quest*/
"title": z.string().describe("Title of the quest").optional(), 
/**NPC who gives the quest*/
"quest_giver": z.string().describe("NPC who gives the quest").optional(), 
/**Unique ID for the quest*/
"quest_id": z.string().describe("Unique ID for the quest").optional(), 
/**Description of the quest*/
"description": z.string().describe("Description of the quest").optional(), 
/**Rewards for completing the quest*/
"rewards": z.array(z.string()).describe("Rewards for completing the quest").optional(), 
/**Locations related to this quest*/
"related_locations": z.array(z.string()).describe("Locations related to this quest").optional(), 
/**Quests that must be completed first*/
"prerequisites": z.array(z.string()).describe("Quests that must be completed first").optional(), 
/**Quests that can be triggered after completion*/
"follow_ups": z.array(z.string()).describe("Quests that can be triggered after completion").optional() })).describe("Quests associated with this location").optional() }).catchall(z.any())).describe("Map of location objects keyed by location ID") }).strict().describe("Schema for location definition files in the Shattered Spire campaign")

// Export TypeScript type
export type LocationsFile = z.infer<typeof LocationsFileSchema>;