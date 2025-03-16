/**
 * Logger utility for consistent logging throughout the application
 * 
 * This provides a standardized way to log messages with different severity levels
 * and categories. It can be configured to enable/disable specific log levels or
 * categories in different environments.
 */

type LogCategory = 'server' | 'data' | 'routing' | 'component' | 'debug' | 'schema';
type LogLevel = 'info' | 'warn' | 'error' | 'debug';

// Default configuration - can be customized
const CONFIG = {
  // Whether to show logs at all
  enabled: process.env.NODE_ENV !== 'production',
  
  // Enable specific log levels
  levels: {
    info: true,
    warn: true,
    error: true,
    debug: process.env.NODE_ENV !== 'production',
  },
  
  // Enable specific categories
  categories: {
    server: true,
    data: true,
    routing: true, 
    component: process.env.NODE_ENV !== 'production',
    debug: process.env.NODE_ENV !== 'production',
    schema: true,
  }
};

/**
 * Creates a prefixed message with category and optional context
 */
function createMessage(category: LogCategory, message: string, context?: any): string[] {
  const timestamp = new Date().toISOString();
  const prefix = `[${timestamp}] [${category.toUpperCase()}]`;
  
  // Return messages as array for console methods
  const result = [`${prefix} ${message}`];
  
  // Add context object if provided
  if (context !== undefined) {
    result.push(context);
  }
  
  return result;
}

/**
 * Generic logging function used by the specialized methods
 */
function log(level: LogLevel, category: LogCategory, message: string, context?: any): void {
  // Skip logging if generally disabled or level/category is disabled
  if (!CONFIG.enabled || !CONFIG.levels[level] || !CONFIG.categories[category]) {
    return;
  }
  
  const args = createMessage(category, message, context);
  
  switch (level) {
    case 'info':
      console.log(...args);
      break;
    case 'warn':
      console.warn(...args);
      break;
    case 'error':
      console.error(...args);
      break;
    case 'debug':
      console.debug(...args);
      break;
  }
}

/**
 * Logger object with methods for different levels and categories
 */
export const logger = {
  // Info level
  info: {
    server: (message: string, context?: any) => log('info', 'server', message, context),
    data: (message: string, context?: any) => log('info', 'data', message, context),
    routing: (message: string, context?: any) => log('info', 'routing', message, context),
    component: (message: string, context?: any) => log('info', 'component', message, context),
    schema: (message: string, context?: any) => log('info', 'schema', message, context),
  },
  
  // Warning level
  warn: {
    server: (message: string, context?: any) => log('warn', 'server', message, context),
    data: (message: string, context?: any) => log('warn', 'data', message, context),
    routing: (message: string, context?: any) => log('warn', 'routing', message, context),
    component: (message: string, context?: any) => log('warn', 'component', message, context),
    schema: (message: string, context?: any) => log('warn', 'schema', message, context),
  },
  
  // Error level
  error: {
    server: (message: string, context?: any) => log('error', 'server', message, context),
    data: (message: string, context?: any) => log('error', 'data', message, context),
    routing: (message: string, context?: any) => log('error', 'routing', message, context),
    component: (message: string, context?: any) => log('error', 'component', message, context),
    schema: (message: string, context?: any) => log('error', 'schema', message, context),
  },
  
  // Debug level (only for development)
  debug: {
    server: (message: string, context?: any) => log('debug', 'server', message, context),
    data: (message: string, context?: any) => log('debug', 'data', message, context),
    routing: (message: string, context?: any) => log('debug', 'routing', message, context),
    component: (message: string, context?: any) => log('debug', 'component', message, context),
    debug: (message: string, context?: any) => log('debug', 'debug', message, context),
    schema: (message: string, context?: any) => log('debug', 'schema', message, context),
  },
};

/**
 * Enable or disable logging at runtime
 */
export function setLoggingEnabled(enabled: boolean): void {
  CONFIG.enabled = enabled;
}

/**
 * Configure specific log levels
 */
export function setLogLevels(levels: Partial<Record<LogLevel, boolean>>): void {
  CONFIG.levels = { ...CONFIG.levels, ...levels };
}

/**
 * Configure specific categories
 */
export function setLogCategories(categories: Partial<Record<LogCategory, boolean>>): void {
  CONFIG.categories = { ...CONFIG.categories, ...categories };
} 