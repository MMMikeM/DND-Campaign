import { createHash } from "node:crypto"
import { selectEntityNames } from "@tome-master/shared/db"
import { db } from "~/lib/db"
import { routedTables } from "~/lib/search"
import type { Route } from "./+types/entity-names"

export async function loader({ request }: Route.LoaderArgs) {
	const names = (await selectEntityNames(db)).filter((entity) => routedTables.has(entity.table))
	const body = JSON.stringify(names)
	const etag = `"${createHash("sha1").update(body).digest("base64url")}"`
	// no-cache keeps the browser's copy but makes it ask before using it, which is what turns an unchanged list into a 304.
	const headers = { ETag: etag, "Cache-Control": "no-cache" }

	if (request.headers.get("If-None-Match") === etag) {
		return new Response(null, { status: 304, headers })
	}
	return new Response(body, { headers: { ...headers, "Content-Type": "application/json" } })
}

// fetcher.load requests `/api/entity-names.data`, where single fetch drops loader headers this doesn't forward.
export const headers: Route.HeadersFunction = ({ loaderHeaders }) => loaderHeaders
