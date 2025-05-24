import { tables } from "@tome-master/shared"
import { createInsertSchema } from "drizzle-zod"
import { z } from "zod/v4"
import { type CreateTableNames, id, optionalId, type Schema } from "./tool.utils"

const {
	associationTables: {
		clues,
		items,
		factionQuestInvolvement,
		npcQuestRoles,
		factionTerritorialControl,
		questHookNpcs,
		questIntroductions,
		regionConnectionDetails,
		enums,
	},
} = tables

export type TableNames = CreateTableNames<typeof tables.associationTables>

export const tableEnum = [
	"clues",
	"factionQuestInvolvement",
	"factionTerritorialControl",
	"items",
	"npcQuestRoles",
	"questHookNpcs",
	"questIntroductions",
	"regionConnectionDetails",
] as const satisfies TableNames

export const schemas = {
	clues: createInsertSchema(clues, {
		id: id.describe("ID of clue to update"),
		factionId: optionalId.describe("ID of faction connected to this clue"),
		siteId: optionalId.describe("ID of site where players can find this clue"),
		npcId: optionalId.describe("ID of NPC who provides this clue"),
		questStageId: id.describe("ID of quest stage where this clue is relevant"),
		description: (s) => s.describe("Visual and contextual details of the clue in point form"),
		reveals: (s) => s.describe("Key information this clue provides when discovered"),
		discoveryCondition: (s) => s.describe("How players can find this clue (skill checks, actions, etc.)"),
		creativePrompts: (s) => s.describe("GM ideas for presenting and integrating this clue"),
	})
		.omit({ id: true })
		.strict()
		.describe("Discoverable evidence that reveals plot information and advances quest objectives"),

	factionQuestInvolvement: createInsertSchema(factionQuestInvolvement, {
		id: id.describe("ID of relationship to update"),
		factionId: id.describe("ID of faction with stake in this quest"),
		questId: id.describe("ID of quest the faction is involved with"),
		interest: (s) => s.describe("Faction's goals and reasons for involvement in point form"),
		role: z
			.enum(enums.factionRoles)
			.describe("Faction's role (quest-giver, antagonist, ally, target, beneficiary, etc.)"),
		creativePrompts: (s) => s.describe("GM ideas for integrating faction actions into quest narrative"),
	})
		.omit({ id: true })
		.strict()
		.describe("Links factions to quests, defining their motivations, roles, and narrative potential"),

	items: createInsertSchema(items, {
		id: id.describe("ID of item to update"),
		siteId: optionalId.describe("ID of site where this item can be found"),
		questId: optionalId.describe("ID of quest this item is important to"),
		factionId: optionalId.describe("ID of faction that values or controls this item"),
		npcId: optionalId.describe("ID of NPC who possesses or seeks this item"),
		stageId: optionalId.describe("ID of quest stage where this item becomes relevant"),
		description: (s) => s.describe("Physical attributes, history, and properties in point form"),
		creativePrompts: (s) => s.describe("GM ideas for using this item as a narrative element"),
		name: (s) => s.describe("Distinctive name or title of the item"),
		type: (s) => s.describe("Item category (weapon, armor, artifact, key item, tool, etc.)"),
		significance: (s) => s.describe("Item's importance to the plot or world lore"),
	})
		.omit({ id: true })
		.strict()
		.describe("Interactive objects that players can acquire, use, and leverage in the narrative"),

	npcQuestRoles: createInsertSchema(npcQuestRoles, {
		id: id.describe("ID of role to update"),
		npcId: id.describe("ID of NPC involved in the quest"),
		questId: id.describe("ID of quest the NPC participates in"),
		creativePrompts: (s) => s.describe("GM ideas for portraying this NPC within the quest"),
		description: (s) => s.describe("NPC's quest-specific behavior and appearance in point form"),
		dramaticMoments: (s) => s.describe("Key scenes where this NPC influences the quest"),
		hiddenAspects: (s) => s.describe("NPC's secret motives or knowledge in this quest"),
		importance: z.enum(enums.importanceLevels).describe("NPC's significance (minor, supporting, major, critical)"),
		role: z.enum(enums.npcRoles).describe("NPC's function (quest-giver, ally, villain, informant, etc.)"),
	})
		.omit({ id: true })
		.strict()
		.describe("Defines how NPCs participate in quests, their narrative functions, and dramatic potential"),

	factionTerritorialControl: createInsertSchema(factionTerritorialControl, {
		id: id.describe("ID of power record to update"),
		factionId: id.describe("ID of faction exerting influence"),
		regionId: optionalId.describe("ID of region where influence is exerted"),
		areaId: optionalId.describe("ID of area where influence is exerted"),
		siteId: optionalId.describe("ID of site where influence is exerted"),
		description: (s) => s.describe("How the faction exercises power in this location in point form"),
		creativePrompts: (s) => s.describe("GM ideas for demonstrating faction influence in gameplay"),
		influenceLevel: (s) => s.describe("Extent of control (minor, moderate, strong, dominant)"),
		presence: (s) => s.describe("Visibility and activity in the area"),
		priorities: (s) => s.describe("Goals and interests in this location"),
	})
		.omit({ id: true })
		.strict()
		.describe("Maps faction influence across locations, creating power dynamics that affect player actions"),

	questHookNpcs: createInsertSchema(questHookNpcs, {
		id: id.describe("ID of relationship to update"),
		npcId: id.describe("ID of NPC who presents the quest hook"),
		hookId: id.describe("ID of quest hook this NPC delivers"),
		dialogueHint: (s) => s.describe("Example conversation that introduces the quest"),
		relationship: (s) => s.describe("NPC's connection to the quest (witness, messenger, victim, etc.)"),
		trustRequired: (s) => s.describe("Trust players need from NPC (none, low, medium, high)"),
	})
		.omit({ id: true })
		.strict()
		.describe("Links NPCs to quest hooks, defining how characters introduce adventures to players"),

	questIntroductions: createInsertSchema(questIntroductions, {
		id: id.describe("ID of hook to update"),
		stageId: id.describe("ID of quest stage this hook initiates"),
		factionId: optionalId.describe("ID of faction connected to this hook"),
		siteId: optionalId.describe("ID of site where this hook can be encountered"),
		itemId: optionalId.describe("ID of item that serves as or connects to this hook"),
		description: (s) => s.describe("How players encounter this quest hook in point form"),
		creativePrompts: (s) => s.describe("GM ideas for naturally introducing this hook"),
		discoveryCondition: (s) => s.describe("Circumstances needed for players to encounter this hook"),
		hookContent: (s) => s.describe("Essential information conveyed by this hook"),
		introductionType: z
			.enum(enums.introductionTypes)
			.describe("Method of delivery (rumor, npc_interaction, site_discovery)"),
		presentationStyle: z
			.enum(enums.presentationStyles)
			.describe("Tone and approach (subtle, clear, urgent, mysterious)"),
		source: (s) => s.describe("Origin (tavern gossip, notice board, messenger, found object, etc.)"),
	})
		.omit({ id: true })
		.strict()
		.describe("Entry points that draw players into quests through rumors, encounters, or discoveries"),

	regionConnectionDetails: createInsertSchema(regionConnectionDetails, {
		relationId: id.describe("ID of region relation this route connects"),
		description: (s) => s.describe("Physical features and atmosphere of the route in point form"),
		creativePrompts: (s) => s.describe("GM ideas for travel encounters and challenges"),
		travelHazards: (s) => s.describe("Dangers and obstacles faced during travel"),
		pointsOfInterest: (s) => s.describe("Notable landmarks or features along the route"),
		controllingFaction: (s) => s.optional().describe("ID of faction that controls this route"),
		routeType: (s) => s.describe("Path type (road, river, mountain pass, sea route, portal, etc.)"),
		travelDifficulty: (s) => s.describe("Challenge level (trivial, easy, moderate, difficult, treacherous)"),
		travelTime: (s) => s.describe("Time required to traverse (hours, days, weeks)"),
	})
		.omit({ id: true })
		.strict()
		.describe("Maps routes between regions, defining travel paths and challenges"),
} as const satisfies Schema<TableNames[number]>
