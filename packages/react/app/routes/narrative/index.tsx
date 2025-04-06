import * as Icons from "lucide-react"
import { useState, useMemo } from "react"
import { NavLink } from "react-router" // Use react-router based on previous corrections
import { Input } from "~/components/ui/input"
import { InfoCard } from "~/components/InfoCard"
import { BadgeWithTooltip } from "~/components/badge-with-tooltip"
import { getAllNarrativeArcs } from "~/lib/entities"
import type { NarrativeArc } from "~/lib/entities"
import { getArcStatusVariant } from "./utils"
import type { Route } from "./+types/index"

export async function loader({ params }: Route.LoaderArgs): Promise<NarrativeArc[]> {
	const arcs = await getAllNarrativeArcs()
	if (!arcs) {
		console.warn("No narrative arcs found or failed to load.")
		return []
	}
	return arcs
}

export default function NarrativeArcsIndex({ loaderData }: Route.ComponentProps) {
	const allArcs = loaderData ?? []
	const [searchTerm, setSearchTerm] = useState("")

	const filteredArcs = useMemo(() => {
		return allArcs.filter((arc) => {
			const lowerSearchTerm = searchTerm.toLowerCase()
			return (
				arc.name?.toLowerCase().includes(lowerSearchTerm) ||
				arc.type?.toLowerCase().includes(lowerSearchTerm) ||
				arc.promise?.toLowerCase().includes(lowerSearchTerm)
			)
		})
	}, [allArcs, searchTerm])

	return (
		<div className="container mx-auto py-6 px-4 sm:px-6">
			<div className="flex justify-between items-center mb-6">
				<div>
					<h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-1 flex items-center">
						<Icons.Workflow className="h-6 w-6 mr-2 text-primary" />
						Narrative Arcs
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

			{filteredArcs.length > 0 ? (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{filteredArcs.map((arc: NarrativeArc) => (
						<NavLink key={arc.id} to={`/narrative/${arc.slug}`} className="no-underline">
							<InfoCard
								title={arc.name}
								icon={<Icons.Workflow className="h-5 w-5 mr-2 text-purple-500" />}
								className="h-full hover:shadow-md transition-shadow"
							>
								<div className="p-4">
									<p className="text-sm text-muted-foreground mb-2">Type: {arc.type ?? "N/A"}</p>
									<p className="text-sm line-clamp-3">
										Promise: {arc.promise || "No goal specified."}
									</p>
								</div>
								<div className="border-t p-4">
									<BadgeWithTooltip
										variant={getArcStatusVariant(arc.status)}
										tooltipContent={`Status: ${arc.status ?? "Unknown"}`}
										className="capitalize"
									>
										{arc.status ?? "Unknown"}
									</BadgeWithTooltip>
									{arc.members && (
										<span className="text-xs text-muted-foreground ml-2">({arc.members.length} Quests)</span>
									)}
								</div>
							</InfoCard>
						</NavLink>
					))}
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
