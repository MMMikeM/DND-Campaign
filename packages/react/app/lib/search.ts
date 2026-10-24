import type { EntityRef } from "@tome-master/shared/search"
import { useFetcher } from "react-router"

/** Entity tables with their own pages: search results link to `/${table}/${slug}`. */
export const routedTables = new Set([
	"areas",
	"conflicts",
	"consequences",
	"factions",
	"foreshadowing",
	"lore",
	"npcs",
	"quests",
	"regions",
	"sites",
])

/**
 * Every routed entity's name, held in the browser so name search never waits on the
 * network. The server stays the source of truth: `refresh` is a conditional request
 * that comes back 304, with no body, until a name actually changes.
 */
export const useEntityNames = () => {
	const fetcher = useFetcher<EntityRef[]>()
	return { names: fetcher.data, refresh: () => fetcher.load("/api/entity-names") }
}
