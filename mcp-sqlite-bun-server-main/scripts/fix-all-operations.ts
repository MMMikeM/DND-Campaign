#!/usr/bin/env bun
import { join } from "node:path"
import { execSync } from "node:child_process"

console.log("========================================")
console.log("Fixing all database operations files...")
console.log("========================================")

const scripts = [
  "fix-npcs.ts",
  "fix-quests.ts",
  "fix-locations.ts"
]

for (const script of scripts) {
  console.log(`\nRunning ${script}...`)
  const scriptPath = join(process.cwd(), "scripts", script)
  try {
    // Make script executable
    execSync(`chmod +x ${scriptPath}`)
    // Run the script
    execSync(`bun ${scriptPath}`, { stdio: 'inherit' })
    console.log(`${script} completed successfully.`)
  } catch (error) {
    console.error(`Error running ${script}:`, error)
  }
}

console.log("\n========================================")
console.log("All operations files have been fixed!")
console.log("========================================") 