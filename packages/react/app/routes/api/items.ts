import {
	getAllAreas,
	getAllConflicts,
	getAllFactions,
	getAllForeshadowing,
	getAllNarrativeArcs,
	getAllNpcs,
	getAllQuests,
	getAllRegions,
	getAllSites,
	getAllWorldChanges,
} from "~/lib/entities"
import type { Route } from "./+types/items"

const fetchData = async () => {
	const [factions, npcs, quests, regions, sites, areas, conflicts, foreshadowing, narrativeArcs, worldChanges] =
		await Promise.all([
			getAllFactions(),
			getAllNpcs(),
			getAllQuests(),
			getAllRegions(),
			getAllSites(),
			getAllAreas(),
			getAllConflicts(),
			getAllForeshadowing(),
			getAllNarrativeArcs(),
			getAllWorldChanges(),
		])
	return {
		factions,
		npcs,
		quests,
		regions,
		sites,
		areas,
		conflicts,
		foreshadowing,
		narrativeArcs,
		worldChanges,
	}
}

export async function loader(_: Route.LoaderArgs) {
	const fetchedData = await fetchData()

	return Response.json(fetchedData)
}

export type Items = Awaited<ReturnType<typeof fetchData>>
