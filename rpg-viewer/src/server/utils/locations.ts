import { LocationsFileSchema } from "../schemas";
import { 
  getDataByType,
  findContentById
} from "./contentUtils";

export const getLocationById = (id: string, campaignName = "shattered-spire") => 
    findContentById(
      id, 
      "locations", 
      campaignName, 
      LocationsFileSchema,
      "locations"
    );
    
export const getLocationsData = (campaignName = "shattered-spire") => 
      getDataByType("locations", LocationsFileSchema, campaignName) 