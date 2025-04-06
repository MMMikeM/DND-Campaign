import { useState } from "react"
import * as Icons from "lucide-react"
import { NavLink } from "react-router"

import { Input } from "~/components/ui/input"
import { getAllAreas } from "~/lib/entities"
import type { Route } from "./+types/index"
import { InfoCard } from "~/components/InfoCard"
import { useSearchFilter } from "~/hooks/useSearchFilter"

export async function loader({ params }: Route.LoaderArgs) {
	return await getAllAreas()
}

export default function AreasIndexPage({ loaderData }: Route.ComponentProps) {
	const [searchTerm, setSearchTerm] = useState("")

	const filteredAreas = useSearchFilter(loaderData, searchTerm)

	return (
		<div className="container mx-auto py-6">
			<div className="flex justify-between items-center mb-6">
				<div>
					<h1 className="text-3xl font-bold">Areas</h1>
					<p className="text-muted-foreground">Browse settlements, districts, and zones within regions</p>
				</div>
			</div>

			<div className="mb-6">
				<div className="relative">
					<Icons.Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
					<Input
						type="search"
						placeholder="Search areas..."
						className="pl-8"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{filteredAreas.map((area) => {
					const { id, name, type, dangerLevel, region, slug, description } = area

					return (
						<NavLink key={id} to={`/areas/${slug}`}>
							<InfoCard title={name} icon={<Icons.MapPin className="h-4 w-4" />}>
								<p className="text-muted-foreground">{type}</p>
								<p className="text-muted-foreground">{region.name}</p>
								<p className="text-muted-foreground">{description.join(" ")}</p>
							</InfoCard>
						</NavLink>
					)
				})}
			</div>

			{filteredAreas.length === 0 && (
				<div className="text-center py-12">
					<Icons.MapPin className="mx-auto h-12 w-12 text-muted-foreground" />
					<h3 className="mt-2 text-lg font-medium">No areas found</h3>
					<p className="mt-1 text-muted-foreground">Try adjusting your search term</p>
				</div>
			)}
		</div>
	)
}
