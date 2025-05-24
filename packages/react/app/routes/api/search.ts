import { searchBySimilarity } from "~/lib/entities"
import { toSlug } from "~/lib/utils/addSlugs"
import type { Route } from "./+types/items"

export async function loader({ request }: Route.LoaderArgs) {
	const url = new URL(request.url)
	const query = url.searchParams.get("q")
	if (!query) {
		return []
	}

	console.log(`Searching for: ${query}`)
	const { rows } = await searchBySimilarity(query)

	const results = rows.map((row) => ({
		id: row.id as string,
		name: row.name as string,
		slug: toSlug(row.name as string),
		table: row.source_table as string,
	}))

	return results
}
