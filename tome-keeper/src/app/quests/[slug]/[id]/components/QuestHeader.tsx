import { useState } from "react"
import type { QuestHeaderProps } from "./types"

export default function QuestHeader({
	quest,
	questId,
	quests,
	handleQuestChange,
	showDMNotes,
	toggleDMNotes,
	toggleAllDMContent,
}: QuestHeaderProps) {
	return (
		<header className="p-6 border-b dark:border-gray-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
			<div className="flex-1">
				<div className="flex items-center gap-2">
					<h2 className="text-xl font-bold">{quest.title || quest.id}</h2>
					{quest.category && (
						<span className="px-2 py-1 text-xs rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300">
							{quest.category}
						</span>
					)}
					{quest.level && (
						<span className="px-2 py-1 text-xs rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
							Level {quest.level}
						</span>
					)}
				</div>
				{quest.subtitle && (
					<p className="text-gray-600 dark:text-gray-400 mt-1">
						{quest.subtitle}
					</p>
				)}
			</div>

			<div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
				{/* Quest Selector */}
				<div className="w-full md:w-auto">
					<select
						value={questId}
						onChange={handleQuestChange}
						className="w-full md:w-auto px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white"
					>
						{quests.map((q) => (
							<option key={q.id} value={q.id}>
								{q.title || q.id}
							</option>
						))}
					</select>
				</div>

				{/* DM Controls */}
				<div className="flex gap-2">
					<button
						type="button"
						onClick={toggleDMNotes}
						className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
							showDMNotes
								? "bg-purple-600 text-white"
								: "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
						}`}
					>
						{showDMNotes ? "Hide DM Notes" : "Show DM Notes"}
					</button>
					<button
						type="button"
						onClick={toggleAllDMContent}
						className="px-3 py-2 bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded-md text-sm font-medium transition-colors hover:bg-gray-300 dark:hover:bg-gray-600"
					>
						Show All DM Content
					</button>
				</div>
			</div>
		</header>
	)
}
