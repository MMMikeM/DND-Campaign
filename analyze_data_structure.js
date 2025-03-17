#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const yaml = require('yaml');

// Configuration
const CAMPAIGN_PATH = path.join(__dirname, 'campaigns', 'shattered-spire');
const ENTITY_TYPES = ['quests', 'npcs', 'factions', 'locations'];

// Utility to get all YAML files in a directory
function getYamlFiles(dir) {
    try {
        if (!fs.existsSync(dir)) {
            console.error(`Directory does not exist: ${dir}`);
            return [];
        }
        
        return fs.readdirSync(dir)
            .filter(file => file.endsWith('.yaml') && !file.includes('schema'))
            .map(file => path.join(dir, file));
    } catch (err) {
        console.error(`Error reading directory ${dir}:`, err);
        return [];
    }
}

// Get the type of a value
function getComplexType(value) {
    if (value === null) return 'null';
    if (Array.isArray(value)) {
        if (value.length === 0) return 'array(empty)';
        
        // Check if all items are of the same type
        const itemTypes = new Set(value.map(item => getComplexType(item)));
        if (itemTypes.size === 1) {
            const itemType = [...itemTypes][0];
            return `array(${itemType})`;
        }
        
        // Mixed types
        return `array(mixed: ${[...itemTypes].join(', ')})`;
    }
    
    if (typeof value === 'object') {
        return 'object';
    }
    
    return typeof value;
}

// Analyze and report the structure of an object
function analyzeStructure(obj, prefix = '', depth = 0, maxDepth = 5) {
    if (depth >= maxDepth) return {};
    
    const structure = {};
    
    // Handle arrays specially
    if (Array.isArray(obj)) {
        if (obj.length === 0) {
            return { type: 'array', itemType: 'unknown', count: 0 };
        }
        
        // If all items are primitive types
        if (obj.every(item => typeof item !== 'object' || item === null)) {
            const types = [...new Set(obj.map(item => typeof item))];
            return { 
                type: 'array', 
                itemType: types.length === 1 ? types[0] : `mixed(${types.join(', ')})`,
                count: obj.length
            };
        }
        
        // If we have objects, analyze the first few to get a representative sample
        const sampleItems = obj.slice(0, 3);
        const itemStructures = sampleItems.map(item => analyzeStructure(item, '', depth + 1, maxDepth));
        
        // Check if they all have the same keys
        const allKeys = new Set();
        itemStructures.forEach(struct => {
            Object.keys(struct).forEach(key => allKeys.add(key));
        });
        
        if (allKeys.size > 0) {
            return { 
                type: 'array', 
                itemType: 'object',
                count: obj.length,
                properties: itemStructures[0] // Show the structure of the first item
            };
        }
        
        return { type: 'array', itemType: 'mixed', count: obj.length };
    }
    
    // Handle objects
    if (obj && typeof obj === 'object') {
        for (const [key, value] of Object.entries(obj)) {
            const fullKey = prefix ? `${prefix}.${key}` : key;
            
            if (value === null) {
                structure[key] = { type: 'null' };
            } else if (Array.isArray(value)) {
                structure[key] = analyzeStructure(value, fullKey, depth + 1, maxDepth);
            } else if (typeof value === 'object') {
                structure[key] = analyzeStructure(value, fullKey, depth + 1, maxDepth);
            } else {
                structure[key] = { type: typeof value };
            }
        }
    } else {
        return { type: typeof obj };
    }
    
    return structure;
}

