export interface ProcessedValue {
  type: "string" | "number" | "boolean" | "null" | "array" | "object";
  value: unknown;
  isLinkable?: boolean;
}

export interface ProcessedObject {
  [key: string]: ProcessedSection;
}

export interface ProcessedArray {
  items: ProcessedValue[];
}

export interface ProcessedSection {
  title: string;
  titleFormatted: string;
  type: "primitive" | "array" | "object";
  path: string;
  value: string | number | boolean | null | ProcessedObject | ProcessedArray;
  description?: string;
  isLinkable?: boolean;
}

export interface ProcessedData {
  title: string;
  description?: string;
  sections: ProcessedSection[];
}

export interface YamlData {
  [key: string]: unknown;
}
