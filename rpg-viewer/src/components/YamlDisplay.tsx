"use client"

import React, { useState, useEffect, useRef } from "react"
import {
	ProcessedData,
	ProcessedSection,
	ProcessedArray,
	ProcessedObject,
	ProcessedValue,
} from "@/types/yamlTypes"
import { useCrossReference } from "./CrossReferenceContext"
import { useRouter } from "next/navigation"

type YamlDisplayProps = {
	filename: string | null
	data?: ProcessedData | null
}

// Helper to determine content type based on filename and data
const getContentType = (filename: string, data: ProcessedData): string => {
	if (!filename) return "generic"

	const lowerFilename = filename.toLowerCase()

	if (lowerFilename.includes("faction")) return "faction"
	if (lowerFilename.includes("npc") || lowerFilename.includes("character"))
		return "npc"
	if (lowerFilename.includes("quest") || lowerFilename.includes("mission"))
		return "quest"
	if (lowerFilename.includes("location") || lowerFilename.includes("place"))
		return "location"

	// If we can't determine from filename, check data sections
	if (data.sections.some((s) => s.title === "factions")) return "faction"
	if (data.sections.some((s) => s.title === "npcs" || s.title === "characters"))
		return "npc"
	if (data.sections.some((s) => s.title === "quests" || s.title === "missions"))
		return "quest"
	if (
		data.sections.some((s) => s.title === "locations" || s.title === "places")
	)
		return "location"

	return "generic"
}

export default function YamlDisplay({ filename, data }: YamlDisplayProps) {
	const [contentType, setContentType] = useState<string>("generic")
	const { registerSectionRef, navigateToFile, navigateToSection } =
		useCrossReference()
	const sectionRefs = useRef<Map<string, HTMLElement>>(new Map())
	const router = useRouter()

	const [processedData, setProcessedData] = useState<ProcessedData | null>(null)
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	// Use provided data or set loading state
	useEffect(() => {
		// If we have direct data provided, use it
		if (data) {
			setProcessedData(data)
			setIsLoading(false)
			setError(null)
			return
		}

		// Otherwise, set loading state if we have a filename but no data
		if (filename && !data) {
			setIsLoading(true)
			setError(null)
		} else if (!filename) {
			// Reset state when no filename is provided
			setProcessedData(null)
			setIsLoading(false)
			setError(null)
		}
	}, [filename, data])

	// Determine content type and handle redirects when data changes
	useEffect(() => {
		if (filename && processedData) {
			const type = getContentType(filename, processedData)
			setContentType(type)

			// Clear section refs when changing files
			sectionRefs.current.clear()

			// Handle redirects for special content types
			if (type !== "generic") {
				const parsedFilename = filename.toLowerCase()

				// Redirect based on content type
				switch (type) {
					case "faction": {
						const isFactionFile = parsedFilename.includes("factions")
						if (isFactionFile) {
							router.push("/factions")
						} else {
							const factionId = parsedFilename.replace(".yaml", "")
							router.push(`/factions/${factionId}`)
						}
						break
					}
					case "npc": {
						const isNpcsFile = parsedFilename.includes("npcs")
						if (isNpcsFile) {
							router.push("/npcs")
						} else {
							const npcId = parsedFilename.replace(".yaml", "")
							router.push(`/npcs/${npcId}`)
						}
						break
					}
					case "quest": {
						const isQuestsFile = parsedFilename.includes("quests")
						if (isQuestsFile) {
							router.push("/quests")
						} else {
							const questId = parsedFilename.replace(".yaml", "")
							router.push(`/quests/${questId}`)
						}
						break
					}
					case "location": {
						const isLocationsFile = parsedFilename.includes("locations")
						if (isLocationsFile) {
							router.push("/locations")
						} else {
							const locationId = parsedFilename.replace(".yaml", "")
							router.push(`/locations/${locationId}`)
						}
						break
					}
				}
			}
		}
	}, [filename, processedData, router])

	// Register section references for navigation
	const handleRef = (path: string) => (el: HTMLElement | null) => {
		if (el) {
			if (sectionRefs.current.get(path) !== el) {
				sectionRefs.current.set(path, el)
				registerSectionRef(path, el)
			}
		}
	}

	// Loading and error states
	if (!filename) {
		return (
			<div className="p-8 text-center text-gray-500">Select a file to view</div>
		)
	}

	if (isLoading) {
		return <div className="p-8 text-center">Loading data...</div>
	}

	if (error) {
		return <div className="p-8 text-center text-red-500">{error}</div>
	}

	if (!processedData) {
		return null
	}

	// For special content types, we'll show a loading message since we're redirecting
	if (contentType !== "generic") {
		return (
			<div className="p-8 text-center">
				Redirecting to {contentType} page...
			</div>
		)
	}

	// Generic YAML display for other content types
	return (
		<div className="yaml-display">
			{/* Display title */}
			{processedData.title && (
				<h1
					className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-4 border-b pb-2 border-gray-200 dark:border-gray-700"
					ref={handleRef(processedData.title || "")}
					id={processedData.title}
				>
					{processedData.title}
				</h1>
			)}

			{/* Display description if available */}
			{processedData.description && (
				<p className="text-gray-600 dark:text-gray-400 mb-6">
					{processedData.description}
				</p>
			)}

			{/* Render each section */}
			{processedData.sections.map((section, index) => (
				<div
					key={`section-${index}`}
					className="mb-8"
					ref={handleRef(section.title || `section-${index}`)}
					id={section.title || `section-${index}`}
				>
					{section.title && (
						<h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-3">
							{section.title}
						</h2>
					)}
					{renderValue(section.value as any, navigateToFile, navigateToSection)}
				</div>
			))}
		</div>
	)
}

