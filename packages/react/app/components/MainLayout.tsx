import * as Icons from "lucide-react"
import { useEffect } from "react"
import { Outlet, useFetcher } from "react-router"
import type { Items } from "~/routes/api/items"
import type { Route } from "../routes/api/+types/items"
import { SidebarNav } from "./sidebar/SidebarNav"
import { Sidebar, SidebarContent, SidebarHeader, SidebarProvider } from "./ui/sidebar"

export function MainLayout({ loaderData }: Route.ComponentProps) {
	const fetcher = useFetcher<Items>()

	useEffect(() => {
		if (fetcher.state === "idle" && fetcher.data == null) {
			fetcher.load("/api/items")
		}
	}, [fetcher])

	const formattedData = {
		factions: fetcher.data?.factions,
		npcs: fetcher.data?.npcs,
		regions: fetcher.data?.regions,
		areas: fetcher.data?.areas,
		sites: fetcher.data?.sites,
		quests: fetcher.data?.quests,
		conflicts: fetcher.data?.conflicts,
		foreshadowing: fetcher.data?.foreshadowing,
		narrativeEvents: fetcher.data?.narrativeEvents,
		narrativeDestinations: fetcher.data?.narrativeDestinations,
		lore: fetcher.data?.lore,
		maps: fetcher.data?.maps,
	}

	return (
		<SidebarProvider defaultOpen={true}>
			<div className="flex h-screen w-screen">
				<Sidebar className="border-r bg-gradient-to-b from-background to-muted/30 relative">
					{/* Subtle background pattern */}
					<div
						className="absolute inset-0 opacity-5 pointer-events-none z-0"
						style={{
							backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%239C92AC' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E")`,
						}}
					/>
					<SidebarHeader className="p-5 border-b border-indigo-100/10 flex items-center gap-2 relative z-10">
						<div className="flex items-center gap-3">
							<div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-2 rounded-lg text-white shadow-md">
								<Icons.BookOpen className="h-6 w-6" />
							</div>
							<div>
								<h2 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
									Lore Master
								</h2>
								<p className="text-xs text-muted-foreground">Campaign Manager</p>
							</div>
						</div>
					</SidebarHeader>
					<SidebarContent className="px-3 py-5 relative z-10">
						<SidebarNav menuData={formattedData} />
					</SidebarContent>
				</Sidebar>
				<main className="flex-1 overflow-auto p-6">
					<Outlet />
				</main>
			</div>
		</SidebarProvider>
	)
}
