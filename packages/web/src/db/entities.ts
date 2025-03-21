import { z } from 'astro:schema';
import { db } from '.';

// Define entity configurations for lookup
const entityConfig = {
  npcs: {
    findById: (id: number ) => db.query.npcs.findFirst({
      where: (npcs, { eq }) => eq(npcs.id, id)
    }),
    findByName: (name: string) => db.query.npcs.findFirst({
      where: (npcs, { eq }) => eq(npcs.name, name)
    }),
    getAll: () => db.query.npcs.findMany(),
    getNamesAndIds: () => db.query.npcs.findMany({
      columns: {
        id: true,
        name: true,
      }})
  },
  factions: {
    findById: (id: number) => db.query.factions.findFirst({
      where: (factions, { eq }) => eq(factions.id, id)
    }),
    findByName: (name: string) => db.query.factions.findFirst({
      where: (factions, { eq }) => eq(factions.name, name)
    }),
    getAll: () => db.query.factions.findMany(),
    getNamesAndIds: () => db.query.factions.findMany({
      columns: {
        id: true,
        name: true,
      }})
  },
  locations: {
    findById: (id: number) => db.query.locations.findFirst({
      where: (locations, { eq }) => eq(locations.id, id)
    }),
    findByName: (name: string) => db.query.locations.findFirst({
      where: (locations, { eq }) => eq(locations.name, name)
    }),
    getAll: () => db.query.locations.findMany(),
    getNamesAndIds: () => db.query.locations.findMany({
      columns: {
        id: true,
        name: true,
      }})
  },
  quests: {
    findById: (id: number) => db.query.quests.findFirst({
      where: (quests, { eq }) => eq(quests.id, id)
    }),
    findByName: (name: string) => db.query.quests.findFirst({
      where: (quests, { eq }) => eq(quests.name, name)
    }),
    getAll: () => db.query.quests.findMany(),
    getNamesAndIds: () => db.query.quests.findMany({
      columns: {
        id: true,
        name: true,
      }})
  }
};



const categories = ['npcs', 'factions', 'locations', 'quests'] as const;
const categorySchema = z.enum(categories);

export const getEntityNamesAndIds = (category: string) => {
  try {
    const categories = categorySchema.parse(category);

  return entityConfig[categories].getNamesAndIds();

  }
  catch (error) {
    console.error("Error in getEntityNamesAndIds:", error);
    throw new Error("Invalid category");
  }
};

const idOrNameSchema = z.union([z.string(), z.number()])

export const getAllFactions = async () => await entityConfig.factions.getAll();

export const getAllLocations = async () =>  await entityConfig.locations.getAll();

export const getAllNpcs = async () =>  await entityConfig.npcs.getAll();

export const getAllQuests = async () =>  await entityConfig.quests.getAll();

export const getEntity = async (entity: typeof entityConfig[typeof categories[number]]) => {
  const returnFn = (nameOrId: number | string) => {
    const parsed = idOrNameSchema.parse(nameOrId);
    if (typeof parsed !== 'string') {
      const data = entity.findById(parsed)
      if (data)
        return data;
    }
    if (typeof parsed === 'string') {
      const data = entity.findByName(parsed);
      if (data)
        return data;
    }
    throw new Error(`Entity with name or id of "${nameOrId}" not found`);
  }
  return returnFn;
}


export const getFaction = async (factionIdOrName: number | string) => {
  const queries = entityConfig.factions;
  const idOrName = idOrNameSchema.parse(factionIdOrName);

  if (typeof idOrName !== 'string') {
    const byId = await queries.findById(idOrName);
    if (byId) {
      return byId
    }
  } 
  if (typeof idOrName === 'string') {
  const byName = await queries.findByName(idOrName);
  if (byName) {
    return byName;
  }
}
throw new Error(`Faction with name or id of "${factionIdOrName}" not found`);
}

export const getQuest = async (questIdOrName: number | string) => {
  const queries = entityConfig.quests;
  const idOrName = idOrNameSchema.parse(questIdOrName);

  if (typeof idOrName !== 'string') {
    const byId = await queries.findById(idOrName);
    if (byId) {
      return byId
    }
  } 
  if (typeof idOrName === 'string') {
    const byName = await queries.findByName(idOrName);
    if (byName) {
      return byName;
    }
  }
  throw new Error(`Quest with name or id of "${questIdOrName}" not found`); 
}

export const getLocation = async (locationIdOrName: number | string) => {
  const queries = entityConfig.locations;
  const idOrName = idOrNameSchema.parse(locationIdOrName);

  if (typeof idOrName !== 'string') {
    const byId = await queries.findById(idOrName);
    if (byId) {
      return byId
    }
  } 
  if (typeof idOrName === 'string') {
    const byName = await queries.findByName(idOrName);
    if (byName) {
      return byName;
    }
  }
  throw new Error(`Location with name or id of "${locationIdOrName}" not found`); 
}

export const getNpc = async (npcIdOrName: number | string) => {
  const queries = entityConfig.npcs;
  const idOrName = idOrNameSchema.parse(npcIdOrName);

  if (typeof idOrName !== 'string') {
    const byId = await queries.findById(idOrName);
    if (byId) {
      return byId
    }
  }
  if (typeof idOrName === 'string') {
    const byName = await queries.findByName(idOrName);
    if (byName) {
      return byName;
    }
  }
  throw new Error(`NPC with name or id of "${npcIdOrName}" not found`);
}