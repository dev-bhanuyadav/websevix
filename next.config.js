/** @type {import('next').NextConfig} */
const nextConfig = {
  // Smaller deployment, fewer issues on Vercel
  productionBrowserSourceMaps: false,

  experimental: {
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
    // Keep serverless output small so Vercel deploy step doesn't hit limits
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
        "node_modules/**/*.d.ts",
        "node_modules/**/test/**",
        "node_modules/**/tests/**",
        "node_modules/**/docs/**",
        "node_modules/**/*.md",
        "node_modules/**/*.txt",
        "node_modules/.bin/**",
        "node_modules/**/README*",
        "node_modules/**/CHANGELOG*",
        "node_modules/**/LICENSE*",
        // Client-only; never needed in API/server bundles
        "node_modules/framer-motion/**",
        "node_modules/recharts/**",
        "node_modules/lucide-react/**",
        "node_modules/@hookform/resolvers/**",
        "node_modules/react-hook-form/**",
      ],
    },
  },
};

module.exports = nextConfig;
