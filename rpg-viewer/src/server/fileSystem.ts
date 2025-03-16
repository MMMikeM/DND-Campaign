// Use the Next.js server-only package to ensure this code only runs on the server
import "server-only";
import fs from "fs";
import path from "path";

// Export functions that interact with the file system
export function readFile(filePath: string): string {
	return fs.readFileSync(filePath, "utf8");
}

export function fileExists(filePath: string): boolean {
	return fs.existsSync(filePath);
}

export function readDirectory(dirPath: string): string[] {
	return fs.readdirSync(dirPath);
}

export function makeDirectory(dirPath: string): void {
	fs.mkdirSync(dirPath, { recursive: true });
}

export function copyFile(srcPath: string, destPath: string): void {
	fs.copyFileSync(srcPath, destPath);
}

export function getPathJoin(...paths: string[]): string {
	return path.join(...paths);
}

export function getBasename(filePath: string): string {
	return path.basename(filePath);
}

export function getYAMLFilesInDirectory(dirPath: string): string[] {
	try {
		if (!fileExists(dirPath)) {
			return [];
		}

		return readDirectory(dirPath).filter(
			(file) =>
				file.toLowerCase().endsWith(".yaml") ||
				file.toLowerCase().endsWith(".yml"),
		);
	} catch (error) {
		console.error(`Error reading directory ${dirPath}:`, error);
		return [];
	}
}

// Function to find a file in multiple locations
export function findYAMLFile(
	filename: string,
): { filePath: string; content: string } | null {
	// Sanitize the filename to prevent directory traversal
	const sanitizedFile = getBasename(filename);

	// Define possible locations to look for the file
	const cwd = process.cwd();
	const possibleLocations = [
		getPathJoin(cwd, "..", sanitizedFile), // Parent directory - prioritized for development
		getPathJoin(cwd, "public", "data", sanitizedFile), // Public data directory
		global.yamlDir ? getPathJoin(global.yamlDir, sanitizedFile) : null, // If global.yamlDir is set
	].filter(Boolean) as string[];

	// Find the file in possible locations
	for (const location of possibleLocations) {
		if (fileExists(location)) {
			try {
				const content = readFile(location);
				return { filePath: location, content };
			} catch (readError) {
				throw new Error(
					`Failed to read YAML file: ${(readError as Error).message}`,
				);
			}
		}
	}

	return null;
}
