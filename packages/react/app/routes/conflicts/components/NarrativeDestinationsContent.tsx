import * as Icons from "lucide-react"
import { InfoCard } from "~/components/InfoCard"
import { Link } from "~/components/ui/link"
import type { Conflict } from "~/lib/entities"

export function NarrativeDestinationsContent({ narrativeDestinations }: Pick<Conflict, "narrativeDestinations">) {
	return (
		<InfoCard
			title="Narrative Destinations"
			icon={<Icons.MapPin className="h-4 w-4 mr-2 text-green-600" />}
			emptyMessage="No narrative destinations linked to this conflict."
		>
			<div className="space-y-6">
				{narrativeDestinations.map((destination) => (
					<div key={destination.id} className="border rounded p-4 bg-background dark:bg-muted/30">
						<div className="flex justify-between items-start mb-3">
							<Link
								href={`/narrative-destinations/${destination.slug}`}
								className="text-lg font-semibold text-primary hover:underline"
							>
								{destination.name}
							</Link>
						</div>
					</div>
				))}
			</div>
		</InfoCard>
	)
}
