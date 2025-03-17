import Link from "next/link"
import { FiUsers, FiMap, FiBookOpen, FiFlag, FiBook } from "react-icons/fi"

interface CategoryCardProps {
	title: string
	description: string
	icon: React.ReactNode
	href: string
	color: string
}

function CategoryCard({
	title,
	description,
	icon,
	href,
	color,
}: CategoryCardProps) {
	return (
		<Link href={href}>
			<div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full">
				<div className={`${color} p-4 flex justify-center`}>
					<div className="text-white">{icon}</div>
				</div>
				<div className="p-6">
					<h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">
						{title}
					</h3>
					<p className="text-gray-600 dark:text-gray-300">{description}</p>
				</div>
			</div>
		</Link>
	)
}

export default function HomePage() {
	return (
		<div className="container mx-auto px-4 py-8">
			<div className="max-w-4xl mx-auto">
				<div className="text-center mb-12">
					<div className="flex justify-center mb-4">
						<FiBook className="w-16 h-16 text-purple-600 dark:text-purple-400" />
					</div>
					<h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-gray-100">
						Tomekeeper
					</h1>
					<p className="text-xl text-gray-600 dark:text-gray-300">
						Your digital grimoire for campaign management
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<CategoryCard
						title="NPCs"
						description="View and manage characters in your world"
						icon={<FiUsers className="w-8 h-8" />}
						href="/npcs"
						color="bg-blue-500"
					/>

					<CategoryCard
						title="Factions"
						description="Track organizations and their relationships"
						icon={<FiFlag className="w-8 h-8" />}
						href="/factions"
						color="bg-red-500"
					/>

					<CategoryCard
						title="Locations"
						description="Explore the places in your campaign world"
						icon={<FiMap className="w-8 h-8" />}
						href="/locations"
						color="bg-green-500"
					/>

					<CategoryCard
						title="Quests"
						description="Manage adventures and storylines"
						icon={<FiBookOpen className="w-8 h-8" />}
						href="/quests"
						color="bg-purple-500"
					/>
				</div>

				<div className="mt-12 p-6 bg-gray-200 dark:bg-gray-800 rounded-lg">
					<h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
						Getting Started
					</h2>
					<p className="text-gray-700 dark:text-gray-300 mb-4">
						Use the navigation drawer on the left to browse through your
						campaign data. You can view details about NPCs, factions, locations,
						and quests.
					</p>
					<p className="text-gray-700 dark:text-gray-300">
						Select any category above to start exploring your campaign world.
					</p>
				</div>
			</div>
		</div>
	)
}
