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
	| "narrativeEvents"
	| "narrativeDestinations"
	| "lore"
	| "maps"

type ItemsData = Record<Categories, MenuItem[] | undefined>

interface SidebarNavProps {
	menuData: ItemsData
}

const categoriesConfig: {
	key: keyof ItemsData
	title: string
	icon: React.ComponentType<{ className?: string }>
	path?: string
}[] = [
	{ key: "lore", title: "Lore", icon: Icons.Library },
	{ key: "maps", title: "Maps", icon: Icons.Map },
	{ key: "factions", title: "Factions", icon: Icons.Users },
	{ key: "npcs", title: "NPCs", icon: Icons.User },
	{ key: "regions", title: "Regions", icon: Icons.Globe },
	{ key: "areas", title: "Areas", icon: Icons.MapPin },
	{ key: "sites", title: "Sites", icon: Icons.LocateFixed },
	{ key: "quests", title: "Quests", icon: Icons.Scroll },
	{ key: "conflicts", title: "Conflicts", icon: Icons.Swords },
	{ key: "foreshadowing", title: "Foreshadowing", icon: Icons.Eye },
	{
		key: "narrativeEvents",
		title: "Narrative Events",
		icon: Icons.Milestone,
		path: "narrative-events",
	},
	{
		key: "narrativeDestinations",
		title: "Narrative Destinations",
		icon: Icons.Book,
		path: "narrative-destinations",
	},
]

export function SidebarNav({ menuData }: SidebarNavProps) {
	const location = useLocation()
	const [activeMenu, setActiveMenu] = useState<string | null>(null)

	useEffect(() => {
		const currentPath = location.pathname
		for (const config of categoriesConfig) {
			const basePath = config.path ?? config.key
			const pathToCheck = `/${basePath}`
			if (currentPath.startsWith(pathToCheck)) {
				setActiveMenu(basePath)
				return
			}
		}
		setActiveMenu(null)
	}, [location.pathname])

	const toggleMenu = (menu: string) => {
		setActiveMenu((prev) => (prev === menu ? null : menu))
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
			{categoriesConfig.map((config) => {
				const menuItems = menuData[config.key]
				if (!menuItems) return null
				const basePath = config.path ?? config.key

				return (
					<CategoryMenu
						key={basePath}
						title={config.title}
						icon={config.icon}
						isExpanded={activeMenu === basePath}
						onToggle={() => toggleMenu(basePath)}
						basePath={basePath}
						menuItems={menuItems}
					/>
				)
			})}
		</SidebarMenu>
	)
}
