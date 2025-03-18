import { QuestsFileSchema } from "../schemas";
import { 
  getDataByType,
  findContentById
} from "./contentUtils";

export const getQuestById = (id: string, campaignName = "shattered-spire") => 
    findContentById(
      id, 
      "quests", 
      campaignName, 
      QuestsFileSchema,
      "quests"
    );
    
export const getQuestsData = (campaignName = "shattered-spire") => 
    getDataByType("quests", QuestsFileSchema, campaignName)