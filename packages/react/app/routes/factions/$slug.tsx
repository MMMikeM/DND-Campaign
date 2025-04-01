import * as Icons from "lucide-react"
import React from "react"
import { useNavigate, useParams } from "react-router"
import { Link } from "~/components/ui/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { getFaction } from "~/lib/entities"
import type { Route } from "./+types/$slug"

// Tab content components
import { OverviewContent } from "./components/OverviewContent"
import { DetailsContent } from "./components/DetailsContent"
import { CultureContent } from "./components/CultureContent"
import { OperationsContent } from "./components/OperationsContent"
import { InfluenceContent } from "./components/InfluenceContent"
import { QuestsContent } from "./components/QuestsContent"
import { MembersContent } from "./components/MembersContent"
import type { Faction } from "~/lib/entities"

// Server-side data fetching
export async function loader({ params }: Route.LoaderArgs) {
	if (!params.slug) {
		throw new Response("No slug provided", { status: 400 })
	}

	const faction = await getFaction(params.slug)
	if (!faction) {
		throw new Response("Faction not found", { status: 404 })
	}

	return faction
}

export default function Faction({ loaderData }: Route.ComponentProps) {
	const faction = loaderData
	const { tab } = useParams()
	const activeTab = tab || "overview"
	const navigate = useNavigate()

	const handleTabChange = (value: string) => {
		navigate(`/factions/${faction.slug}/${value === "overview" ? "" : value}`)
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
						<TabsTrigger value="overview" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900">Overview</TabsTrigger>
						<TabsTrigger value="details" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900">Details</TabsTrigger>
						<TabsTrigger value="culture" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900">Culture</TabsTrigger>
						<TabsTrigger value="operations" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900">Operations</TabsTrigger>
						<TabsTrigger value="influence" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900">Influence</TabsTrigger>
						<TabsTrigger value="quests" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900">Quests</TabsTrigger>
						<TabsTrigger value="members" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900">Members</TabsTrigger>
					</TabsList>

					{/* Overview Tab */}
					<TabsContent value="overview" className="space-y-6 animate-in fade-in-50 duration-300">
						<OverviewContent {...faction} />
					</TabsContent>

					{/* Details Tab */}
					<TabsContent value="details" className="animate-in fade-in-50 duration-300">
						<DetailsContent {...faction} />
					</TabsContent>

					{/* Culture Tab */}
					<TabsContent value="culture" className="animate-in fade-in-50 duration-300">
						<CultureContent {...faction} />
					</TabsContent>

					{/* Operations Tab */}
					<TabsContent value="operations" className="space-y-6 animate-in fade-in-50 duration-300">
						<OperationsContent operations={faction.operations} />
					</TabsContent>

					{/* Influence Tab */}
					<TabsContent value="influence" className="space-y-6 animate-in fade-in-50 duration-300">
						<InfluenceContent {...faction} />
					</TabsContent>

					{/* Quests Tab */}
					<TabsContent value="quests" className="animate-in fade-in-50 duration-300">
						<QuestsContent {...faction} />
					</TabsContent>

					{/* Members Tab */}
					<TabsContent value="members" className="animate-in fade-in-50 duration-300">
						<MembersContent {...faction} />
					</TabsContent>
				</Tabs>
			</div>
		</div>
	)
}



interface FactionHeaderProps extends Pick<Faction, 'name' | 'type'> {
	className?: string
}

export function Header({ name, type, className }: FactionHeaderProps) {
	return (
		<div className={className}>
			<h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-2 flex items-center">
				<Icons.Flag className="h-6 w-6 mr-2 text-primary" />
				{name}
			</h1>
			
			{type && (
				<p className="text-slate-600 dark:text-slate-400">
					<Icons.Briefcase className="h-4 w-4 inline-block mr-1" />
					{type}
				</p>
			)}
		</div>
	)
} 