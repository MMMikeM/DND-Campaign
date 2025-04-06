import * as Icons from "lucide-react"
import { useState, useMemo } from "react"
import { NavLink } from "react-router" // Corrected import source
import { Input } from "~/components/ui/input"
import { InfoCard } from "~/components/InfoCard"
import { BadgeWithTooltip } from "~/components/badge-with-tooltip"
import { getAllForeshadowing } from "~/lib/entities"
import { getForeshadowingSubtletyVariant } from "./utils"
import type { Route } from "./+types/index"
import { List } from "~/components/List"

export async function loader({ params }: Route.LoaderArgs) {
	const foreshadowingItems = await getAllForeshadowing()
	if (!foreshadowingItems) {
		console.warn("No foreshadowing items found or failed to load.")
		return []
	}
	return foreshadowingItems
}

export default function ForeshadowingIndex({ loaderData }: Route.ComponentProps) {
	const allItems = loaderData ?? []
	const [searchTerm, setSearchTerm] = useState("")

	const filteredItems = useMemo(() => {
		return allItems.filter((item) => {
			const lowerSearchTerm = searchTerm.toLowerCase()
			return (
				item.name.toLowerCase().includes(lowerSearchTerm) ||
				item.type.toLowerCase().includes(lowerSearchTerm) ||
				item.description.join(" ").toLowerCase().includes(lowerSearchTerm)
			)
		})
	}, [allItems, searchTerm])

	return (
		<div className="container mx-auto py-6 px-4 sm:px-6">
			<div className="flex justify-between items-center mb-6">
				<div>
					<h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-1 flex items-center">
						<Icons.Eye className="h-6 w-6 mr-2 text-primary" />
						Narrative Foreshadowing
					</h1>
					<p className="text-muted-foreground">Hints and clues pointing towards future events or revelations.</p>
				</div>
			</div>

			<div className="mb-6">
				<div className="relative">
					<Icons.Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
					<Input
						type="search"
						placeholder="Search foreshadowing by name, type, description..."
						className="pl-8"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						aria-label="Search foreshadowing"
					/>
				</div>
			</div>

			{filteredItems.length > 0 ? (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{filteredItems.map((item) => (
						<NavLink key={item.id} to={`/foreshadowing/${item.slug}`} className="no-underline">
							<InfoCard
								title={item.name}
								icon={<Icons.Eye className="h-5 w-5 mr-2 text-cyan-500" />}
								className="h-full hover:shadow-md transition-shadow"
							>
								<List items={item.description} />
								<div className="border-t p-4">
									<BadgeWithTooltip
										variant={getForeshadowingSubtletyVariant(item.subtlety)}
										tooltipContent={`Subtlety: ${item.subtlety ?? "Unknown"}`}
										className="capitalize"
									>
										{item.subtlety ?? "Unknown"}
									</BadgeWithTooltip>
								</div>
							</InfoCard>
						</NavLink>
					))}
				</div>
			) : (
				<div className="text-center py-12">
					<Icons.EyeOff className="mx-auto h-12 w-12 text-muted-foreground" />
					<h3 className="mt-2 text-lg font-medium">No foreshadowing found</h3>
					<p className="mt-1 text-muted-foreground">Try adjusting your search term.</p>
				</div>
			)}
		</div>
	)
}
