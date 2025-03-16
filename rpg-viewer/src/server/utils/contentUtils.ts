import {
	fileExists,
	readFile,
	getPathJoin,
	getYAMLFilesInDirectory,
} from "@/server/fileSystem"
import yaml from "js-yaml"
import type { z } from "zod"

/**
 * Error class for content-related errors
 */
export class ContentError extends Error {
	constructor(
		message: string,
		public contentType?: string,
	) {
		super(message)
		this.name = "ContentError"
	}
}

/**
 * Find all YAML files in a directory
 */
export async function findAllContentFiles(
	contentType: string,
	campaignName: string,
): Promise<string[]> {
	// Define the directory paths to look in
	const contentDirectories = [
		// New campaign structure
		await getPathJoin(
			process.cwd(),
			"..",
			"campaigns",
			campaignName,
			contentType,
		),
		// Direct path for development
		await getPathJoin(process.cwd(), "campaigns", campaignName, contentType),
		// Root directory files with naming pattern - DISABLED to avoid validation errors with non-standard files
		// await getPathJoin(process.cwd(), ".."),
		// Direct root for development - DISABLED to avoid validation errors with non-standard files
		// await getPathJoin(process.cwd()),
	]

	// Collect all found files
	const foundFiles: string[] = []

	// Try each directory
	for (const directory of contentDirectories) {
		try {
			if (await fileExists(directory)) {
				// For root directories, look for specific naming pattern
				if (
					directory === (await getPathJoin(process.cwd(), "..")) ||
					directory === (await getPathJoin(process.cwd()))
				) {
					// Get all YAML files matching the pattern
					const allYamlFiles = await getYAMLFilesInDirectory(directory)
					const matchingFiles = allYamlFiles
						.filter(
							(file) =>
								file
									.toLowerCase()
									.includes(
										`${campaignName.toLowerCase()}-${contentType.toLowerCase()}`,
									) ||
								file.toLowerCase().includes(`${contentType.toLowerCase()}`),
						)
						.map((file) => getPathJoin(directory, file))

					if (matchingFiles.length > 0) {
						foundFiles.push(...(await Promise.all(matchingFiles)))
					}
				} else {
					// Get all YAML files in the directory
					const yamlFilesPromises = (
						await getYAMLFilesInDirectory(directory)
					).map((file) => getPathJoin(directory, file))

					const yamlFiles = await Promise.all(yamlFilesPromises)

					if (yamlFiles.length > 0) {
						foundFiles.push(...yamlFiles)
					}
				}
			}
		} catch (error) {
			console.error(
				`[findAllContentFiles] Error reading directory ${directory}:`,
				error,
			)
			console.debug(`Error reading directory ${directory}`, error)
			// Continue to next directory option
		}
	}

	if (foundFiles.length === 0) {
		throw new ContentError(
			`No ${contentType} files found in campaign '${campaignName}'`,
			contentType,
		)
	}

	return foundFiles
}

/**
 * Parse and process a YAML content file
 * Keeps the data structure as close to the schema as possible
 */
export async function parseContentFile<T extends z.ZodTypeAny>(
	filePath: string,
	contentType: string,
	schema: T,
) {
	try {
		const fileContent = await readFile(filePath)
		const parsedYaml = yaml.load(fileContent)

		// Ensure we have a valid YAML object
		if (!parsedYaml || typeof parsedYaml !== "object") {
			throw new ContentError(
				`Invalid ${contentType} file format in ${filePath}`,
				contentType,
			)
		}

		// Validate data against schema
		try {
			return schema.parse(parsedYaml) as z.infer<T>
		} catch (validationErr) {
			console.error(`Failed to validate ${contentType} data`, validationErr)
			throw new ContentError(
				`Schema validation failed: ${(validationErr as Error).message}`,
				contentType,
			)
		}
	} catch (readErr) {
		console.error(`Error reading ${contentType} file`, readErr)
		throw readErr instanceof ContentError
			? readErr
			: new ContentError(
					`Failed to read or parse ${contentType} file: ${(readErr as Error).message}`,
					contentType,
				)
	}
}

/**
 * Convert an ID or name with hyphens/underscores to a properly formatted display name
 */
export function idToName(id: string): string {
	return id
		.split(/[-_]/)
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ")
}

/**
 * Generic function to get data by type
 * Returns the data directly as validated by the schema
 * Always returns an array of data, even for a single file
 */
export async function getDataByType<T extends z.ZodTypeAny>(
	contentType: string,
	schema: T,
	campaignName: string,
): Promise<z.infer<T>[]> {
	try {
		const contentFiles = await findAllContentFiles(contentType, campaignName)

		if (contentFiles.length === 0) {
			const errorMsg = `${idToName(contentType)} files not found for campaign '${campaignName}'`
			console.error(errorMsg)
			throw new ContentError(errorMsg, contentType)
		}

		// Always collect data in an array
		const allData: z.infer<T>[] = []

		for (const filePath of contentFiles) {
			try {
				const fileData = await parseContentFile<T>(
					filePath,
					contentType,
					schema,
				)

				allData.push(fileData)
			} catch (error) {
				console.error(`[getDataByType] Error parsing file ${filePath}:`, error)
			}
		}

		return allData
	} catch (error) {
		throw error instanceof ContentError
			? error
			: new ContentError(
					`Failed to fetch ${contentType} data: ${(error as Error).message}`,
					contentType,
				)
	}
}

/**
 * Find content by ID across multiple files in a folder
 * This function always validates content against the provided schema
 * and always normalizes IDs for consistent lookups
 */
export async function findContentById<T>(
	id: string,
	contentType: string,
	campaignName: string,
	schema: z.ZodType<T>,
	rootProperty?: string,
): Promise<T> {
	try {
		const allContentData = await getDataByType(
			contentType,
			schema,
			campaignName,
		)

		// Always normalize the search ID
		const searchId = id.toLowerCase()

		for (const content of allContentData) {
			// If a root property is specified, look within that property
			const searchContent =
				rootProperty && content[rootProperty] ? content[rootProperty] : content

			// Check if the content is an object
			if (typeof searchContent === "object") {
				// Direct match with the ID as a key
				if (searchContent[id] !== undefined) {
					return searchContent[id] as T
				}

				// Try to find key with case-insensitive and format-flexible matching
				const key = Object.keys(searchContent).find((k) => {
					const normalizedKey = k.toLowerCase()
					return (
						normalizedKey === searchId ||
						normalizedKey.replace(/\s+/g, "-") === searchId ||
						normalizedKey.replace(/_/g, "-") === searchId.replace(/\s+/g, "-")
					)
				})

				if (key) {
					return searchContent[key] as T
				}

				// Look for objects with an id property matching the search ID
				if (Array.isArray(searchContent)) {
					const item = searchContent.find(
						(item) =>
							(item && item.id === id) ||
							(item.id && item.id.toLowerCase() === searchId),
					)

					if (item) {
						return item as T
					}
				}
			}
		}

		// If we get here, no match was found
		throw new ContentError(
			`${idToName(contentType)} with ID "${id}" not found in any content`,
			contentType,
		)
	} catch (error) {
		console.error(`Error finding ${contentType} with ID "${id}"`, error)
		throw error instanceof ContentError
			? error
			: new ContentError(
					`Failed to find ${contentType} with ID "${id}": ${(error as Error).message}`,
					contentType,
				)
	}
}
