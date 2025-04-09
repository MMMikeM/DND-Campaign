import * as Icons from "lucide-react"
import { useEffect, useState } from "react"
import { useLocation } from "react-router"
import { Link } from "~/components/ui/link"
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar"
import { CategoryMenu, type MenuItem } from "./CategoryMenu"

type Categories =
	| "factions"
	| "npcs"
	| "regions"
	| "areas"
	| "sites"
	| "quests"
	| "conflicts"
	| "foreshadowing"
	| "narrativeArcs"
	| "worldChanges"
export type ItemsData = Record<Categories, MenuItem[] | undefined>

interface SidebarNavProps {
	menuData: ItemsData
}

export function SidebarNav({ menuData }: SidebarNavProps) {
	const location = useLocation()

	const [activeMenu, setActiveMenu] = useState<string | null>(null)

	useEffect(() => {
		const currentPath = location.pathname

		const categories: Categories[] = [
			"factions",
			"npcs",
			"regions",
			"areas",
			"sites",
			"quests",
			"conflicts",
			"foreshadowing",
			"narrativeArcs",
			"worldChanges",
		]

		// Find if the current path matches any category and set that as the active menu
		for (const category of categories) {
			if (currentPath.startsWith(`/${category}`)) {
				setActiveMenu(category)
				break
			}
		}
	}, [location.pathname])

	const toggleMenu = (menu: string) => {
		setActiveMenu(prev => prev === menu ? null : menu)
	}

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<SidebarMenuButton
					asChild
					isActive={location.pathname === "/"}
					className={`py-3 px-4 rounded-md transition-all font-medium hover:bg-muted/60 ${
						location.pathname === "/"
							? "bg-gradient-to-r from-indigo-500/15 to-purple-500/15 text-indigo-700 dark:text-indigo-400 font-semibold shadow-sm"
							: ""
					}`}
				>
					<Link href="/">
						<Icons.Home className="mr-3 h-4 w-4" />
						<span>Dashboard</span>
					</Link>
				</SidebarMenuButton>
			</SidebarMenuItem>

			<div className="mt-8 mb-3 px-4">
				<h3 className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">World Elements</h3>
			</div>


				{menuData.factions && (
					<CategoryMenu
						title="Factions"
						icon={Icons.Users}
						isExpanded={activeMenu === "factions"}
						onToggle={() => toggleMenu("factions")}
						basePath="factions"
						menuItems={menuData.factions}
					/>
				)}



			{menuData.npcs && (
				<CategoryMenu
					title="NPCs"
					icon={Icons.User}
					isExpanded={activeMenu === "npcs"}
					onToggle={() => toggleMenu("npcs")}
					basePath="npcs"
					menuItems={menuData.npcs}
				/>
			)}

			{menuData.regions && (
				<CategoryMenu
					title="Regions"
					icon={Icons.Map}
					isExpanded={activeMenu === "regions"}
					onToggle={() => toggleMenu("regions")}
					basePath="regions"
					menuItems={menuData.regions}
				/>
			)}

			{menuData.areas && (
				<CategoryMenu
					title="Areas"
					icon={Icons.MapPin}
					isExpanded={activeMenu === "areas"}
					onToggle={() => toggleMenu("areas")}
					basePath="areas"
					menuItems={menuData.areas}
				/>
			)}

			{menuData.sites && (
				<CategoryMenu
					title="Sites"
					icon={Icons.LocateFixed}
					isExpanded={activeMenu === "sites"}
					onToggle={() => toggleMenu("sites")}
					basePath="sites"
					menuItems={menuData.sites}
				/>
			)}

			{menuData.quests && (
				<CategoryMenu
					title="Quests"
					icon={Icons.Scroll}
					isExpanded={activeMenu === "quests"}
					onToggle={() => toggleMenu("quests")}
					basePath="quests"
					menuItems={menuData.quests}
				/>
			)}

			{menuData.conflicts && (
				<CategoryMenu
					title="Conflicts"
					icon={Icons.Swords}
					isExpanded={activeMenu === "conflicts"}
					onToggle={() => toggleMenu("conflicts")}
					basePath="conflicts"
					menuItems={menuData.conflicts}
				/>
			)}

			{menuData.foreshadowing && (
				<CategoryMenu
					title="Foreshadowing"
					icon={Icons.Eye}
					isExpanded={activeMenu === "foreshadowing"}
					onToggle={() => toggleMenu("foreshadowing")}
					basePath="foreshadowing"
					menuItems={menuData.foreshadowing}
				/>
			)}

			{menuData.narrativeArcs && (
				<CategoryMenu
					title="Narrative Arcs"
					icon={Icons.Milestone}
					isExpanded={activeMenu === "narrativeArcs"}
					onToggle={() => toggleMenu("narrativeArcs")}
					basePath="narrative"
					menuItems={menuData.narrativeArcs}
				/>
			)}

			{menuData.worldChanges && (
				<CategoryMenu
					title="World Changes"
					icon={Icons.Globe}
					isExpanded={activeMenu === "worldChanges"}
					onToggle={() => toggleMenu("worldChanges")}
					basePath="world"
					menuItems={menuData.worldChanges}
				/>
			)}
		</SidebarMenu>
	)
}
