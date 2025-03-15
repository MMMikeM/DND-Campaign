/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Suppress the React hydration warning in development mode
  onDemandEntries: {
    // Helps to avoid hydration errors
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 4,
  },
};

module.exports = nextConfig;
