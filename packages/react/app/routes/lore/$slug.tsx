import * as Icons from "lucide-react"
import { NavLink, useNavigate, useParams } from "react-router"
import { BadgeWithTooltip } from "~/components/badge-with-tooltip"
import { Button } from "~/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { getLore, type Lore } from "~/lib/entities"
import type { Route } from "./+types/$slug"

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

export default function LoreDetail({ loaderData }: Route.ComponentProps) {
	const lore = loaderData
	const {
		itemRelations,
		questHooks,
		id,
		name,
		creativePrompts,
		gmNotes,
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
		links,
		incomingForeshadowing,
		slug,
	} = lore
	const { tab } = useParams()
	const activeTab = tab || "details"
	const navigate = useNavigate()

	const handleTabChange = (value: string) => {
		navigate(`/lore/${lore.slug}/${value === "details" ? "" : value}`)
	}

	return (
		<div className="container mx-auto py-6 px-4 sm:px-6">
			<div className="flex justify-between items-center mb-6">
				<Button variant="outline" size="sm" asChild>
					<NavLink to="/world" className="flex items-center">
						<Icons.ChevronLeft className="h-4 w-4 mr-2" />
						Back to World Changes
					</NavLink>
				</Button>
			</div>

			<Header {...lore} className="mb-6" />

			<Tabs value={activeTab} onValueChange={handleTabChange} className="mt-6">
				<TabsList className="grid grid-cols-3 mb-8 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
					<TabsTrigger value="details" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900">
						Details
					</TabsTrigger>
					<TabsTrigger value="impact" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900">
						Impact
					</TabsTrigger>
					<TabsTrigger
						value="connections"
						className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900"
					>
						Connections
					</TabsTrigger>
				</TabsList>

				<TabsContent value="details" className="space-y-6 animate-in fade-in-50 duration-300">
					<DetailsContent change={change} />
				</TabsContent>

				<TabsContent value="impact" className="animate-in fade-in-50 duration-300">
					<ImpactContent change={change} />
				</TabsContent>

				<TabsContent value="connections" className="animate-in fade-in-50 duration-300">
					<ConnectionsContent change={change} />
				</TabsContent>
			</Tabs>
		</div>
	)
}

export function Header({
	name,
	conceptType,
	moralClarity,
	currentEffectiveness,
	scope,
	status,
	timeframe,
	className,
}: ChangeHeaderProps) {
	return (
		<div className={className}>
			<h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-2 flex items-center">
				<Icons.Globe className="h-6 w-6 mr-2 text-primary" />
				{name}
			</h1>
			<div className="flex flex-wrap gap-2 mt-2">
				<BadgeWithTooltip variant="outline" tooltipContent="Type of change" className="capitalize">
					<Icons.Tag className="h-3.5 w-3.5 mr-1" />
					{conceptType}
				</BadgeWithTooltip>
				<BadgeWithTooltip
					variant={getChangeSeverityVariant(moralClarity)}
					tooltipContent={`Severity: ${moralClarity}`}
					className="capitalize"
				>
					<Icons.AlertTriangle className="h-3.5 w-3.5 mr-1" /> {/* Example icon */}
					{moralClarity}
				</BadgeWithTooltip>
				<BadgeWithTooltip variant="outline" tooltipContent="Visibility of the change" className="capitalize">
					<Icons.Eye className="h-3.5 w-3.5 mr-1" />
					{status}
				</BadgeWithTooltip>
				<BadgeWithTooltip variant="outline" tooltipContent="Timeframe of the change" className="capitalize">
					<Icons.Clock className="h-3.5 w-3.5 mr-1" />
					{scope}
				</BadgeWithTooltip>
			</div>
		</div>
	)
}
