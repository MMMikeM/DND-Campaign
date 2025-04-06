import * as Icons from "lucide-react"
import { NavLink } from "react-router"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { getAllFactions } from "~/lib/entities"
import { useMemo, useState } from "react"
import type { Route } from "./+types/index"
import { InfoCard } from "~/components/InfoCard"
import { useSearchFilter } from "~/hooks/useSearchFilter"

export async function loader({ params }: Route.LoaderArgs) {
	return await getAllFactions()
}

export default function FactionsIndex({ loaderData }: Route.ComponentProps) {
	const [searchTerm, setSearchTerm] = useState("")
	const factions = loaderData

	const filteredFactions = useSearchFilter(factions, searchTerm)

	return (
		<div className="container mx-auto py-6">
			<div className="flex justify-between items-center mb-6">
				<div>
					<h1 className="text-3xl font-bold">Factions</h1>
					<p className="text-muted-foreground">Browse and manage factions in your campaign world</p>
				</div>
				<Button>
					<NavLink to="/factions/new" className="flex items-center">
						<span className="mr-2">New Faction</span>
						<Icons.Flag className="h-4 w-4" />
					</NavLink>
				</Button>
			</div>

			<div className="mb-6">
				<div className="relative">
					<Icons.Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
					<Input
						type="search"
						placeholder="Search factions..."
						className="pl-8"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{filteredFactions.map((faction) => {
					const {
						name,
						type,
						alignment,
						size,
						wealth,
						reach,
						publicGoal,
						publicPerception,
						secretGoal,
						description,
						values,
						history,
						notes,
						resources,
						recruitment,
						slug,
					} = faction

					return (
						<NavLink key={faction.id} to={`/factions/${slug}`}>
							<InfoCard
								title={name}
								icon={<Icons.Flag className="h-5 w-5 mr-2 text-indigo-500" />}
								className="h-full hover:shadow-md transition-shadow"
							>
								<div className="p-4">
									<p className="text-sm text-muted-foreground mb-2">{publicGoal}</p>
									{description?.[0] && <p className="text-sm line-clamp-2">{description[0]}</p>}
									{publicPerception && (
										<p className="text-xs text-muted-foreground mt-2">
											<span className="font-medium">Public Perception:</span> {publicPerception}
										</p>
									)}
									{secretGoal && (
										<p className="text-xs text-muted-foreground mt-1 italic">
											<span className="font-medium">Secret Goal:</span> {secretGoal}
										</p>
									)}
								</div>
								<div className="border-t p-4">
									<div className="flex flex-col w-full gap-2">
										<div className="text-xs text-muted-foreground flex items-center gap-2">
											<span className="capitalize">{size}</span>
											<span>•</span>
											<span className="capitalize">{reach}</span>
											<span>•</span>
											<span className="capitalize">{wealth}</span>
										</div>
										<div className="text-xs text-muted-foreground">
											<span>{values?.length || 0} values</span>
											<span className="mx-1">•</span>
											<span>{resources?.length || 0} resources</span>
											<span className="mx-1">•</span>
											<span>{notes?.length || 0} notes</span>
										</div>
									</div>
								</div>
							</InfoCard>
						</NavLink>
					)
				})}
			</div>

			{filteredFactions.length === 0 && (
				<div className="text-center py-12">
					<Icons.Flag className="mx-auto h-12 w-12 text-muted-foreground" />
					<h3 className="mt-2 text-lg font-medium">No factions found</h3>
					<p className="mt-1 text-muted-foreground">Try adjusting your search term</p>
				</div>
			)}
		</div>
	)
}
