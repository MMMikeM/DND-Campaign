import * as Icons from "lucide-react"
import { InfoCard } from "~/components/InfoCard"
import { List } from "~/components/List"
import type { Consequence } from "~/lib/entities"

type OverviewContentProps = Pick<
	Consequence,
	| "complicationDetails"
	| "conflictImpactDescription"
	| "creativePrompts"
	| "description"
	| "escalationDetails"
	| "playerImpactFeel"
	| "twistRevealDetails"
>

export function OverviewContent({
	complicationDetails,
	conflictImpactDescription,
	creativePrompts,
	description,
	escalationDetails,
	playerImpactFeel,
	twistRevealDetails,
}: OverviewContentProps) {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
			<InfoCard
				title="Description"
				icon={<Icons.ScrollText className="h-4 w-4 mr-2 text-blue-600" />}
				emptyMessage="No description provided."
			>
				<List items={description} spacing="sm" />
			</InfoCard>

			<InfoCard title="Player Impact" icon={<Icons.Users className="h-4 w-4 mr-2 text-green-600" />}>
				<p className="text-sm text-muted-foreground">{playerImpactFeel}</p>
			</InfoCard>

			{conflictImpactDescription && (
				<InfoCard title="Conflict Impact" icon={<Icons.Swords className="h-4 w-4 mr-2 text-red-600" />}>
					<p className="text-sm text-muted-foreground">{conflictImpactDescription}</p>
				</InfoCard>
			)}

			{complicationDetails && (
				<InfoCard title="Complication" icon={<Icons.GitBranch className="h-4 w-4 mr-2 text-amber-600" />}>
					<p className="text-sm text-muted-foreground">{complicationDetails}</p>
				</InfoCard>
			)}

			{escalationDetails && (
				<InfoCard title="Escalation" icon={<Icons.TrendingUp className="h-4 w-4 mr-2 text-orange-600" />}>
					<p className="text-sm text-muted-foreground">{escalationDetails}</p>
				</InfoCard>
			)}

			{twistRevealDetails && (
				<InfoCard title="Twist Reveal" icon={<Icons.Sparkle className="h-4 w-4 mr-2 text-purple-600" />}>
					<p className="text-sm text-muted-foreground">{twistRevealDetails}</p>
				</InfoCard>
			)}

			<InfoCard
				title="Creative Prompts"
				icon={<Icons.Lightbulb className="h-4 w-4 mr-2 text-amber-600" />}
				emptyMessage="No creative prompts available."
				className="md:col-span-2"
			>
				<List items={creativePrompts} spacing="sm" />
			</InfoCard>
		</div>
	)
}
