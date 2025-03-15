"use client";

import React, { useState, useEffect, useRef } from "react";
import { trpc } from "@/trpc/client";
import {
  ProcessedData,
  ProcessedSection,
  ProcessedArray,
  ProcessedObject,
  ProcessedValue,
} from "@/types/yamlTypes";
import { useCrossReference } from "./CrossReferenceContext";
import FactionDisplay from "./content-types/FactionDisplay";
import NPCDisplay from "./content-types/NPCDisplay";
import QuestDisplay from "./content-types/QuestDisplay";
import LocationDisplay from "./content-types/LocationDisplay";

type YamlDisplayProps = {
  filename: string | null;
};

// Helper to determine content type based on filename and data
const getContentType = (filename: string, data: ProcessedData): string => {
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
};

export default function YamlDisplay({ filename }: YamlDisplayProps) {
  const [contentType, setContentType] = useState<string>("generic");
  const { registerSectionRef } = useCrossReference();
  const sectionRefs = useRef<Map<string, HTMLElement>>(new Map());

  // Use tRPC query for processed data
  const {
    data: processedData,
    isLoading,
    error: queryError,
  } = trpc.yaml.getProcessedData.useQuery(
    { file: filename || "" },
    {
      enabled: !!filename,
      retry: 1,
      refetchOnWindowFocus: false,
    }
  );

  // Access the data from the properly structured response
  const data = processedData?.data as ProcessedData | null;
  const error = queryError ? queryError.message : null;

  // Determine content type when data changes
  useEffect(() => {
    if (filename && data) {
      setContentType(getContentType(filename, data));

      // Clear section refs when changing files
      sectionRefs.current.clear();
    }
  }, [filename, data]);

  // Register section references for navigation
  const handleRef = (path: string) => (el: HTMLElement | null) => {
    if (el) {
      if (sectionRefs.current.get(path) !== el) {
        sectionRefs.current.set(path, el);
        registerSectionRef(path, el);
      }
    }
  };

  // Loading and error states
  if (!filename) {
    return (
      <div className="p-8 text-center text-gray-500">Select a file to view</div>
    );
  }

  if (isLoading) {
    return <div className="p-8 text-center">Loading data...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>;
  }

  if (!data) {
    return null;
  }

  // Render appropriate component based on content type
  switch (contentType) {
    case "faction":
      // Extract faction ID from filename if possible
      const factionId = filename ? filename.replace(/\.ya?ml$/, "") : undefined;
      return <FactionDisplay factionId={factionId} handleRef={handleRef} />;
    case "npc":
      return <NPCDisplay data={data} handleRef={handleRef} />;
    case "quest":
      // If it's the main quests file, don't try to extract a specific quest ID
      const questFilename = filename?.toLowerCase() || "";
      const isQuestsFile = questFilename.includes("quests");
      const questId = isQuestsFile
        ? undefined // Don't pass a questId for the quests file, let the component handle it
        : questFilename.replace(/\.ya?ml$/, "");

      return <QuestDisplay questId={questId} handleRef={handleRef} />;
    case "location":
      // If it's the main locations file, don't try to extract a specific location ID
      const locationFilename = filename?.toLowerCase() || "";
      const isLocationsFile = locationFilename.includes("locations");
      const locationId = isLocationsFile
        ? undefined // Don't pass a locationId for the locations file, let the component handle it
        : locationFilename.replace(/\.ya?ml$/, "");

      return <LocationDisplay locationId={locationId} handleRef={handleRef} />;
    default:
      // Fall back to generic display
      return <GenericYamlDisplay data={data} handleRef={handleRef} />;
  }
}

// Generic display component for general YAML content
function GenericYamlDisplay({
  data,
  handleRef,
}: {
  data: ProcessedData;
  handleRef: (path: string) => (el: HTMLElement | null) => void;
}) {
  const { navigateToFile, navigateToSection } = useCrossReference();

  // Sections already sorted by the server
  const sortedSections = data.sections;

  return (
    <article className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border dark:border-gray-800 transition-colors duration-300 p-6">
      <header className="mb-8">
        <h1
          className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-4 border-b pb-2 border-gray-200 dark:border-gray-700"
          ref={handleRef(data.title)}
          id={data.title}
        >
          {data.title}
        </h1>

        {data.description && renderDescription(data.description)}
      </header>

      <main className="space-y-6">
        {sortedSections.map((section) => (
          <div
            className="mb-8"
            key={section.path}
            ref={handleRef(section.path)}
          >
            <h2
              className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4"
              id={section.path}
            >
              {section.titleFormatted}
            </h2>
            <div className="bg-white dark:bg-gray-800/20 p-4 rounded-md border border-gray-200 dark:border-gray-700 shadow-sm">
              {/* Render all content types consistently */}
              <div className="overflow-x-auto">
                {renderSectionValue(section, navigateToFile, navigateToSection)}
              </div>
            </div>
          </div>
        ))}
      </main>
    </article>
  );
}

// Handle description specially
const renderDescription = (description: string): React.ReactNode => {
  return (
    <div className="bg-gray-50 dark:bg-gray-800/30 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
      <p className="text-gray-700 dark:text-gray-300 whitespace-normal break-words">
        {description}
      </p>
    </div>
  );
};

// Handle link clicks
const handleLinkClick = (
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
const renderPotentialLink = (
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
const renderPrimitiveValue = (
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
const renderArrayValue = (
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
const renderObjectValue = (
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
const renderValue = (
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
const renderSectionValue = (
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
