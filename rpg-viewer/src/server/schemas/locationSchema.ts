import { z } from "zod";

// Schema for NPCs associated with a location, district, or area
const LocationNPCSchema = z.array(z.string());

// Schema for features of a district or area
const LocationFeaturesSchema = z.array(z.string());

// Schema for encounters that can happen in an area
const EncounterSchema = z.array(z.string());

// Schema for treasures that can be found in an area
const TreasureSchema = z.array(z.string());

// Schema for quest rewards
const QuestRewardsSchema = z.array(z.string());

// Schema for a single quest associated with a location
const LocationQuestSchema = z
  .object({
    title: z.string(),
    quest_giver: z.string(),
    description: z.string(),
    rewards: QuestRewardsSchema,
  })
  .passthrough();

// Schema for quests associated with a location
const LocationQuestsSchema = z.record(LocationQuestSchema);

// Schema for an area within a location (like a crater_rim or impact_zone)
const LocationAreaSchema = z
  .object({
    description: z.string(),
    features: LocationFeaturesSchema.optional(),
    encounters: EncounterSchema.optional(),
    treasure: TreasureSchema.optional(),
    npcs: LocationNPCSchema.optional(),
  })
  .passthrough();

// Schema for areas in a location
const LocationAreasSchema = z.record(LocationAreaSchema);

// Schema for a district within a location (like market_district or residential_district)
const LocationDistrictSchema = z
  .object({
    description: z.string(),
    features: LocationFeaturesSchema.optional(),
    npcs: LocationNPCSchema.optional(),
  })
  .passthrough();

// Schema for districts in a location
const LocationDistrictsSchema = z.record(LocationDistrictSchema);

// Schema for a single location
export const LocationSchema = z
  .object({
    type: z.string(),
    description: z.string(),
    districts: LocationDistrictsSchema.optional(),
    areas: LocationAreasSchema.optional(),
    quests: LocationQuestsSchema.optional(),
  })
  .passthrough();

// Schema for the entire locations file
export const LocationsFileSchema = z
  .object({
    title: z.string(),
    version: z.string(),
    locations: z.record(LocationSchema),
  })
  .passthrough();

// Type for a single location with its ID
export type Location = z.infer<typeof LocationSchema> & {
  id: string;
  name: string;
};

// Type for location data returned by the API
export type LocationsData = {
  title: string;
  version: string;
  locations: Location[];
};
