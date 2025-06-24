import * as Icons from "lucide-react"
import { NavLink } from "react-router"
import { BadgeWithTooltip } from "~/components/badge-with-tooltip"
import { InfoCard } from "~/components/InfoCard"
import { List } from "~/components/List"
import { Button } from "~/components/ui/button"
import { Link } from "~/components/ui/link"
import { type Foreshadowing, getForeshadowing } from "~/lib/entities"
import type { Route } from "./+types/$slug"
import { getForeshadowingSubtletyVariant } from "./utils"

export async function loader({ params }: Route.LoaderArgs) {
	if (!params.slug) {
		throw new Response("No slug provided", { status: 400 })
	}

	const foreshadowing = await getForeshadowing(params.slug)
	if (!foreshadowing) {
		throw new Response("Foreshadowing item not found", { status: 404 })
	}

	return foreshadowing
}

export default function ForeshadowingDetail({ loaderData }: Route.ComponentProps) {
	const foreshadowing = loaderData

	const {
		id,
		name,
		creativePrompts,
		description,
		gmNotes,
		tags,
		subtlety,
		narrativeWeight,
		suggestedDeliveryMethods,
		targetQuest,
		targetNpc,
		targetNarrativeEvent,
		targetConflict,
		targetItem,
		targetNarrativeDestination,
		targetLore,
		targetFaction,
		targetSite,
		sourceQuest,
		sourceQuestStage,
		sourceSite,
		slug,
		sourceNpc,
		sourceItemDescriptionId,
		sourceLoreId,
		sourceNpcId,
		sourceQuestId,
		sourceQuestStageId,
		sourceSiteId,
		targetConflictId,
		targetFactionId,
		targetItemId,
		targetLoreId,
		targetNarrativeDestinationId,
		targetNarrativeEventId,
		targetQuestId,
		targetSiteId,
		targetNpcId,
	} = foreshadowing

	if (!foreshadowing) {
		return <div>Error: Foreshadowing data could not be loaded.</div>
	}

	return <div className="container mx-auto py-6 px-4 sm:px-6 space-y-6">{JSON.stringify(foreshadowing)}</div>
}
