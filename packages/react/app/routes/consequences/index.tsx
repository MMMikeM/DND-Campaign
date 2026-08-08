import * as Icons from "lucide-react"
import { useMemo, useState } from "react"
import { NavLink } from "react-router" // Use react-router based on previous corrections
import { BadgeWithTooltip } from "~/components/badge-with-tooltip"
import { InfoCard } from "~/components/InfoCard"
import { Input } from "~/components/ui/input"
import { getAllConsequences, type Consequence } from "~/lib/entities"
import type { Route } from "./+types/index"
import { getArcStatusVariant } from "./utils"

export async function loader({ params }: Route.LoaderArgs) {
	const consequences = await getAllConsequences()
	if (!consequences) {
		console.warn("No consequences found or failed to load.")
		return []
	}
	return consequences
}

export default function ConsequencesIndex({ loaderData }: Route.ComponentProps) {
	const allConsequences = loaderData ?? []
	const [searchTerm, setSearchTerm] = useState("")

	const filteredConsequences = useMemo(() => {
		return allConsequences.filter((consequence) => {
			const lowerSearchTerm = searchTerm.toLowerCase()
			return consequence.name?.toLowerCase().includes(lowerSearchTerm)
		})
	}, [allConsequences, searchTerm])

	return (
		<div className="container mx-auto py-6 px-4 sm:px-6">
			<div className="flex justify-between items-center mb-6">
				<div>
					<h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-1 flex items-center">
						<Icons.Workflow className="h-6 w-6 mr-2 text-primary" />
						Consequences
					</h1>
					<p className="text-muted-foreground">Overarching storylines and character progressions.</p>
				</div>
			</div>

			<div className="mb-6">
				<div className="relative">
					<Icons.Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
					<Input
						type="search"
						placeholder="Search arcs by name, type, or promise..."
						className="pl-8"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						aria-label="Search narrative arcs"
					/>
				</div>
			</div>

			{filteredConsequences.length > 0 ? (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{filteredConsequences.map(
						({
							affectedAreaId,
							affectedConflictId,
							affectedConsequenceId,
							affectedFactionId,
							affectedNpcId,
							affectedQuestId,
							affectedRegionId,
							affectedSiteId,
							complicationDetails,
							conflictImpactDescription,
							consequenceType,
							creativePrompts,
							description,
							escalationDetails,
							id,
							name,
							playerImpactFeel,
							severity,
							slug,
							sourceType,
							tags,
							timeframe,
							triggerQuestId,
							triggerQuestStageDecisionId,
							twistRevealDetails,
							visibility,
						}) => (
							<NavLink key={id} to={`/consequences/${slug}`} className="no-underline">
								<InfoCard
									title={name}
									icon={<Icons.Workflow className="h-5 w-5 mr-2 text-purple-500" />}
									className="h-full hover:shadow-md transition-shadow"
								>
									<div className="p-4">
										<p className="text-sm text-muted-foreground mb-2 capitalize">{consequenceType}</p>
										<p className="text-sm line-clamp-3">{playerImpactFeel}</p>
									</div>
									<div className="border-t p-4 flex flex-wrap gap-2">
										<BadgeWithTooltip variant="outline" tooltipContent="Severity" className="capitalize">
											{severity}
										</BadgeWithTooltip>
										<BadgeWithTooltip variant="outline" tooltipContent="Visibility" className="capitalize">
											{visibility}
										</BadgeWithTooltip>
										<BadgeWithTooltip variant="outline" tooltipContent="Timeframe" className="capitalize">
											{timeframe}
										</BadgeWithTooltip>
									</div>
								</InfoCard>
							</NavLink>
						),
					)}
				</div>
			) : (
				<div className="text-center py-12">
					<Icons.Workflow className="mx-auto h-12 w-12 text-muted-foreground" />
					<h3 className="mt-2 text-lg font-medium">No narrative arcs found</h3>
					<p className="mt-1 text-muted-foreground">Try adjusting your search term.</p>
				</div>
			)}
		</div>
	)
}
