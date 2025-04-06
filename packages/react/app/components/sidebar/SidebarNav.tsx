import { useState, useEffect } from "react"
import { useLocation } from "react-router"
import * as Icons from "lucide-react"
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "../ui/sidebar"
import { Link } from "~/components/ui/link"
import { CategoryMenu, type MenuItem } from "./CategoryMenu"


type Categories = "factions" | "npcs" | "regions" | "areas" | "sites" | "quests" | "conflicts" | "foreshadowing" | "narrative" | "world"
type ItemsData = Record<Categories, MenuItem[]>

interface SidebarNavProps {
	menuData: ItemsData
}

export function SidebarNav({ menuData }: SidebarNavProps) {
	const location = useLocation()

	
	const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({
		factions: false,
		npcs: false,
		regions: false,
		areas: false, 
		sites: false, 
		quests: false,
		conflicts: false,
		foreshadowing: false,
		narrative: false,
		world: false,
	})

	
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
			"narrative",
			"world",
		]

		categories.forEach((category) => {
			if (currentPath.startsWith(`/${category}`)) {
				setExpandedMenus((prev) => ({
					...prev,
					[category]: true,
				}))
			}
		})
	}, [location.pathname])

	const toggleMenu = (menu: string) => {
		setExpandedMenus((prev) => ({
			...prev,
			[menu]: !prev[menu],
		}))
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

			{/* Category header */}
			<div className="mt-8 mb-3 px-4">
				<h3 className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">World Elements</h3>
			</div>

			<CategoryMenu
				title="Factions"
				icon={Icons.Users}
				isExpanded={expandedMenus.factions}
				onToggle={() => toggleMenu("factions")}
				basePath="factions"
				menuItems={menuData.factions}
			/>

			<CategoryMenu
				title="NPCs"
				icon={Icons.User}
				isExpanded={expandedMenus.npcs}
				onToggle={() => toggleMenu("npcs")}
				basePath="npcs"
				menuItems={menuData.npcs}
			/>

			<CategoryMenu
				title="Regions"
				icon={Icons.Map}
				isExpanded={expandedMenus.regions}
				onToggle={() => toggleMenu("regions")}
				basePath="regions"
				menuItems={menuData.regions}
			/>

			{/* Add Area Menu */}
			<CategoryMenu
				title="Areas"
				icon={Icons.MapPin}
				isExpanded={expandedMenus.areas}
				onToggle={() => toggleMenu("areas")}
				basePath="areas"
				menuItems={menuData.areas}
			/>

			{/* Add Site Menu */}
			<CategoryMenu
				title="Sites"
				icon={Icons.LocateFixed}
				isExpanded={expandedMenus.sites}
				onToggle={() => toggleMenu("sites")}
				basePath="sites"
				menuItems={menuData.sites}
			/>

			<CategoryMenu
				title="Quests"
				icon={Icons.Scroll}
				isExpanded={expandedMenus.quests}
				onToggle={() => toggleMenu("quests")}
				basePath="quests"
				menuItems={menuData.quests}
			/>

			{/* New Category Menus */}
			<CategoryMenu
				title="Conflicts"
				icon={Icons.Swords}
				isExpanded={expandedMenus.conflicts}
				onToggle={() => toggleMenu("conflicts")}
				basePath="conflicts"
				menuItems={menuData.conflicts}
			/>

			<CategoryMenu
				title="Foreshadowing"
				icon={Icons.Eye}
				isExpanded={expandedMenus.foreshadowing}
				onToggle={() => toggleMenu("foreshadowing")}
				basePath="foreshadowing"
				menuItems={menuData.foreshadowing}
			/>

			<CategoryMenu
				title="Narrative Arcs"
				icon={Icons.Milestone}
				isExpanded={expandedMenus.narrative}
				onToggle={() => toggleMenu("narrative")}
				basePath="narrative"
				menuItems={menuData.narrative}
			/>

			<CategoryMenu
				title="World Changes"
				icon={Icons.Globe}
				isExpanded={expandedMenus.world}
				onToggle={() => toggleMenu("world")}
				basePath="world"
				menuItems={menuData.world}
			/>
		</SidebarMenu>
	)
}
