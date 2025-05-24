import * as Icons from "lucide-react"
import { useState } from "react"
import { NavLink } from "react-router"

import { InfoCard } from "~/components/InfoCard"
import { List } from "~/components/List"
import { Input } from "~/components/ui/input"
import { useSearchFilter } from "~/hooks/useSearchFilter"
import { getAllSites } from "~/lib/entities"
import type { Route } from "./+types/index"

export async function loader({ params }: Route.LoaderArgs) {
	return await getAllSites()
}

export default function SitesIndexPage({ loaderData }: Route.ComponentProps) {
	const [searchTerm, setSearchTerm] = useState("")

	const filteredSites = useSearchFilter(loaderData, searchTerm)

	return (
		<div className="container mx-auto py-6">
			<div className="flex justify-between items-center mb-6">
				<div>
					<h1 className="text-3xl font-bold">Sites</h1>
					<p className="text-muted-foreground">Browse specific locations within areas</p>
				</div>
				{/* <Button>
					<NavLink to="/sites/new" className="flex items-center">
						<span className="mr-2">New Site</span>
						<Icons.LocateFixed className="h-4 w-4" />
					</NavLink>
				</Button> */}
			</div>

			<div className="mb-6">
				<div className="relative">
					<Icons.Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
					<Input
						type="search"
						placeholder="Search sites..."
						className="pl-8"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{filteredSites.map((site) => {
					const {
						id,
						name,
						siteType,
						slug,
						description,
						areaId,
						climate,
						creativePrompts,
						creatures,
						descriptors,
						embedding,
						environment,
						features,
						lightingDescription,
						mood,
						smells,
						soundscape,
						terrain,
						treasures,
						weather,
					} = site

					const icon = <Icons.LocateFixed className="h-4 w-4 text-primary" />

					return (
						<NavLink key={id} to={`/sites/${slug}`}>
							<InfoCard title={name} icon={icon} className="h-full hover:shadow-md transition-shadow">
								<List items={description} spacing="sm" emptyText="No description" />
							</InfoCard>
						</NavLink>
					)
				})}
			</div>

			{filteredSites.length === 0 && (
				<div className="text-center py-12">
					<Icons.LocateFixed className="mx-auto h-12 w-12 text-muted-foreground" />
					<h3 className="mt-2 text-lg font-medium">No sites found</h3>
					<p className="mt-1 text-muted-foreground">Try adjusting your search term</p>
				</div>
			)}
		</div>
	)
}
