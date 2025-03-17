import path from "node:path"
import fs from "node:fs"
import yaml from "js-yaml"
import * as fileSystem from "./fileSystem"
import { idToName } from "./utils/contentUtils"

// Types for YAML processing
interface Section {
	title: string
	titleFormatted: string
	type: "primitive" | "array" | "object"
	path: string
	value: unknown
	isLinkable?: boolean
}

interface ProcessedValue {
	type: "string" | "number" | "boolean" | "null" | "array" | "object"
	value: unknown
	isLinkable?: boolean
}

export interface ProcessedData {
	sections: Section[]
}

// Helper to check if text can be linked to another entry
function isLinkable(text: string): boolean {
	if (typeof text !== "string") return false

	// Pattern for detecting potential cross-references
	return (
		/^[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)*$/.test(text) &&
		text.length > 3 &&
		!["true", "false", "null", "undefined"].includes(text.toLowerCase())
	)
}

// Format key for display
function formatKeyForDisplay(key: string): string {
	return idToName(key)
}

// Process YAML data into a format suitable for UI display
export function processYamlData(data: Record<string, unknown>): ProcessedData {
	const sections: Section[] = []

	for (const [key, value] of Object.entries(data)) {
		const path = key
		const titleFormatted = formatKeyForDisplay(key)

		if (Array.isArray(value)) {
			sections.push({
				title: key,
				titleFormatted,
				type: "array",
				path,
				value,
			})
		} else if (value !== null && typeof value === "object") {
			sections.push({
				title: key,
				titleFormatted,
				type: "object",
				path,
				value,
			})
		} else {
			const valueStr = String(value)
			sections.push({
				title: key,
				titleFormatted,
				type: "primitive",
				path,
				value,
				isLinkable: isLinkable(valueStr),
			})
		}
	}

	return { sections: getSortedSections(sections) }
}

// Get sorted sections with version having lower priority
function getSortedSections(sections: Section[]): Section[] {
	return [...sections].sort((a, b) => {
		// Special case handling for certain fields to appear first
		if (a.title === "title") return -1
		if (b.title === "title") return 1
		if (a.title === "name") return -1
		if (b.title === "name") return 1
		if (a.title === "description") return -1
		if (b.title === "description") return 1

		// Push version to the end
		if (a.title === "version") return 1
		if (b.title === "version") return -1

		return a.title.localeCompare(b.title)
	})
}

// Process a value for display
export function processValue(value: unknown): ProcessedValue {
	if (value === null || value === undefined) {
		return { type: "null", value: "null" }
	}

	if (typeof value === "string") {
		return {
			type: "string",
			value,
			isLinkable: isLinkable(value),
		}
	}

	if (typeof value === "number") {
		return { type: "number", value }
	}

	if (typeof value === "boolean") {
		return { type: "boolean", value }
	}

	if (Array.isArray(value)) {
		return { type: "array", value }
	}

	return { type: "object", value }
}

// Get all YAML files from specified directories
export async function getYamlFiles(): Promise<string[]> {
	try {
		const cwd = process.cwd()

		// Paths for locating YAML files
		const rootDir = await fileSystem.getPathJoin(cwd, "..")
		const publicDataDir = await fileSystem.getPathJoin(cwd, "public", "data")

		// Get YAML files from both directories
		const rootYamlFiles = await fileSystem.getYAMLFilesInDirectory(rootDir)
		const publicYamlFiles =
			await fileSystem.getYAMLFilesInDirectory(publicDataDir)

		// Combine files, removing duplicates
		const yamlFilesSet = new Set([...rootYamlFiles, ...publicYamlFiles])
		const yamlFiles = Array.from(yamlFilesSet)

		// Sort files alphabetically
		yamlFiles.sort()

		// Store public data directory in global for easier access
		global.yamlDir = publicDataDir

		return yamlFiles
	} catch (error) {
		console.error("Error in getYamlFiles:", error)
		// Return an empty list rather than throwing an error
		return []
	}
}

// Find a specific YAML file
export async function findYamlFile(filename: string): Promise<string | null> {
	try {
		const fileResult = await fileSystem.findYAMLFile(filename)
		return fileResult ? fileResult.filePath : null
	} catch (error) {
		console.error(`Error finding YAML file ${filename}:`, error)
		return null
	}
}

// Get the content of a YAML file
export async function getYamlContent(
	filename: string,
): Promise<Record<string, unknown> | null> {
	try {
		const fileResult = await fileSystem.findYAMLFile(filename)
		if (!fileResult) return null

		const parsedData = yaml.load(fileResult.content)
		if (parsedData === null || parsedData === undefined) {
			throw new Error("YAML content is empty or invalid")
		}

		return parsedData as Record<string, unknown>
	} catch (error) {
		console.error(`Error getting YAML content for ${filename}:`, error)
		return null
	}
}

// Get the processed YAML data for UI display
export async function getProcessedYamlData(
	filename: string,
): Promise<ProcessedData | null> {
	try {
		const content = await getYamlContent(filename)
		if (!content) return null

		return processYamlData(content)
	} catch (error) {
		console.error(`Error processing YAML data for ${filename}:`, error)
		return null
	}
}
