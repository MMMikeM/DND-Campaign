'use server';

// This is a server component that loads Quest data

import QuestDisplay from "./QuestDisplay";
import { logger } from "@/utils/logger";
import { getQuestsData } from "@/server/utils/quests";

interface QuestDisplayServerProps {
  questId?: string;
  category?: string;
}

export default async function QuestDisplayServer({
  questId,
  category,
}: QuestDisplayServerProps) {
  logger.debug.data("Loading quests data in QuestDisplayServer", { questId, category });
  
  try {
    // Load all quests data
    const questsDataArray = await getQuestsData();
    
    if (!questsDataArray || questsDataArray.length === 0) {
      logger.warn.data("No quests data available");
      return <div>No quests data available</div>;
    }
    
    const questsData = questsDataArray[0]; // Get first item from array
    
    // If a specific quest ID is provided, find that quest's data
    let questData: any = null;
    if (questId) {
      questData = questsData.quests.find((quest: any) => 
        quest.id === questId || 
        (quest.id?.toLowerCase() === questId.toLowerCase())
      ) || null;
      
      if (questData) {
        logger.debug.data("Found specific quest data", { 
          questId, 
          category: questData?.category 
        });
      } else {
        logger.warn.data(`Quest with ID ${questId} not found in data`);
      }
    }
    
    logger.debug.data("QuestDisplayServer ready", { 
      questCount: questsData.quests.length,
      hasSelectedQuest: !!questData
    });

    return (
      <QuestDisplay
        questId={questId}
        currentCategory={category}
        questsData={questsData}
        initialQuestData={questData}
      />
    );
  } catch (error) {
    logger.error.data("Error in QuestDisplayServer", error);
    return <div>Error loading quests: {(error as Error).message}</div>;
  }
} 