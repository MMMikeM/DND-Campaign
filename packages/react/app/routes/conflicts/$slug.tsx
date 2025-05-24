import * as Icons from "lucide-react"
import { NavLink, useNavigate, useParams } from "react-router"
import { BadgeWithTooltip } from "~/components/badge-with-tooltip"
import { Button } from "~/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import type { Conflict } from "~/lib/entities"
import { getConflict } from "~/lib/entities"
import type { Route } from "./+types/$slug"
import { OverviewContent } from "./components/OverviewContent"
import { ParticipantsContent } from "./components/ParticipantsContent"
import { ProgressionContent } from "./components/ProgressionContent"
import { getConflictStatusVariant } from "./utils"

export async function loader({ params }: Route.LoaderArgs) {
	const conflict = await getConflict(params.slug)
	if (!conflict) {
		throw new Response("Conflict not found", { status: 404 })
	}

	console.log(JSON.stringify(conflict, null, 2))

	return conflict
}

interface ConflictHeaderProps extends Pick<Conflict, "name" | "scope" | "nature" | "status"> {
	className?: string
}

export function Header({ name, scope, nature, status, className }: ConflictHeaderProps) {
	return (
		<div className={className}>
			<h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-2 flex items-center">
				<Icons.Swords className="h-6 w-6 mr-2 text-primary" />
				{name}
			</h1>
			<div className="flex flex-wrap gap-2 mt-2">
				<BadgeWithTooltip variant="outline" tooltipContent="Scale of the conflict">
					<Icons.Maximize className="h-3.5 w-3.5 mr-1" />
					{scope}
				</BadgeWithTooltip>
				<BadgeWithTooltip variant="outline" tooltipContent="Nature of the conflict">
					<Icons.ShieldAlert className="h-3.5 w-3.5 mr-1" />
					{nature}
				</BadgeWithTooltip>
				<BadgeWithTooltip variant={getConflictStatusVariant(status)} tooltipContent={`Current status: ${status}`}>
					<Icons.Activity className="h-3.5 w-3.5 mr-1" />
					{status}
				</BadgeWithTooltip>
			</div>
		</div>
	)
}

export default function ConflictDetail({ loaderData }: Route.ComponentProps) {
	const conflict = loaderData
	const { tab } = useParams()
	const activeTab = tab || "overview"
	const navigate = useNavigate()

	const handleTabChange = (value: string) => {
		navigate(`/conflicts/${conflict.slug}/${value === "overview" ? "" : value}`)
	}
	const {
		participants,
		progression,
		cause,
		creativePrompts,
		description,
		hiddenTruths,
		moralDilemma,
		name,
		nature,
		scope,
		stakes,
		status,
		possibleOutcomes,
		primaryRegion,
		slug,
		worldChanges,
	} = conflict

	return (
		<div className="container mx-auto py-6 px-4 sm:px-6">
			<div className="flex justify-between items-center mb-6">
				<Button variant="outline" size="sm" asChild>
					<NavLink to="/conflicts" className="flex items-center">
						<Icons.ChevronLeft className="h-4 w-4 mr-2" />
						Back to Conflicts
					</NavLink>
				</Button>
			</div>

			<Header {...conflict} className="mb-6" />

			<Tabs value={activeTab} onValueChange={handleTabChange} className="mt-6">
				<TabsList className="grid grid-cols-3 mb-8 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
					<TabsTrigger value="overview" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900">
						Overview
					</TabsTrigger>
					<TabsTrigger
						value="participants"
						className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900"
					>
						Participants
					</TabsTrigger>
					<TabsTrigger
						value="progression"
						className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900"
					>
						Progression
					</TabsTrigger>
				</TabsList>

				<TabsContent value="overview" className="space-y-6 animate-in fade-in-50 duration-300">
					<OverviewContent conflict={conflict} />
				</TabsContent>

				<TabsContent value="participants" className="animate-in fade-in-50 duration-300">
					<ParticipantsContent conflict={conflict} />
				</TabsContent>

				<TabsContent value="progression" className="animate-in fade-in-50 duration-300">
					<ProgressionContent conflict={conflict} />
				</TabsContent>
			</Tabs>
		</div>
	)
}
