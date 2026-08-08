import * as Icons from "lucide-react"
import { NavLink } from "react-router"
import { BadgeWithTooltip } from "~/components/badge-with-tooltip"
import { Button } from "~/components/ui/button"
import type { NPC } from "~/lib/entities"
import { getAdaptabilityVariant, getAlignmentVariant, getWealthVariant } from "../utils"

interface NPCHeaderProps {
	npc: NPC
}

export function NPCHeader({ npc }: NPCHeaderProps) {
	const { name, race, age, attitude, gender, occupation, details, slug } = npc

	return (
		<>
			<div className="mb-6">
				<Button variant="outline" size="sm" asChild>
					<NavLink to="/npcs" className="flex items-center">
						<Icons.ChevronLeft className="h-4 w-4 mr-2" />
						Back to NPCs
					</NavLink>
				</Button>
			</div>

			<div className="mb-6">
				<h1 className="text-3xl font-bold flex items-center">
					<Icons.UserCircle className="h-6 w-6 mr-3 text-indigo-500" />
					{name}
				</h1>
				<div className="flex flex-wrap gap-2 mt-2">
					<BadgeWithTooltip variant="outline" className="flex items-center" tooltipContent="Character species">
						<Icons.BadgeInfo className="h-3.5 w-3.5 mr-1" />
						{race}
					</BadgeWithTooltip>

					<BadgeWithTooltip variant="outline" className="flex items-center" tooltipContent="Character's stage of life">
						<Icons.ScrollText className="h-3.5 w-3.5 mr-1" />
						{age}
					</BadgeWithTooltip>

					<BadgeWithTooltip
						variant="outline"
						className="flex items-center"
						tooltipContent="General attitude toward others"
					>
						<Icons.Smile className="h-3.5 w-3.5 mr-1" />
						{attitude}
					</BadgeWithTooltip>

					<BadgeWithTooltip
						variant={getWealthVariant(details?.wealth)}
						className="flex items-center"
						tooltipContent="Economic standing and available resources"
					>
						<Icons.Building className="h-3.5 w-3.5 mr-1" />
						{details?.wealth}
					</BadgeWithTooltip>

					<BadgeWithTooltip variant="outline" className="flex items-center" tooltipContent="Character identity">
						<Icons.Users className="h-3.5 w-3.5 mr-1" />
						{gender}
					</BadgeWithTooltip>

					<BadgeWithTooltip
						variant={getAdaptabilityVariant(details?.adaptability)}
						className="flex items-center"
						tooltipContent="Flexibility in response to changing situations"
					>
						<Icons.Sparkles className="h-3.5 w-3.5 mr-1" />
						{details?.adaptability}
					</BadgeWithTooltip>

					<BadgeWithTooltip
						variant={getAlignmentVariant(details?.alignment)}
						className="flex items-center"
						tooltipContent="Moral and ethical alignment"
					>
						<Icons.Heart className="h-3.5 w-3.5 mr-1" />
						{details?.alignment}
					</BadgeWithTooltip>

					<BadgeWithTooltip variant="outline" className="flex items-center" tooltipContent="Role in society">
						<Icons.Briefcase className="h-3.5 w-3.5 mr-1" />
						{occupation}
					</BadgeWithTooltip>
				</div>
			</div>
		</>
	)
}
