import React, { useState } from "react"
import { NavLink, useParams, useNavigate } from "react-router"
import * as Icons from "lucide-react"
import { Button } from "~/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { getQuest, getQuestStages } from "~/lib/entities"
import type { Route } from "./+types/$slug"

import OverviewContent from "./components/OverviewContent"
import StagesContent from "./components/StagesContent"
import ThemesContent from "./components/ThemesContent"
import ConnectionsContent from "./components/ConnectionsContent"
import TwistsContent from "./components/TwistsContent"

import { QuestHeader } from "./components/QuestHeader"

export async function loader({ params }: Route.LoaderArgs) {
	if (!params.slug) {
		throw new Response("No slug provided", { status: 400 })
	}

	const quest = await getQuest(params.slug)

	if (!quest) {
		throw new Response("Quest not found", { status: 404 })
	}

	const stages2 = await getQuestStages(quest.id)

	return { quest, stages2 }
}

export default function QuestDetailPage({ loaderData }: Route.ComponentProps) {
	const { quest, stages2 } = loaderData
	console.log(stages2)
	const { tab, stageId } = useParams()
	// If stageId is present, force the active tab to be "stages"
	const activeTab = stageId ? "stages" : tab || "overview"
	const navigate = useNavigate()

	const [selectedStageId, setSelectedStageId] = useState<number | null>(
		stageId ? parseInt(stageId, 10) : stages2.stageTree?.id || null,
	)

	const { factions, name, region, slug, type, urgency, visibility, mood } = quest

	const handleTabChange = (value: string) => {
		// When changing tabs, always navigate to the basic tab route (without stage)
		navigate(`/quests/${slug}/${value === "overview" ? "" : value}`)
	}

	const handleStageSelect = (stageId: number | null) => {
		setSelectedStageId(stageId)
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
					<StagesContent
						quest={quest}
						stages={stages2}
						selectedStageId={selectedStageId}
						onStageSelect={handleStageSelect}
					/>
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
