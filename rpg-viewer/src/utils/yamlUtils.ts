/**
 * YAML utility functions for backward compatibility
 * These functions provide a transition layer while we migrate to direct tRPC usage
 */
import { trpc } from "@/trpc/client";

// Helper function to create a tRPC proxy instance that can be used outside of React components
// This requires a wrapper with access to tRPC hooks
type TRPCProxyType = ReturnType<typeof trpc.useContext>;
let trpcProxy: TRPCProxyType | null = null;

/**
 * Sets the tRPC proxy to be used by utility functions
 * This must be called before using any of the utility functions
 * Typically done in the app's root component
 */
export function setTRPCProxy(proxy: TRPCProxyType) {
  trpcProxy = proxy;
}

/**
 * Check if the tRPC proxy is initialized
 */
function ensureProxy() {
  if (!trpcProxy) {
    throw new Error("tRPC proxy not initialized. Call setTRPCProxy first.");
  }
}

/**
 * Get a list of all available YAML files
 */
export async function getYamlFilesList() {
  ensureProxy();
  return trpcProxy!.yaml.getFileList.fetch();
}

/**
 * Get raw YAML data for a file
 */
export async function getYamlData(filename: string | null) {
  if (!filename) {
    throw new Error("No filename provided");
  }

  ensureProxy();
  const result = await trpcProxy!.yaml.getRawData.fetch({ file: filename });
  return { data: result };
}

/**
 * Get processed YAML data ready for display
 */
export async function getProcessedYamlData(filename: string | null) {
  if (!filename) {
    throw new Error("No filename provided");
  }

  ensureProxy();
  return trpcProxy!.yaml.getProcessedData.fetch({ file: filename });
}
