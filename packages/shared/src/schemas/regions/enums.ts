import { dangerLevels } from "../shared-enums"

const objectiveTypes = [
	"DEATHMATCH",
	"STOP_THE_RITUAL",
	"DARING_ESCAPE",
	"HOLD_THE_FORT",
	"SAVE_THE_NPC",
	"SABOTAGE",
	"ESCORT_PAYLOAD",
	"HEIST",
	"PEACEMAKER",
	"ARREST",
	"SURVIVE_WAVES",
	"PUZZLE_CHALLENGE",
	"SOCIAL_ENCOUNTER_WITH_STAKES",
] as const

const difficultyLevels = ["easy", "medium", "hard"] as const
const linkTypes = ["adjacent", "road", "tunnel", "portal", "historical", "visible", "path", "conceptual"] as const
const secretTypes = ["historical", "hidden area", "concealed item", "true purpose", "connection"] as const
const siteFunctions = [
	"rest_stop_recovery",
	"challenge_hub_obstacle",
	"information_node_lore",
	"thematic_showcase_mood",
	"social_interaction_nexus",
] as const
const siteTypes = [
	"building",
	"fortress",
	"castle",
	"tower",
	"temple",
	"market",
	"town_square",
	"port",
	"graveyard",
	"arena",
	"warehouse",
	"slum",
	"farm",

	"cave",
	"clearing",
	"beach",
	"river_crossing",
	"waterfall",
	"mountain_pass",
	"cliff",
	"oasis",
	"field",
	"grove",

	"ruins",
	"cemetery",
	"mine",

	"road",
	"bridge",
	"camp",
	"crossroads",
	"trail",
] as const

const regionTypes = [
	"coastal",
	"desert",
	"forest",
	"mountain",
	"ocean",
	"river",
	"swamp",
	"wilderness",
	"grassland",
	"jungle",
	"tundra",
	"hills",
	"valley",
	"canyon",
	"marsh",
	"lake",

	"planar",
	"enchanted",
	"blighted",
	"haunted",
	"elemental",
] as const

const areaTypes = [
	"city",
	"town",
	"village",
	"outpost",
	"hamlet",

	"ruins_complex",
	"wilderness_stretch",
	"battlefield",
	"sacred_grounds",
	"dungeon_network",
	"fortress_complex",
	"mining_district",
	"farmland_district",
] as const

const atmosphereTypes = [
	"safe_haven_rest",
	"oppressive_tense",
	"mysterious_intriguing",
	"mundane_stable",
	"wild_dangerous_challenging",
	"wonder_awe",
] as const

const encounterCategories = ["combat", "puzzle", "trap", "social", "exploration_hazard"] as const

const connectionTypes = ["allied", "hostile", "trade", "cultural", "historical", "vassal", "contested"] as const
const routeTypes = ["road", "river", "mountain_pass", "sea_route", "portal", "wilderness"] as const
const travelDifficulties = ["trivial", "easy", "moderate", "difficult", "treacherous"] as const

export const enums = {
	areaTypes,
	atmosphereTypes,
	difficultyLevels,
	dangerLevels,
	linkTypes,
	objectiveTypes,
	regionTypes,
	secretTypes,
	siteFunctions,
	siteTypes,
	encounterCategories,
	connectionTypes,
	routeTypes,
	travelDifficulties,
}
