import * as Icons from "lucide-react"
import { NavLink, useNavigate, useParams } from "react-router"
import { Button } from "~/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { getQuest, getQuestStages } from "~/lib/entities"
import type { Route } from "./+types/$slug"
import ConnectionsContent from "./components/ConnectionsContent"
import OverviewContent from "./components/OverviewContent"
import { QuestHeader } from "./components/QuestHeader"
import StagesContent from "./components/StagesContent"
import ThemesContent from "./components/ThemesContent"
import TwistsContent from "./components/TwistsContent"

export async function loader({ params }: Route.LoaderArgs) {
	if (!params.slug) {
		throw new Response("No slug provided", { status: 400 })
	}

	const quest = await getQuest(params.slug)

	if (!quest) {
		throw new Response("Quest not found", { status: 404 })
	}

	const stages = await getQuestStages(quest.id)

	return { quest, stages }
}

export default function QuestDetailPage({ loaderData }: Route.ComponentProps) {
	const { quest, stages } = loaderData
	const { tab, stageSlug, stageTab } = useParams()

	const activeTab = stageSlug ? "stages" : tab || "overview"
	const navigate = useNavigate()

	const selectedStage = stageSlug ? quest.stages.find((stage) => stage.slug === stageSlug) : quest.stages[0] || null

	const selectedStageId = selectedStage?.id || null

	const { name, slug } = quest

	const handleTabChange = (value: string) => {
		if (value === "stages" && selectedStage) {
			navigate(`/quests/${slug}/stages/${selectedStage.slug}`)
		} else {
			navigate(`/quests/${slug}/${value === "overview" ? "" : value}`)
		}
	}

	const handleStageSelect = (stageId: number) => {
		const stage = quest.stages.find((s) => s.id === stageId)
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

			<QuestHeader {...quest} />

			<Tabs value={activeTab} onValueChange={handleTabChange} className="mb-10">
				<TabsList className="grid grid-cols-5">
					<TabsTrigger value="overview">Overview</TabsTrigger>
					<TabsTrigger value="stages">Stages</TabsTrigger>
					<TabsTrigger value="themes">Themes</TabsTrigger>
					<TabsTrigger value="connections">Connections</TabsTrigger>
					<TabsTrigger value="twists">Twists</TabsTrigger>
				</TabsList>

				<TabsContent value="overview" className="space-y-6 mt-6">
					<OverviewContent quest={quest} />
				</TabsContent>

				<TabsContent value="stages" className="space-y-6 mt-6">
					{stageSlug && selectedStage ? (
						<StagesContent
							quest={quest}
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
					<ThemesContent quest={quest} />
				</TabsContent>

				<TabsContent value="connections" className="space-y-6">
					<ConnectionsContent quest={quest} />
				</TabsContent>

				<TabsContent value="twists" className="space-y-6 mt-6">
					<TwistsContent quest={quest} />
				</TabsContent>
			</Tabs>
		</div>
	)
}
