import { z } from "zod";
import yaml from "js-yaml";
import { router, publicProcedure } from "../trpc";
import "../types"; // Import for global type definitions
import * as fs from "../fileSystem";
import { TRPCError } from "@trpc/server";

// These server-only imports will be dynamically imported in the procedures
// import fs from "fs";
// import path from "path";

// Helper types
type FileResult = { file: string; status: string; message?: string };

// Reuse the helper functions from your existing API
function isLinkable(text: string): boolean {
	if (typeof text !== "string") return false;

	// Pattern for detecting potential cross-references
	return (
		/^[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)*$/.test(text) &&
		text.length > 3 &&
		!["true", "false", "null", "undefined"].includes(text.toLowerCase())
	);
}

function formatKeyForDisplay(key: string): string {
	return key.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

// Define interfaces for typed data handling
interface Section {
	title: string;
	titleFormatted: string;
	type: "primitive" | "array" | "object";
	path: string;
	value: unknown;
	isLinkable?: boolean;
}

interface ProcessedValue {
	type: "string" | "number" | "boolean" | "null" | "array" | "object";
	value: unknown;
	isLinkable?: boolean;
}

// Get sorted sections with version having lower priority
function getSortedSections(sections: Section[]): Section[] {
	return [...sections].sort((a, b) => {
		// Special case handling:

		// Put description first if it exists
		if (a.title === "description") return -1;
		if (b.title === "description") return 1;

		// Put "version" much lower in priority
		if (a.title === "version") return 10;
		if (b.title === "version") return -10;

		// Put name, title, id near the top
		const highPriorityFields = ["name", "title", "id"];
		const aIsHighPriority = highPriorityFields.includes(a.title);
		const bIsHighPriority = highPriorityFields.includes(b.title);

		if (aIsHighPriority && !bIsHighPriority) return -1;
		if (!aIsHighPriority && bIsHighPriority) return 1;

		// Default: alphabetical
		return a.title.localeCompare(b.title);
	});
}

// Process YAML data - exported for use in other modules if needed
export function processYamlData(
	data: Record<string, unknown>,
	parentPath: string = "",
): {
	title: string;
	description?: string;
	sections: Section[];
} {
	if (!data || typeof data !== "object") {
		return {
			title: "Error",
			description: "Invalid YAML data",
			sections: [],
		};
	}

	// Extract title and description if available
	let title = "YAML Data";
	let description: string | undefined = undefined;

	if (data.name && typeof data.name === "string") {
		title = data.name;
	} else if (data.title && typeof data.title === "string") {
		title = data.title;
	}

	if (data.description && typeof data.description === "string") {
		description = data.description;
	}

	// Process all sections
	const sections: Section[] = Object.entries(data).map(([key, value]) => {
		const path = parentPath ? `${parentPath}.${key}` : key;
		const processedValue = processValueForDisplay(value, path);

		return {
			title: key,
			titleFormatted: formatKeyForDisplay(key),
			type:
				processedValue.type === "array" || processedValue.type === "object"
					? processedValue.type
					: "primitive",
			path,
			value: processedValue.value,
			isLinkable: processedValue.isLinkable,
		};
	});

	// Return processed data
	return {
		title,
		description,
		sections: getSortedSections(sections),
	};
}

function processValueForDisplay(value: unknown, path: string): ProcessedValue {
	if (value === null || value === undefined) {
		return { type: "null", value: null };
	}

	if (typeof value === "string") {
		return {
			type: "string",
			value,
			isLinkable: isLinkable(value),
		};
	}

	if (typeof value === "number") {
		return { type: "number", value };
	}

	if (typeof value === "boolean") {
		return { type: "boolean", value };
	}

	if (Array.isArray(value)) {
		const items = value.map((item, index) =>
			processValueForDisplay(item, `${path}[${index}]`),
		);
		return {
			type: "array",
			value: { items },
		};
	}

	if (typeof value === "object") {
		const processedObj: Record<string, Section> = {};

		for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
			const nestedPath = `${path}.${key}`;
			const processedValue = processValueForDisplay(val, nestedPath);

			processedObj[key] = {
				title: key,
				titleFormatted: formatKeyForDisplay(key),
				type:
					processedValue.type === "array" || processedValue.type === "object"
						? processedValue.type
						: "primitive",
				path: nestedPath,
				value: processedValue.value,
				isLinkable: processedValue.isLinkable,
			};
		}

		return {
			type: "object",
			value: processedObj,
		};
	}

	// Fallback
	return {
		type: "string",
		value: String(value),
	};
}

