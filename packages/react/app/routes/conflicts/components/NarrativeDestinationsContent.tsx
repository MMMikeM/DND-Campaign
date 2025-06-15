import * as Icons from "lucide-react"
import { InfoCard } from "~/components/InfoCard"
import { List } from "~/components/List"
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

						{destination.description && (
							<div className="mb-3">
								<h4 className="font-medium text-sm mb-1 flex items-center">
									<Icons.FileText className="h-3.5 w-3.5 mr-1.5 text-gray-500" />
									Description
								</h4>
								<List items={destination.description} spacing="xs" textColor="muted" textSize="sm" />
							</div>
						)}

						{destination.region && (
							<div className="mb-3">
								<h4 className="font-medium text-sm mb-1 flex items-center">
									<Icons.Globe className="h-3.5 w-3.5 mr-1.5 text-gray-500" />
									Region
								</h4>
								<Link
									href={`/regions/${destination.region.slug || destination.region.id}`}
									className="text-sm text-primary hover:underline"
								>
									{destination.region.name}
								</Link>
							</div>
						)}

						{destination.creativePrompts && destination.creativePrompts.length > 0 && (
							<div className="mb-3">
								<h4 className="font-medium text-sm mb-1 flex items-center">
									<Icons.Lightbulb className="h-3.5 w-3.5 mr-1.5 text-gray-500" />
									Creative Prompts
								</h4>
								<List items={destination.creativePrompts} spacing="xs" textColor="muted" textSize="sm" />
							</div>
						)}

						{destination.gmNotes && destination.gmNotes.length > 0 && (
							<div>
								<h4 className="font-medium text-sm mb-1 flex items-center">
									<Icons.Eye className="h-3.5 w-3.5 mr-1.5 text-red-600" />
									GM Notes
								</h4>
								<List items={destination.gmNotes} spacing="xs" textColor="muted" textSize="sm" />
							</div>
						)}
					</div>
				))}
			</div>
		</InfoCard>
	)
}
