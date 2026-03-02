/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [],
  },

  experimental: {
    // Next.js 14.x key for server-external packages
    // (renamed to top-level serverExternalPackages in Next.js 15)
    serverComponentsExternalPackages: [
      "mongoose",
      "@anthropic-ai/sdk",
      "razorpay",
      "pusher",
      "cloudinary",
      "nodemailer",
      "bcryptjs",
      "jose",
    ],

    // Exclude build-time-only packages from being traced into deployments
    outputFileTracingExcludes: {
      "*": [
        "node_modules/@swc/**",
        "node_modules/webpack/**",
        "node_modules/webpack-dev-server/**",
        "node_modules/@types/**",
        "node_modules/typescript/**",
        "node_modules/ts-node/**",
        "node_modules/esbuild/**",
        "node_modules/terser/**",
        "node_modules/jest/**",
        "node_modules/@jest/**",
        "node_modules/eslint/**",
        "node_modules/@eslint/**",
        "node_modules/prettier/**",
        "node_modules/**/*.map",
      ],
    },
  },
};

module.exports = nextConfig;
