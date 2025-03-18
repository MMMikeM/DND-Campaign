import { join } from "node:path"
import { readFileSync, writeFileSync } from "node:fs"

// Path to the file
const filePath = join(process.cwd(), "src", "database", "operations", "quests.ts")

// Read the file
console.log(`Reading file: ${filePath}`)
let content = readFileSync(filePath, "utf-8")

// Replace named parameters in run calls with positional parameters
console.log("Fixing parameter passing in Quests operations...")

// Fix pattern: .run({ 1: value, 2: value }) -> .run(value, value)
content = content.replace(/\.run\(\{\s*1:\s*([^,]+),\s*2:\s*([^,]+),?\s*\}\)/g, '.run($1, $2)')
content = content.replace(/\.run\(\{\s*1:\s*([^,]+),\s*2:\s*([^,]+),\s*3:\s*([^,]+),?\s*\}\)/g, '.run($1, $2, $3)')
content = content.replace(/\.run\(\{\s*1:\s*([^,]+),\s*2:\s*([^,]+),\s*3:\s*([^,]+),\s*4:\s*([^,]+),?\s*\}\)/g, '.run($1, $2, $3, $4)')

// Handle larger parameter counts
content = content.replace(/\.run\(\{\s*1:\s*([^,]+),\s*2:\s*([^,]+),\s*3:\s*([^,]+),\s*4:\s*([^,]+),\s*5:\s*([^,]+),?\s*\}\)/g, 
  '.run($1, $2, $3, $4, $5)')

content = content.replace(/\.run\(\{\s*1:\s*([^,]+),\s*2:\s*([^,]+),\s*3:\s*([^,]+),\s*4:\s*([^,]+),\s*5:\s*([^,]+),\s*6:\s*([^,]+),?\s*\}\)/g, 
  '.run($1, $2, $3, $4, $5, $6)')

content = content.replace(/\.run\(\{\s*1:\s*([^,]+),\s*2:\s*([^,]+),\s*3:\s*([^,]+),\s*4:\s*([^,]+),\s*5:\s*([^,]+),\s*6:\s*([^,]+),\s*7:\s*([^,]+),?\s*\}\)/g, 
  '.run($1, $2, $3, $4, $5, $6, $7)')

content = content.replace(/\.run\(\{\s*1:\s*([^,]+),\s*2:\s*([^,]+),\s*3:\s*([^,]+),\s*4:\s*([^,]+),\s*5:\s*([^,]+),\s*6:\s*([^,]+),\s*7:\s*([^,]+),\s*8:\s*([^,]+),?\s*\}\)/g, 
  '.run($1, $2, $3, $4, $5, $6, $7, $8)')

// Write the modified content back to the file
console.log(`Writing fixed content back to: ${filePath}`)
writeFileSync(filePath, content, "utf-8")

console.log("Quest operations file has been fixed successfully!") 