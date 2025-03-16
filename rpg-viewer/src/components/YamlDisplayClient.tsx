"use client";

import React, { useRef } from "react";
import type { ProcessedData } from "@/types/yamlTypes";
import { useCrossReference } from "./CrossReferenceContext";
import FactionDisplay from "./content-types/FactionDisplay";
import NPCDisplay from "./content-types/NPCDisplay";
import QuestDisplay from "./content-types/QuestDisplay";
import LocationDisplay from "./content-types/LocationDisplay";

interface YamlDisplayClientProps {
	data: ProcessedData;
	contentType: string;
	filename: string;
}

export default function YamlDisplayClient({
	data,
	contentType,
	filename,
}: YamlDisplayClientProps) {
	const { registerSectionRef } = useCrossReference();
	const sectionRefs = useRef<Map<string, HTMLElement>>(new Map());

	// Register section references for navigation
	const handleRef = (path: string) => (el: HTMLElement | null) => {
		if (el) {
			if (sectionRefs.current.get(path) !== el) {
				sectionRefs.current.set(path, el);
				registerSectionRef(path, el);
			}
		}
	};

	// Display specialized components based on content type
	switch (contentType) {
		case "faction":
			return <FactionDisplay handleRef={handleRef} />;
		case "npc":
			return <NPCDisplay handleRef={handleRef} />;
		case "quest":
			return <QuestDisplay handleRef={handleRef} />;
		case "location":
			return <LocationDisplay handleRef={handleRef} />;
		default:
			// Default display for any YAML file
			return (
				<div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
					<h2 className="text-xl font-semibold mb-4">{filename}</h2>

					{data.sections.map((section) => (
						<div
							key={section.path}
							className="mb-6 pb-4 border-b border-gray-200 dark:border-gray-700"
							ref={handleRef(section.path)}
						>
							<h3 className="text-lg font-medium mb-2">
								{section.titleFormatted}
							</h3>

							{section.type === "primitive" && (
								<div className="text-gray-700 dark:text-gray-300">
									{String(section.value)}
								</div>
							)}

							{section.type === "array" && Array.isArray(section.value) && (
								<ul className="list-disc pl-5 space-y-1">
									{section.value.map((item, index) => (
										<li
											key={`${section.path}-item-${index}`}
											className="text-gray-700 dark:text-gray-300"
										>
											{typeof item === "object"
												? JSON.stringify(item)
												: String(item)}
										</li>
									))}
								</ul>
							)}

							{section.type === "object" &&
								typeof section.value === "object" && (
									<div className="grid grid-cols-1 md:grid-cols-2 gap-2">
										{Object.entries(
											section.value as Record<string, unknown>,
										).map(([key, val]) => (
											<div key={key} className="flex">
												<span className="font-medium mr-2">{key}:</span>
												<span className="text-gray-700 dark:text-gray-300">
													{typeof val === "object"
														? JSON.stringify(val)
														: String(val)}
												</span>
											</div>
										))}
									</div>
								)}
						</div>
					))}
				</div>
			);
	}
}
