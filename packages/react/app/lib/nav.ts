import type { LucideIcon } from "lucide-react"
import * as Icons from "lucide-react"

/**
 * The only shape the sidebar ever needs from an entity. Kept deliberately
 * narrow: it is what crosses the network boundary in `/api/items`, so it must
 * survive a JSON round-trip losslessly (no Dates, no nested relations).
 */
export interface NavItem {
	id: number
	name: string
	slug: string
}

export interface NavEntity {
	key: string
	title: string
	icon: LucideIcon
	/** Route base path, when it differs from `key`. */
	path?: string
}

/**
 * Single source of truth for the entity navigation. Adding an entity here is a
 * type error until `routes/api/items.ts` supplies a matching fetcher.
 */
export const navEntities = [
	{ key: "lore", title: "Lore", icon: Icons.Library },
	{ key: "maps", title: "Maps", icon: Icons.Map },
	{ key: "factions", title: "Factions", icon: Icons.Users },
	{ key: "npcs", title: "NPCs", icon: Icons.User },
	{ key: "regions", title: "Regions", icon: Icons.Globe },
	{ key: "areas", title: "Areas", icon: Icons.MapPin },
	{ key: "sites", title: "Sites", icon: Icons.LocateFixed },
	{ key: "quests", title: "Quests", icon: Icons.Scroll },
	{ key: "conflicts", title: "Conflicts", icon: Icons.Swords },
	{ key: "foreshadowing", title: "Foreshadowing", icon: Icons.Eye },
	{ key: "consequences", title: "Consequences", icon: Icons.AlertTriangle },
] as const satisfies readonly NavEntity[]

export type NavKey = (typeof navEntities)[number]["key"]

/** Every key always resolves to a list — a failed fetch yields `[]`, never null. */
export type NavData = Record<NavKey, NavItem[]>

export const emptyNavData: NavData = Object.fromEntries(
	navEntities.map(({ key }) => [key, [] as NavItem[]]),
) as NavData

export const navBasePath = (entity: NavEntity) => entity.path ?? entity.key