// Process all YAML files for an entity type
function processEntityType(entityType) {
    const dir = path.join(CAMPAIGN_PATH, entityType);
    const files = getYamlFiles(dir);
    
    if (files.length === 0) {
        console.log(`No YAML files found for ${entityType}`);
        return null;
    }
    
    console.log(`\nAnalyzing ${files.length} ${entityType} files...`);
    
    // Parse and merge all files
    const allData = [];
    
    files.forEach(file => {
        try {
            const content = fs.readFileSync(file, 'utf8');
            const data = yaml.parse(content);
            allData.push(data);
            console.log(`Processed: ${path.basename(file)}`);
        } catch (err) {
            console.error(`Error processing ${file}:`, err.message);
        }
    });
    
    if (allData.length === 0) {
        console.log(`No valid data found for ${entityType}`);
        return null;
    }
    
    // Merge all the data
    const mergedData = { files: [] };
    
    allData.forEach(data => {
        // Determine the root property based on entity type
        let items;
        
        if (entityType === 'quests') {
            items = data.quests || [];
            mergedData.files.push({
                title: data.title,
                version: data.version,
                category: data.category,
                itemCount: items.length
            });
        } else if (entityType === 'npcs') {
            items = data.npcs || [];
            mergedData.files.push({
                title: data.title,
                version: data.version,
                itemCount: items.length
            });
        } else if (entityType === 'factions') {
            items = data.factions || {};
            mergedData.files.push({
                title: data.title,
                version: data.version,
                itemCount: Object.keys(items).length
            });
        } else if (entityType === 'locations') {
            items = data.locations || {};
            mergedData.files.push({
                title: data.title,
                version: data.version,
                itemCount: Object.keys(items).length
            });
        }
        
        if (!mergedData.items) {
            // Initialize the items collection based on what we found
            if (Array.isArray(items)) {
                mergedData.items = [];
            } else if (typeof items === 'object') {
                mergedData.items = {};
            }
        }
        
        // Merge the items
        if (Array.isArray(items) && Array.isArray(mergedData.items)) {
            mergedData.items.push(...items);
        } else if (typeof items === 'object' && typeof mergedData.items === 'object') {
            Object.assign(mergedData.items, items);
        }
    });
    
    return mergedData;
}

// Generate schema from the analyzed structure
function generateSchema(structure, name) {
    // This is a simple schema generator, you'll want to enhance it based on your needs
    if (!structure) return null;
    
    const schema = {
        $schema: "http://json-schema.org/draft-07/schema#",
        title: `${name.charAt(0).toUpperCase() + name.slice(1)} Schema`,
        description: `Schema for ${name} definition files in the Shattered Spire campaign`,
        type: "object",
    };
    
    // Add required properties based on what we found
    const required = [];
    const properties = {};
    
    // Add file metadata properties
    properties.title = {
        type: "string",
        description: `The title of the ${name} collection`
    };
    required.push('title');
    
    properties.version = {
        type: "string",
        description: `Version number of the ${name} file`
    };
    required.push('version');
    
    if (name === 'quests') {
        properties.category = {
            type: "string",
            description: "Category of the quests in this file"
        };
        required.push('category');
    }
    
    properties.description = {
        type: "string",
        description: `Description of the ${name} collection`
    };
    required.push('description');
    
    // Add the main collection property
    const collectionName = name;
    
    if (Array.isArray(structure.items)) {
        properties[collectionName] = {
            type: "array",
            description: `Array of ${name} objects`,
            items: {
                type: "object",
                properties: {}
            }
        };
        
        // Sample the first few items to build properties
        const sampleItems = structure.items.slice(0, 5);
        const allProps = new Set();
        
        // Collect all property names
        sampleItems.forEach(item => {
            Object.keys(item).forEach(prop => allProps.add(prop));
        });
        
        // Add each property to the schema
        [...allProps].forEach(prop => {
            // Find the first item that has this property for analysis
            const sampleItem = sampleItems.find(item => item[prop] !== undefined);
            if (!sampleItem) return;
            
            const value = sampleItem[prop];
            const type = getComplexType(value);
            
            properties[collectionName].items.properties[prop] = {
                type: type.startsWith('array') ? 'array' : type,
                description: `${prop} of the ${name.slice(0, -1)}`
            };
            
            // Add items definition for arrays
            if (type.startsWith('array')) {
                const match = type.match(/array\(([^)]+)\)/);
                if (match) {
                    const itemType = match[1];
                    
                    if (itemType === 'object' && Array.isArray(value) && value.length > 0) {
                        // For arrays of objects, include their structure
                        properties[collectionName].items.properties[prop].items = {
                            type: 'object',
                            properties: {}
                        };
                        
                        // Sample the first object
                        const firstObj = value[0];
                        if (firstObj && typeof firstObj === 'object') {
                            Object.keys(firstObj).forEach(subProp => {
                                const subValue = firstObj[subProp];
                                const subType = getComplexType(subValue);
                                
                                properties[collectionName].items.properties[prop].items.properties[subProp] = {
                                    type: subType.startsWith('array') ? 'array' : subType,
                                    description: `${subProp} of the ${prop}`
                                };
                            });
                        }
                    } else {
                        // For arrays of primitives
                        properties[collectionName].items.properties[prop].items = {
                            type: itemType === 'mixed' ? ['string', 'number', 'boolean'] : itemType
                        };
                    }
                }
            }
        });
    } else if (typeof structure.items === 'object') {
        properties[collectionName] = {
            type: "object",
            description: `Map of ${name} objects keyed by ${name.slice(0, -1)} ID`,
            properties: {}
        };
        
        // For simplicity, we'll just note that it's a keyed map
        // A more advanced implementation would analyze the structure of each value
    }
    
    schema.properties = properties;
    schema.required = required;
    
    return schema;
}

