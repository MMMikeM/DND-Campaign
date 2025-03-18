import type { Faction, FactionLeader } from "./types"
import { motion, AnimatePresence } from "framer-motion"
import { GradientCard, createCardHeader } from "@/components/GradientCard"
import { SecretToggleButton } from "@/components/SecretToggleButton"

interface FactionLeadershipProps {
	faction: Faction
	showTrueLeader?: boolean
	toggleTrueLeader?: () => void
	showSecrets?: boolean
	toggleSecrets?: () => void
}

export function FactionLeadership({
	faction,
	showTrueLeader = false,
	toggleTrueLeader,
	showSecrets = false,
	toggleSecrets,
}: FactionLeadershipProps) {
	if (!faction.leadership || faction.leadership.length === 0) return null

	// Determine if there are any true leaders (with secret flag)
	const hasTrueLeaders = faction.leadership.some((leader: FactionLeader) => leader.secret_leader)
	// Determine if there are any secrets
	const hasSecrets = faction.leadership.some((leader: FactionLeader) => leader.secret)

	// Filter for visible leaders (all public leaders + true leaders if visible)
	const visibleLeaders = faction.leadership.filter(
		(leader: FactionLeader) => !leader.secret_leader || (leader.secret_leader && showTrueLeader),
	)

	const leadershipIcon = (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="currentColor"
			className="w-6 h-6"
			aria-hidden="true"
		>
			<title>Leadership Icon</title>
			<path
				fillRule="evenodd"
				d="M12 1.5a5.25 5.25 0 0 1 5.25 5.25v3a3 3 0 0 1 3 3v6.75a3 3 0 0 1-3 3H6.75a3 3 0 0 1-3-3v-6.75a3 3 0 0 1 3-3v-3A5.25 5.25 0 0 1 12 1.5Zm0 2.25a3 3 0 0 0-3 3v3h6v-3a3 3 0 0 0-3-3Z"
				clipRule="evenodd"
			/>
		</svg>
	)

	// Create header with toggle buttons if needed
	const headerRightContent = (
		<div className="flex space-x-2">
			{hasTrueLeaders && toggleTrueLeader && (
				<SecretToggleButton showSecret={showTrueLeader} toggleSecret={toggleTrueLeader} />
			)}
			{hasSecrets && toggleSecrets && (
				<SecretToggleButton showSecret={showSecrets} toggleSecret={toggleSecrets} />
			)}
		</div>
	)

	const header = createCardHeader("Leadership", leadershipIcon, "purple", headerRightContent)

	return (
		<GradientCard headerContent={header} colorTheme="purple">
			<div className="p-4 grid grid-cols-1 gap-4">
				{/* Visible leaders */}
				<AnimatePresence mode="wait" initial={false}>
					{visibleLeaders.map((leader: FactionLeader, index) => (
						<motion.div
							key={`leader-${leader.name}`}
							initial={leader.secret_leader ? { opacity: 0, y: 20 } : { opacity: 1 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -20 }}
							transition={{
								type: "spring",
								stiffness: 300,
								damping: 30,
								delay: leader.secret_leader ? index * 0.05 : 0,
							}}
							className={`p-4 rounded-lg border shadow-lg backdrop-blur-lg ${
								leader.secret_leader
									? "bg-gradient-to-br from-blue-50/60 via-violet-50/60 to-blue-100/60 dark:from-blue-900/30 dark:via-violet-900/30 dark:to-blue-900/20 border-blue-200/50 dark:border-blue-800/50"
									: "bg-white/70 dark:bg-gray-800/60 border-gray-200/70 dark:border-gray-700/50"
							}`}
						>
							<div className="font-semibold text-lg text-gray-800 dark:text-gray-200 flex items-center flex-wrap">
								<motion.span
									animate={leader.secret_leader ? { rotate: [0, -10, 10, -5, 5, 0] } : {}}
									transition={{ duration: 0.5, delay: 0.2 }}
									className="mr-2"
								>
									{leader.secret_leader ? (
										<svg
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 24 24"
											fill="currentColor"
											className="w-5 h-5 text-blue-500"
											aria-hidden="true"
										>
											<title>True Leader</title>
											<path
												fillRule="evenodd"
												d="M15.75 1.5a6.75 6.75 0 0 0-6.651 7.906c.067.39-.032.717-.221.906l-6.5 6.499a3 3 0 0 0-.878 2.121v2.818c0 .414.336.75.75.75H6a.75.75 0 0 0 .75-.75v-1.5h1.5A.75.75 0 0 0 9 19.5V18h1.5a.75.75 0 0 0 .75-.75V15h1.5a.75.75 0 0 0 .75-.75v-.232a1 1 0 0 0 .232-.221l4.063-4.062a1 1 0 0 0 .22-.55L18.75 4.5A.75.75 0 0 0 18 3.75h-1.422l-.703-1.76A.75.75 0 0 0 15.75 1.5Z"
												clipRule="evenodd"
											/>
										</svg>
									) : (
										<svg
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 24 24"
											fill="currentColor"
											className="w-5 h-5 text-gray-400"
											aria-hidden="true"
										>
											<title>Faction Member</title>
											<path
												fillRule="evenodd"
												d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
												clipRule="evenodd"
											/>
										</svg>
									)}
								</motion.span>
								{leader.name}
								{leader.role && (
									<span className="ml-2 px-2 py-0.5 text-xs font-normal bg-gray-200/80 dark:bg-gray-700/80 text-gray-700 dark:text-gray-300 rounded-full backdrop-blur-lg">
										{leader.role}
									</span>
								)}
								{leader.secret_leader && (
									<motion.span
										initial={{ opacity: 0, scale: 0.8 }}
										animate={{ opacity: 1, scale: 1 }}
										transition={{ delay: 0.3 }}
										className="ml-2 px-2 py-0.5 text-xs font-normal bg-blue-100/80 dark:bg-blue-800/50 text-blue-700 dark:text-blue-300 rounded-full backdrop-blur-lg"
									>
										True Leader
									</motion.span>
								)}
							</div>
							{leader.description && (
								<motion.p
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									transition={{ delay: 0.1 }}
									className="text-gray-700 dark:text-gray-300 mt-2"
								>
									{leader.description}
								</motion.p>
							)}

							{/* Secrets with Framer Motion */}
							{leader.secret && (
								<AnimatePresence key={`secret-content-${leader.name}`} mode="wait" initial={false}>
									<motion.div
										layout
										className="mt-3"
										initial={{ opacity: 0.9 }}
										animate={{ opacity: 1 }}
										transition={{ duration: 0.3 }}
									>
										<motion.div
											layout
											className={`p-3 rounded-md border backdrop-blur-xl ${
												showSecrets
													? "bg-violet-50/70 dark:bg-violet-900/40 border-violet-200/50 dark:border-violet-800/50"
													: "bg-red-50/70 dark:bg-red-900/40 border-red-200/50 dark:border-red-800/50"
											}`}
											animate={{
												backgroundColor: showSecrets
													? "rgba(245, 243, 255, 0.7)"
													: "rgba(254, 242, 242, 0.7)",
												borderColor: showSecrets
													? "rgba(221, 214, 254, 0.5)"
													: "rgba(254, 202, 202, 0.5)",
												boxShadow: showSecrets
													? "0 4px 6px -1px rgba(139, 92, 246, 0.1), 0 2px 4px -2px rgba(139, 92, 246, 0.1)"
													: "0 4px 6px -1px rgba(248, 113, 113, 0.1), 0 2px 4px -2px rgba(248, 113, 113, 0.1)",
											}}
											transition={{ duration: 0.5 }}
										>
											<div className="flex items-center justify-between">
												<div className="flex items-center">
													<motion.span
														animate={{
															color: showSecrets ? "rgb(124, 58, 237)" : "rgb(239, 68, 68)",
															rotate: showSecrets ? [0, -10, 10, 0] : 0,
														}}
														transition={{ duration: 0.5 }}
														className="mr-1"
													>
														{showSecrets ? (
															<svg
																xmlns="http://www.w3.org/2000/svg"
																viewBox="0 0 20 20"
																fill="currentColor"
																className="w-4 h-4"
																aria-hidden="true"
															>
																<title>Secret Unlocked</title>
																<path
																	fillRule="evenodd"
																	d="M10 1a4.5 4.5 0 0 0-4.5 4.5V9H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-.5V5.5A4.5 4.5 0 0 0 10 1Zm3 8V5.5a3 3 0 1 0-6 0V9h6Z"
																	clipRule="evenodd"
																/>
															</svg>
														) : (
															<svg
																xmlns="http://www.w3.org/2000/svg"
																viewBox="0 0 20 20"
																fill="currentColor"
																className="w-4 h-4"
																aria-hidden="true"
															>
																<title>Secret Locked</title>
																<path
																	fillRule="evenodd"
																	d="M10 1a4.5 4.5 0 0 0-4.5 4.5V9H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-.5V5.5A4.5 4.5 0 0 0 10 1Z"
																	clipRule="evenodd"
																/>
															</svg>
														)}
													</motion.span>
													<motion.span
														animate={{
															color: showSecrets ? "rgb(91, 33, 182)" : "rgb(185, 28, 28)",
														}}
														className="italic font-medium dark:text-gray-300"
													>
														Secret:
													</motion.span>
												</div>

												{toggleSecrets && (
													<motion.button
														onClick={toggleSecrets}
														type="button"
														whileHover={{ scale: 1.05 }}
														whileTap={{ scale: 0.95 }}
														animate={{
															backgroundColor: showSecrets
																? "rgba(237, 233, 254, 0.8)"
																: "rgba(254, 226, 226, 0.8)",
														}}
														className={`text-xs font-medium rounded-full px-2 py-0.5 shadow-md backdrop-blur-lg ${
															showSecrets
																? "text-purple-800 dark:text-purple-200 border border-purple-200/80 dark:border-purple-700/50"
																: "text-red-800 dark:text-red-200 border border-red-200/80 dark:border-red-700/50"
														}`}
													>
														{showSecrets ? "Hide" : "Show"}
													</motion.button>
												)}
											</div>

											{/* Secret content with Framer Motion animation */}
											<AnimatePresence
												key={`secret-details-${leader.name}`}
												mode="wait"
												initial={false}
											>
												{showSecrets && (
													<motion.p
														initial={{ opacity: 0, y: 10 }}
														animate={{ opacity: 1, y: 0 }}
														exit={{ opacity: 0, y: -10 }}
														transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
														className="text-gray-700 dark:text-gray-300 mt-2"
													>
														{leader.secret}
													</motion.p>
												)}
											</AnimatePresence>
										</motion.div>
									</motion.div>
								</AnimatePresence>
							)}

							{/* Secret hint */}
							{leader.secret && !showSecrets && toggleSecrets && (
								<div className="mt-1 text-right">
									<motion.button
										onClick={toggleSecrets}
										type="button"
										whileHover={{ scale: 1.05, x: -3 }}
										whileTap={{ scale: 0.95 }}
										className="text-purple-500 dark:text-purple-400 text-xs hover:text-purple-700 dark:hover:text-purple-300 flex items-center ml-auto"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 20 20"
											fill="currentColor"
											className="w-3.5 h-3.5 mr-1"
											aria-hidden="true"
										>
											<title>Secret Information</title>
											<path
												fillRule="evenodd"
												d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-7-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM9 9a.75.75 0 0 0 0 1.5h.253a.25.25 0 0 1 .244.304l-.459 2.066A1.75 1.75 0 0 0 10.747 15H11a.75.75 0 0 0 0-1.5h-.253a.25.25 0 0 1-.244-.304l.459-2.066A1.75 1.75 0 0 0 9.253 9H9Z"
												clipRule="evenodd"
											/>
										</svg>
										<span className="italic">
											{leader.secret_leader
												? "This leader has secrets..."
												: "There's a secret about this person..."}
										</span>
									</motion.button>
								</div>
							)}
						</motion.div>
					))}
				</AnimatePresence>

				{/* True Leaders Hint with Animation */}
				{hasTrueLeaders && !showTrueLeader && toggleTrueLeader && (
					<motion.div
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.2, type: "spring" }}
						className="p-3 border border-dashed border-blue-300/50 dark:border-blue-700/50 rounded-lg text-center bg-blue-50/50 dark:bg-blue-900/30 backdrop-blur-lg shadow-inner"
					>
						<p className="text-blue-600 dark:text-blue-400 italic text-sm">
							<motion.button
								onClick={toggleTrueLeader}
								type="button"
								whileHover={{ scale: 1.03 }}
								whileTap={{ scale: 0.97 }}
								className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 inline-flex items-center"
							>
								<motion.span
									animate={{ opacity: [1, 0.5, 1] }}
									transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
									className="mr-1 text-xs"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 20 20"
										fill="currentColor"
										className="w-4 h-4 text-blue-500"
										aria-hidden="true"
									>
										<title>Secret Leadership Available</title>
										<path d="M10 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
										<path
											fillRule="evenodd"
											d="M.664 10.59a1.651 1.651 0 0 1 0-1.186A10.004 10.004 0 0 1 10 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0 1 10 17c-4.257 0-7.893-2.66-9.336-6.41ZM14 10a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z"
											clipRule="evenodd"
										/>
									</svg>
								</motion.span>
								<span>There's more to this faction's leadership than meets the eye...</span>
							</motion.button>
						</p>
					</motion.div>
				)}
			</div>
		</GradientCard>
	)
}
