import * as Icons from "lucide-react"
import { redirect, replace, useNavigate, useParams } from "react-router"
import { AlignmentBadge } from "~/components/alignment-badge"
import { BadgeWithTooltip } from "~/components/badge-with-tooltip"
import { Link } from "~/components/ui/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import type { Faction as FactionType } from "~/lib/entities"
import { getFaction } from "~/lib/entities"
import type { Route } from "./+types/$slug"
import { AgendasContent } from "./components/AgendasContent"
import { CultureContent } from "./components/CultureContent"
import { DetailsContent } from "./components/DetailsContent"
import { InfluenceContent } from "./components/InfluenceContent"
import { MembersContent } from "./components/MembersContent"
import { OverviewContent } from "./components/OverviewContent"
import { QuestsContent } from "./components/QuestsContent"

export async function loader({ params }: Route.LoaderArgs) {
	if (!params.slug) {
		throw new Response("No slug provided", { status: 400 })
	}

	const faction = await getFaction(params.slug)

	if (Number.isInteger(Number(params.slug))) {
		return replace(`/factions/${faction.slug}`)
	}

	if (!faction) {
		throw new Response("Faction not found", { status: 404 })
	}

	return faction
}

export default function Faction({ loaderData }: Route.ComponentProps) {
	const faction = loaderData
	const {
		aesthetics,
		agendas,
		affectingConsequences,
		creativePrompts,
		description,
		gmNotes,
		incomingForeshadowing,
		itemRelations,
		loreLinks,
		questHooks,
		conflicts,
		members,
		questParticipation,
		influence,
		narrativeDestinationInvolvement,
		primaryHqSite,
		relations,
		slug,
		taboos,
		values,
		wealth,
		tags,
		history,
		jargon,
		name,
		publicAlignment,
		publicGoal,
		publicPerception,
		reach,
		recognitionSigns,
		rituals,
		secretAlignment,
		secretGoal,
		size,
		symbols,
		transparencyLevel,
		type,
	} = faction
	const { tab } = useParams()
	const activeTab = tab || "overview"
	const navigate = useNavigate()

	const handleTabChange = (value: string) => {
		navigate(`/factions/${slug}/${value === "overview" ? "" : value}`)
	}

	return (
		<div className="container mx-auto py-6 px-4 sm:px-6">
			<div className="mb-6">
				<Link href="/factions" asButton variant="outline" className="mb-4">
					<Icons.ChevronLeft className="h-4 w-4 mr-1" />
					Back to Factions
				</Link>

				<Header {...faction} />

				<Tabs value={activeTab} onValueChange={handleTabChange} className="mt-6">
					<TabsList className="grid grid-cols-7 mb-8 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
						<TabsTrigger
							value="overview"
							className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900"
						>
							Overview
						</TabsTrigger>
						<TabsTrigger value="details" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900">
							Details
						</TabsTrigger>
						<TabsTrigger value="culture" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900">
							Culture
						</TabsTrigger>
						<TabsTrigger value="agendas" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900">
							Agendas
						</TabsTrigger>
						<TabsTrigger
							value="influence"
							className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900"
						>
							Influence
						</TabsTrigger>
						<TabsTrigger value="quests" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900">
							Quests
						</TabsTrigger>
						<TabsTrigger value="members" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900">
							Members
						</TabsTrigger>
					</TabsList>

					<TabsContent value="overview" className="space-y-6 animate-in fade-in-50 duration-300">
						<OverviewContent
							values={values}
							description={description}
							gmNotes={gmNotes}
							name={name}
							publicGoal={publicGoal}
							secretGoal={secretGoal}
							primaryHqSite={primaryHqSite}
							history={history}
							publicPerception={publicPerception}
						/>
					</TabsContent>

					<TabsContent value="details" className="animate-in fade-in-50 duration-300">
						<DetailsContent
							secretAlignment={secretAlignment}
							transparencyLevel={transparencyLevel}
							tags={tags}
							incomingForeshadowing={incomingForeshadowing}
							narrativeDestinationInvolvement={narrativeDestinationInvolvement}
							conflicts={conflicts}
							itemRelations={itemRelations}
							loreLinks={loreLinks}
							creativePrompts={creativePrompts}
							affectingConsequences={affectingConsequences}
							publicAlignment={publicAlignment}
							size={size}
							wealth={wealth}
							reach={reach}
							type={type}
						/>
					</TabsContent>

					<TabsContent value="culture" className="animate-in fade-in-50 duration-300">
						<CultureContent
							aesthetics={aesthetics}
							jargon={jargon}
							recognitionSigns={recognitionSigns}
							taboos={taboos}
							symbols={symbols}
							rituals={rituals}
						/>
					</TabsContent>

					<TabsContent value="agendas" className="space-y-6 animate-in fade-in-50 duration-300">
						<AgendasContent agendas={agendas} />
					</TabsContent>

					<TabsContent value="influence" className="space-y-6 animate-in fade-in-50 duration-300">
						<InfluenceContent relations={relations} influence={influence} />
					</TabsContent>

					<TabsContent value="quests" className="animate-in fade-in-50 duration-300">
						<QuestsContent questHooks={questHooks} questParticipation={questParticipation} />
					</TabsContent>

					<TabsContent value="members" className="animate-in fade-in-50 duration-300">
						<MembersContent members={members} />
					</TabsContent>
				</Tabs>
			</div>
		</div>
	)
}

export function Header({
	name,
	type,
	publicAlignment,
	size,
	wealth,
	reach,
}: Pick<FactionType, "name" | "type" | "size" | "wealth" | "reach" | "publicAlignment">) {
	return (
		<div className="flex flex-col items-start  gap-2">
			<h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-2 flex items-center">
				<Icons.Flag className="h-6 w-6 mr-2 text-primary" />
				{name}
			</h1>

			<div className="flex items-center gap-2">
				<BadgeWithTooltip tooltipContent={"Type"} className={getSizeBadgeClasses(type[0])}>
					{type[0]}
				</BadgeWithTooltip>

				<AlignmentBadge alignment={publicAlignment} />
				<BadgeWithTooltip tooltipContent={"Size"} className={getSizeBadgeClasses(size)}>
					{size}
				</BadgeWithTooltip>

				<BadgeWithTooltip tooltipContent={"Wealth"} className={getWealthBadgeClasses(wealth)}>
					{wealth}
				</BadgeWithTooltip>

				<BadgeWithTooltip tooltipContent={"Reach"} className={getReachBadgeClasses(reach)}>
					{reach}
				</BadgeWithTooltip>

				<BadgeWithTooltip tooltipContent={"Type"}>{type}</BadgeWithTooltip>
			</div>
		</div>
	)
}

const getSizeBadgeClasses = (size: string) => {
	const classes = {
		massive: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
		large: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
		medium: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
		small: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
		tiny: "bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-300",
	}
	return classes[size as keyof typeof classes] || classes.tiny
}

const getWealthBadgeClasses = (wealth: string) => {
	const classes = {
		wealthy: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
		rich: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
		moderate: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
		poor: "bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-300",
		destitute: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
	}
	return classes[wealth as keyof typeof classes] || classes.poor
}

const getReachBadgeClasses = (reach: string) => {
	const classes = {
		global: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",
		continental: "bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300",
		national: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
		regional: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
		local: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
	}
	return classes[reach as keyof typeof classes] || classes.local
}
