const fs = require("fs");
const path = require("path");

// Directory paths
const sourceDir = path.join(__dirname, ".."); // Parent directory
const targetDir = path.join(__dirname, "public", "data");

// Create the target directory if it doesn't exist
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
  console.log(`Created directory: ${targetDir}`);
}

// Get all YAML files from the source directory
const yamlFiles = fs
  .readdirSync(sourceDir)
  .filter((file) => file.endsWith(".yaml") || file.endsWith(".yml"));

// Copy each YAML file to the target directory
yamlFiles.forEach((file) => {
  const sourcePath = path.join(sourceDir, file);
  const targetPath = path.join(targetDir, file);

  fs.copyFileSync(sourcePath, targetPath);
  console.log(`Copied: ${file}`);
});

console.log(`Done! Copied ${yamlFiles.length} YAML files to ${targetDir}`);
