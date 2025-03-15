"use client";

import React, { useState, useEffect } from "react";
import { trpc } from "@/trpc/client";
import { useCrossReference } from "../CrossReferenceContext";

interface QuestDisplayProps {
  questId?: string;
  handleRef: (path: string) => (el: HTMLElement | null) => void;
}

export default function QuestDisplay({
  questId,
  handleRef,
}: QuestDisplayProps) {
  const { navigateToFile } = useCrossReference();
  const [selectedQuestId, setSelectedQuestId] = useState<string | undefined>(
    questId
  );
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Fetch all quests
  const {
    data: questsData,
    isLoading: isLoadingQuests,
    error: questsError,
  } = trpc.quests.getAllQuests.useQuery(undefined, {
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Determine if the provided questId is a file name rather than a quest ID
  const isQuestFile = questId && questId.includes("quests");

  // Fetch specific quest data if an ID is provided and it's not the quests file
  const {
    data: singleQuestData,
    isLoading: isLoadingSingleQuest,
    error: singleQuestError,
  } = trpc.quests.getQuestById.useQuery(selectedQuestId || "", {
    enabled: !!selectedQuestId && !isQuestFile,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Set the first quest as selected if none is specified and we have quests data
  // OR if the provided questId is the name of the quests file
  useEffect(() => {
    if (
      (!selectedQuestId || isQuestFile) &&
      questsData?.quests &&
      questsData.quests.length > 0
    ) {
      setSelectedQuestId(questsData.quests[0].id);
    }
  }, [questsData, selectedQuestId, isQuestFile]);

  // Handle quest selection change
  const handleQuestChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedQuestId(e.target.value);
  };

  // Handle category filter change
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
  };

  // Filter quests by category
  const filteredQuests = questsData?.quests
    ? selectedCategory === "all"
      ? questsData.quests
      : questsData.quests.filter((quest) => quest.category === selectedCategory)
    : [];

  // Loading states
  if (isLoadingQuests) {
    return <div className="p-4 text-center">Loading quests...</div>;
  }

  // Error states
  if (questsError) {
    return (
      <div className="p-4 text-center text-red-500">
        Error loading quests: {questsError.message}
      </div>
    );
  }

  if (!questsData || questsData.quests.length === 0) {
    return (
      <div className="p-4 text-center">
        No quest data available. Please check your YAML file.
      </div>
    );
  }

  // Loading specific quest
  if (selectedQuestId && isLoadingSingleQuest) {
    return <div className="p-4 text-center">Loading quest details...</div>;
  }

  // Error loading specific quest
  if (selectedQuestId && singleQuestError) {
    return (
      <div className="p-4 text-center text-red-500">
        Error loading quest: {singleQuestError.message}
      </div>
    );
  }

  // Handle the case where we have quests data but no specific quest is selected or found
  const quest = singleQuestData;

  if (!quest && questsData?.quests && questsData.quests.length > 0) {
    // If no specific quest is found but we have quest data, show the first quest
    if (!isLoadingSingleQuest && selectedQuestId) {
      console.log(
        `Quest ${selectedQuestId} not found, showing first available quest`
      );
      // Set the first quest as selected
      if (selectedQuestId !== questsData.quests[0].id) {
        setSelectedQuestId(questsData.quests[0].id);
        return (
          <div className="p-4 text-center">
            Loading first available quest...
          </div>
        );
      }
    }
  }

  if (!quest) {
    return (
      <div className="p-4 text-center">Select a quest to view details</div>
    );
  }

  return (
    <article className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border dark:border-gray-800 transition-colors duration-300 p-6">
      <header className="mb-8">
        {/* Category and Quest Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Filter by Category
            </label>
            <select
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
            >
              <option value="all">All Categories</option>
              <option value="main_quest">Main Quests</option>
              <option value="side_quest">Side Quests</option>
              <option value="faction_quest">Faction Quests</option>
              <option value="personal_quest">Personal Quests</option>
            </select>
          </div>

          {/* Quest Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Select Quest
            </label>
            <select
              value={selectedQuestId}
              onChange={handleQuestChange}
              className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
            >
              {filteredQuests.map((q) => (
                <option key={q.id} value={q.id}>
                  {q.id}: {q.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quest Title and ID */}
        <div className="flex items-start justify-between mb-4">
          <h1
            className="text-3xl font-bold text-gray-800 dark:text-gray-200 border-b pb-2 border-gray-200 dark:border-gray-700 flex-grow"
            ref={handleRef(quest.id)}
            id={quest.id}
          >
            {quest.title}
          </h1>
          <span className="text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-gray-600 dark:text-gray-400 ml-2">
            {quest.id}
          </span>
        </div>

        {/* Quest Meta Information */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
          <div className="text-sm bg-indigo-50 dark:bg-indigo-900/20 px-2 py-1 rounded text-indigo-700 dark:text-indigo-400">
            Type: {quest.type}
          </div>
          <div className="text-sm bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded text-amber-700 dark:text-amber-400">
            Difficulty: {quest.difficulty}
          </div>
          <div className="text-sm bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded text-emerald-700 dark:text-emerald-400">
            Category: {quest.category?.replace("_", " ")}
          </div>
        </div>

        {/* Quest Description */}
        <div className="bg-gray-50 dark:bg-gray-800/30 p-4 rounded-lg border border-gray-200 dark:border-gray-700 mb-4">
          <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-2">
            Description
          </h3>
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
            {quest.description}
          </p>
        </div>
      </header>

      <main className="space-y-8">
        {/* Associated NPCs */}
        {quest.associated_npc && quest.associated_npc.length > 0 && (
          <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-md border border-indigo-100 dark:border-indigo-800/50">
            <h3 className="text-lg font-medium text-indigo-700 dark:text-indigo-300 mb-2">
              Quest Giver{quest.associated_npc.length > 1 ? "s" : ""}
            </h3>
            <ul className="list-disc pl-5 space-y-1 dark:text-gray-300">
              {quest.associated_npc.map((npc, index) => (
                <li
                  key={index}
                  className="cursor-pointer hover:text-blue-600 dark:hover:text-blue-400"
                  onClick={() =>
                    navigateToFile(
                      `${npc.toLowerCase().replace(/\s+/g, "-")}.yaml`
                    )
                  }
                >
                  {npc}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Quest Stages */}
        {quest.quest_stages && quest.quest_stages.length > 0 && (
          <div className="bg-white dark:bg-gray-800/20 p-4 rounded-md border border-gray-200 dark:border-gray-700 shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              Quest Stages
            </h2>
            <div className="space-y-6">
              {quest.quest_stages.map((stage) => (
                <div
                  key={stage.stage}
                  className="border-l-4 border-indigo-500 dark:border-indigo-600 pl-4 py-2"
                >
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    Stage {stage.stage}: {stage.title}
                  </h3>

                  {/* Objectives */}
                  <div className="mb-4">
                    <h4 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Objectives:
                    </h4>
                    <ul className="list-disc pl-5 space-y-1 text-gray-600 dark:text-gray-400">
                      {stage.objectives.map((objective, idx) => (
                        <li key={idx}>{objective}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Completion Paths */}
                  <div>
                    <h4 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Completion Paths:
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(stage.completion_paths).map(
                        ([pathName, path]) => (
                          <div
                            key={pathName}
                            className="bg-white dark:bg-gray-800 p-3 rounded-md border border-gray-200 dark:border-gray-700"
                          >
                            <h5 className="font-semibold text-gray-800 dark:text-gray-200 capitalize mb-2">
                              {pathName.replace(/_/g, " ")}
                            </h5>
                            <div className="space-y-2 text-sm">
                              <div>
                                <span className="font-medium text-gray-700 dark:text-gray-300">
                                  Approach:
                                </span>{" "}
                                <span className="text-gray-600 dark:text-gray-400">
                                  {path.description}
                                </span>
                              </div>
                              <div>
                                <span className="font-medium text-gray-700 dark:text-gray-300">
                                  Challenges:
                                </span>{" "}
                                <span className="text-gray-600 dark:text-gray-400">
                                  {path.challenges}
                                </span>
                              </div>
                              <div>
                                <span className="font-medium text-gray-700 dark:text-gray-300">
                                  Outcomes:
                                </span>{" "}
                                <span className="text-gray-600 dark:text-gray-400">
                                  {path.outcomes}
                                </span>
                              </div>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Key Decision Points */}
        {quest.key_decision_points && quest.key_decision_points.length > 0 && (
          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-md border border-purple-100 dark:border-purple-800/50">
            <h2 className="text-2xl font-semibold text-purple-700 dark:text-purple-300 mb-4">
              Key Decision Points
            </h2>
            <div className="space-y-6">
              {quest.key_decision_points.map((decision, idx) => (
                <div key={idx} className="space-y-3">
                  <h3 className="text-lg font-medium text-purple-700 dark:text-purple-300">
                    Stage {decision.stage}: {decision.decision}
                  </h3>
                  <div className="space-y-2">
                    {decision.choices.map((choice, choiceIdx) => (
                      <div
                        key={choiceIdx}
                        className="bg-white dark:bg-gray-800 p-3 rounded-md border border-gray-200 dark:border-gray-700"
                      >
                        <p className="text-gray-800 dark:text-gray-200 font-medium mb-1">
                          {choice.choice}
                        </p>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                          <span className="font-medium">Consequences:</span>{" "}
                          {choice.consequences}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Potential Twists */}
        {quest.potential_twists && quest.potential_twists.length > 0 && (
          <div className="bg-rose-50 dark:bg-rose-900/20 p-4 rounded-md border border-rose-100 dark:border-rose-800/50">
            <h2 className="text-2xl font-semibold text-rose-700 dark:text-rose-300 mb-4">
              Potential Twists
            </h2>
            <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
              {quest.potential_twists.map((twist, idx) => (
                <li key={idx}>{twist}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Rewards */}
        {quest.rewards && (
          <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-md border border-amber-100 dark:border-amber-800/50">
            <h2 className="text-2xl font-semibold text-amber-700 dark:text-amber-300 mb-4">
              Rewards
            </h2>
            <div className="space-y-4">
              {Array.isArray(quest.rewards) ? (
                // Simple array of rewards
                <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                  {quest.rewards.map((reward, idx) => (
                    <li key={idx}>{reward}</li>
                  ))}
                </ul>
              ) : (
                // Object with paths and rewards
                Object.entries(quest.rewards).map(([pathName, rewards]) => (
                  <div key={pathName}>
                    <h3 className="font-medium text-amber-700 dark:text-amber-300 capitalize mb-2">
                      {pathName.replace(/_/g, " ")}:
                    </h3>
                    <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                      {rewards.map((reward, idx) => (
                        <li key={idx}>{reward}</li>
                      ))}
                    </ul>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Related Quests */}
        {(quest.related_quests || quest.follow_up_quests) && (
          <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-md border border-emerald-100 dark:border-emerald-800/50">
            <h2 className="text-2xl font-semibold text-emerald-700 dark:text-emerald-300 mb-4">
              Connected Quests
            </h2>

            {quest.follow_up_quests && (
              <div className="mb-4">
                <h3 className="font-medium text-emerald-700 dark:text-emerald-300 mb-2">
                  Follow-Up Quests:
                </h3>
                {Array.isArray(quest.follow_up_quests) ? (
                  <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                    {quest.follow_up_quests.map((questId, idx) => (
                      <li
                        key={idx}
                        className="cursor-pointer hover:text-blue-600 dark:hover:text-blue-400"
                        onClick={() => setSelectedQuestId(questId)}
                      >
                        {questId}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="space-y-3">
                    {Object.entries(quest.follow_up_quests).map(
                      ([condition, quests]) => (
                        <div key={condition}>
                          <h4 className="font-medium text-gray-700 dark:text-gray-300 capitalize mb-1">
                            If {condition.replace(/_/g, " ")}:
                          </h4>
                          <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                            {quests.map((questId, idx) => (
                              <li
                                key={idx}
                                className="cursor-pointer hover:text-blue-600 dark:hover:text-blue-400"
                                onClick={() => setSelectedQuestId(questId)}
                              >
                                {questId}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>
            )}

            {quest.related_quests && quest.related_quests.length > 0 && (
              <div>
                <h3 className="font-medium text-emerald-700 dark:text-emerald-300 mb-2">
                  Related Quests:
                </h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                  {quest.related_quests.map((questId, idx) => (
                    <li
                      key={idx}
                      className="cursor-pointer hover:text-blue-600 dark:hover:text-blue-400"
                      onClick={() => setSelectedQuestId(questId)}
                    >
                      {questId}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </main>
    </article>
  );
}
