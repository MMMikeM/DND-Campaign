import { defineAction, ActionError } from 'astro:actions';
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

const entitySchema = z.object({
  id: z.number().optional(),
  name: z.string().optional(),
  category: categorySchema
}).refine(data => data.id || data.name, {
  message: "Either id or name must be provided"
}).refine(data => !(data.id && data.name), {
  message: "Only one of id or name can be provided"
});

export const getEntity = async (args: { category: string; id?: number; name?: string }) => {
  try {
    const { category, id, name } = entitySchema.parse(args);
    const config = entityConfig[category];
    if (!config) {
      throw new Error(`Invalid category: ${category}`);
    }
    if (id) {
      const data = await config.findById(id);
      if (!data) {
        throw new Error(`${category} with id ${id} not found`);
      }
      return data;
    }
    if (name) {
      const data = await config.findByName(name);
      if (!data) {
        throw new Error(`${category} with name ${name} not found`);
      }
      return data;
    }
  } catch (error) {
    console.error("Error in getEntity:", error);
    throw new Error("Invalid input");
  }
};