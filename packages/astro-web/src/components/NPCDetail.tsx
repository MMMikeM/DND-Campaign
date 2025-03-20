import { useState } from "react"
import type { NPC } from "../types/models"

interface NPCDetailProps {
	npc: NPC
}

export default function NPCDetail({ npc }: NPCDetailProps) {
	const [activeTab, setActiveTab] = useState<string>("description")

	const renderDescription = () => (
		<div className="space-y-4">
			<div className="flex gap-4 items-center">
				<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
					<span className="mr-1">👤</span> {npc.race}
				</span>
				<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
					<span className="mr-1">♂️/♀️</span> {npc.gender}
				</span>
				<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
					<span className="mr-1">🛠️</span> {npc.occupation}
				</span>
				{npc.role && (
					<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
						<span className="mr-1">🎭</span> {npc.role}
					</span>
				)}
			</div>

			<div className="mt-6">
				<h3 className="text-lg font-medium text-slate-200 mb-2">Background</h3>
				<p className="text-slate-300 whitespace-pre-line">{npc.background}</p>
			</div>

			<div className="mt-4">
				<h3 className="text-lg font-medium text-slate-200 mb-2">Motivation</h3>
				<p className="text-slate-300 whitespace-pre-line">{npc.motivation}</p>
			</div>

			<div className="mt-4">
				<h3 className="text-lg font-medium text-slate-200 mb-2">Secret</h3>
				<p className="text-slate-300 whitespace-pre-line">{npc.secret}</p>
			</div>

			{npc.descriptions && npc.descriptions.length > 0 && (
				<div className="mt-4">
					<h3 className="text-lg font-medium text-slate-200 mb-2">Descriptions</h3>
					<ul className="list-disc pl-5 text-slate-300 space-y-1">
						{npc.descriptions.map((desc, i) => (
							<li key={`desc-${i}-${desc.substring(0, 10)}`}>{desc}</li>
						))}
					</ul>
				</div>
			)}
		</div>
	)

	const renderPersonality = () => (
		<div className="space-y-4">
			<div className="mb-6">
				<h3 className="text-lg font-medium text-slate-200 mb-2">Quirk</h3>
				<p className="text-slate-300">{npc.quirk || "None specified"}</p>
			</div>

			{npc.personalityTraits && npc.personalityTraits.length > 0 && (
				<div>
					<h3 className="text-lg font-medium text-slate-200 mb-2">Personality Traits</h3>
					<ul className="list-disc pl-5 text-slate-300 space-y-1">
						{npc.personalityTraits.map((trait, i) => (
							<li key={`trait-${i}-${trait.substring(0, 10)}`}>{trait}</li>
						))}
					</ul>
				</div>
			)}

			<div className="p-4 bg-slate-800 rounded-lg border border-slate-700 mt-6">
				<div className="flex items-center mb-3">
					<span className="text-yellow-400 mr-2">💭</span>
					<h3 className="text-lg font-medium text-slate-200">Roleplaying Notes</h3>
				</div>
				<p className="text-slate-300 italic">
					Speaks in a hushed tone and is constantly suspicious of others. Avoids eye contact during
					conversation, but observes everyone carefully. Often fidgets with crystal beads in their
					beard when nervous.
				</p>
			</div>
		</div>
	)

	const renderInventory = () => (
		<div>
			<h3 className="text-lg font-medium text-slate-200 mb-3">Items</h3>

			{npc.inventory && npc.inventory.length > 0 ? (
				<div className="overflow-hidden rounded-lg border border-slate-700">
					<table className="min-w-full divide-y divide-slate-700">
						<thead className="bg-slate-800">
							<tr>
								<th
									scope="col"
									className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider"
								>
									Item
								</th>
								<th
									scope="col"
									className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider"
								>
									Quantity
								</th>
								<th
									scope="col"
									className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider"
								>
									Notes
								</th>
							</tr>
						</thead>
						<tbody className="bg-slate-800 divide-y divide-slate-700">
							{npc.inventory.map((item, i) => (
								<tr key={`inv-${i}-${item.item}`} className="hover:bg-slate-700">
									<td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
										{item.item}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
										{item.quantity}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
										{item.notes || "-"}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			) : (
				<p className="text-slate-400 italic">No inventory items recorded.</p>
			)}
		</div>
	)

	const renderDialogue = () => (
		<div>
			<h3 className="text-lg font-medium text-slate-200 mb-3">Conversation Topics</h3>

			{npc.dialogue && npc.dialogue.length > 0 ? (
				<div className="space-y-4">
					{npc.dialogue.map((dialogue, i) => (
						<div
							key={`dlg-${i}-${dialogue.topic}`}
							className="p-4 bg-slate-800 rounded-lg border border-slate-700"
						>
							<h4 className="font-medium text-slate-200 mb-2">{dialogue.topic}</h4>
							<p className="text-slate-300 whitespace-pre-line">{dialogue.response}</p>
							{dialogue.condition && (
								<p className="mt-2 text-sm text-yellow-400 italic">
									<span className="font-medium">Condition:</span> {dialogue.condition}
								</p>
							)}
						</div>
					))}
				</div>
			) : (
				<p className="text-slate-400 italic">No dialogue options recorded.</p>
			)}
		</div>
	)

	return (
		<div className="bg-slate-800 rounded-xl shadow-xl overflow-hidden border border-slate-700">
			{/* Header */}
			<div className="bg-slate-700 p-6">
				<div className="flex justify-between items-center">
					<h2 className="text-3xl font-bold text-white">{npc.name}</h2>
					<div className="flex gap-2">
						<button
							type="button"
							className="p-2 text-slate-400 hover:text-white hover:bg-slate-600 rounded-md"
							aria-label="Edit NPC"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-5 w-5"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
								/>
							</svg>
						</button>
						<button
							type="button"
							className="p-2 text-slate-400 hover:text-white hover:bg-slate-600 rounded-md"
							aria-label="Delete NPC"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-5 w-5"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
								/>
							</svg>
						</button>
					</div>
				</div>
				<div className="mt-3 flex gap-3">
					<div className="text-slate-300 flex items-center">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-5 w-5 mr-1 text-blue-400"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
						{npc.role || npc.occupation}
					</div>
					<div className="text-slate-300 flex items-center">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-5 w-5 mr-1 text-purple-400"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
							/>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
							/>
						</svg>
						Traveling merchant, often found in marketplaces
					</div>
				</div>
			</div>

			{/* Tabs */}
			<div className="bg-slate-900 px-6 border-b border-slate-700">
				<nav className="-mb-px flex space-x-8" aria-label="Tabs">
					<button
						type="button"
						onClick={() => setActiveTab("description")}
						className={`${
							activeTab === "description"
								? "border-blue-500 text-blue-400"
								: "border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-300"
						} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
						aria-label="Show Description tab"
					>
						<span className="flex items-center">
							<span className="mr-2">📝</span> Description
						</span>
					</button>
					<button
						type="button"
						onClick={() => setActiveTab("personality")}
						className={`${
							activeTab === "personality"
								? "border-blue-500 text-blue-400"
								: "border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-300"
						} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
						aria-label="Show Personality tab"
					>
						<span className="flex items-center">
							<span className="mr-2">😀</span> Personality
						</span>
					</button>
					<button
						type="button"
						onClick={() => setActiveTab("inventory")}
						className={`${
							activeTab === "inventory"
								? "border-blue-500 text-blue-400"
								: "border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-300"
						} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
						aria-label="Show Inventory tab"
					>
						<span className="flex items-center">
							<span className="mr-2">🎒</span> Inventory
						</span>
					</button>
					<button
						type="button"
						onClick={() => setActiveTab("dialogue")}
						className={`${
							activeTab === "dialogue"
								? "border-blue-500 text-blue-400"
								: "border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-300"
						} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
						aria-label="Show Dialogue tab"
					>
						<span className="flex items-center">
							<span className="mr-2">💬</span> Dialogue
						</span>
					</button>
				</nav>
			</div>

			{/* Tab Content */}
			<div className="p-6">
				{activeTab === "description" && renderDescription()}
				{activeTab === "personality" && renderPersonality()}
				{activeTab === "inventory" && renderInventory()}
				{activeTab === "dialogue" && renderDialogue()}
			</div>
		</div>
	)
}
