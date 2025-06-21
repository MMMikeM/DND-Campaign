import * as Icons from "lucide-react"
import { useNavigate, useParams } from "react-router"
import { BadgeWithTooltip } from "~/components/badge-with-tooltip"
import { Link } from "~/components/ui/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { getLore, type Lore } from "~/lib/entities"
import { titleToCamelCase } from "~/lib/utils"
import type { Route } from "./+types/$slug"
import { ConnectionsContent } from "./components/ConnectionsContent"
import { DetailsContent } from "./components/DetailsContent"
import { ImpactContent } from "./components/ImpactContent"
import { getLoreTypeVariant } from "./utils"

export async function loader({ params }: Route.LoaderArgs) {
	if (!params.slug) {
		throw new Response("No slug provided", { status: 400 })
	}

	const lore = await getLore(params.slug)
	if (!lore) {
		throw new Response("Lore not found", { status: 404 })
	}

	return lore
}

const TABS = ["Details", "Impact", "Connections"]

export default function LoreDetail({ loaderData }: Route.ComponentProps) {
	const { tab } = useParams()
	const navigate = useNavigate()

	const {
		itemRelations,
		name,
		tags,
		summary,
		loreType,
		surfaceImpression,
		livedReality,
		hiddenTruths,
		modernRelevance,
		aesthetics_and_symbols,
		interactions_and_rules,
		connections_to_world,
		core_tenets_and_traditions,
		history_and_legacy,
		conflicting_narratives,
		incomingForeshadowing,
		slug,
		creativePrompts,
		gmNotes,
		links,
	} = loaderData

	const activeTab = tab || "details"

	const handleTabChange = (value: string) => {
		navigate(`/lore/${slug}/${value === "details" ? "" : value}`)
	}

	return (
		<div className="container mx-auto px-4 py-6 sm:px-6">
			<div className="mb-6 flex items-center justify-between">
				<Link href="/lore" asButton variant="outline" size="sm">
					<Icons.ChevronLeft className="mr-2 h-4 w-4" />
					Back to Lore
				</Link>
			</div>

			<Header name={name} loreType={loreType} tags={tags} className="mb-6" />

			<Tabs value={activeTab} onValueChange={handleTabChange} className="mt-6">
				<TabsList className="mb-8 grid grid-cols-3 rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
					{TABS.map((tab) => (
						<TabsTrigger
							key={tab}
							value={titleToCamelCase(tab)}
							className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900"
						>
							{tab}
						</TabsTrigger>
					))}
				</TabsList>

				<TabsContent value="details" className="animate-in fade-in-50 duration-300">
					<DetailsContent
						summary={summary}
						surfaceImpression={surfaceImpression}
						livedReality={livedReality}
						hiddenTruths={hiddenTruths}
						core_tenets_and_traditions={core_tenets_and_traditions}
						history_and_legacy={history_and_legacy}
					/>
				</TabsContent>

				<TabsContent value="impact" className="animate-in fade-in-50 duration-300">
					<ImpactContent
						modernRelevance={modernRelevance}
						aesthetics_and_symbols={aesthetics_and_symbols}
						interactions_and_rules={interactions_and_rules}
						conflicting_narratives={conflicting_narratives}
					/>
				</TabsContent>

				<TabsContent value="connections" className="animate-in fade-in-50 duration-300">
					<ConnectionsContent
						itemRelations={itemRelations}
						incomingForeshadowing={incomingForeshadowing}
						connections_to_world={connections_to_world}
					/>
				</TabsContent>
			</Tabs>
		</div>
	)
}

interface LoreHeaderProps extends Pick<Lore, "name" | "loreType" | "tags"> {
	className?: string
}

export function Header({ name, loreType, tags, className }: LoreHeaderProps) {
	return (
		<div className={className}>
			<h1 className="mb-2 flex items-center text-3xl font-bold text-slate-900 dark:text-slate-50">
				<Icons.BookOpenText className="mr-2 h-6 w-6 text-primary" />
				{name}
			</h1>
			<div className="mt-2 flex flex-wrap gap-2">
				{loreType && (
					<BadgeWithTooltip variant={getLoreTypeVariant(loreType)} tooltipContent="Type of Lore" className="capitalize">
						<Icons.Tag className="mr-1 h-3.5 w-3.5" />
						{loreType.replace(/_/g, " ")}
					</BadgeWithTooltip>
				)}
				{tags?.slice(0, 4).map((tag) => (
					<BadgeWithTooltip key={tag} variant="outline" tooltipContent="Tag">
						{tag}
					</BadgeWithTooltip>
				))}
			</div>
		</div>
	)
}
