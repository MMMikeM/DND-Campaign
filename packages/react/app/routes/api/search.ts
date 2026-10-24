import { fullTextSearch } from "~/lib/entities"
import { routedTables } from "~/lib/search"
import type { Route } from "./+types/search"

export async function loader({ request }: Route.LoaderArgs) {
	const query = new URL(request.url).searchParams.get("q")
	if (!query) {
		return []
	}

	return (await fullTextSearch(query)).filter((hit) => routedTables.has(hit.table))
}
