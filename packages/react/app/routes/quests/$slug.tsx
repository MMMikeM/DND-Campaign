import * as Icons from "lucide-react"
import { NavLink, useNavigate, useParams } from "react-router"
import { ConsequenceList } from "~/components/ConsequenceList"
import { ForeshadowingList } from "~/components/ForeshadowingList"
import { Tags } from "~/components/Tags"
import { Button } from "~/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { getQuest } from "~/lib/entities"
import type { Route } from "./+types/$slug"
import { ConnectionsContent } from "./components/ConnectionsContent"
import { OverviewContent } from "./components/OverviewContent"
import { QuestHeader } from "./components/QuestHeader"
import { StagesContent } from "./components/StagesContent"
import { ThemesContent } from "./components/ThemesContent"

export async function loader({ params }: Route.LoaderArgs) {
	if (!params.slug) {
		throw new Response("No slug provided", { status: 400 })
	}

	const quest = await getQuest(params.slug)

	return quest
}

export default function QuestDetailPage({ loaderData }: Route.ComponentProps) {
	const {
		affectingConsequences,
		creativePrompts,
		dependentQuests,
		description,
		emotionalShape,
		eventType,
		hooks,
		impactSeverity,
		incomingForeshadowing,
		intendedRhythmEffect,
		itemConnections,
		loreLinks,
		mood,
		name,
		narrativePlacement,
		objectives,
		otherUnlockConditionsNotes,
		outgoingForeshadowing,
		participants,
		payoff,
		prerequisiteQuest,
		primaryPlayerExperienceGoal,
		promise,
		relations,
		rewards,
		slug,
		stages,
		stakes,
		tags,
		triggeredConsequences,
		type,
		urgency,
	} = loaderData

	const { tab, stageSlug, stageTab } = useParams()

	const activeTab = stageSlug ? "stages" : tab || "overview"
	const navigate = useNavigate()

	const selectedStage = stageSlug ? stages.find((stage) => stage.slug === stageSlug) : (stages[0] ?? null)

	const selectedStageId = selectedStage?.id ?? null

	const handleTabChange = (value: string) => {
		if (value === "stages" && selectedStage) {
			navigate(`/quests/${slug}/stages/${selectedStage.slug}`)
		} else {
			navigate(`/quests/${slug}/${value === "overview" ? "" : value}`)
		}
	}

	const handleStageSelect = (stageId: number) => {
		const stage = stages.find((s) => s.id === stageId)
		if (stage) {
			if (stageTab) {
				navigate(`/quests/${slug}/stages/${stage.slug}/${stageTab}`)
			} else {
				navigate(`/quests/${slug}/stages/${stage.slug}`)
			}
		}
	}

	return (
		<div className="container mx-auto py-6">
			<div className="mb-6">
				<Button variant="outline" size="sm" asChild>
					<NavLink to="/quests" className="flex items-center">
						<Icons.ChevronLeft className="h-4 w-4 mr-2" />
						Back to Quests
					</NavLink>
				</Button>
			</div>

			<QuestHeader name={name} type={type} urgency={urgency} mood={mood} />

			<Tags tags={tags} variant="secondary" maxDisplay={8} className="mb-6" />

			<Tabs value={activeTab} onValueChange={handleTabChange} className="mb-10">
				<TabsList className="grid grid-cols-5">
					<TabsTrigger value="overview">Overview</TabsTrigger>
					<TabsTrigger value="stages">Stages</TabsTrigger>
					<TabsTrigger value="themes">Themes</TabsTrigger>
					<TabsTrigger value="connections">Connections</TabsTrigger>
					<TabsTrigger value="consequences">Consequences</TabsTrigger>
				</TabsList>

				<TabsContent value="overview" className="space-y-6 mt-6">
					<OverviewContent
						description={description}
						hooks={hooks}
						objectives={objectives}
						otherUnlockConditionsNotes={otherUnlockConditionsNotes}
						payoff={payoff}
						prerequisiteQuest={prerequisiteQuest}
						promise={promise}
						rewards={rewards}
						stakes={stakes}
					/>
				</TabsContent>

				<TabsContent value="stages" className="space-y-6 mt-6">
					{stageSlug && selectedStage ? (
						<StagesContent
							name={name}
							slug={slug}
							stages={stages}
							selectedStageId={selectedStageId}
							onStageSelect={handleStageSelect}
							stageTab={stageTab || "overview"}
						/>
					) : (
						<div className="text-center p-6 border rounded-md">
							<p className="text-muted-foreground">Please select a stage from the list</p>
						</div>
					)}
				</TabsContent>

				<TabsContent value="themes" className="space-y-6 mt-6">
					<ThemesContent
						creativePrompts={creativePrompts}
						emotionalShape={emotionalShape}
						eventType={eventType}
						impactSeverity={impactSeverity}
						intendedRhythmEffect={intendedRhythmEffect}
						narrativePlacement={narrativePlacement}
						primaryPlayerExperienceGoal={primaryPlayerExperienceGoal}
					/>
				</TabsContent>

				<TabsContent value="connections" className="space-y-6">
					<ConnectionsContent
						dependentQuests={dependentQuests}
						itemConnections={itemConnections}
						loreLinks={loreLinks}
						participants={participants}
						relations={relations}
					/>
					<ForeshadowingList
						incoming={incomingForeshadowing}
						outgoing={outgoingForeshadowing}
						emptyMessage="No foreshadowing is linked to this quest."
					/>
				</TabsContent>

				<TabsContent value="consequences" className="space-y-6 mt-6">
					<ConsequenceList
						triggered={triggeredConsequences}
						affecting={affectingConsequences}
						emptyMessage="No consequences are linked to this quest."
					/>
				</TabsContent>
			</Tabs>
		</div>
	)
}
