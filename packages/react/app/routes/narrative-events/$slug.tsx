import * as Icons from "lucide-react"
import { NavLink, useNavigate, useParams } from "react-router"
import { BadgeWithTooltip } from "~/components/badge-with-tooltip"
import { Button } from "~/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { getNarrativeEvent, type NarrativeEvent } from "~/lib/entities"
import type { Route } from "./+types/$slug"
import { OverviewContent } from "./components/OverviewContent"
import { QuestsContent } from "./components/QuestsContent"

export async function loader({ params }: Route.LoaderArgs) {
	if (!params.slug) {
		throw new Response("No slug provided", { status: 400 })
	}

	const narrativeEvent = await getNarrativeEvent(params.slug)
	if (!narrativeEvent) {
		throw new Response("Narrative Arc not found", { status: 404 })
	}

	return narrativeEvent
}

type key = keyof NarrativeEvent

export default function NarrativeEventDetail({ loaderData }: Route.ComponentProps) {
	const narrativeEvent = loaderData
	const {
		id,
		name,
		creativePrompts,
		description,
		gmNotes,
		tags,
		questStageId,
		eventType,
		intendedRhythmEffect,
		narrativePlacement,
		impactSeverity,
		triggeringStageDecisionId,
		relatedQuestId,
		complication_details,
		escalation_details,
		twist_reveal_details,
		questStage,
		triggeringStageDecision,
		relatedQuest,
		incomingForeshadowing,
		slug,
	} = narrativeEvent
	const { tab } = useParams()
	const activeTab = tab || "overview"
	const navigate = useNavigate()

	const handleTabChange = (value: string) => {
		navigate(`/narrative-events/${slug}/${value === "overview" ? "" : value}`)
	}

	if (!narrativeEvent) {
		return <div>Error: Narrative Arc data could not be loaded.</div>
	}

	return (
		<div className="container mx-auto py-6 px-4 sm:px-6">
			<div className="flex justify-between items-center mb-6">
				<Button variant="outline" size="sm" asChild>
					<NavLink to="/narrative" className="flex items-center">
						<Icons.ChevronLeft className="h-4 w-4 mr-2" />
						Back to Narrative Arcs
					</NavLink>
				</Button>
			</div>
			<Header name={name} eventType={eventType} />
			<Tabs value={activeTab} onValueChange={handleTabChange} className="mt-6">
				<TabsList className="grid grid-cols-2 mb-8 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
					<TabsTrigger value="overview" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900">
						Overview
					</TabsTrigger>
					<TabsTrigger value="quests" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900">
						Quests
					</TabsTrigger>
				</TabsList>

				<TabsContent value="overview" className="space-y-6 animate-in fade-in-50 duration-300">
					<OverviewContent
						name={name}
						eventType={eventType}
						description={description}
						creativePrompts={creativePrompts}
						gmNotes={gmNotes}
					/>
				</TabsContent>

				<TabsContent value="quests" className="animate-in fade-in-50 duration-300">
					<QuestsContent questStage={questStage} relatedQuest={relatedQuest} />
				</TabsContent>
			</Tabs>
		</div>
	)
}

export function Header({ name, eventType }: Pick<NarrativeEvent, "name" | "eventType">) {
	return (
		<div>
			<h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-2 flex items-center">
				<Icons.Workflow className="h-6 w-6 mr-2 text-primary" />
				{name}
			</h1>
			<div className="flex flex-wrap gap-2 mt-2">
				<BadgeWithTooltip variant="outline" tooltipContent="Type of arc" className="capitalize">
					<Icons.Tag className="h-3.5 w-3.5 mr-1" />
					{eventType}
				</BadgeWithTooltip>
			</div>
		</div>
	)
}
