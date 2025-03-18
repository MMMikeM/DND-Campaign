import { sqliteTable, text, integer, primaryKey } from "drizzle-orm/sqlite-core"

// Define the main quests table
export const quests = sqliteTable("quests", {
	id: text("id").primaryKey().notNull(),
	title: text("title").notNull(),
	type: text("type").notNull(),
	difficulty: text("difficulty").notNull(),
	description: text("description").notNull(),
	adaptable: integer("adaptable", { mode: "boolean" }).default(true),
})

// Define the quest stages table
export const questStages = sqliteTable(
	"quest_stages",
	{
		questId: text("quest_id")
			.notNull()
			.references(() => quests.id, { onDelete: "cascade" }),
		stage: integer("stage").notNull(),
		title: text("title").notNull(),
	},
	(table) => {
		return {
			pk: primaryKey({ columns: [table.questId, table.stage] }),
		}
	},
)

// Define the quest objectives table
export const questObjectives = sqliteTable(
	"quest_objectives",
	{
		questId: text("quest_id")
			.notNull()
			.references(() => quests.id, { onDelete: "cascade" }),
		stage: integer("stage").notNull(),
		objective: text("objective").notNull(),
	},
	(table) => {
		return {
			pk: primaryKey({ columns: [table.questId, table.stage, table.objective] }),
		}
	},
)

// Define the quest completion paths table
export const questCompletionPaths = sqliteTable(
	"quest_completion_paths",
	{
		questId: text("quest_id")
			.notNull()
			.references(() => quests.id, { onDelete: "cascade" }),
		stage: integer("stage").notNull(),
		pathName: text("path_name").notNull(),
		description: text("description").notNull(),
		challenges: text("challenges").notNull(),
		outcomes: text("outcomes").notNull(),
	},
	(table) => {
		return {
			pk: primaryKey({ columns: [table.questId, table.stage, table.pathName] }),
		}
	},
)

// Define the quest decision points table
export const questDecisionPoints = sqliteTable(
	"quest_decision_points",
	{
		questId: text("quest_id")
			.notNull()
			.references(() => quests.id, { onDelete: "cascade" }),
		stage: integer("stage").notNull(),
		decision: text("decision").notNull(),
	},
	(table) => {
		return {
			pk: primaryKey({ columns: [table.questId, table.stage, table.decision] }),
		}
	},
)

// Define the quest decision choices table
export const questDecisionChoices = sqliteTable(
	"quest_decision_choices",
	{
		questId: text("quest_id")
			.notNull()
			.references(() => quests.id, { onDelete: "cascade" }),
		stage: integer("stage").notNull(),
		decision: text("decision").notNull(),
		choice: text("choice").notNull(),
		consequences: text("consequences").notNull(),
	},
	(table) => {
		return {
			pk: primaryKey({ columns: [table.questId, table.stage, table.decision, table.choice] }),
		}
	},
)

// Define the quest twists table
export const questTwists = sqliteTable(
	"quest_twists",
	{
		questId: text("quest_id")
			.notNull()
			.references(() => quests.id, { onDelete: "cascade" }),
		twist: text("twist").notNull(),
	},
	(table) => {
		return {
			pk: primaryKey({ columns: [table.questId, table.twist] }),
		}
	},
)

// Define the quest rewards table
export const questRewards = sqliteTable(
	"quest_rewards",
	{
		questId: text("quest_id")
			.notNull()
			.references(() => quests.id, { onDelete: "cascade" }),
		rewardPath: text("reward_path").notNull(),
		reward: text("reward").notNull(),
	},
	(table) => {
		return {
			pk: primaryKey({ columns: [table.questId, table.rewardPath, table.reward] }),
		}
	},
)

// Define the quest follow-ups table
export const questFollowUps = sqliteTable(
	"quest_follow_ups",
	{
		questId: text("quest_id")
			.notNull()
			.references(() => quests.id, { onDelete: "cascade" }),
		path: text("path").notNull(),
		followUpId: text("follow_up_id").notNull(),
	},
	(table) => {
		return {
			pk: primaryKey({ columns: [table.questId, table.path, table.followUpId] }),
		}
	},
)

