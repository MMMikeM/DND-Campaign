import { tables } from "@tome-master/shared"
import { createInsertSchema } from "drizzle-zod"
import { z } from "zod/v4"
import { type CreateTableNames, id, type Schema } from "./tool.utils"

const {
	regionTables: { regions, areas, sites, regionConnections, siteEncounters, siteLinks, siteSecrets, enums },
} = tables

type TableNames = CreateTableNames<typeof tables.regionTables>

export const tableEnum = [
	"regions",
	"areas",
	"sites",
	"regionConnections",
	"siteLinks",
	"siteEncounters",
	"siteSecrets",
] as const satisfies TableNames

export const schemas = {
	regions: createInsertSchema(regions, {
		atmosphereType: z.enum(enums.atmosphereTypes).describe("Atmosphere type (dark, light, neutral, etc.)"),
		creativePrompts: (s) => s.describe("Adventure hooks and campaign ideas for this region"),
		culturalNotes: (s) => s.describe("Traditions, customs, and social behaviors in point form"),
		dangerLevel: z.enum(enums.dangerLevels).describe("Threat assessment (safe, low, moderate, high, deadly)"),
		description: (s) => s.describe("Physical features and atmosphere in point form"),
		economy: (s) => s.describe("Industries, trade goods, and economic activities"),
		gmNotes: (s) => s.describe("GM notes for this region"),
		hazards: (s) => s.describe("Environmental dangers and risks to travelers in point form"),
		history: (s) => s.describe("Major historical events and developments"),
		name: (s) => s.describe("Distinctive name of this region"),
		pointsOfInterest: (s) => s.describe("Landmarks and notable locations not detailed as full sites"),
		population: (s) => s.describe("Approximate inhabitants and demographic makeup"),
		revelationLayersSummary: (s) => s.describe("Summary of revelation layers for this region"),
		rumors: (s) => s.describe("Gossip and stories circulating among locals and travelers"),
		secrets: (s) => s.describe("Hidden truths and undiscovered elements known to few"),
		security: (s) => s.describe("Military presence, law enforcement, and safety measures"),
		tags: (s) => s.describe("Tags for this region"),
		type: z.enum(enums.regionTypes).describe("Classification (city, forest, mountain, desert, etc.)"),
	})
		.omit({ id: true, embeddingId: true })
		.strict()
		.describe("Major geographic areas that provide settings for adventures and define the campaign world"),

	areas: createInsertSchema(areas, {
		atmosphereType: z.enum(enums.atmosphereTypes).describe("Atmosphere type (dark, light, neutral, etc.)"),
		creativePrompts: (s) => s.describe("Adventure hooks and campaign ideas for this area"),
		culturalNotes: (s) => s.describe("Traditions, customs, and social behaviors in point form"),
		dangerLevel: (s) => s.describe("Threat assessment (safe, low, moderate, high, deadly)"),
		defenses: (s) => s.describe("Defensive structures and security measures"),
		description: (s) => s.describe("Physical features and atmosphere in point form"),
		gmNotes: (s) => s.describe("GM notes for this area"),
		hazards: (s) => s.describe("Environmental dangers and risks to travelers in point form"),
		leadership: (s) => s.describe("Rulers, authorities, or influential figures"),
		name: (s) => s.describe("Specific name of this area"),
		pointsOfInterest: (s) => s.describe("Landmarks and notable locations not detailed as full sites"),
		population: (s) => s.describe("Approximate inhabitants and demographic makeup"),
		primaryActivity: (s) => s.describe("Primary activity or focus of the area"),
		regionId: id.describe("Required ID of region this area belongs to"),
		revelationLayersSummary: (s) => s.describe("Summary of revelation layers for this area"),
		rumors: (s) => s.describe("Gossip and stories circulating among locals and travelers"),
		tags: (s) => s.describe("Tags for this area"),
		type: z.enum(enums.areaTypes).describe("Classification (city, forest, mountain, desert, etc.)"),
	})
		.omit({ id: true, embeddingId: true })
		.strict()
		.describe("Subdivisions within regions that have distinct identities and adventure opportunities"),

	sites: createInsertSchema(sites, {
		areaId: id.describe("Required ID of area this site is located within"),
		battlemapImage: (s) =>
			s.describe(
				"REQUIRED: Battlemap image data for this site (base64 encoded binary data). Sites represent tactical combat locations and must include a battlemap image.",
			),
		chokePoints: (s) => s.describe("Choke points for this site"),
		climate: (s) => s.describe("Weather patterns (temperate, tropical, arid, etc.)"),
		coverOptions: (s) => s.describe("Cover options for this site"),
		creativePrompts: (s) => s.describe("Scene ideas and narrative opportunities"),
		creatures: (s) => s.describe("Inhabitants, wildlife, and monsters found here"),
		description: (s) => s.describe("Visual details and layout in point form"),
		descriptors: (s) => s.describe("Evocative adjectives for quick reference"),
		difficultTerrain: (s) => s.describe("Difficult terrain for this site"),
		elevationFeatures: (s) => s.describe("Elevation features for this site"),
		environment: (s) => s.describe("Setting context (urban, rural, wilderness, underground)"),
		environmentalHazards: (s) => s.describe("Environmental hazards for this site"),
		features: (s) => s.describe("Notable objects and distinct elements"),
		gmNotes: (s) => s.describe("GM notes for this site"),
		imageFormat: z
			.enum(enums.imageFormats)
			.describe("REQUIRED: Image format (png, jpg, webp) - must match the battlemap image format"),
		imageHeight: (s) =>
			s.describe("REQUIRED: Image height in pixels - must be provided when uploading battlemap image"),
		imageSize: (s) => s.describe("REQUIRED: Image size in bytes - must be provided when uploading battlemap image"),
		imageWidth: (s) => s.describe("REQUIRED: Image width in pixels - must be provided when uploading battlemap image"),
		intendedSiteFunction: z.enum(enums.siteFunctions).describe("Function of this site"),
		interactiveElements: (s) => s.describe("Interactive elements for this site"),
		lightingDescription: (s) => s.describe("Illumination quality and sources"),
		mood: (s) => s.describe("Emotional atmosphere (peaceful, tense, eerie, vibrant)"),
		movementRoutes: (s) => s.describe("Movement routes for this site"),
		name: (s) => s.describe("Specific name of this location"),
		sightLines: (s) => s.describe("Sight lines for this site"),
		siteType: z.enum(enums.siteTypes).describe("Category (building, fortress, cave, ruins, etc.)"),
		smells: (s) => s.describe("Distinctive odors and scents"),
		soundscape: (s) => s.describe("Characteristic sounds and acoustic elements"),
		tacticalPositions: (s) => s.describe("Tactical positions for this site"),
		tags: (s) => s.describe("Tags for this site"),
		terrain: (s) => s.describe("Physical landscape (rocky, forested, marshy, etc.)"),
		treasures: (s) => s.describe("Valuables and collectibles that might be found"),
		weather: (s) => s.describe("Typical meteorological conditions and effects"),
	})
		.omit({ id: true, embeddingId: true })
		.strict()
		.refine((data) => {
			const missing = []
			if (!data.battlemapImage) missing.push("battlemapImage (base64 encoded image data)")
			if (!data.imageFormat) missing.push("imageFormat (png/jpg/webp)")
			if (!data.imageSize) missing.push("imageSize (bytes)")
			if (!data.imageWidth) missing.push("imageWidth (pixels)")
			if (!data.imageHeight) missing.push("imageHeight (pixels)")

			return {
				message: `Sites represent tactical battlemap locations and MUST include all image fields. Missing: ${missing.join(", ")}. All sites require a complete battlemap image with metadata for tactical combat.`,
			}
		})
		.describe(
			"Tactical battlemap locations where encounters and combat take place. Sites MUST include a battlemap image with complete metadata as they represent specific combat environments.",
		),

	regionConnections: createInsertSchema(regionConnections, {
		pointsOfInterest: (s) => s.describe("Points of interest for this region"),
		controllingFactionId: (s) => s.describe("ID of faction controlling this region"),
		routeType: z.enum(enums.routeTypes).describe("Route type (road, river, air, sea)"),
		travelDifficulty: z.enum(enums.travelDifficulties).describe("Travel difficulty (easy, moderate, hard)"),
		travelHazards: (s) => s.describe("Travel hazards for this region"),
		travelTime: (s) => s.describe("Travel time for this region"),
		connectionType: z.enum(enums.connectionTypes).describe("Relationship type (allied, hostile, trade, rivals)"),
		creativePrompts: (s) => s.describe("Adventure ideas involving travel or conflict"),
		description: (s) => s.describe("How these regions interact and current dynamics"),
		gmNotes: (s) => s.describe("GM notes for this connection"),
		otherRegionId: id.describe("Required ID of secondary region in this relationship"),
		regionId: id.describe("Required ID of primary region in this relationship"),
		tags: (s) => s.describe("Tags for this connection"),
	})
		.omit({ id: true })
		.strict()
		.describe("Political, economic, and geographical relationships between different regions")
		.refine((data) => data.regionId !== data.otherRegionId, {
			message: "A region cannot have a connection with itself",
			path: ["otherRegionId"],
		}),

	siteLinks: createInsertSchema(siteLinks, {
		creativePrompts: (s) => s.describe("Story ideas involving travel or interaction"),
		description: (s) => s.describe("Physical connections and proximity between sites"),
		gmNotes: (s) => s.describe("GM notes for this link"),
		linkType: z.enum(enums.linkTypes).describe("Connection type (adjacent, connected, visible from)"),
		otherSiteId: id.describe("Required ID of secondary site in this relationship"),
		siteId: id.describe("Required ID of primary site in this relationship"),
		tags: (s) => s.describe("Tags for this link"),
	})
		.omit({ id: true })
		.strict()
		.describe("Physical and narrative connections between locations that players can traverse")
		.refine((data) => data.siteId !== data.otherSiteId, {
			message: "A site cannot have a link with itself",
			path: ["otherSiteId"],
		}),

	siteEncounters: createInsertSchema(siteEncounters, {
		creativePrompts: (s) => s.describe("Variations and alternative approaches"),
		creatures: (s) => s.describe("Enemies, NPCs, or beings involved"),
		dangerLevel: z.enum(enums.dangerLevels).describe("Threat level (safe, low, moderate, high, deadly)"),
		description: (s) => s.describe("Setup and possible outcomes in point form"),
		difficulty: z.enum(enums.difficultyLevels).describe("Challenge level (easy, medium, hard)"),
		encounterType: z.enum(enums.encounterTypes).describe("Interaction type (combat, social, puzzle, trap)"),
		gmNotes: (s) => s.describe("GM notes for this encounter"),
		name: (s) => s.describe("Distinctive title for this encounter"),
		siteId: id.describe("Required ID of site where this encounter occurs"),
		tags: (s) => s.describe("Tags for this encounter"),
		treasure: (s) => s.describe("Rewards and valuable items obtainable"),
	})
		.omit({ id: true, embeddingId: true })
		.strict()
		.describe("Challenges, interactions, and events that players can experience at specific locations"),

	siteSecrets: createInsertSchema(siteSecrets, {
		consequences: (s) => s.describe("Immediate and long-term effects of discovery"),
		creativePrompts: (s) => s.describe("Ways to foreshadow or reveal this secret"),
		description: (s) => s.describe("What the secret entails and its significance in point form"),
		difficultyToDiscover: z
			.enum(enums.difficultyLevels)
			.describe("Discovery challenge (obvious through nearly impossible)"),
		discoveryMethod: (s) => s.describe("Actions or checks that could reveal this secret"),
		gmNotes: (s) => s.describe("GM notes for this secret"),
		secretType: z.enum(enums.secretTypes).describe("Category (historical, hidden area, concealed item, true purpose)"),
		siteId: id.describe("Required ID of site where this secret exists"),
		tags: (s) => s.describe("Tags for this secret"),
	})
		.omit({ id: true, embeddingId: true })
		.strict()
		.describe("Hidden information and concealed areas that reward player exploration and investigation"),
} as const satisfies Schema<TableNames[number]>
