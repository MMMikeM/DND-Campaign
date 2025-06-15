import {
	getAllAreas,
	getAllConflicts,
	getAllFactions,
	getAllForeshadowing,
	getAllMaps,
	getAllNarrativeDestinations,
	getAllNarrativeEvents,
	getAllNpcs,
	getAllQuests,
	getAllRegions,
	getAllSites,
	getAllWorldConcepts,
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
	worldConcepts: getAllWorldConcepts,
}

const fetchData = async () => {
	const entries = await Promise.all(
		Object.entries(fetchDataSources).map(async ([key, fetcher]) => {
			const data = await fetcher()
			return [key, data] as const
		}),
	)

	return Object.fromEntries(entries)
}

export async function loader(_: Route.LoaderArgs) {
	const fetchedData = await fetchData()

	return Response.json(fetchedData)
}

export type Items = Awaited<ReturnType<typeof fetchData>>