// Render YAML values recursively
const renderValue = (
	value: any,
	onNavigateFile: (file: string) => void,
	onNavigateSection: (section: string) => void,
): React.ReactNode => {
	if (!value) return null

	// Handle different types of values
	if (typeof value === "object") {
		if (Array.isArray(value)) {
			// Render as array
			return renderArrayValue(value, onNavigateFile, onNavigateSection)
		} else {
			// Render as object
			return renderObjectValue(value, onNavigateFile, onNavigateSection)
		}
	}

	// Render primitives (string, number, boolean, etc.)
	return renderPrimitiveValue(value, onNavigateFile, onNavigateSection)
}

// Render object values
const renderObjectValue = (
	obj: any,
	onNavigateFile: (file: string) => void,
	onNavigateSection: (section: string) => void,
): React.ReactNode => {
	if (!obj || Object.keys(obj).length === 0) {
		return <span className="text-gray-400">Empty object</span>
	}

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-2 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-800/70">
			{Object.entries(obj).map(([key, value]) => (
				<div
					key={key}
					className="flex flex-col gap-1 p-2 rounded border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900"
				>
					<div className="font-medium text-gray-800 dark:text-gray-200">
						{key}
					</div>
					<div>{renderValue(value, onNavigateFile, onNavigateSection)}</div>
				</div>
			))}
		</div>
	)
}

// Render array values
const renderArrayValue = (
	array: any[],
	onNavigateFile: (file: string) => void,
	onNavigateSection: (section: string) => void,
): React.ReactNode => {
	if (!array || array.length === 0) {
		return <span className="text-gray-400">Empty list</span>
	}

	// Determine if this is a list of primitive values or complex objects
	const hasComplexItems = array.some(
		(item) => typeof item === "object" && item !== null,
	)

	if (hasComplexItems) {
		// For complex items, use a more structured list
		return (
			<div className="space-y-3">
				{array.map((item, index) => (
					<div
						key={index}
						className="border-l-2 border-indigo-300 dark:border-indigo-700 pl-4 py-2 bg-white/50 dark:bg-gray-800/30 rounded-r-md"
					>
						<div className="text-sm font-medium text-indigo-600 dark:text-indigo-400 mb-2">
							Item {index + 1}
						</div>
						<div>{renderValue(item, onNavigateFile, onNavigateSection)}</div>
					</div>
				))}
			</div>
		)
	} else {
		// For simple items, use a more compact list
		return (
			<ul className="list-disc ml-6 space-y-1">
				{array.map((item, index) => (
					<li key={index}>
						{renderValue(item, onNavigateFile, onNavigateSection)}
					</li>
				))}
			</ul>
		)
	}
}

// Render primitive values
const renderPrimitiveValue = (
	value: any,
	onNavigateFile: (file: string) => void,
	onNavigateSection: (section: string) => void,
): React.ReactNode => {
	// Handle undefined or null
	if (value === undefined || value === null) {
		return <span className="text-gray-400">Not specified</span>
	}

	// Handle strings that might be references or URLs
	if (typeof value === "string") {
		// Check if it looks like a cross-reference to a file
		if (value.endsWith(".yaml") || value.endsWith(".yml")) {
			return (
				<button
					onClick={() => onNavigateFile(value)}
					className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
				>
					{value}
				</button>
			)
		}

		// If it's a URL, make it clickable
		const urlRegex = /^https?:\/\/[^\s/$.?#].[^\s]*$/i
		if (urlRegex.test(value)) {
			return (
				<a
					href={value}
					target="_blank"
					rel="noopener noreferrer"
					className="text-blue-600 dark:text-blue-400 hover:underline"
				>
					{value}
				</a>
			)
		}

		// Regular string
		return <span>{value}</span>
	}

	if (typeof value === "boolean") {
		return (
			<span
				className={
					value
						? "text-emerald-600 dark:text-emerald-400"
						: "text-rose-600 dark:text-rose-400"
				}
			>
				{String(value)}
			</span>
		)
	}

	if (typeof value === "number") {
		return (
			<span className="text-amber-600 dark:text-amber-400">
				{String(value)}
			</span>
		)
	}

	// Other primitive
	return <span>{String(value)}</span>
}
