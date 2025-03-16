'use server';
// This is a server component to display appropriate content based on type
import { Suspense } from 'react';
import FactionDisplayServer from './content-types/FactionDisplayServer';
import NPCDisplayServer from './content-types/NPCDisplayServer';
import QuestDisplayServer from './content-types/QuestDisplayServer';
import LocationDisplayServer from './content-types/LocationDisplayServer';
import { logger } from '@/utils/logger';

interface ContentDisplayServerProps {
  contentType: string;
  filename: string;
}

export default async function ContentDisplayServer({ contentType, filename }: ContentDisplayServerProps) {
  logger.debug.data("ContentDisplayServer rendering", { contentType, filename });
  
  // Extract ID from filename if it's a specific file
  const parsedFilename = filename.toLowerCase();
  
  // Render appropriate component based on content type
  switch (contentType) {
    case "faction": {
      // Determine if this is a main factions file or a specific faction
      const isFactionFile = parsedFilename.includes("factions");
      
      // If it's the main factions file, just render the faction display
      if (isFactionFile) {
        return (
          <Suspense fallback={<div>Loading factions...</div>}>
            <FactionDisplayServer />
          </Suspense>
        );
      }
      
      // Not implemented yet - return generic message for specific factions
      return <div>Viewing faction: {filename}</div>;
    }
    
    case "npc": {
      // Determine if this is the main NPCs file or a specific NPC
      const isNpcsFile = parsedFilename.includes("npcs");
      
      // If it's the NPCs index file, don't pass an ID
      if (isNpcsFile) {
        return (
          <Suspense fallback={<div>Loading NPCs...</div>}>
            <div>NPCs list would be displayed here</div>
          </Suspense>
        );
      }
      
      // Not implemented yet - return generic message for specific NPCs
      return <div>Viewing NPC: {filename}</div>;
    }
    
    case "quest": {
      // Determine if this is a quests file or a specific quest
      const isQuestsFile = parsedFilename.includes("quests");
      
      // Log the quest filename for debugging
      logger.debug.data("Handling quest file", { 
        filename: parsedFilename,
        isQuestsFile 
      });
      
      // If it's the quests index file, render the quests display server
      // We'll let the quests display server handle extracting category info
      return (
        <Suspense fallback={<div>Loading quests...</div>}>
          <QuestDisplayServer />
        </Suspense>
      );
      
      // Note: Specific quest rendering not needed yet
    }
    
    case "location": {
      // Determine if this is the locations file or a specific location
      const isLocationsFile = parsedFilename.includes("locations");
      
      // If it's the locations index file, just render the location display
      if (isLocationsFile) {
        return (
          <Suspense fallback={<div>Loading locations...</div>}>
            <LocationDisplayServer />
          </Suspense>
        );
      }
      
      // Not implemented yet - return generic message for specific locations
      return <div>Viewing location: {filename}</div>;
    }
    
    default:
      // If we can't determine the content type, return an error
      return <div>Unknown content type: {contentType}</div>;
  }
} 