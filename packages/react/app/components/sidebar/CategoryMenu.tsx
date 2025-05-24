import type { LucideIcon } from "lucide-react"
import * as Icons from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import { useLocation } from "react-router"
import { Link } from "~/components/ui/link"
import { SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar"

const menuVariants = {
	hidden: {
		opacity: 0,
		height: 0,
		overflow: "hidden",
	},
	visible: {
		opacity: 1,
		height: "auto",
		transition: {
			duration: 0.3,
			ease: "easeInOut",
		},
	},
	exit: {
		opacity: 0,
		height: 0,
		transition: {
			duration: 0.2,
			ease: "easeInOut",
		},
	},
}

const chevronVariants = {
	open: { rotate: 0 },
	closed: { rotate: -90 },
}

export type MenuItem = {
	id: string | number
	name: string
	slug: string
}

interface CategoryMenuProps {
	title: string
	icon: LucideIcon
	isExpanded: boolean
	onToggle: () => void
	basePath: string
	menuItems: MenuItem[]
}

export function CategoryMenu({ title, icon: Icon, isExpanded, onToggle, basePath, menuItems }: CategoryMenuProps) {
	const location = useLocation()

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" || e.key === " ") {
			onToggle()
		}
	}

	return (
		<SidebarMenuItem className="mb-1">
			<button
				type="button"
				className="flex w-full items-center justify-between px-4 py-3 hover:bg-muted/60 rounded-md transition-colors font-medium"
				onClick={onToggle}
				onKeyDown={handleKeyDown}
				aria-expanded={isExpanded}
			>
				<div className="flex items-center text-left">
					<div
						className={`mr-3 h-8 w-8 rounded-md flex items-center justify-center shadow-sm ${isExpanded ? "bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300" : "bg-muted/50 text-foreground"}`}
					>
						<Icon className="h-4 w-4" />
					</div>
					<span>{title}</span>
				</div>
				<motion.div animate={isExpanded ? "open" : "closed"} variants={chevronVariants} transition={{ duration: 0.2 }}>
					<Icons.ChevronDown className="h-4 w-4" />
				</motion.div>
			</button>
			<AnimatePresence>
				{isExpanded && (
					<motion.div
						className="mt-1 space-y-1 border-indigo-100/20 pl-3 pt-1"
						variants={menuVariants}
						initial="hidden"
						animate="visible"
						exit="exit"
					>
						<SidebarMenuButton
							asChild
							isActive={location.pathname === `/${basePath}`}
							className={`py-2 px-3 rounded-md transition-all ${location.pathname === `/${basePath}` ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 font-medium" : ""}`}
						>
							<Link href={`/${basePath}`} className="flex items-center">
								<Icons.List className="mr-2 h-3.5 w-3.5" />
								<span>All {title}</span>
							</Link>
						</SidebarMenuButton>
						{menuItems.map((item) => (
							<SidebarMenuButton
								asChild
								key={item.slug || item.id}
								isActive={location.pathname === `/${basePath}/${item.slug}`}
								className={`py-2 px-3 rounded-md transition-all text-sm ${location.pathname === `/${basePath}/${item.slug}` ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 font-medium" : ""}`}
							>
								<Link href={`/${basePath}/${item.slug}`} className="flex items-center">
									<span>{item.name}</span>
								</Link>
							</SidebarMenuButton>
						))}
					</motion.div>
				)}
			</AnimatePresence>
		</SidebarMenuItem>
	)
}