// Define the related quests table
export const questRelated = sqliteTable(
	"quest_related",
	{
		questId: text("quest_id")
			.notNull()
			.references(() => quests.id, { onDelete: "cascade" }),
		relatedId: text("related_id").notNull(),
	},
	(table) => {
		return {
			pk: primaryKey({ columns: [table.questId, table.relatedId] }),
		}
	},
)

// Define the quest associated NPCs table
export const questAssociatedNpcs = sqliteTable(
	"quest_associated_npcs",
	{
		questId: text("quest_id")
			.notNull()
			.references(() => quests.id, { onDelete: "cascade" }),
		npcId: text("npc_id").notNull(),
	},
	(table) => {
		return {
			pk: primaryKey({ columns: [table.questId, table.npcId] }),
		}
	},
)

// Define the main npcs table
export const npcs = sqliteTable("npcs", {
	id: text("id").primaryKey().notNull(),
	name: text("name").notNull(),
	race: text("race").notNull(),
	gender: text("gender").notNull(),
	occupation: text("occupation").notNull(),
	role: text("role"),
	quirk: text("quirk"),
	background: text("background").notNull(),
	motivation: text("motivation").notNull(),
	secret: text("secret").notNull(),
	stats: text("stats").notNull(),
})

// Define the npc descriptions table
export const npcDescriptions = sqliteTable(
	"npc_descriptions",
	{
		npcId: text("npc_id")
			.notNull()
			.references(() => npcs.id, { onDelete: "cascade" }),
		description: text("description").notNull(),
	},
	(table) => {
		return {
			pk: primaryKey({ columns: [table.npcId, table.description] }),
		}
	},
)

// Define the npc personality traits table
export const npcPersonalityTraits = sqliteTable(
	"npc_personality_traits",
	{
		npcId: text("npc_id")
			.notNull()
			.references(() => npcs.id, { onDelete: "cascade" }),
		trait: text("trait").notNull(),
	},
	(table) => {
		return {
			pk: primaryKey({ columns: [table.npcId, table.trait] }),
		}
	},
)

// Define the npc quests table
export const npcQuests = sqliteTable(
	"npc_quests",
	{
		npcId: text("npc_id")
			.notNull()
			.references(() => npcs.id, { onDelete: "cascade" }),
		questId: text("quest_id").notNull(),
		description: text("description").notNull(),
	},
	(table) => {
		return {
			pk: primaryKey({ columns: [table.npcId, table.questId] }),
		}
	},
)

// Define the npc relationships table
export const npcRelationships = sqliteTable(
	"npc_relationships",
	{
		npcId: text("npc_id")
			.notNull()
			.references(() => npcs.id, { onDelete: "cascade" }),
		relatedNpcId: text("related_npc_id").notNull(),
		relationship: text("relationship").notNull(),
	},
	(table) => {
		return {
			pk: primaryKey({ columns: [table.npcId, table.relatedNpcId] }),
		}
	},
)

// Define the npc locations table
export const npcLocations = sqliteTable(
	"npc_locations",
	{
		npcId: text("npc_id")
			.notNull()
			.references(() => npcs.id, { onDelete: "cascade" }),
		locationId: text("location_id").notNull(),
		description: text("description").notNull(),
	},
	(table) => {
		return {
			pk: primaryKey({ columns: [table.npcId, table.locationId] }),
		}
	},
)

// Define the npc inventory table
export const npcInventory = sqliteTable(
	"npc_inventory",
	{
		npcId: text("npc_id")
			.notNull()
			.references(() => npcs.id, { onDelete: "cascade" }),
		item: text("item").notNull(),
	},
	(table) => {
		return {
			pk: primaryKey({ columns: [table.npcId, table.item] }),
		}
	},
)

