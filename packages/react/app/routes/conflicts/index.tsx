import { getAllConflicts } from "~/lib/entities"
import { useState } from "react"
import { NavLink } from "react-router" // Corrected import source
import { Input } from "~/components/ui/input"
import { Button } from "~/components/ui/button"
import { BadgeWithTooltip } from "~/components/badge-with-tooltip"
import { getConflictStatusVariant } from "./utils"
import type { Conflict } from "~/lib/entities"
import type { Route } from "./+types/index"
import { InfoCard } from "~/components/InfoCard"
import * as Icons from "lucide-react"

export async function loader({ params }: Route.LoaderArgs) {
	return await getAllConflicts()
}

export default function ConflictsIndex({ loaderData }: Route.ComponentProps) {
	const allConflicts = loaderData ?? []
	const [searchTerm, setSearchTerm] = useState("")

	const filteredConflicts = allConflicts.filter((conflict) => {
		const term = searchTerm.toLowerCase()
		return (
			conflict.name?.toLowerCase().includes(term) ||
			conflict.scope?.toLowerCase().includes(term) ||
			conflict.nature?.toLowerCase().includes(term)
		)
	})

	return (
		<div className="container mx-auto py-6">
			<div className="flex justify-between items-center mb-6">
				<div>
					<h1 className="text-3xl font-bold">Major Conflicts</h1>
					<p className="text-muted-foreground">
						Browse and manage ongoing or historical conflicts in the campaign world.
					</p>
				</div>
				<Button asChild>
					<NavLink to="/conflicts/new" className="flex items-center">
						<span className="mr-2">New Conflict</span>
						<Icons.Swords className="h-4 w-4" />
					</NavLink>
				</Button>
			</div>

			<div className="mb-6">
				<div className="relative">
					<Icons.Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
					<Input
						type="search"
						placeholder="Search conflicts by name, scope, nature..."
						className="pl-8"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
				</div>
			</div>

			{filteredConflicts.length > 0 ? (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{filteredConflicts.map((conflict: Conflict) => (
						<NavLink key={conflict.id} to={`/conflicts/${conflict.slug}`} className="no-underline">
							<InfoCard
								title={conflict.name}
								icon={<Icons.Swords className="h-5 w-5 mr-2 text-destructive" />}
								className="h-full hover:shadow-md transition-shadow"
							>
								<div className="p-4">
									<p className="text-sm text-muted-foreground mb-2">
										Scope: {conflict.scope ?? "N/A"} | Nature: {conflict.nature ?? "N/A"}
									</p>
									<p className="text-sm line-clamp-3">
										{Array.isArray(conflict.description) && conflict.description.length > 0
											? conflict.description[0]
											: "No description."}
									</p>
								</div>
								<div className="border-t p-4">
									<BadgeWithTooltip
										variant={getConflictStatusVariant(conflict.status)}
										tooltipContent={`Status: ${conflict.status ?? "Unknown"}`}
									>
										{conflict.status ?? "Unknown"}
									</BadgeWithTooltip>
								</div>
							</InfoCard>
						</NavLink>
					))}
				</div>
			) : (
				<div className="text-center py-12">
					<Icons.Swords className="mx-auto h-12 w-12 text-muted-foreground" />
					<h3 className="mt-2 text-lg font-medium">No conflicts found</h3>
					<p className="mt-1 text-muted-foreground">Try adjusting your search term.</p>
				</div>
			)}
		</div>
	)
}
