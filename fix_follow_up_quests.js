#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const yaml = require('yaml');

// Configuration
const QUESTS_PATH = path.join(__dirname, 'campaigns', 'shattered-spire', 'quests');

// Get all YAML files
function getYamlFiles(dir) {
    return fs.readdirSync(dir)
        .filter(file => file.endsWith('.yaml') && !file.includes('schema'))
        .map(file => path.join(dir, file));
}

// Process a quest file
function processQuestFile(filePath) {
    console.log(`Processing: ${path.basename(filePath)}`);
    
    // Read file
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Parse YAML
    const data = yaml.parse(content);
    
    let modified = false;
    
    // Process each quest
    if (data.quests && Array.isArray(data.quests)) {
        data.quests.forEach(quest => {
            // Check if follow_up_quests is an object but not an array
            if (quest.follow_up_quests && typeof quest.follow_up_quests === 'object' && !Array.isArray(quest.follow_up_quests)) {
                console.log(`  - Converting follow_up_quests for quest: ${quest.id}`);
                
                // Collect all quest IDs from all paths
                const allQuestIds = new Set();
                Object.values(quest.follow_up_quests).forEach(idList => {
                    if (Array.isArray(idList)) {
                        idList.forEach(id => allQuestIds.add(id));
                    }
                });
                
                // Replace with array
                quest.follow_up_quests = Array.from(allQuestIds);
                modified = true;
            }
        });
    }
    
    // Save file if modified
    if (modified) {
        console.log(`  Saving changes to: ${path.basename(filePath)}`);
        fs.writeFileSync(filePath, yaml.stringify(data));
    } else {
        console.log(`  No changes needed for: ${path.basename(filePath)}`);
    }
}

// Main function
function main() {
    console.log("Converting object-style follow_up_quests to arrays...");
    
    const questFiles = getYamlFiles(QUESTS_PATH);
    
    if (questFiles.length === 0) {
        console.log("No quest files found!");
        return;
    }
    
    questFiles.forEach(processQuestFile);
    
    console.log("\nConversion complete!");
}

// Run the script
main(); 