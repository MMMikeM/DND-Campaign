// YAML processing types for shared usage between server and client components

export interface ProcessedSection {
	title: string;
	titleFormatted: string;
	type: "primitive" | "array" | "object";
	path: string;
	value: unknown;
	isLinkable?: boolean;
}

export interface ProcessedArray {
	items: ProcessedValue[];
}

export interface ProcessedObject {
	properties: Record<string, ProcessedValue>;
}

export interface ProcessedValue {
	type: "string" | "number" | "boolean" | "null" | "array" | "object";
	value: unknown;
	isLinkable?: boolean;
}

export interface ProcessedData {
	title?: string;
	description?: string;
	sections: ProcessedSection[];
}

export interface YamlData {
	[key: string]: unknown;
}
