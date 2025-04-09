import * as Icons from "lucide-react"
import { InfoCard } from "~/components/InfoCard"
import { List } from "~/components/List"
import type { NPC } from "~/lib/entities"

export function OverviewContent({ appearance, background, alignment, attitude, occupation, socialStatus, quirk }: NPC) {
	return (
		<InfoCard
			title="Overview"
			icon={<Icons.Info className="h-5 w-5 mr-2" />}
			emptyMessage="No overview information available."
			description="Essential information about {name}"
			contentClassName="grid grid-cols-1 md:grid-cols-2 gap-4"
		>
			<div>
				<h3 className="font-medium mb-2 flex items-center">
					<Icons.Heart className="h-4 w-4 mr-2 text-red-500" />
					Alignment
				</h3>
				<p className="text-muted-foreground capitalize">{alignment}</p>
			</div>
			<div>
				<h3 className="font-medium mb-2 flex items-center">
					<Icons.Smile className="h-4 w-4 mr-2 text-amber-500" />
					Attitude
				</h3>
				<p className="text-muted-foreground capitalize">{attitude}</p>
			</div>
			<div>
				<h3 className="font-medium mb-2 flex items-center">
					<Icons.Briefcase className="h-4 w-4 mr-2 text-emerald-600" />
					Occupation
				</h3>
				<p className="text-muted-foreground capitalize">{occupation}</p>
			</div>
			<div>
				<h3 className="font-medium mb-2 flex items-center">
					<Icons.Users className="h-4 w-4 mr-2 text-purple-600" />
					Social Status
				</h3>
				<p className="text-muted-foreground capitalize">{socialStatus}</p>
			</div>
			<div className="col-span-2">
				<p className="text-sm text-muted-foreground mb-4">What makes this NPC unique</p>
				<div className="p-4 bg-muted rounded-md">
					<p className="text-lg italic">{quirk}</p>
				</div>
			</div>
			<List heading="Background" items={background} spacing="sm" textColor="muted" collapsible={false} />
			<List heading="Appearance" items={appearance} spacing="sm" textColor="muted" collapsible={false} />
		</InfoCard>
	)
}
