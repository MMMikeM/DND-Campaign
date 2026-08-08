import * as Icons from "lucide-react"
import { useEffect, useState } from "react"
import { useLocation } from "react-router"
import { Link } from "~/components/ui/link"
import { navBasePath, type NavData, navEntities } from "~/lib/nav"
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar"
import { CategoryMenu } from "./CategoryMenu"

interface SidebarNavProps {
	menuData: NavData
}

export function SidebarNav({ menuData }: SidebarNavProps) {
	const location = useLocation()
	const [activeMenu, setActiveMenu] = useState<string | null>(null)

	useEffect(() => {
		const currentPath = location.pathname
		for (const entity of navEntities) {
			const basePath = navBasePath(entity)
			if (currentPath.startsWith(`/${basePath}`)) {
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
			{navEntities.map((entity) => {
				const menuItems = menuData[entity.key]
				if (menuItems.length === 0) return null
				const basePath = navBasePath(entity)

				return (
					<CategoryMenu
						key={basePath}
						title={entity.title}
						icon={entity.icon}
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
