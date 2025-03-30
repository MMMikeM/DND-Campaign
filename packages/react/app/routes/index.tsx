import { NavLink } from "react-router"
import * as Icons from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"

// Define sections statically as this doesn't need loader data
const sections = [
	{
		title: "Factions",
		icon: <Icons.Flag className="h-6 w-6 text-indigo-500" />,
		path: "/factions",
		description: "Organizations and groups in the world",
	},
	{
		title: "NPCs",
		icon: <Icons.User className="h-6 w-6 text-indigo-500" />,
		path: "/npcs",
		description: "Characters that inhabit the world",
	},
	{
		title: "Quests",
		icon: <Icons.Award className="h-6 w-6 text-indigo-500" />,
		path: "/quests",
		description: "Adventures and storylines",
	},
	{
		title: "Regions",
		icon: <Icons.Map className="h-6 w-6 text-indigo-500" />,
		path: "/regions",
		description: "Areas and locations in the world",
	},
]

// Export a component without a loader since one isn't needed
export default function IndexPage() {
	return (
		<div className="container mx-auto py-8">
			<div className="text-center mb-12">
				<h1 className="text-4xl font-bold mb-4">Campaign Manager</h1>
				<p className="text-xl text-muted-foreground">
					Manage your D&D campaign world and keep track of everything
				</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
				{sections.map((section) => (
					<NavLink key={section.path} to={section.path} className="no-underline">
						<Card className="h-full hover:bg-muted transition-colors">
							<CardHeader className="flex flex-row items-center justify-between pb-2">
								<CardTitle className="text-xl font-bold">{section.title}</CardTitle>
								{section.icon}
							</CardHeader>
							<CardContent>
								<p className="text-muted-foreground">{section.description}</p>
							</CardContent>
						</Card>
					</NavLink>
				))}
			</div>
		</div>
	)
}