// Define the main factions table
export const factions = sqliteTable("factions", {
	id: text("id").primaryKey().notNull(),
	name: text("name").notNull(),
	type: text("type").notNull(),
	alignment: text("alignment"),
	description: text("description"),
	publicGoal: text("public_goal"),
	trueGoal: text("true_goal"),
	headquarters: text("headquarters"),
	territory: text("territory"),
	history: text("history"),
	notes: text("notes"),
})

// Define the faction resources table
export const factionResources = sqliteTable(
	"faction_resources",
	{
		factionId: text("faction_id")
			.notNull()
			.references(() => factions.id, { onDelete: "cascade" }),
		resource: text("resource").notNull(),
	},
	(table) => {
		return {
			pk: primaryKey({ columns: [table.factionId, table.resource] }),
		}
	},
)

// Define the faction leadership table
export const factionLeadership = sqliteTable(
	"faction_leadership",
	{
		factionId: text("faction_id")
			.notNull()
			.references(() => factions.id, { onDelete: "cascade" }),
		leaderId: text("leader_id").notNull(),
		role: text("role").notNull(),
	},
	(table) => {
		return {
			pk: primaryKey({ columns: [table.factionId, table.leaderId] }),
		}
	},
)

// Define the faction allies table
export const factionAllies = sqliteTable(
	"faction_allies",
	{
		factionId: text("faction_id")
			.notNull()
			.references(() => factions.id, { onDelete: "cascade" }),
		allyId: text("ally_id").notNull(),
	},
	(table) => {
		return {
			pk: primaryKey({ columns: [table.factionId, table.allyId] }),
		}
	},
)

// Define the faction enemies table
export const factionEnemies = sqliteTable(
	"faction_enemies",
	{
		factionId: text("faction_id")
			.notNull()
			.references(() => factions.id, { onDelete: "cascade" }),
		enemyId: text("enemy_id").notNull(),
	},
	(table) => {
		return {
			pk: primaryKey({ columns: [table.factionId, table.enemyId] }),
		}
	},
)

// Define the faction quests table
export const factionQuests = sqliteTable(
	"faction_quests",
	{
		factionId: text("faction_id")
			.notNull()
			.references(() => factions.id, { onDelete: "cascade" }),
		questId: text("quest_id").notNull(),
	},
	(table) => {
		return {
			pk: primaryKey({ columns: [table.factionId, table.questId] }),
		}
	},
)

// Define the main locations table
export const locations = sqliteTable("locations", {
	id: text("id").primaryKey().notNull(),
	name: text("name").notNull(),
	type: text("type").notNull(),
	region: text("region"),
	description: text("description").notNull(),
	history: text("history"),
	dangerLevel: text("danger_level"),
	factionControl: text("faction_control"),
})

// Define the location notable features table
export const locationNotableFeatures = sqliteTable(
	"location_notable_features",
	{
		locationId: text("location_id")
			.notNull()
			.references(() => locations.id, { onDelete: "cascade" }),
		feature: text("feature").notNull(),
	},
	(table) => {
		return {
			pk: primaryKey({ columns: [table.locationId, table.feature] }),
		}
	},
)

// Define the location NPCs table
export const locationNpcs = sqliteTable(
	"location_npcs",
	{
		locationId: text("location_id")
			.notNull()
			.references(() => locations.id, { onDelete: "cascade" }),
		npcId: text("npc_id").notNull(),
	},
	(table) => {
		return {
			pk: primaryKey({ columns: [table.locationId, table.npcId] }),
		}
	},
)

// Define the location factions table
export const locationFactions = sqliteTable(
	"location_factions",
	{
		locationId: text("location_id")
			.notNull()
			.references(() => locations.id, { onDelete: "cascade" }),
		factionId: text("faction_id").notNull(),
	},
	(table) => {
		return {
			pk: primaryKey({ columns: [table.locationId, table.factionId] }),
		}
	},
)

// Define the location points of interest table
export const locationPointsOfInterest = sqliteTable(
	"location_points_of_interest",
	{
		locationId: text("location_id")
			.notNull()
			.references(() => locations.id, { onDelete: "cascade" }),
		name: text("name").notNull(),
		description: text("description").notNull(),
	},
	(table) => {
		return {
			pk: primaryKey({ columns: [table.locationId, table.name] }),
		}
	},
)

