import {
	getAllAreas,
	getAllConflicts,
	getAllFactions,
	getAllForeshadowing,
	getAllLore,
	getAllMaps,
	getAllNarrativeDestinations,
	getAllNarrativeEvents,
	getAllNpcs,
	getAllQuests,
	getAllRegions,
	getAllSites,
} from "~/lib/entities"
import type { Route } from "./+types/items"

const fetchDataSources = {
	areas: getAllAreas,
	conflicts: getAllConflicts,
	factions: getAllFactions,
	foreshadowing: getAllForeshadowing,
	maps: getAllMaps,
	narrativeDestinations: getAllNarrativeDestinations,
	narrativeEvents: getAllNarrativeEvents,
	npcs: getAllNpcs,
	quests: getAllQuests,
	regions: getAllRegions,
	sites: getAllSites,
	lore: getAllLore,
}

const fetchData = async () => {
	const entries = await Promise.all(
		Object.entries(fetchDataSources).map(async ([key, fetcher]) => {
			try {
				console.log(`Fetching ${key}...`)
				const data = await fetcher()
				console.log(`Fetched ${data?.length || 0} ${key}`)
				return [key, data] as const
			} catch (error) {
				console.error(`Error fetching ${key}:`, error)
				return [key, null] as const
			}
		}),
	)

	// Log summary instead of trying to stringify everything
	const summary = entries.map(([key, data]) => `${key}: ${data?.length || 0} items`).join(", ")
	console.log(`Data fetch complete: ${summary}`)

	return Object.fromEntries(entries)
}

export async function loader(_: Route.LoaderArgs) {
	const fetchedData = await fetchData()
	return Response.json(fetchedData)
}

export type Items = Awaited<ReturnType<typeof fetchData>>
