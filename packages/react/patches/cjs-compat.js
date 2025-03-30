// Patch for CommonJS compatibility in ESM context
// Using Anthony Fu's isomorphic approach for __dirname and __filename
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

// Define the polyfills only if they don't already exist
if (typeof globalThis.__filename === 'undefined') {
  Object.defineProperty(globalThis, '__filename', {
    get() {
      return fileURLToPath(import.meta.url);
    }
  });
}

if (typeof globalThis.__dirname === 'undefined') {
  Object.defineProperty(globalThis, '__dirname', {
    get() {
      return dirname(fileURLToPath(import.meta.url));
    }
  });
}

console.log('CJS compatibility patch loaded'); 