/**
 * YAML utility functions - server-only
 */
import { getYamlFiles, getYamlContent, getProcessedYamlData as getServerProcessedYamlData } from '@/server/yaml';

// Mark this file as server-only
// These functions can only be used in Server Components
'use server';

/**
 * Get a list of all available YAML files
 */
export async function getYamlFilesList() {
  return getYamlFiles();
}

/**
 * Get raw YAML data for a file
 */
export async function getYamlData(filename: string) {
  return getYamlContent(filename);
}

/**
 * Get processed YAML data ready for display
 */
export async function getProcessedYamlData(filename: string) {
  return getServerProcessedYamlData(filename);
}
