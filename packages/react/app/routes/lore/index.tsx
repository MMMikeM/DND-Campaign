import * as Icons from "lucide-react"
import { useState } from "react"
import { NavLink } from "react-router"
import { InfoCard } from "~/components/InfoCard"
import { Input } from "~/components/ui/input"
import { useSearchFilter } from "~/hooks/useSearchFilter"
import { getAllLore } from "~/lib/entities"
import type { Route } from "./+types/index"

export async function loader({ params }: Route.LoaderArgs) {
	const lore = await getAllLore()
	if (!lore) {
		throw new Response("Lore not found", { status: 404 })
	}
	return lore
}

export default function LoreIndex({ loaderData }: Route.ComponentProps) {
	const [searchTerm, setSearchTerm] = useState("")
	const allLore = loaderData

	const filteredLore = useSearchFilter(allLore, searchTerm)

	return (
		<div className="container mx-auto py-6 px-4 sm:px-6">
			<div className="flex justify-between items-center mb-6">
				<div>
					<h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-1 flex items-center">
						<Icons.Globe className="h-6 w-6 mr-2 text-primary" />
						Lore
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
						aria-label="Search lore"
					/>
				</div>
			</div>

			{filteredLore.length > 0 ? (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{filteredLore.map((lore) => (
						<NavLink key={lore.id} to={`/lore/${lore.slug}`} className="no-underline">
							<InfoCard
								title={lore.name}
								icon={<Icons.History className="h-5 w-5 mr-2 text-blue-500" />}
								className="h-full hover:shadow-md transition-shadow"
							>
								<div className="p-4">
									<p className="text-sm text-muted-foreground mb-2">Type: {lore.loreType ?? "N/A"}</p>{" "}
									<p className="text-sm line-clamp-3">
										{Array.isArray(lore.summary) ? lore.summary.join(" ") : lore.summary || "No summary."}
									</p>
								</div>
							</InfoCard>
						</NavLink>
					))}
				</div>
			) : (
				<div className="text-center py-12">
					<Icons.Globe className="mx-auto h-12 w-12 text-muted-foreground" />
					<h3 className="mt-2 text-lg font-medium">No lore found</h3>
					<p className="mt-1 text-muted-foreground">Try adjusting your search term.</p>
				</div>
			)}
		</div>
	)
}
