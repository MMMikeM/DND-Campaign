import * as Icons from "lucide-react"
import type React from "react"
import { BadgeWithTooltip } from "~/components/badge-with-tooltip"
import { Link } from "~/components/ui/link"
import type { Quest } from "~/lib/entities"
import { getTypeVariant, getUrgencyVariant, getVisibilityVariant } from "../utils"

export const QuestHeader: React.FC<Quest> = ({ name, type, urgency, visibility, mood, factions, region }) => (
	<div className="mb-6">
		<h1 className="text-3xl font-bold flex items-center">
			<Icons.Scroll className="h-6 w-6 mr-3 text-indigo-500" />
			{name}
		</h1>
		<div className="flex flex-wrap gap-2 mt-2">
			<BadgeWithTooltip
				variant={getTypeVariant(type)}
				className="flex items-center"
				tooltipContent={`${type === "main" ? "Primary campaign quest" : type === "faction" ? "Faction-related quest" : type === "character" ? "Character-focused quest" : type === "side" ? "Optional side quest" : "Generic quest"}`}
			>
				<Icons.Target className="h-3.5 w-3.5 mr-1" />
				{type}
			</BadgeWithTooltip>
			<BadgeWithTooltip
				variant={getUrgencyVariant(urgency)}
				className="flex items-center"
				tooltipContent={`${urgency === "critical" ? "Requires immediate attention" : urgency === "urgent" ? "Should be addressed soon" : urgency === "developing" ? "Situation is evolving" : "Long-term background plot"}`}
			>
				<Icons.Clock className="h-3.5 w-3.5 mr-1" />
				{urgency}
			</BadgeWithTooltip>
			<BadgeWithTooltip
				variant={getVisibilityVariant(visibility)}
				className="flex items-center"
				tooltipContent={`This quest is ${visibility === "hidden" ? "not yet known to players" : visibility === "rumored" ? "rumors are circulating" : visibility === "known" ? "known to players" : "prominently featured in the campaign"}`}
			>
				<Icons.Eye className="h-3.5 w-3.5 mr-1" />
				{visibility}
			</BadgeWithTooltip>
			{factions && factions.length > 0 && factions[0]?.faction && (
				<Link href={`/factions/${factions[0].faction.slug}/influence`}>
					<BadgeWithTooltip
						className="flex items-center cursor-pointer hover:bg-indigo-600"
						tooltipContent={`Primary faction involved: ${factions[0].faction.name}`}
					>
						<Icons.Flag className="h-3.5 w-3.5 mr-1" />
						{factions[0].faction.name}
					</BadgeWithTooltip>
				</Link>
			)}
			{region && (
				<Link href={`/regions/${region.slug}/connections`}>
					<BadgeWithTooltip
						variant="outline"
						className="flex items-center cursor-pointer hover:bg-indigo-600"
						tooltipContent={`This quest takes place in ${region.name}`}
					>
						<Icons.MapPin className="h-3.5 w-3.5 mr-1" />
						{region.name}
					</BadgeWithTooltip>
				</Link>
			)}
		</div>
		<p className="mt-4 text-muted-foreground italic">"{mood}"</p>
	</div>
)

export { QuestHeader }
