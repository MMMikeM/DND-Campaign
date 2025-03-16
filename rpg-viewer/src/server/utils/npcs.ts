import { NpcsFileSchema } from "../schemas";
import { 
  getDataByType,
  findContentById
} from "./contentUtils";

export const getNpcById = (id: string, campaignName = "shattered-spire") => 
    findContentById(
      id, 
      "npc", 
      campaignName, 
      NpcsFileSchema,
      "npcs"
    );
    
export const getNpcsData = (campaignName = "shattered-spire") => 
      getDataByType("npcs", NpcsFileSchema, campaignName)