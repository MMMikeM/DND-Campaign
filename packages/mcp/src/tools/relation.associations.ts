import { locationFactions, npcFactions, npcLocations, npcQuests, questFaction, questLocations } from '@tome-master/shared';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { db } from '..';
import logger from '../logger';
import zodToMCP from '../zodToMcp';
import { Tool } from '@modelcontextprotocol/sdk/types.js';

type EntityType = 'quest' | 'npc' | 'location' | 'faction';
type AssociationToolName = `associate_${EntityType}_${EntityType}`;

const associationTableMap = {
  'faction_location': locationFactions,
  'faction_npc': npcFactions,
  'faction_quest': questFaction,
  'location_faction': locationFactions,
  'location_npc': npcLocations,
  'location_quest': questLocations,
  'npc_faction': npcFactions,
  'npc_location': npcLocations,
  'npc_quest': npcQuests,
  'quest_faction': questFaction,
  'quest_location': questLocations,
  'quest_npc': npcQuests,
};

const fkFieldMap = {
  'faction': 'factionId',
  'location': 'locationId',
  'npc': 'npcId',
  'quest': 'questId',
};

// Generate relation tools
const generateRelationTools = () => {
  return Object.entries(associationTableMap).map(([relation, table]) => {
    const [sourceType, targetType] = relation.split('_') as [EntityType, EntityType];
    const toolName = `associate_${sourceType}_${targetType}` as AssociationToolName;
    
    return {
      name: toolName,
      description: `Associate a ${sourceType} with a ${targetType}`,
      inputSchema: zodToMCP(createInsertSchema(table))
    } as Tool & { name: AssociationToolName };
  });
};

const generateToolHandlers = () => {
  const handlers: Record<string, Function> = {};
  
  Object.entries(associationTableMap).forEach(([relation, table]) => {
    const [sourceType, targetType] = relation.split('_') as [EntityType, EntityType];
    const toolName = `associate_${sourceType}_${targetType}`;
    
    handlers[toolName] = async (args: Record<string, unknown>) => {
      const sourceField = fkFieldMap[sourceType];
      const targetField = fkFieldMap[targetType];
      
      // Create dynamic schema based on the relationship
      const schemaObj: Record<string, z.ZodNumber> = {
        [sourceField]: z.number(),
        [targetField]: z.number()
      };
      
      // For self-referential relationships like npc_npc, use different field names
      if (sourceType === targetType) {
        schemaObj[`related${sourceField.charAt(0).toUpperCase() + sourceField.slice(1)}`] = z.number();
      }
      
      const schema = z.object(schemaObj);
      const parsed = schema.parse(args);
      
      logger.info(`Associating ${sourceType} with ${targetType}`, { parsed });
      return await db.insert(table).values(parsed);
    };
  });
  
  return handlers;
};

export const relationTools = generateRelationTools();
export const relationToolHandlers = generateToolHandlers();