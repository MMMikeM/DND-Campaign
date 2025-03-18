import { SecretToggleButton } from "@/components/SecretToggleButton"
import type { Faction } from "./types"
import { motion, AnimatePresence } from "framer-motion"
import { GradientCard } from "@/components/GradientCard"

interface FactionGoalsProps {
	faction: Faction
	showTrueGoal?: boolean
	toggleTrueGoal?: () => void
}

const goalIcon = (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		fill="currentColor"
		className="w-6 h-6"
		aria-hidden="true"
	>
		<title>Goal Icon</title>
		<path
			fillRule="evenodd"
			d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm.53 5.47a.75.75 0 0 0-1.06 0l-3 3a.75.75 0 1 0 1.06 1.06l1.72-1.72v5.69a.75.75 0 0 0 1.5 0v-5.69l1.72 1.72a.75.75 0 1 0 1.06-1.06l-3-3Z"
			clipRule="evenodd"
		/>
	</svg>
)

export function FactionGoals({ faction, showTrueGoal = false, toggleTrueGoal }: FactionGoalsProps) {
	if (!faction.public_goal && !faction.true_goal) return null

	const customHeader = (
		<div className="flex items-center justify-between w-full">
			<div className="flex items-center">
				<span className="text-violet-500 mr-2 text-xl">{goalIcon}</span>
				<h2 className="text-xl font-semibold text-gray-800 dark:text-violet-200">Goal</h2>
			</div>

			{faction.true_goal && toggleTrueGoal && (
				<SecretToggleButton showSecret={showTrueGoal} toggleSecret={toggleTrueGoal} />
			)}
		</div>
	)

	return (
		<GradientCard colorTheme="purple" headerContent={customHeader}>
			{/* Public Goal */}
			{faction.public_goal && (
				<div className="bg-white/70 dark:bg-gray-800/60 p-4 rounded-lg border border-gray-200/70 dark:border-gray-700/50 shadow-lg backdrop-blur-lg">
					<div className="flex items-center mb-2">
						<span className="text-violet-500 mr-2">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 20 20"
								fill="currentColor"
								className="w-5 h-5"
								aria-hidden="true"
							>
								<title>Public Goal</title>
								<path
									fillRule="evenodd"
									d="M4.25 2A2.25 2.25 0 0 0 2 4.25v11.5A2.25 2.25 0 0 0 4.25 18h11.5A2.25 2.25 0 0 0 18 15.75V4.25A2.25 2.25 0 0 0 15.75 2H4.25ZM15 5.75a.75.75 0 0 0-1.5 0v8.5a.75.75 0 0 0 1.5 0v-8.5Zm-8.5 6a.75.75 0 0 0-1.5 0v2.5a.75.75 0 0 0 1.5 0v-2.5ZM8.584 9a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5a.75.75 0 0 1 .75-.75Zm3.58-1.25a.75.75 0 0 0-1.5 0v6.5a.75.75 0 0 0 1.5 0v-6.5Z"
									clipRule="evenodd"
								/>
							</svg>
						</span>
						<h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Public Goal</h3>
					</div>
					<p className="text-gray-700 dark:text-gray-300">{faction.public_goal}</p>
				</div>
			)}

			{/* True Goal with Framer Motion */}
			<AnimatePresence mode="wait" initial={false}>
				{faction.true_goal && showTrueGoal && (
					<motion.div
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: "auto" }}
						exit={{ opacity: 0, height: 0 }}
						transition={{ type: "spring", stiffness: 300, damping: 30 }}
						className="mt-4 overflow-hidden"
					>
						<div className="bg-violet-50/70 dark:bg-violet-900/30 p-4 rounded-lg border border-violet-200/70 dark:border-violet-700/50 shadow-lg backdrop-blur-lg">
							<div className="flex items-center mb-2">
								<span className="text-violet-600 dark:text-violet-400 mr-2">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 20 20"
										fill="currentColor"
										className="w-5 h-5"
										aria-hidden="true"
									>
										<title>True Goal</title>
										<path
											fillRule="evenodd"
											d="M10 1a4.5 4.5 0 0 0-4.5 4.5V9H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-.5V5.5A4.5 4.5 0 0 0 10 1Zm3 8V5.5a3 3 0 1 0-6 0V9h6Z"
											clipRule="evenodd"
										/>
									</svg>
								</span>
								<h3 className="text-lg font-semibold text-violet-800 dark:text-violet-300">
									True Goal
								</h3>
							</div>
							<p className="text-violet-700 dark:text-violet-300">{faction.true_goal}</p>
						</div>
					</motion.div>
				)}
			</AnimatePresence>

			{/* Secret hint */}
			{faction.true_goal && !showTrueGoal && toggleTrueGoal && (
				<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-right">
					<motion.button
						onClick={toggleTrueGoal}
						type="button"
						whileHover={{ scale: 1.05, x: -3 }}
						whileTap={{ scale: 0.95 }}
						className="text-violet-500 dark:text-violet-400 text-xs hover:text-violet-700 dark:hover:text-violet-300 flex items-center ml-auto"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 20 20"
							fill="currentColor"
							className="w-3.5 h-3.5 mr-1"
							aria-hidden="true"
						>
							<title>Secret Information</title>
						</svg>
					</motion.button>
				</motion.div>
			)}
		</GradientCard>
	)
}
