import React from "react";
import {
  ProcessedSection,
  ProcessedArray,
  ProcessedObject,
  ProcessedValue,
} from "@/types/yamlTypes";

// Handle description specially
export const renderDescription = (description: string): React.ReactNode => {
  return (
    <div className="bg-gray-50 dark:bg-gray-800/30 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
      <p className="text-gray-700 dark:text-gray-200 whitespace-normal break-words">
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
): void => {
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
): React.ReactNode => {
  if (isLinkable) {
    return (
      <button
        className="text-blue-600 dark:text-blue-300 hover:underline cursor-pointer font-medium"
        onClick={() =>
          handleLinkClick(value, navigateToFile, navigateToSection)
        }
      >
        {value}
      </button>
    );
  }
  return (
    <span className="break-words text-gray-800 dark:text-gray-200">
      {value}
    </span>
  );
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
    return (
      <span className="text-gray-400 dark:text-gray-500">Not specified</span>
    );
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
            ? "text-emerald-600 dark:text-emerald-300"
            : "text-rose-600 dark:text-rose-300"
        }
      >
        {String(value.value)}
      </span>
    );
  }

  if (value.type === "number") {
    return (
      <span className="text-amber-600 dark:text-amber-300">
        {String(value.value)}
      </span>
    );
  }

  // Other primitive
  return (
    <span className="text-gray-800 dark:text-gray-200">
      {String(value.value)}
    </span>
  );
};

