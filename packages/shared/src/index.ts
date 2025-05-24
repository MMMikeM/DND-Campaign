// Export database utilities
export * from "./db/index.js"
export * from "./db/utils.js"

// Embedding utilities
export type { EmbeddedEntityName } from "./lib/embeddingIndex"
export { embeddingTextGenerators } from "./lib/embeddingIndex"
export { getGeminiEmbedding, getTextForEntity } from "./lib/embeddings"

// Export schemas
export * from "./schemas/index.js"
