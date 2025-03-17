"use server"
import { promises as fsPromises } from "fs";
import path from "path";

// Export functions that interact with the file system
export const readFile = async (filePath: string): Promise<string> => {
	try {
		return await fsPromises.readFile(filePath, "utf8");
	} catch (error) {
		throw new Error(`Failed to read file ${filePath}: ${(error as Error).message}`);
	}
};

export const fileExists = async (filePath: string): Promise<boolean> => {
	try {
		await fsPromises.access(filePath);
		return true;
	} catch {
		return false;
	}
};

export const readDirectory = async (dirPath: string): Promise<string[]> => {
	try {
		return await fsPromises.readdir(dirPath);
	} catch (error) {
		throw new Error(`Failed to read directory ${dirPath}: ${(error as Error).message}`);
	}
};

export const getPathJoin = async (...paths: string[]): Promise<string> => {
	return path.join(...paths);
};

export const getBasename = async (filePath: string): Promise<string> => {
	return path.basename(filePath);
};

export const getYAMLFilesInDirectory = async (dirPath: string): Promise<string[]> => {
	try {
		if (!(await fileExists(dirPath))) {
			return [];
		}

		const files = await readDirectory(dirPath);
		return files.filter(
			(file) =>
				file.toLowerCase().endsWith(".yaml") ||
				file.toLowerCase().endsWith(".yml"),
		);
	} catch (error) {
		console.error(`Error reading directory ${dirPath}:`, error);
		return [];
	}
};

// Function to find a file in multiple locations
export const findYAMLFile = async (
	filename: string,
): Promise<{ filePath: string; content: string } | null> => {
	// Sanitize the filename to prevent directory traversal
	const sanitizedFile = getBasename(filename);

	// Define possible locations to look for the file
	const cwd = process.cwd();
	const possibleLocations = await Promise.all([
		getPathJoin(cwd, "..", await sanitizedFile), // Parent directory - prioritized for development
		getPathJoin(cwd, "public", "data", await sanitizedFile), // Public data directory
	].filter(Boolean) )		;

	// Find the file in possible locations
	for (const location of possibleLocations) {
		if (await fileExists(location)) {
			try {
				const content = await readFile(location);
				return { filePath: location, content };
			} catch (readError) {
				throw new Error(
					`Failed to read YAML file: ${(readError as Error).message}`,
				);
			}
		}
	}

	return null;
};
