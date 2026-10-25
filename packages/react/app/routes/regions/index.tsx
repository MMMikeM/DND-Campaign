import * as Icons from "lucide-react"
import { useState } from "react"
import { NavLink } from "react-router"
import { BadgeWithTooltip } from "~/components/badge-with-tooltip"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card"
import { Input } from "~/components/ui/input"
import { getAllRegions } from "~/lib/entities"
import type { Route } from "./+types/index"

// Server-side data fetching
export async function loader({ params }: Route.LoaderArgs) {
	return await getAllRegions()
}

export default function RegionsIndexPage({ loaderData }: Route.ComponentProps) {
	const [searchTerm, setSearchTerm] = useState("")
	const regions = loaderData

	const filteredRegions = regions.filter(
		(region) =>
			region.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			region.type.toLowerCase().includes(searchTerm.toLowerCase()),
	)

	return (
		<div className="container mx-auto py-6">
			<div className="flex justify-between items-center mb-6">
				<div>
					<h1 className="text-3xl font-bold">Regions</h1>
					<p className="text-muted-foreground">Browse and manage locations in your campaign world</p>
				</div>
			</div>

			<div className="mb-6">
				<div className="relative">
					<Icons.Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
					<Input
						type="search"
						placeholder="Search regions..."
						className="pl-8"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{filteredRegions.map((region) => {
					const {
						atmosphereAndCulture,
						dangerLevel,
						description,
						featuresAndHazards,
						historyAndEconomy,
						id,
						loreAndSecrets,
						name,
						slug,
						tags,
						type,
					} = region

					return (
						<NavLink key={region.id} to={`/regions/${slug}`}>
							<Card className="h-full hover:shadow-md transition-shadow">
								<CardHeader>
									<CardTitle className="flex items-center">
										<Icons.Map className="h-5 w-5 mr-2 text-indigo-500" />
										{name}
									</CardTitle>
									<CardDescription>
										<span className="capitalize">{type}</span>
									</CardDescription>
								</CardHeader>
								<CardContent>
									{description?.[0] && <p className="text-sm line-clamp-2">{description[0]}</p>}
									<div className="flex flex-wrap items-center gap-2 mt-3">
										<BadgeWithTooltip
											variant={
												dangerLevel === "safe"
													? "outline"
													: dangerLevel === "low"
														? "secondary"
														: dangerLevel === "moderate"
															? "default"
															: "destructive"
											}
											tooltipContent={
												dangerLevel === "safe"
													? "Safe for all travelers"
													: dangerLevel === "low"
														? "Minor threats present"
														: dangerLevel === "moderate"
															? "Significant dangers"
															: dangerLevel === "high"
																? "Very dangerous"
																: "Extremely deadly"
											}
										>
											{dangerLevel}
										</BadgeWithTooltip>
									</div>
								</CardContent>
								<CardFooter>
									<div className="flex flex-col w-full gap-2">
										<div className="flex items-center text-xs text-muted-foreground justify-between">
											<span>{featuresAndHazards?.length || 0} features & hazards</span>
											<span>{loreAndSecrets?.length || 0} lore & secrets</span>
										</div>
									</div>
								</CardFooter>
							</Card>
						</NavLink>
					)
				})}
			</div>

			{filteredRegions.length === 0 && (
				<div className="text-center py-12">
					<Icons.Map className="mx-auto h-12 w-12 text-muted-foreground" />
					<h3 className="mt-2 text-lg font-medium">No regions found</h3>
					<p className="mt-1 text-muted-foreground">Try adjusting your search term</p>
				</div>
			)}
		</div>
	)
}
