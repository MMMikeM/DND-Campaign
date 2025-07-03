import { tables } from "@tome-master/shared"
import { createInsertSchema } from "drizzle-zod"
import { z } from "zod/v4"
import { type CreateTableNames, id, list, optionalId, type Schema } from "./utils/tool.utils"

const {
	regionTables: { regions, areas, sites, siteEncounters, siteLinks, siteSecrets, regionConnections, enums },
} = tables

const {
	dangerLevels,
	regionTypes,
	areaTypes,
	siteFunctions,
	linkTypes,
	objectiveTypes,
	difficultyLevels,
	secretTypes,
	routeTypes,
	travelDifficulties,
	connectionTypes,
} = enums

type TableNames = CreateTableNames<typeof tables.regionTables>

export const tableEnum = [
	"regions",
	"areas",
	"sites",
	"siteLinks",
	"siteEncounters",
	"siteSecrets",
] as const satisfies TableNames

export const schemas = {
	regions: createInsertSchema(regions, {
		dangerLevel: z.enum(dangerLevels).describe("Threat assessment (safe, low, moderate, high, deadly)"),
		description: list.describe("Physical features and atmosphere in point form"),
		name: (s) => s.describe("Distinctive name of this region"),
		atmosphereAndCulture: list.describe("Atmosphere and culture of this region"),
		featuresAndHazards: list.describe("Features and hazards of this region"),
		historyAndEconomy: list.describe("History and economy of this region"),
		loreAndSecrets: list.describe("Lore and secrets of this region"),
		type: z.enum(regionTypes).describe("Classification (city, forest, mountain, desert, etc.)"),
		tags: list.describe("Tags for this region"),
	})
		.omit({ id: true })
		.strict()
		.describe("Major geographic areas that provide settings for adventures and define the campaign world"),
	regionConnections: createInsertSchema(regionConnections, {
		name: (s) => s.describe("Name of this connection"),
		pointsOfInterest: list.describe("Points of interest for this region"),
		routeType: z.enum(routeTypes).describe("Route type (road, river, air, sea)"),
		travelDifficulty: z.enum(travelDifficulties).describe("Travel difficulty (easy, moderate, hard)"),
		travelHazards: list.describe("Travel hazards for this region"),
		travelTime: (s) => s.describe("Travel time for this region"),
		connectionType: z.enum(connectionTypes).describe("Relationship type (allied, hostile, trade, rivals)"),
		creativePrompts: list.describe("Adventure ideas involving travel or conflict"),
		description: list.describe("How these regions interact and current dynamics"),
		sourceRegionId: id.describe("Required ID of primary region in this relationship"),
		targetRegionId: id.describe("Required ID of secondary region in this relationship"),
		tags: list.describe("Tags for this connection"),
	})
		.omit({ id: true })
		.strict()
		.describe("Political, economic, and geographical relationships between different regions"),

	areas: createInsertSchema(areas, {
		name: (s) => s.describe("Specific name of this area"),
		description: list.describe("Physical features and atmosphere in point form"),
		featuresAndHazards: list.describe("Features and hazards of this area"),
		loreAndSecrets: list.describe("Lore and secrets of this area"),
		regionId: id.describe("Required ID of region this area belongs to"),
		tags: list.describe("Tags for this area"),
		cultureAndLeadership: list.describe("Culture and leadership of this area"),
		type: z.enum(areaTypes).describe("Classification (city, forest, mountain, desert, etc.)"),
	})
		.omit({ id: true })
		.strict()
		.describe("Subdivisions within regions that have distinct identities and adventure opportunities"),

	sites: createInsertSchema(sites, {
		areaId: id.describe("Required ID of area this site is located within"),
		mapGroupId: id.describe("Required ID of the map variant this site is associated with"),
		creativePrompts: list.describe("Scene ideas and narrative opportunities"),
		description: list.describe("Visual details and layout in point form"),
		intendedSiteFunction: z.enum(siteFunctions).describe("Function of this site"),
		name: (s) => s.describe("Specific name of this location"),
		tags: list.describe("Tags for this site"),
	})
		.omit({ id: true })
		.strict()
		.describe(
			"Tactical locations where encounters and combat take place. Each site must be linked to a pre-existing map.",
		),

	siteLinks: createInsertSchema(siteLinks, {
		creativePrompts: list.describe("Story ideas involving travel or interaction"),
		description: list.describe("Physical connections and proximity between sites"),
		linkType: z.enum(linkTypes).describe("Connection type (adjacent, connected, visible from)"),
		targetSiteId: id.describe("Required ID of secondary site in this relationship"),
		sourceSiteId: id.describe("Required ID of primary site in this relationship"),
		tags: list.describe("Tags for this link"),
	})
		.omit({ id: true })
		.strict()
		.describe("Physical and narrative connections between locations that players can traverse")
		.refine((data) => data.sourceSiteId !== data.targetSiteId, {
			message: "A site cannot have a link with itself",
			path: ["targetSiteId"],
		}),

	siteEncounters: createInsertSchema(siteEncounters, {
		name: (s) => s.describe("Distinctive title for this encounter"),
		siteId: id.describe("Required ID of site where this encounter occurs"),
		mapVariantId: optionalId.describe("Optional ID of map variant where this encounter occurs"),

		encounterVibe: list.describe("Vibe of this encounter"),
		creativePrompts: list.describe("Variations and alternative approaches"),
		tags: list.describe("Tags for this encounter"),

		objectiveType: z.enum(objectiveTypes).describe("Type of objective for this encounter"),
		objectiveDetails: (s) => s.describe("Details of the objective for this encounter"),

		specialVariations: list.describe("Special variations for this encounter"),
		nonCombatOptions: list.describe("Non-combat options for this encounter"),

		encounterSpecificEnvironmentNotes: (s) => s.describe("Specific environment notes for this encounter"),
		interactiveElements: list.describe("Interactive elements for this encounter"),

		treasureOrRewards: list.describe("Treasure or rewards for this encounter"),
	})
		.omit({ id: true })
		.strict()
		.describe("Challenges, interactions, and events that players can experience at specific locations"),

	siteSecrets: createInsertSchema(siteSecrets, {
		siteId: id.describe("Required ID of site where this secret exists"),
		difficultyToDiscover: z.enum(difficultyLevels).describe("Discovery challenge (obvious through nearly impossible)"),
		discoveryMethod: list.describe("Actions or checks that could reveal this secret"),
		secretType: z.enum(secretTypes).describe("Category (historical, hidden area, concealed item, true purpose)"),
	})
		.omit({ id: true })
		.strict()
		.describe("Hidden information and concealed areas that reward player exploration and investigation"),
} as const satisfies Schema<TableNames[number]>
