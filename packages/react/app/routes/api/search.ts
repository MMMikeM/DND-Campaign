import { buildFullTextQuery, type FullTextHit } from "@tome-master/shared/db"
import { db } from "~/lib/db"
import { routedTables } from "~/lib/search"
import type { Route } from "./+types/search"

export async function loader({ request }: Route.LoaderArgs) {
	const query = new URL(request.url).searchParams.get("q")
	if (!query) {
		return []
	}

	const { rows } = await db.execute<FullTextHit>(buildFullTextQuery(query, 10, [...routedTables]))
	return rows.map(({ id, source_table, name, slug }) => ({ id, table: source_table, name, slug }))
}
