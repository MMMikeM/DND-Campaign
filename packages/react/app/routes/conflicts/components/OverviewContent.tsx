import * as Icons from "lucide-react"
import { BadgeWithTooltip } from "~/components/badge-with-tooltip"
import { InfoCard } from "~/components/InfoCard"
import { List } from "~/components/List"
import { Tags } from "~/components/Tags"
import { Link } from "~/components/ui/link"
import type { Conflict } from "~/lib/entities"

type OverviewContentProps = Pick<
	Conflict,
	| "description"
	| "stakes"
	| "status"
	| "scope"
	| "natures"
	| "region"
	| "narrativeDestinations"
	| "cause"
	| "clarityOfRightWrong"
	| "moralDilemma"
	| "tags"
	| "creativePrompts"
	| "gmNotes"
	| "hiddenTruths"
>

export function OverviewContent({
	description,
	stakes,
	status,
	scope,
	natures,
	region,
	narrativeDestinations,
	cause,
	clarityOfRightWrong,
	moralDilemma,
	tags,
	creativePrompts,
	gmNotes,
	hiddenTruths,
}: OverviewContentProps) {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
			<div className="flex items-center mb-4 col-span-2">
				<Link href={`/regions/${region?.slug}`} className="text-primary hover:underline">
					{region?.name}
				</Link>
			</div>

			<div className="space-y-6">
				<InfoCard
					title="Description"
					icon={<Icons.ScrollText className="h-4 w-4 mr-2 text-blue-600" />}
					emptyMessage="No description provided."
				>
					<List items={description} spacing="sm" textColor="muted" />
				</InfoCard>

				<InfoCard
					title="Stakes"
					icon={<Icons.AlertTriangle className="h-4 w-4 mr-2 text-red-600" />}
					emptyMessage="No stakes defined."
				>
					<List items={stakes} spacing="sm" textColor="muted" />
				</InfoCard>

				<InfoCard
					title="Root Cause"
					icon={<Icons.Flame className="h-4 w-4 mr-2 text-orange-600" />}
					emptyMessage="No root cause identified."
				>
					{cause}
				</InfoCard>

				<InfoCard
					title="Narrative Destinations"
					icon={<Icons.MapPin className="h-4 w-4 mr-2 text-green-600" />}
					emptyMessage="No narrative destinations defined."
				>
					{narrativeDestinations.map((destination) => (
						<Link key={destination.id} href={`/narrative-destinations/${destination.slug}`}>
							{destination.name}
						</Link>
					))}
				</InfoCard>
			</div>

			<div className="space-y-6">
				<InfoCard
					title="Moral Aspects"
					icon={<Icons.Scale className="h-4 w-4 mr-2 text-purple-600" />}
					emptyMessage="No moral information provided."
				>
					<div className="space-y-3">
						<BadgeWithTooltip tooltipContent="Moral Dilemma">{moralDilemma}</BadgeWithTooltip>
						<BadgeWithTooltip tooltipContent="Clarity of Right/Wrong">{clarityOfRightWrong}</BadgeWithTooltip>
					</div>
				</InfoCard>

				<InfoCard
					title="Creative Prompts"
					icon={<Icons.Lightbulb className="h-4 w-4 mr-2 text-amber-600" />}
					emptyMessage="No creative prompts available."
				>
					<List items={creativePrompts} spacing="sm" textColor="muted" />
				</InfoCard>

				<InfoCard
					title="GM Notes"
					icon={<Icons.Eye className="h-4 w-4 mr-2 text-red-600" />}
					emptyMessage="No GM notes recorded."
				>
					<List items={gmNotes} spacing="sm" textColor="muted" />
				</InfoCard>

				<InfoCard
					title="Hidden Truths"
					icon={<Icons.EyeOff className="h-4 w-4 mr-2 text-red-700" />}
					emptyMessage="No hidden truths documented."
				>
					<List items={hiddenTruths} spacing="sm" textColor="muted" />
				</InfoCard>
			</div>

			{tags && tags.length > 0 && (
				<div className="col-span-2">
					<InfoCard
						title="Tags"
						icon={<Icons.Tag className="h-4 w-4 mr-2 text-gray-600" />}
						emptyMessage="No tags assigned."
					>
						<Tags tags={tags} variant="secondary" maxDisplay={10} />
					</InfoCard>
				</div>
			)}
		</div>
	)
}
