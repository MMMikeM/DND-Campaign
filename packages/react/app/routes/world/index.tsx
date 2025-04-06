import * as Icons from "lucide-react"
import { useState, useMemo } from "react"
import { NavLink } from "react-router"
import { Input } from "~/components/ui/input"
import { InfoCard } from "~/components/InfoCard"
import { BadgeWithTooltip } from "~/components/badge-with-tooltip"
import { getAllWorldChanges } from "~/lib/entities"
import { getChangeSeverityVariant } from "./utils"
import type { Route } from "./+types/index"
import { useSearchFilter } from "~/hooks/useSearchFilter"

export async function loader({ params }: Route.LoaderArgs) {
	const changes = await getAllWorldChanges()
	if (!changes) {
		console.warn("No world state changes found or failed to load.")
		return []
	}
	return changes
}

export default function WorldChangesIndex({ loaderData }: Route.ComponentProps) {
	const [searchTerm, setSearchTerm] = useState("")
	const allChanges = loaderData ?? []

	const filteredChanges = useSearchFilter(allChanges, searchTerm)

	return (
		<div className="container mx-auto py-6 px-4 sm:px-6">
			<div className="flex justify-between items-center mb-6">
				<div>
					<h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-1 flex items-center">
						<Icons.Globe className="h-6 w-6 mr-2 text-primary" /> {/* Changed icon */}
						World State Changes
					</h1>
					<p className="text-muted-foreground">Significant events altering the state of the world.</p>
				</div>
			</div>

			<div className="mb-6">
				<div className="relative">
					<Icons.Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
					<Input
						type="search"
						placeholder="Search changes by title, type, or description..."
						className="pl-8"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						aria-label="Search world state changes"
					/>
				</div>
			</div>

			{filteredChanges.length > 0 ? (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{filteredChanges.map((change) => (
						<NavLink key={change.id} to={`/world/${change.slug}`} className="no-underline">
							<InfoCard
								title={change.name}
								icon={<Icons.History className="h-5 w-5 mr-2 text-blue-500" />}
								className="h-full hover:shadow-md transition-shadow"
							>
								<div className="p-4">
									<p className="text-sm text-muted-foreground mb-2">Type: {change.changeType ?? "N/A"}</p>{" "}
									<p className="text-sm line-clamp-3">
										{Array.isArray(change.description)
											? change.description.join(" ")
											: change.description || "No description."}
									</p>
								</div>
								<div className="border-t p-4">
									<BadgeWithTooltip
										variant={getChangeSeverityVariant(change.severity)}
										tooltipContent={`Severity: ${change.severity ?? "Unknown"}`}
										className="capitalize"
									>
										{change.severity ?? "Unknown"}
									</BadgeWithTooltip>
								</div>
							</InfoCard>
						</NavLink>
					))}
				</div>
			) : (
				<div className="text-center py-12">
					<Icons.Globe className="mx-auto h-12 w-12 text-muted-foreground" />
					<h3 className="mt-2 text-lg font-medium">No world state changes found</h3>
					<p className="mt-1 text-muted-foreground">Try adjusting your search term.</p>
				</div>
			)}
		</div>
	)
}
