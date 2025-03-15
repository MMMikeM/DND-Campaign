"use client";

import React, { useState, useEffect } from "react";
import { trpc } from "@/trpc/client";
import { useCrossReference } from "../CrossReferenceContext";

interface FactionDisplayProps {
  factionId?: string;
  handleRef: (path: string) => (el: HTMLElement | null) => void;
}

export default function FactionDisplay({
  factionId,
  handleRef,
}: FactionDisplayProps) {
  const { navigateToFile } = useCrossReference();
  const [selectedFactionId, setSelectedFactionId] = useState<
    string | undefined
  >(factionId);

  // Fetch all factions
  const {
    data: factionsData,
    isLoading: isLoadingFactions,
    error: factionsError,
  } = trpc.factions.getAllFactions.useQuery(undefined, {
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch specific faction data if an ID is provided
  const {
    data: singleFactionData,
    isLoading: isLoadingSingleFaction,
    error: singleFactionError,
  } = trpc.factions.getFactionById.useQuery(selectedFactionId || "", {
    enabled: !!selectedFactionId,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Set the first faction as selected if none is specified and we have factions data
  useEffect(() => {
    if (!selectedFactionId && factionsData?.factions?.length > 0) {
      setSelectedFactionId(factionsData.factions[0].id);
    }
  }, [factionsData, selectedFactionId]);

  // Handle faction selection change
  const handleFactionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedFactionId(e.target.value);
  };

  // Loading states
  if (isLoadingFactions) {
    return <div className="p-4 text-center">Loading factions...</div>;
  }

  // Error states
  if (factionsError) {
    return (
      <div className="p-4 text-center text-red-500">
        Error loading factions: {factionsError.message}
      </div>
    );
  }

  if (!factionsData || factionsData.factions.length === 0) {
    return (
      <div className="p-4 text-center">
        No faction data available. Please check your YAML file.
      </div>
    );
  }

  // Loading specific faction
  if (selectedFactionId && isLoadingSingleFaction) {
    return <div className="p-4 text-center">Loading faction details...</div>;
  }

  // Error loading specific faction
  if (selectedFactionId && singleFactionError) {
    return (
      <div className="p-4 text-center text-red-500">
        Error loading faction: {singleFactionError.message}
      </div>
    );
  }

  const faction = singleFactionData;

  if (!faction) {
    return (
      <div className="p-4 text-center">Select a faction to view details</div>
    );
  }

  return (
    <article className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border dark:border-gray-800 transition-colors duration-300 p-6">
      <header className="mb-8">
        {/* Faction selector */}
        <div className="mb-4">
          <select
            value={selectedFactionId}
            onChange={handleFactionChange}
            className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
          >
            {factionsData.factions.map((f) => (
              <option key={f.id} value={f.id}>
                {f.id}
              </option>
            ))}
          </select>
        </div>

        <h1
          className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-4 border-b pb-2 border-gray-200 dark:border-gray-700"
          ref={handleRef(faction.id)}
          id={faction.id}
        >
          {faction.id}
        </h1>

        {factionsData.description && (
          <div className="bg-gray-50 dark:bg-gray-800/30 p-4 rounded-lg border border-gray-200 dark:border-gray-700 mb-4">
            <p className="text-gray-700 dark:text-gray-300 whitespace-normal break-words">
              {factionsData.description}
            </p>
          </div>
        )}
      </header>

      <main className="space-y-8">
        {/* Faction Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {faction.type && (
            <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-md border border-indigo-100 dark:border-indigo-800/50">
              <h3 className="text-lg font-medium text-indigo-700 dark:text-indigo-300 mb-2">
                Type
              </h3>
              <div className="text-gray-800 dark:text-gray-200">
                {faction.type}
              </div>
            </div>
          )}

          {faction.public_goal && (
            <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-md border border-emerald-100 dark:border-emerald-800/50">
              <h3 className="text-lg font-medium text-emerald-700 dark:text-emerald-300 mb-2">
                Public Goal
              </h3>
              <div className="text-gray-800 dark:text-gray-200">
                {faction.public_goal}
              </div>
            </div>
          )}

          {faction.true_goal && (
            <div className="bg-rose-50 dark:bg-rose-900/20 p-4 rounded-md border border-rose-100 dark:border-rose-800/50">
              <h3 className="text-lg font-medium text-rose-700 dark:text-rose-300 mb-2">
                True Goal
              </h3>
              <div className="text-gray-800 dark:text-gray-200">
                {faction.true_goal}
              </div>
            </div>
          )}

          {faction.goal && !faction.public_goal && !faction.true_goal && (
            <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-md border border-emerald-100 dark:border-emerald-800/50">
              <h3 className="text-lg font-medium text-emerald-700 dark:text-emerald-300 mb-2">
                Goal
              </h3>
              <div className="text-gray-800 dark:text-gray-200">
                {faction.goal}
              </div>
            </div>
          )}
        </div>

        {/* Resources */}
        {faction.resources && faction.resources.length > 0 && (
          <div className="mt-8 grid grid-cols-1 gap-6">
            <div className="bg-white dark:bg-gray-800/20 p-4 rounded-md border border-gray-200 dark:border-gray-700 shadow-sm">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Resources
              </h2>
              <ul className="list-disc pl-5 space-y-1 dark:text-gray-300">
                {faction.resources.map((resource, index) => (
                  <li key={index}>{resource}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Leadership */}
        {faction.leadership && faction.leadership.length > 0 && (
          <div className="bg-white dark:bg-gray-800/20 p-4 rounded-md border border-gray-200 dark:border-gray-700 shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              Leadership
            </h2>
            <div className="space-y-4">
              {faction.leadership.map((leader, index) => (
                <div
                  key={index}
                  className="p-3 bg-gray-50 dark:bg-gray-800/40 rounded-md border border-gray-200 dark:border-gray-700"
                >
                  <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200">
                    {leader.name}
                    {leader.role && (
                      <span className="text-sm font-normal text-gray-600 dark:text-gray-400 ml-2">
                        ({leader.role})
                      </span>
                    )}
                  </h3>
                  {leader.description && (
                    <p className="text-gray-700 dark:text-gray-300 mt-1">
                      {leader.description}
                    </p>
                  )}
                  {leader.secret && (
                    <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/20 rounded border border-red-100 dark:border-red-800/50">
                      <p className="text-red-700 dark:text-red-300 text-sm italic">
                        Secret: {leader.secret}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Territory */}
        {faction.territory && (
          <div className="bg-white dark:bg-gray-800/20 p-4 rounded-md border border-gray-200 dark:border-gray-700 shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              Territory
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              {faction.territory}
            </p>
          </div>
        )}

        {/* Allies */}
        {faction.allies && faction.allies.length > 0 && (
          <div className="bg-white dark:bg-gray-800/20 p-4 rounded-md border border-gray-200 dark:border-gray-700 shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              Allies
            </h2>
            <ul className="list-disc pl-5 space-y-1 dark:text-gray-300">
              {faction.allies.map((ally, index) => (
                <li key={index}>{ally}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Enemies */}
        {faction.enemies && faction.enemies.length > 0 && (
          <div className="bg-white dark:bg-gray-800/20 p-4 rounded-md border border-gray-200 dark:border-gray-700 shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              Enemies
            </h2>
            <ul className="list-disc pl-5 space-y-1 dark:text-gray-300">
              {faction.enemies.map((enemy, index) => (
                <li key={index}>{enemy}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Notes */}
        {faction.notes && (
          <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-md border border-amber-100 dark:border-amber-800/50">
            <h2 className="text-2xl font-semibold text-amber-700 dark:text-amber-300 mb-4">
              Notes
            </h2>
            <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
              {faction.notes}
            </div>
          </div>
        )}

        {/* Members (if present) */}
        {faction.members && faction.members.length > 0 && (
          <div className="bg-white dark:bg-gray-800/20 p-4 rounded-md border border-gray-200 dark:border-gray-700 shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              Members
            </h2>
            <div className="space-y-4">
              {faction.members.map((member, index) => (
                <div
                  key={index}
                  className="p-3 bg-gray-50 dark:bg-gray-800/40 rounded-md border border-gray-200 dark:border-gray-700"
                >
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                    {member.name}
                    {member.role && (
                      <span className="text-sm font-normal text-gray-600 dark:text-gray-400 ml-2">
                        ({member.role})
                      </span>
                    )}
                  </h3>
                  {member.description && (
                    <p className="text-gray-700 dark:text-gray-300 mt-1">
                      {member.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quests */}
        {faction.quests && faction.quests.length > 0 && (
          <div className="bg-white dark:bg-gray-800/20 p-4 rounded-md border border-gray-200 dark:border-gray-700 shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              Quests
            </h2>
            <ul className="list-disc pl-5 space-y-1 dark:text-gray-300">
              {faction.quests.map((quest, index) => (
                <li
                  key={index}
                  className="cursor-pointer hover:text-blue-600 dark:hover:text-blue-400"
                  onClick={() => navigateToFile(`${quest}.yaml`)}
                >
                  {quest}
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </article>
  );
}
