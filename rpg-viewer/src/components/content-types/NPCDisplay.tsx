import React from "react";
import { ProcessedData } from "@/types/yamlTypes";
import { useCrossReference } from "../CrossReferenceContext";
import { renderSectionValue, renderDescription } from "../yamlUtils";

interface NPCDisplayProps {
  data: ProcessedData;
  handleRef: (path: string) => (el: HTMLElement | null) => void;
}

export default function NPCDisplay({ data, handleRef }: NPCDisplayProps) {
  const { navigateToFile, navigateToSection } = useCrossReference();

  // Get key NPC data
  const findSection = (title: string) =>
    data.sections.find((s) => s.title === title);
  const npcRole = findSection("role");
  const npcAffiliation = findSection("affiliation");
  const npcMotivation = findSection("motivation");
  const npcAbilities = findSection("abilities");
  const npcStats = findSection("stats");
  const npcBackground = findSection("background");
  const npcAppearance = findSection("appearance");

  // Get remaining sections for general display
  const displayedSections = [
    "role",
    "affiliation",
    "motivation",
    "abilities",
    "stats",
    "background",
    "appearance",
  ];
  const otherSections = data.sections.filter(
    (s) => !displayedSections.includes(s.title)
  );
  const sortedOtherSections = otherSections;

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

      <main className="space-y-8">
        {/* NPC Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {npcRole && (
            <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-md border border-indigo-100 dark:border-indigo-800/50">
              <h3 className="text-lg font-medium text-indigo-700 dark:text-indigo-300 mb-2">
                Role
              </h3>
              <div className="text-gray-800 dark:text-gray-200">
                {renderSectionValue(npcRole, navigateToFile, navigateToSection)}
              </div>
            </div>
          )}

          {npcAffiliation && (
            <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-md border border-emerald-100 dark:border-emerald-800/50">
              <h3 className="text-lg font-medium text-emerald-700 dark:text-emerald-300 mb-2">
                Affiliation
              </h3>
              <div className="text-gray-800 dark:text-gray-200">
                {renderSectionValue(
                  npcAffiliation,
                  navigateToFile,
                  navigateToSection
                )}
              </div>
            </div>
          )}

          {npcMotivation && (
            <div className="bg-rose-50 dark:bg-rose-900/20 p-4 rounded-md border border-rose-100 dark:border-rose-800/50">
              <h3 className="text-lg font-medium text-rose-700 dark:text-rose-300 mb-2">
                Motivation
              </h3>
              <div className="text-gray-800 dark:text-gray-200">
                {renderSectionValue(
                  npcMotivation,
                  navigateToFile,
                  navigateToSection
                )}
              </div>
            </div>
          )}
        </div>

        {/* Stats and Abilities */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {npcStats && (
            <div className="bg-white dark:bg-gray-800/20 p-4 rounded-md border border-gray-200 dark:border-gray-700 shadow-sm">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Stats
              </h2>
              <div>
                {renderSectionValue(
                  npcStats,
                  navigateToFile,
                  navigateToSection
                )}
              </div>
            </div>
          )}

          {npcAbilities && (
            <div className="bg-white dark:bg-gray-800/20 p-4 rounded-md border border-gray-200 dark:border-gray-700 shadow-sm">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Abilities
              </h2>
              <div>
                {renderSectionValue(
                  npcAbilities,
                  navigateToFile,
                  navigateToSection
                )}
              </div>
            </div>
          )}
        </div>

        {/* Background and Appearance */}
        <div className="grid grid-cols-1 gap-6">
          {npcBackground && (
            <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-md border border-amber-100 dark:border-amber-800/50">
              <h2 className="text-2xl font-semibold text-amber-700 dark:text-amber-300 mb-4">
                Background
              </h2>
              <div className="prose dark:prose-invert max-w-none">
                {renderSectionValue(
                  npcBackground,
                  navigateToFile,
                  navigateToSection
                )}
              </div>
            </div>
          )}

          {npcAppearance && (
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md border border-blue-100 dark:border-blue-800/50">
              <h2 className="text-2xl font-semibold text-blue-700 dark:text-blue-300 mb-4">
                Appearance
              </h2>
              <div className="prose dark:prose-invert max-w-none">
                {renderSectionValue(
                  npcAppearance,
                  navigateToFile,
                  navigateToSection
                )}
              </div>
            </div>
          )}
        </div>

        {/* Other Sections */}
        {sortedOtherSections.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              Additional Information
            </h2>

            <div className="space-y-6">
              {sortedOtherSections.map((section) => (
                <div
                  className="mb-6"
                  key={section.path}
                  ref={handleRef(section.path)}
                >
                  <h3
                    className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-3"
                    id={section.path}
                  >
                    {section.titleFormatted}
                  </h3>
                  <div className="bg-white dark:bg-gray-800/20 p-4 rounded-md border border-gray-200 dark:border-gray-700 shadow-sm">
                    <div className="overflow-x-auto">
                      {renderSectionValue(
                        section,
                        navigateToFile,
                        navigateToSection
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </article>
  );
}