// Define the location connections table
export const locationConnections = sqliteTable(
	"location_connections",
	{
		locationId: text("location_id")
			.notNull()
			.references(() => locations.id, { onDelete: "cascade" }),
		connectedLocationId: text("connected_location_id").notNull(),
	},
	(table) => {
		return {
			pk: primaryKey({ columns: [table.locationId, table.connectedLocationId] }),
		}
	},
)

// Define the location districts table
export const locationDistricts = sqliteTable(
	"location_districts",
	{
		locationId: text("location_id")
			.notNull()
			.references(() => locations.id, { onDelete: "cascade" }),
		name: text("name").notNull(),
		description: text("description").notNull(),
	},
	(table) => {
		return {
			pk: primaryKey({ columns: [table.locationId, table.name] }),
		}
	},
)

// Define the district features table
export const districtFeatures = sqliteTable(
	"district_features",
	{
		locationId: text("location_id")
			.notNull()
			.references(() => locations.id, { onDelete: "cascade" }),
		districtName: text("district_name").notNull(),
		feature: text("feature").notNull(),
	},
	(table) => {
		return {
			pk: primaryKey({ columns: [table.locationId, table.districtName, table.feature] }),
		}
	},
)

// Define the district NPCs table
export const districtNpcs = sqliteTable(
	"district_npcs",
	{
		locationId: text("location_id")
			.notNull()
			.references(() => locations.id, { onDelete: "cascade" }),
		districtName: text("district_name").notNull(),
		npcId: text("npc_id").notNull(),
	},
	(table) => {
		return {
			pk: primaryKey({ columns: [table.locationId, table.districtName, table.npcId] }),
		}
	},
)

// Define the location areas table
export const locationAreas = sqliteTable(
	"location_areas",
	{
		locationId: text("location_id")
			.notNull()
			.references(() => locations.id, { onDelete: "cascade" }),
		name: text("name").notNull(),
		description: text("description").notNull(),
		type: text("type").notNull(),
	},
	(table) => {
		return {
			pk: primaryKey({ columns: [table.locationId, table.name] }),
		}
	},
)

// Define the area features table
export const areaFeatures = sqliteTable(
	"area_features",
	{
		locationId: text("location_id")
			.notNull()
			.references(() => locations.id, { onDelete: "cascade" }),
		areaName: text("area_name").notNull(),
		feature: text("feature").notNull(),
	},
	(table) => {
		return {
			pk: primaryKey({ columns: [table.locationId, table.areaName, table.feature] }),
		}
	},
)

// Define the area encounters table
export const areaEncounters = sqliteTable(
	"area_encounters",
	{
		locationId: text("location_id")
			.notNull()
			.references(() => locations.id, { onDelete: "cascade" }),
		areaName: text("area_name").notNull(),
		encounter: text("encounter").notNull(),
		difficulty: text("difficulty").notNull(),
	},
	(table) => {
		return {
			pk: primaryKey({ columns: [table.locationId, table.areaName, table.encounter] }),
		}
	},
)

// Define the area treasures table
export const areaTreasures = sqliteTable(
	"area_treasures",
	{
		locationId: text("location_id")
			.notNull()
			.references(() => locations.id, { onDelete: "cascade" }),
		areaName: text("area_name").notNull(),
		treasure: text("treasure").notNull(),
		value: text("value").notNull(),
	},
	(table) => {
		return {
			pk: primaryKey({ columns: [table.locationId, table.areaName, table.treasure] }),
		}
	},
)

// Define the area NPCs table
export const areaNpcs = sqliteTable(
	"area_npcs",
	{
		locationId: text("location_id")
			.notNull()
			.references(() => locations.id, { onDelete: "cascade" }),
		areaName: text("area_name").notNull(),
		npcId: text("npc_id").notNull(),
	},
	(table) => {
		return {
			pk: primaryKey({ columns: [table.locationId, table.areaName, table.npcId] }),
		}
	},
)
