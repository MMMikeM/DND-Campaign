import {
	getAreaNames,
	getConflictNames,
	getConsequenceNames,
	getFactionNames,
	getForeshadowingNames,
	getLoreNames,
	getMapNames,
	getNpcNames,
	getQuestNames,
	getRegionNames,
	getSiteNames,
} from "~/lib/entities"
import type { NavData, NavItem, NavKey } from "~/lib/nav"
import type { Route } from "./+types/items"

type NavFetcher = () => Promise<NavItem[]>

/**
 * `satisfies` makes this exhaustive in both directions against `navEntities`:
 * a nav entry with no fetcher and a fetcher with no nav entry are both errors.
 */
const navFetchers = {
	areas: getAreaNames,
	conflicts: getConflictNames,
	consequences: getConsequenceNames,
	factions: getFactionNames,
	foreshadowing: getForeshadowingNames,
	lore: getLoreNames,
	maps: getMapNames,
	npcs: getNpcNames,
	quests: getQuestNames,
	regions: getRegionNames,
	sites: getSiteNames,
} satisfies Record<NavKey, NavFetcher>

const loadNavItems = async (key: NavKey, fetch: NavFetcher): Promise<NavItem[]> => {
	try {
		return await fetch()
	} catch (error) {
		console.error(`Failed to load sidebar items for ${key}:`, error)
		return []
	}
}

export const loadNavData = async (): Promise<NavData> => {
	const entries = await Promise.all(
		Object.entries(navFetchers).map(async ([key, fetch]) => [key, await loadNavItems(key as NavKey, fetch)] as const),
	)

	return Object.fromEntries(entries) as NavData
}

export async function loader(_: Route.LoaderArgs) {
	return Response.json(await loadNavData())
}
