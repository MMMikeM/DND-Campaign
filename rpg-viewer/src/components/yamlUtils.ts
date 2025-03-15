import React from "react";
import {
  ProcessedSection,
  ProcessedArray,
  ProcessedObject,
  ProcessedValue,
} from "@/types/yamlTypes";

// Get sorted sections with version having lower priority
export const getSortedSections = (
  sections: ProcessedSection[]
): ProcessedSection[] => {
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

    // Default to alphabetical order
    return a.title.localeCompare(b.title);
  });
};

// Handle description specially
export const renderDescription = (description: string): React.ReactNode => {
  return (
    <div className="bg-gray-50 dark:bg-gray-800/30 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
      <p className="text-gray-700 dark:text-gray-300 whitespace-normal break-words">
        {description}
      </p>
    </div>
  );
};

// Handle link clicks
export const handleLinkClick = (
  text: string,
  navigateToFile: (file: string) => void,
  navigateToSection: (section: string) => void
) => {
  // Check if it might be a reference to a file
  if (text.endsWith(".yaml") || text.endsWith(".yml")) {
    navigateToFile(text);
  } else {
    // Otherwise, try to find and scroll to that section
    navigateToSection(text);
  }
};

// Render a value that might be a link
export const renderPotentialLink = (
  value: string,
  isLinkable: boolean = false,
  navigateToFile: (file: string) => void,
  navigateToSection: (section: string) => void
) => {
  if (isLinkable) {
    return (
      <button
        className="text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer font-medium"
        onClick={() =>
          handleLinkClick(value, navigateToFile, navigateToSection)
        }
      >
        {value}
      </button>
    );
  }
  return <span className="break-words">{value}</span>;
};

// Render primitive values
export const renderPrimitiveValue = (
  value: ProcessedValue,
  navigateToFile: (file: string) => void,
  navigateToSection: (section: string) => void
): React.ReactNode => {
  if (
    value.type === "null" ||
    value.value === null ||
    value.value === undefined
  ) {
    return <span className="text-gray-400">Not specified</span>;
  }

  if (value.type === "string") {
    const stringValue = value.value as string;
    return renderPotentialLink(
      stringValue,
      value.isLinkable,
      navigateToFile,
      navigateToSection
    );
  }

  if (value.type === "boolean") {
    return (
      <span
        className={
          value.value
            ? "text-emerald-600 dark:text-emerald-400"
            : "text-rose-600 dark:text-rose-400"
        }
      >
        {String(value.value)}
      </span>
    );
  }

  if (value.type === "number") {
    return (
      <span className="text-amber-600 dark:text-amber-400">
        {String(value.value)}
      </span>
    );
  }

  // Other primitive
  return <span>{String(value.value)}</span>;
};

// Render array values
export const renderArrayValue = (
  array: ProcessedArray,
  navigateToFile: (file: string) => void,
  navigateToSection: (section: string) => void
): React.ReactNode => {
  if (!array.items || array.items.length === 0) {
    return <span className="text-gray-400">Empty list</span>;
  }

  // Determine if this is a list of primitive values or complex objects
  const hasComplexItems = array.items.some(
    (item) => item.type === "object" || item.type === "array"
  );

  if (hasComplexItems) {
    // For complex items, use a more structured list
    return (
      <div className="space-y-3">
        {array.items.map((item, index) => (
          <div
            key={index}
            className="border-l-2 border-indigo-300 dark:border-indigo-700 pl-4 py-2 bg-white/50 dark:bg-gray-800/30 rounded-r-md"
          >
            <div className="text-sm font-medium text-indigo-600 dark:text-indigo-400 mb-2">
              Item {index + 1}
            </div>
            <div>{renderValue(item, navigateToFile, navigateToSection)}</div>
          </div>
        ))}
      </div>
    );
  }

  // For simple items, use a basic list with better styling
  return (
    <ul className="space-y-1 list-inside pl-0">
      {array.items.map((item, index) => (
        <li
          key={index}
          className="text-gray-700 dark:text-gray-300 flex items-start"
        >
          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs mr-2 mt-0.5 flex-shrink-0">
            {index + 1}
          </span>
          <span className="flex-1">
            {renderValue(item, navigateToFile, navigateToSection)}
          </span>
        </li>
      ))}
    </ul>
  );
};

// Render object values
export const renderObjectValue = (
  obj: ProcessedObject,
  navigateToFile: (file: string) => void,
  navigateToSection: (section: string) => void
): React.ReactNode => {
  if (!obj || Object.keys(obj).length === 0) {
    return <span className="text-gray-400">Empty object</span>;
  }

  // Always render the full contents, never just show property count
  // For objects with many properties, create a more structured layout
  const entries = Object.entries(obj);

  // For all objects, use a standard description list
  return (
    <dl className="divide-y divide-gray-200 dark:divide-gray-700 rounded-md overflow-hidden">
      {entries.map(([key, section]) => (
        <div
          key={key}
          className="py-3 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4"
        >
          <dt className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
            {section.titleFormatted}
          </dt>
          <dd className="text-sm text-gray-800 dark:text-gray-200 sm:col-span-2 relative">
            {/* Add a left border for nested content to create visual hierarchy */}
            {(section.type === "object" || section.type === "array") && (
              <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-indigo-100 dark:bg-indigo-900/30 rounded-full"></div>
            )}
            <div
              className={`${
                section.type === "object" || section.type === "array"
                  ? "pl-3"
                  : ""
              }`}
            >
              {renderSectionValue(section, navigateToFile, navigateToSection)}
            </div>
          </dd>
        </div>
      ))}
    </dl>
  );
};

// Render a value based on its type
export const renderValue = (
  value: ProcessedValue,
  navigateToFile: (file: string) => void,
  navigateToSection: (section: string) => void
): React.ReactNode => {
  if (value.type === "array") {
    return renderArrayValue(
      value.value as ProcessedArray,
      navigateToFile,
      navigateToSection
    );
  }

  if (value.type === "object") {
    return renderObjectValue(
      value.value as ProcessedObject,
      navigateToFile,
      navigateToSection
    );
  }

  return renderPrimitiveValue(value, navigateToFile, navigateToSection);
};

// Render a section's value
export const renderSectionValue = (
  section: ProcessedSection,
  navigateToFile: (file: string) => void,
  navigateToSection: (section: string) => void
): React.ReactNode => {
  if (section.type === "primitive") {
    if (section.title === "description") {
      return (
        <div className="whitespace-normal break-words text-gray-700 dark:text-gray-300">
          {typeof section.value === "string"
            ? section.value
            : String(section.value)}
        </div>
      );
    }
    return renderPotentialLink(
      typeof section.value === "string" ? section.value : String(section.value),
      section.isLinkable,
      navigateToFile,
      navigateToSection
    );
  }

  if (section.type === "array") {
    return renderArrayValue(
      section.value as ProcessedArray,
      navigateToFile,
      navigateToSection
    );
  }

  if (section.type === "object") {
    // Always expand objects, no conditional rendering
    return renderObjectValue(
      section.value as ProcessedObject,
      navigateToFile,
      navigateToSection
    );
  }

  return <span className="break-words">{String(section.value)}</span>;
};
