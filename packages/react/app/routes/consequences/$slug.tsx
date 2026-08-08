import * as Icons from "lucide-react"
import { NavLink, useNavigate, useParams } from "react-router"
import { BadgeWithTooltip } from "~/components/badge-with-tooltip"
import { ForeshadowingList } from "~/components/ForeshadowingList"
import { Tags } from "~/components/Tags"
import { buttonVariants } from "~/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { type Consequence, getConsequence } from "~/lib/entities"
import type { Route } from "./+types/$slug"
import { ConnectionsContent } from "./components/ConnectionsContent"
import { OverviewContent } from "./components/OverviewContent"

export async function loader({ params }: Route.LoaderArgs) {
	if (!params.slug) {
		throw new Response("No slug provided", { status: 400 })
	}

	return await getConsequence(params.slug)
}

export default function ConsequenceDetail({ loaderData }: Route.ComponentProps) {
	const {
		affectedArea,
		affectedConflict,
		affectedConsequence,
		affectedFaction,
		affectedNpc,
		affectedQuest,
		affectedRegion,
		affectedSite,
		affectingConsequences,
		complicationDetails,
		conflictImpactDescription,
		consequenceType,
		creativePrompts,
		description,
		escalationDetails,
		incomingForeshadowing,
		name,
		playerImpactFeel,
		severity,
		slug,
		sourceType,
		tags,
		timeframe,
		triggerQuest,
		triggerQuestStageDecision,
		twistRevealDetails,
		visibility,
	} = loaderData

	const { tab } = useParams()
	const activeTab = tab || "overview"
	const navigate = useNavigate()

	const handleTabChange = (value: string) => {
		navigate(`/consequences/${slug}/${value === "overview" ? "" : value}`)
	}

	return (
		<div className="container mx-auto py-6 px-4 sm:px-6">
			<div className="flex justify-between items-center mb-6">
				<NavLink to="/quests" className={buttonVariants({ variant: "outline", size: "sm" })}>
					<Icons.ChevronLeft className="h-4 w-4 mr-2" />
					Back to Consequences
				</NavLink>
			</div>

			<Header
				name={name}
				consequenceType={consequenceType}
				severity={severity}
				visibility={visibility}
				timeframe={timeframe}
				sourceType={sourceType}
			/>

			<Tags tags={tags} variant="secondary" maxDisplay={8} className="mb-6" />

			<Tabs value={activeTab} onValueChange={handleTabChange} className="mt-6">
				<TabsList className="grid grid-cols-2 mb-8">
					<TabsTrigger value="overview">Overview</TabsTrigger>
					<TabsTrigger value="connections">Connections</TabsTrigger>
				</TabsList>

				<TabsContent value="overview" className="space-y-6 animate-in fade-in-50 duration-300">
					<OverviewContent
						complicationDetails={complicationDetails}
						conflictImpactDescription={conflictImpactDescription}
						creativePrompts={creativePrompts}
						description={description}
						escalationDetails={escalationDetails}
						playerImpactFeel={playerImpactFeel}
						twistRevealDetails={twistRevealDetails}
					/>
				</TabsContent>

				<TabsContent value="connections" className="space-y-6 animate-in fade-in-50 duration-300">
					<ConnectionsContent
						affectedArea={affectedArea}
						affectedConflict={affectedConflict}
						affectedConsequence={affectedConsequence}
						affectedFaction={affectedFaction}
						affectedNpc={affectedNpc}
						affectedQuest={affectedQuest}
						affectedRegion={affectedRegion}
						affectedSite={affectedSite}
						affectingConsequences={affectingConsequences}
						triggerQuest={triggerQuest}
						triggerQuestStageDecision={triggerQuestStageDecision}
					/>
					<ForeshadowingList
						incoming={incomingForeshadowing}
						emptyMessage="No foreshadowing points toward this consequence."
					/>
				</TabsContent>
			</Tabs>
		</div>
	)
}

type HeaderProps = Pick<
	Consequence,
	"name" | "consequenceType" | "severity" | "visibility" | "timeframe" | "sourceType"
>

export function Header({ name, consequenceType, severity, visibility, timeframe, sourceType }: HeaderProps) {
	return (
		<div>
			<h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-2 flex items-center">
				<Icons.Activity className="h-6 w-6 mr-2 text-primary" />
				{name}
			</h1>
			<div className="flex flex-wrap gap-2 mt-2">
				<BadgeWithTooltip variant="outline" tooltipContent="Kind of consequence" className="capitalize">
					<Icons.Tag className="h-3.5 w-3.5 mr-1" />
					{consequenceType}
				</BadgeWithTooltip>
				<BadgeWithTooltip variant="outline" tooltipContent="How severe the impact is" className="capitalize">
					<Icons.AlertTriangle className="h-3.5 w-3.5 mr-1" />
					{severity}
				</BadgeWithTooltip>
				<BadgeWithTooltip variant="outline" tooltipContent="How visible this is to players" className="capitalize">
					<Icons.Eye className="h-3.5 w-3.5 mr-1" />
					{visibility}
				</BadgeWithTooltip>
				<BadgeWithTooltip variant="outline" tooltipContent="When this lands" className="capitalize">
					<Icons.Clock className="h-3.5 w-3.5 mr-1" />
					{timeframe}
				</BadgeWithTooltip>
				<BadgeWithTooltip variant="outline" tooltipContent="Where this originated" className="capitalize">
					<Icons.GitBranch className="h-3.5 w-3.5 mr-1" />
					{sourceType}
				</BadgeWithTooltip>
			</div>
		</div>
	)
}
