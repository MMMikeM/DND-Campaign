// Extend the NodeJS global interface to include our custom properties
declare global {
  // We need to use var here for global variables in Node.js
  // eslint-disable-next-line no-var
  var yamlDir: string | undefined;
}

export {};
