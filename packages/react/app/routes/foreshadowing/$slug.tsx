import * as Icons from "lucide-react"
import React from "react"
import { useNavigate, useParams, NavLink } from "react-router"
import { Button } from "~/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { getForeshadowing, type Foreshadowing } from "~/lib/entities"
import type { Route } from "./+types/$slug"
import { BadgeWithTooltip } from "~/components/badge-with-tooltip"
import { getForeshadowingSubtletyVariant } from "./utils"

import DetailsContent from "./components/DetailsContent"
import ConnectionsContent from "./components/ConnectionsContent"

export async function loader({ params }: Route.LoaderArgs) {
	if (!params.slug) {
		throw new Response("No slug provided", { status: 400 })
	}

	const item = await getForeshadowing(params.slug)
	if (!item) {
		throw new Response("Foreshadowing item not found", { status: 404 })
	}

	return item
}

export function Header({ name, type, subtlety }: Foreshadowing) {
	return (
		<div>
			<h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-2 flex items-center">
				<Icons.Eye className="h-6 w-6 mr-2 text-primary" />
				{name}
			</h1>
			<div className="flex flex-wrap gap-2 mt-2">
				<BadgeWithTooltip variant="outline" tooltipContent="Form of the foreshadowing" className="capitalize">
					<Icons.FileText className="h-3.5 w-3.5 mr-1" />
					{type}
				</BadgeWithTooltip>
				<BadgeWithTooltip
					variant={getForeshadowingSubtletyVariant(subtlety)}
					tooltipContent={`Subtlety: ${subtlety}`}
					className="capitalize"
				>
					<Icons.SignalLow className="h-3.5 w-3.5 mr-1" />
					{subtlety}
				</BadgeWithTooltip>
			</div>
		</div>
	)
}

export default function ForeshadowingDetail({ loaderData }: Route.ComponentProps) {
	const item = loaderData
	const { tab } = useParams()
	const activeTab = tab || "details"
	const navigate = useNavigate()

	const handleTabChange = (value: string) => {
		navigate(`/foreshadowing/${item.slug}/${value === "details" ? "" : value}`)
	}

	if (!item) {
		return <div>Error: Foreshadowing data could not be loaded.</div>
	}

	return (
		<div className="container mx-auto py-6 px-4 sm:px-6">
			<div className="flex justify-between items-center mb-6">
				<Button variant="outline" size="sm" asChild>
					<NavLink to="/foreshadowing" className="flex items-center">
						<Icons.ChevronLeft className="h-4 w-4 mr-2" />
						Back to Foreshadowing
					</NavLink>
				</Button>
			</div>
			<Header {...item} />
			<Tabs value={activeTab} onValueChange={handleTabChange} className="mt-6">
				<TabsList className="grid grid-cols-2 mb-8 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
					<TabsTrigger value="details" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900">
						Details
					</TabsTrigger>
					<TabsTrigger
						value="connections"
						className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900"
					>
						Connections
					</TabsTrigger>
				</TabsList>

				<TabsContent value="details" className="space-y-6 animate-in fade-in-50 duration-300">
					<DetailsContent item={item} />
				</TabsContent>

				<TabsContent value="connections" className="animate-in fade-in-50 duration-300">
					<ConnectionsContent item={item} />
				</TabsContent>
			</Tabs>
		</div>
	)
}
