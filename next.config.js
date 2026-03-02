/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [],
  },

  // Reduce serverless function bundle size
  experimental: {
    // Exclude heavy server-only packages from being traced into every function
    outputFileTracingExcludes: {
      "*": [
        // Dev tools
        "node_modules/@swc/**",
        "node_modules/webpack/**",
        "node_modules/webpack-dev-server/**",
        "node_modules/terser/**",
        "node_modules/esbuild/**",

        // Type packages (runtime not needed)
        "node_modules/@types/**",
        "node_modules/typescript/**",
        "node_modules/ts-node/**",

        // Large packages not needed at edge/function level
        "node_modules/puppeteer/**",
        "node_modules/puppeteer-core/**",
        "node_modules/playwright/**",
        "node_modules/chrome-aws-lambda/**",

        // Test tools
        "node_modules/jest/**",
        "node_modules/@jest/**",
        "node_modules/mocha/**",
        "node_modules/chai/**",

        // Unnecessary binary files
        "node_modules/**/*.md",
        "node_modules/**/*.map",
        "node_modules/**/*.txt",
        "node_modules/**/*.html",
      ],
    },
  },

  // Webpack config to mark server-only packages as external
  webpack: (config, { isServer }) => {
    if (isServer) {
      // These are imported dynamically — don't bundle them
      config.externals = [
        ...(Array.isArray(config.externals) ? config.externals : [config.externals].filter(Boolean)),
        "razorpay",
        "@anthropic-ai/sdk",
        "pusher",
        "cloudinary",
        "nodemailer",
        "mongoose",
      ];
    }
    return config;
  },
};

module.exports = nextConfig;
