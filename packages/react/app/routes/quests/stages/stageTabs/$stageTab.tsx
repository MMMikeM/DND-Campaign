import { Navigate, useNavigate, useOutletContext, useParams } from "react-router"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import type { Quest } from "~/lib/entities"
import Decisions from "./components/decisions"
import Details from "./components/details"
import Overview from "./components/overview"

export default function StageOverviewTab() {
	// Get the selected stage from outlet context
	const { selectedStage, questSlug } = useOutletContext<{ selectedStage: Quest["stages"][0]; questSlug: string }>()

	const { stageTab, stageSlug } = useParams()
	const navigate = useNavigate()

	if (!selectedStage) {
		return <div>No stage data available</div>
	}

	if (!stageTab) {
		return <Navigate to={`/quests/${questSlug}/stages/${stageSlug}/overview`} />
	}

	const handleTabChange = (value: string) => {
		navigate(`/quests/${questSlug}/stages/${stageSlug}/${value}`)
	}

	return (
		<div className="min-h-screen">
			<Tabs value={stageTab} onValueChange={handleTabChange} className="w-full">
				<TabsList className="grid w-full grid-cols-3 mb-4">
					<TabsTrigger value="overview">Overview</TabsTrigger>
					<TabsTrigger value="decisions">Decisions</TabsTrigger>
					<TabsTrigger value="details">Details</TabsTrigger>
				</TabsList>
			</Tabs>
			<Tabs value={stageTab}>
				<TabsContent value="overview">
					<Overview {...selectedStage} />
				</TabsContent>
				<TabsContent value="decisions">
					<Decisions {...selectedStage} />
				</TabsContent>
				<TabsContent value="details">
					<Details {...selectedStage} />
				</TabsContent>
			</Tabs>
		</div>
	)
}