// Render array values
export const renderArrayValue = (
  array: ProcessedArray,
  navigateToFile: (file: string) => void,
  navigateToSection: (section: string) => void,
  parentTitle?: string
): React.ReactNode => {
  if (!array.items || array.items.length === 0) {
    return <span className="text-gray-400">Empty list</span>;
  }

  // Determine if this is a list of primitive values or complex objects
  const hasComplexItems = array.items.some(
    (item) => item.type === "object" || item.type === "array"
  );

  if (hasComplexItems) {
    // For leadership and character sections, use a card-based layout
    const isEntityList =
      parentTitle &&
      ["leadership", "characters", "npcs", "members", "leaders"].includes(
        parentTitle.toLowerCase()
      );

    if (isEntityList) {
      return (
        <div className="grid grid-cols-1 gap-6 mt-2">
          {array.items.map((item, index) => {
            // Get item information for card display
            let cardTitle = "";

            // Keep track of which fields we've already displayed
            const displayedFields = new Set<string>();

            if (item.type === "object" && item.value) {
              const objValue = item.value as Record<string, ProcessedSection>;

              // Extract a name/title for the card
              if (objValue.name) {
                cardTitle = String(objValue.name.value);
                displayedFields.add("name");
              } else if (objValue.title) {
                cardTitle = String(objValue.title.value);
                displayedFields.add("title");
              } else {
                // Look for key fields that might be names (first capitalized word)
                for (const key in objValue) {
                  const section = objValue[key];
                  if (
                    section.type === "primitive" &&
                    typeof section.value === "string"
                  ) {
                    const value = section.value;
                    if (
                      value &&
                      value.match(/^[A-Z][a-z]+/) &&
                      value.length < 50
                    ) {
                      cardTitle = value;
                      displayedFields.add(key);
                      break;
                    }
                  }
                }
              }

              // Explicitly hide role, description and other display fields from property list
              // Now we'll ONLY hide name and title to match screenshot
              if (objValue.name) displayedFields.add("name");
              if (objValue.title) displayedFields.add("title");
            }

            // If we couldn't extract a name, create a generic one
            if (!cardTitle) {
              const baseName =
                parentTitle && parentTitle.endsWith("s")
                  ? parentTitle.slice(0, -1) // Remove trailing 's'
                  : parentTitle || "Entry";
              cardTitle = `${baseName} ${index + 1}`;
            }

            return (
              <div
                key={index}
                className="bg-gray-50 dark:bg-gray-800/30 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                <div className="p-4">
                  {/* Simple header with just the name */}
                  <h4 className="text-lg font-semibold text-blue-600 dark:text-blue-300 mb-3">
                    {cardTitle}
                  </h4>

                  {/* Display fields in a simple format */}
                  <div className="space-y-1">
                    {item.type === "object" &&
                      item.value &&
                      Object.entries(
                        item.value as Record<string, ProcessedSection>
                      )
                        .filter(([key]) => !displayedFields.has(key))
                        .map(([key, section]) => (
                          <div key={key} className="flex items-start">
                            <div className="text-indigo-600 dark:text-indigo-400 font-medium mr-2 whitespace-nowrap">
                              {key}:
                            </div>
                            <div className="text-gray-800 dark:text-gray-200 flex-1">
                              {section.type === "primitive"
                                ? renderPrimitiveValue(
                                    section,
                                    navigateToFile,
                                    navigateToSection
                                  )
                                : renderSectionValue(
                                    section,
                                    navigateToFile,
                                    navigateToSection
                                  )}
                            </div>
                          </div>
                        ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      );
    }

    // For other complex items, use the standard list with subheadings
    return (
      <div className="space-y-4">
        {array.items.map((item, index) => {
          // Try to find a useful label for this item
          let itemLabel = "";

          // For objects, try to find a name or title field to use
          if (item.type === "object" && item.value) {
            // Cast to ProcessedObject with a Record structure
            const objValue = item.value as Record<string, ProcessedSection>;

            // Try to extract titles and names in different ways
            // Try to find a field that indicates a person or entity name
            if (objValue.name) {
              itemLabel = String(objValue.name.value);
            } else if (objValue.title) {
              itemLabel = String(objValue.title.value);
            } else if (objValue.id) {
              itemLabel = String(objValue.id.value);
            } else {
              // Look for primitive string values that might contain a name
              for (const key in objValue) {
                const section = objValue[key];
                if (
                  section.type === "primitive" &&
                  typeof section.value === "string"
                ) {
                  // If this looks like a name (first word is capitalized), use it
                  const value = section.value;
                  if (
                    value &&
                    value.match(/^[A-Z][a-z]+/) &&
                    value.length < 50
                  ) {
                    itemLabel = value;
                    break;
                  }
                }
              }
            }
          }

          // If we couldn't find a good label, create a contextual one based on parent section
          if (!itemLabel) {
            // Special handling for different parent types
            let baseName = "Entry";

            if (parentTitle) {
              // Handle specific cases
              if (parentTitle.toLowerCase() === "leadership") {
                baseName = "Leader";
              } else if (
                parentTitle.toLowerCase() === "characters" ||
                parentTitle.toLowerCase() === "npcs"
              ) {
                baseName = "Character";
              } else if (parentTitle.toLowerCase() === "items") {
                baseName = "Item";
              } else if (parentTitle.toLowerCase() === "locations") {
                baseName = "Location";
              } else if (
                parentTitle.toLowerCase() === "missions" ||
                parentTitle.toLowerCase() === "quests"
              ) {
                baseName = "Quest";
              } else {
                // Make a singular form of the parent title if possible
                baseName = parentTitle.endsWith("s")
                  ? parentTitle.slice(0, -1) // Remove trailing 's'
                  : parentTitle;
              }
            }

            itemLabel = `${baseName} ${index + 1}`;
          }

          return (
            <div
              key={index}
              className="pb-3 border-b border-gray-100 dark:border-gray-700 last:border-0"
            >
              <h4 className="text-lg font-medium text-blue-500 dark:text-blue-300 mb-2">
                {itemLabel}
              </h4>
              <div className="mt-2 text-gray-800 dark:text-gray-200">
                {renderValue(
                  item,
                  navigateToFile,
                  navigateToSection,
                  parentTitle
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // For simple items, use a basic list with better styling
  return (
    <ul className="space-y-1 list-inside pl-0">
      {array.items.map((item, index) => (
        <li
          key={index}
          className="text-gray-700 dark:text-gray-200 flex items-start"
        >
          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-200 text-xs mr-2 mt-0.5 flex-shrink-0">
            {index + 1}
          </span>
          <span className="flex-1">
            {renderValue(item, navigateToFile, navigateToSection, parentTitle)}
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
  const entries = Object.entries(obj);

  // For all objects, use a vertical layout with subheadings
  return (
    <div className="space-y-4">
      {entries.map(([key, section]) => {
        // Cast section to ProcessedSection to avoid TypeScript errors
        const typedSection = section as ProcessedSection;

        return (
          <div key={key} className="pb-4">
            <h4 className="text-lg font-medium text-blue-500 dark:text-blue-300 mb-2 border-b border-gray-100 dark:border-gray-700 pb-1">
              {typedSection.titleFormatted}
            </h4>

            <div className="mt-2 text-gray-800 dark:text-gray-200">
              {renderSectionValue(
                typedSection,
                navigateToFile,
                navigateToSection
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Render a value based on its type
export const renderValue = (
  value: ProcessedValue,
  navigateToFile: (file: string) => void,
  navigateToSection: (section: string) => void,
  parentTitle?: string
): React.ReactNode => {
  if (value.type === "array") {
    return renderArrayValue(
      value.value as ProcessedArray,
      navigateToFile,
      navigateToSection,
      parentTitle
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
        <div className="whitespace-normal break-words text-gray-700 dark:text-gray-200">
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
    // Pass the section title as context for better array item labeling
    return renderArrayValue(
      section.value as ProcessedArray,
      navigateToFile,
      navigateToSection,
      section.titleFormatted // Pass the formatted title for better context
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

  return (
    <span className="break-words text-gray-800 dark:text-gray-200">
      {String(section.value)}
    </span>
  );
};
