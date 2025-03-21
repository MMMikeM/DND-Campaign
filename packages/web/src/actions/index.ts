import { defineAction, ActionError } from 'astro:actions';
import { z } from 'astro:schema';
import { db } from '../db';

// Define entity configurations for lookup
const entityConfig = {
  npcs: {

  },
  factions: {

  },
  locations: {

  },
  quests: {

  }
};

type EntityCategory = keyof typeof entityConfig;

export const server = {
};