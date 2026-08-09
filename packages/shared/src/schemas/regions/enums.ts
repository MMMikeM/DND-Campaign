export { dangerLevels } from "../shared-enums"

export const objectiveTypes = [
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

export const difficultyLevels = ["easy", "medium", "hard"] as const
export const linkTypes = [
	"adjacent",
	"road",
	"tunnel",
	"portal",
	"historical",
	"visible",
	"path",
	"conceptual",
] as const
export const secretTypes = ["historical", "hidden area", "concealed item", "true purpose", "connection"] as const
export const siteFunctions = [
	"rest_stop_recovery",
	"challenge_hub_obstacle",
	"information_node_lore",
	"thematic_showcase_mood",
	"social_interaction_nexus",
] as const

export const regionTypes = [
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

export const areaTypes = [
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

export const connectionTypes = ["allied", "hostile", "trade", "cultural", "historical", "vassal", "contested"] as const
export const routeTypes = ["road", "river", "mountain_pass", "sea_route", "portal", "wilderness"] as const
export const travelDifficulties = ["trivial", "easy", "moderate", "difficult", "treacherous"] as const
