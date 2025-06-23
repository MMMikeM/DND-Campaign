import * as Icons from "lucide-react"
import { useState } from "react"
import { NavLink } from "react-router"
import { InfoCard } from "~/components/InfoCard"
import { List } from "~/components/List"
import { Tags } from "~/components/Tags"
import { Badge } from "~/components/ui/badge"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { useSearchFilter } from "~/hooks/useSearchFilter"
import { getAllMaps } from "~/lib/entities"
import type { Route } from "./+types/index"

export async function loader({ params }: Route.LoaderArgs) {
	const maps = await getAllMaps()
	if (!maps) {
		throw new Response("Maps not found", { status: 404 })
	}

	return maps
}

export default function MapsIndex({ loaderData }: Route.ComponentProps) {
	const [searchTerm, setSearchTerm] = useState("")
	const allMaps = loaderData ?? []

	const filteredMaps = useSearchFilter(allMaps, searchTerm)

	return (
		<div className="container mx-auto py-6">
			<div className="flex justify-between items-center mb-6">
				<div>
					<h1 className="text-3xl font-bold">Battle Maps</h1>
					<p className="text-muted-foreground">Browse tactical battle maps for encounters and locations.</p>
				</div>
				<Button asChild>
					<NavLink to="/maps/new" className="flex items-center">
						<span className="mr-2">New Map</span>
						<Icons.Map className="h-4 w-4" />
					</NavLink>
				</Button>
			</div>

			<div className="mb-6">
				<div className="relative">
					<Icons.Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
					<Input
						type="search"
						placeholder="Search maps by name, description, tags..."
						className="pl-8"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
				</div>
			</div>

			{filteredMaps.length > 0 ? (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{filteredMaps.map((map) => (
						<NavLink key={map.id} to={`/maps/${map.slug}`} className="no-underline">
							<InfoCard
								title={map.name}
								icon={<Icons.Map className="h-5 w-5 mr-2 text-blue-600" />}
								className="h-full hover:shadow-md transition-shadow"
							>
								<div className="p-4">
									{map.description && map.description.length > 0 && (
										<div className="mb-3">
											<List items={map.description} spacing="sm" emptyText="No description." />
										</div>
									)}

									{map.variants && map.variants.length > 0 && (
										<div className="mb-3">
											<h4 className="text-sm font-medium mb-2">Variants</h4>
											<div className="space-y-1">
												{map.variants.map((variant) => (
													<div key={variant.id} className="flex justify-between items-center text-xs">
														<span className="text-muted-foreground">{variant.variantName || "Default"}</span>
														{variant.isDefault && (
															<Badge variant="outline" className="h-4 px-1 text-xs">
																Default
															</Badge>
														)}
													</div>
												))}
											</div>
										</div>
									)}

									{map.tags && map.tags.length > 0 && (
										<div className="mb-3">
											<Tags tags={map.tags} variant="secondary" maxDisplay={3} />
										</div>
									)}
								</div>

								<div className="border-t p-4">
									<div className="flex justify-between items-center text-sm text-muted-foreground">
										<span>
											{map.variants?.length || 0} variant{map.variants?.length !== 1 ? "s" : ""}
										</span>
										{map.site && <span className="text-xs">Site: {map.site.name}</span>}
									</div>
								</div>
							</InfoCard>
						</NavLink>
					))}
				</div>
			) : (
				<div className="text-center py-12">
					<Icons.Map className="mx-auto h-12 w-12 text-muted-foreground" />
					<h3 className="mt-2 text-lg font-medium">No maps found</h3>
					<p className="mt-1 text-muted-foreground">Try adjusting your search term.</p>
				</div>
			)}
		</div>
	)
}
