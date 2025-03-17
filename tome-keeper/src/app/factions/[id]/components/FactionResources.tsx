import type { Faction } from "./types"
import { motion } from "framer-motion"
import { GradientCard, createCardHeader } from "../../../../components/GradientCard"

const resourcesIcon = (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		fill="currentColor"
		className="w-6 h-6"
		aria-hidden="true"
	>
		<title>Resources Icon</title>
		<path d="M12.378 1.602a.75.75 0 0 0-.756 0L3 6.632l9 5.25 9-5.25-8.622-5.03ZM21.75 7.93l-9 5.25v9l8.628-5.032a.75.75 0 0 0 .372-.648V7.93ZM11.25 22.18v-9l-9-5.25v8.57a.75.75 0 0 0 .372.648l8.628 5.033Z" />
	</svg>
)

export function FactionResources({ faction }: { faction: Faction }) {
	const resources = faction.resources || []

	if (resources.length === 0) return null

	const header = createCardHeader("Resources", resourcesIcon, "blue")

	return (
		<GradientCard headerContent={header} colorTheme="blue">
			<motion.ul className="space-y-2">
				{resources.map((resource, index) => (
					<motion.li
						key={`resource-${index}-${resource.substring(0, 10)}`}
						initial={{ opacity: 0, x: -10 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ delay: index * 0.05 }}
						className="flex items-start"
					>
						<span className="text-cyan-500 mr-2 mt-1">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 20 20"
								fill="currentColor"
								className="w-4 h-4"
								aria-hidden="true"
							>
								<title>Resource Item</title>
								<path d="M11.983 1.907a.75.75 0 0 0-1.292-.657l-8.5 9.5A.75.75 0 0 0 2.75 12h6.572l-1.305 6.093a.75.75 0 0 0 1.292.657l8.5-9.5A.75.75 0 0 0 17.25 8h-6.572l1.305-6.093Z" />
							</svg>
						</span>
						<span>{resource}</span>
					</motion.li>
				))}
			</motion.ul>
		</GradientCard>
	)
}
