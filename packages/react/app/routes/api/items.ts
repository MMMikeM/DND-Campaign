import { getAllFactions, getAllNpcs, getAllQuests, getAllRegions } from "~/lib/entities"
import type { Route } from "./+types/items"

export async function loader(_: Route.LoaderArgs) {
	const [factions, npcs, quests, regions] = await Promise.all([
		(await getAllFactions()).map(({ name, id, slug }) => ({ name, id, slug })),
		(await getAllNpcs()).map(({ name, id, slug }) => ({ name, id, slug })),
		(await getAllQuests()).map(({ name, id, slug }) => ({ name, id, slug })),
		(await getAllRegions()).map(({ name, id, slug }) => ({ name, id, slug })),
	])

	return Response.json({ factions, npcs, quests, regions })
}
