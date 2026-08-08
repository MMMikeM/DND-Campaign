import * as Icons from "lucide-react"
import type React from "react"
import { BadgeWithTooltip } from "~/components/badge-with-tooltip"
import { Link } from "~/components/ui/link"
import type { Quest } from "~/lib/entities"
import { getTypeVariant, getUrgencyVariant } from "../utils"

type QuestHeaderProps = Pick<Quest, "name" | "type" | "urgency" | "mood">

export const QuestHeader: React.FC<QuestHeaderProps> = ({ name, type, urgency, mood }) => (
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
		</div>
		<p className="mt-4 text-muted-foreground italic">"{mood}"</p>
	</div>
)
