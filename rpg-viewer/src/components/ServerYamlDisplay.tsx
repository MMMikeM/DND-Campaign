import { Suspense } from "react";
import { getProcessedYamlData } from "@/server/yaml";
import type { ProcessedData } from "@/types/yamlTypes";
import YamlDisplayClient from "./YamlDisplayClient";

interface ServerYamlDisplayProps {
	filename: string;
}

export default async function ServerYamlDisplay({
	filename,
}: ServerYamlDisplayProps) {
	// Directly fetch processed YAML data from the server function
	const processedData = await getProcessedYamlData(filename);

	if (!processedData) {
		return (
			<div className="p-4 text-red-500">
				Error loading YAML file: {filename}
			</div>
		);
	}

	// Determine content type
	const contentType = getContentType(filename, processedData);

	// Pass the pre-processed data to a client component for rendering
	return (
		<Suspense fallback={<div className="p-4">Loading YAML content...</div>}>
			<YamlDisplayClient
				data={processedData}
				contentType={contentType}
				filename={filename}
			/>
		</Suspense>
	);
}

// Helper to determine content type based on filename and data
function getContentType(filename: string, data: ProcessedData): string {
	if (!filename) return "generic";

	const lowerFilename = filename.toLowerCase();

	if (lowerFilename.includes("faction")) return "faction";
	if (lowerFilename.includes("npc") || lowerFilename.includes("character"))
		return "npc";
	if (lowerFilename.includes("quest") || lowerFilename.includes("mission"))
		return "quest";
	if (lowerFilename.includes("location") || lowerFilename.includes("place"))
		return "location";

	// If we can't determine from filename, check data sections
	if (data.sections.some((s) => s.title === "factions")) return "faction";
	if (data.sections.some((s) => s.title === "npcs" || s.title === "characters"))
		return "npc";
	if (data.sections.some((s) => s.title === "quests" || s.title === "missions"))
		return "quest";
	if (
		data.sections.some((s) => s.title === "locations" || s.title === "places")
	)
		return "location";

	return "generic";
}