// Server-side file utilities
async function getYamlFilesFromDirectory(directory: string): Promise<string[]> {
	return fs.getYAMLFilesInDirectory(directory);
}

async function findFile(
	filename: string,
): Promise<{ filePath: string; content: string } | null> {
	return fs.findYAMLFile(filename);
}

export const yamlRouter = router({
	// Get a list of available YAML files
	getFileList: publicProcedure.query(async () => {
		try {
			const cwd = process.cwd();

			// Paths for locating YAML files
			const rootDir = fs.getPathJoin(cwd, "..");
			const publicDataDir = fs.getPathJoin(cwd, "public", "data");

			// Get all YAML files from both directories
			const rootYamlFiles = await getYamlFilesFromDirectory(rootDir);
			const publicYamlFiles = await getYamlFilesFromDirectory(publicDataDir);

			// Combine files, removing duplicates
			const yamlFilesSet = new Set([...rootYamlFiles, ...publicYamlFiles]);
			const yamlFiles = Array.from(yamlFilesSet);

			// Sort files alphabetically
			yamlFiles.sort();

			// Store public data directory in global for easier access
			global.yamlDir = publicDataDir;

			return { files: yamlFiles };
		} catch (error) {
			console.error("Error in getFileList:", error);
			// Return an empty list rather than throwing an error
			return { files: [] };
		}
	}),

	// Get raw YAML data
	getRawData: publicProcedure
		.input(z.object({ file: z.string() }))
		.query(async ({ input }) => {
			const { file } = input;

			if (!file || file === "undefined" || file === "") {
				throw new Error("No file specified");
			}

			try {
				const result = await findFile(file);

				if (result) {
					return { content: result.content };
				} else {
					throw new Error(`YAML file not found: ${file}`);
				}
			} catch (error) {
				console.error(`Error in getRawData for file ${file}:`, error);
				throw new Error(
					`Failed to read YAML file: ${(error as Error).message}`,
				);
			}
		}),

	// Get processed YAML data
	getProcessedData: publicProcedure
		.input(z.object({ file: z.string() }))
		.query(async ({ input }) => {
			const { file } = input;

			if (!file || file === "undefined" || file === "") {
				throw new Error("No file specified");
			}

			try {
				const result = await findFile(file);

				if (result) {
					try {
						// Parse YAML content
						const parsedData = yaml.load(result.content);

						// Check if parsedData is valid
						if (parsedData === null || parsedData === undefined) {
							throw new Error("YAML content is empty or invalid");
						}

						// Process the data into a more UI-friendly format with sections
						const processedData = processYamlData(
							parsedData as Record<string, unknown>,
						);

						// Create the result object
						return { data: processedData };
					} catch (parseError) {
						throw new Error(
							`Failed to parse YAML content: ${(parseError as Error).message}`,
						);
					}
				} else {
					throw new Error(`YAML file not found: ${file}`);
				}
			} catch (error) {
				console.error(`Error in getProcessedData for file ${file}:`, error);
				throw new Error(
					`Failed to process YAML file: ${(error as Error).message}`,
				);
			}
		}),

	// Copy YAML files from parent directory to public/data
	copyFiles: publicProcedure.mutation(async () => {
		try {
			const cwd = process.cwd();
			const rootDir = fs.getPathJoin(cwd, "..");
			const publicDir = fs.getPathJoin(cwd, "public");
			const dataDir = fs.getPathJoin(publicDir, "data");

			// Create public/data directory if it doesn't exist
			if (!fs.fileExists(publicDir)) {
				fs.makeDirectory(publicDir);
			}
			if (!fs.fileExists(dataDir)) {
				fs.makeDirectory(dataDir);
			}

			// Get all YAML files in the root directory
			let yamlFiles: string[] = [];
			try {
				yamlFiles = fs
					.readDirectory(rootDir)
					.filter(
						(file) =>
							file.toLowerCase().endsWith(".yaml") ||
							file.toLowerCase().endsWith(".yml"),
					);
			} catch (err) {
				throw new Error(
					`Failed to read source directory: ${(err as Error).message}`,
				);
			}

			if (yamlFiles.length === 0) {
				throw new Error("No YAML files found in source directory");
			}

			// Copy each YAML file to the public/data directory
			const results: FileResult[] = [];

			for (const file of yamlFiles) {
				const sourcePath = fs.getPathJoin(rootDir, file);
				const targetPath = fs.getPathJoin(dataDir, file);

				try {
					fs.copyFile(sourcePath, targetPath);
					results.push({ file, status: "success" });
				} catch (err) {
					results.push({
						file,
						status: "error",
						message: (err as Error).message,
					});
				}
			}

			return { results };
		} catch (error) {
			console.error("Error copying files:", error);
			throw new Error((error as Error).message);
		}
	}),

	// Debug filesystem information
	debugFs: publicProcedure.query(async () => {
		try {
			const cwd = process.cwd();
			const parentDir = fs.getPathJoin(cwd, "..");
			const grandparentDir = fs.getPathJoin(cwd, "..", "..");
			const publicDir = fs.getPathJoin(cwd, "public");
			const publicDataDir = fs.getPathJoin(publicDir, "data");

			// Check various locations for YAML files
			const dirs = [
				{ name: "Current Working Directory", path: cwd },
				{ name: "Parent Directory", path: parentDir },
				{ name: "Grandparent Directory", path: grandparentDir },
				{ name: "Public Directory", path: publicDir },
				{ name: "Public Data Directory", path: publicDataDir },
			];

			const directoryInfo = dirs.map((dir) => {
				let files: string[] = [];
				const exists = fs.fileExists(dir.path);
				let yamlFiles: string[] = [];

				if (exists) {
					try {
						files = fs.readDirectory(dir.path);
						yamlFiles = files.filter(
							(file) => file.endsWith(".yaml") || file.endsWith(".yml"),
						);
					} catch (err) {
						return {
							name: dir.name,
							path: dir.path,
							exists,
							error: `Error reading directory: ${(err as Error).message}`,
							files: [],
							yamlFiles: [],
						};
					}
				}

				return {
					name: dir.name,
					path: dir.path,
					exists,
					files,
					yamlFiles,
				};
			});

			// Also check if our specific files exist
			const factionsFile = fs.getPathJoin(
				parentDir,
				"shattered-spire-factions.yaml",
			);
			const factionsExists = fs.fileExists(factionsFile);

			return {
				cwd,
				directoryInfo,
				factionsFile,
				factionsExists,
			};
		} catch (error) {
			console.error("Error in debugFs:", error);
			throw new Error(`Debug filesystem error: ${(error as Error).message}`);
		}
	}),

	// Add a new procedure to list all YAML files
	listFiles: publicProcedure.query(async () => {
		try {
			const cwd = process.cwd();

			// For development, prefer files from the parent directory
			const rootDir = fs.getPathJoin(cwd, ".."); // Parent directory where original YAML files live
			const publicDataDir = fs.getPathJoin(cwd, "public", "data");

			// Get all YAML files from both directories with preference for root files
			const rootYamlFiles = fs.getYAMLFilesInDirectory(rootDir);
			// Only use public data dir files if we find nothing in the root
			const publicYamlFiles =
				rootYamlFiles.length > 0
					? []
					: fs.getYAMLFilesInDirectory(publicDataDir);

			// Combine files, removing duplicates
			const yamlFilesSet = new Set([...rootYamlFiles, ...publicYamlFiles]);
			const yamlFiles = Array.from(yamlFilesSet);

			return yamlFiles;
		} catch (error) {
			throw new TRPCError({
				code: "INTERNAL_SERVER_ERROR",
				message: "Failed to fetch YAML files",
				cause: error,
			});
		}
	}),
});