// Main function to analyze all entity types
async function analyzeAll() {
    console.log("Starting data structure analysis...");
    
    const results = {};
    
    for (const entityType of ENTITY_TYPES) {
        const data = processEntityType(entityType);
        if (data) {
            results[entityType] = data;
            
            // Analyze the structure
            console.log(`\n=== ${entityType.toUpperCase()} STRUCTURE ANALYSIS ===`);
            
            console.log(`Found ${data.files.length} files containing ${Array.isArray(data.items) ? data.items.length : Object.keys(data.items).length} items`);
            
            // Analyze item structure
            if (Array.isArray(data.items) && data.items.length > 0) {
                // For array-based collections (quests, npcs)
                console.log('\nProperties found across all items:');
                
                // Count occurrences of each property
                const propCounts = {};
                data.items.forEach(item => {
                    Object.keys(item).forEach(key => {
                        propCounts[key] = (propCounts[key] || 0) + 1;
                    });
                });
                
                // Get total count for percentage calculation
                const totalItems = data.items.length;
                
                // Sort by occurrence (most common first)
                const sortedProps = Object.keys(propCounts).sort((a, b) => propCounts[b] - propCounts[a]);
                
                sortedProps.forEach(prop => {
                    const count = propCounts[prop];
                    const percentage = ((count / totalItems) * 100).toFixed(1);
                    const sampleItem = data.items.find(item => item[prop] !== undefined);
                    const type = sampleItem ? getComplexType(sampleItem[prop]) : 'unknown';
                    
                    console.log(`- ${prop}: ${count}/${totalItems} (${percentage}%) [${type}]`);
                });
                
                // Generate and save schema
                const schema = generateSchema(data, entityType);
                if (schema) {
                    const schemaPath = path.join(CAMPAIGN_PATH, entityType, '.generated-schema.json');
                    fs.writeFileSync(schemaPath, JSON.stringify(schema, null, 2));
                    console.log(`\nGenerated schema saved to: ${schemaPath}`);
                }
            } else if (typeof data.items === 'object') {
                // For object-based collections (factions, locations)
                const keys = Object.keys(data.items);
                if (keys.length > 0) {
                    console.log(`\nFound ${keys.length} keys in the collection`);
                    
                    // Analyze the first few items to see their structure
                    const sampleKeys = keys.slice(0, 3);
                    
                    sampleKeys.forEach(key => {
                        console.log(`\nSample item "${key}" structure:`);
                        const item = data.items[key];
                        const props = Object.keys(item);
                        
                        props.forEach(prop => {
                            const type = getComplexType(item[prop]);
                            console.log(`- ${prop}: [${type}]`);
                        });
                    });
                    
                    // Generate and save schema
                    const schema = generateSchema(data, entityType);
                    if (schema) {
                        const schemaPath = path.join(CAMPAIGN_PATH, entityType, '.generated-schema.json');
                        fs.writeFileSync(schemaPath, JSON.stringify(schema, null, 2));
                        console.log(`\nGenerated schema saved to: ${schemaPath}`);
                    }
                }
            }
        }
    }
    
    console.log("\nAnalysis complete!");
}

// Run the analysis
analyzeAll().catch(err => {
    console.error("Error during analysis:", err);
    process.exit(1);
}); 