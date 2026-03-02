/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [],
  },

  // Next.js 14.2 — mark heavy server-only packages as external so they are
  // NOT bundled into every serverless function's webpack chunk.
  // Vercel's output-file-tracing still includes them in the deployment;
  // they are simply resolved via require() at runtime instead of being
  // inlined into each function bundle, which dramatically reduces per-function size.
  serverExternalPackages: [
    "mongoose",
    "@anthropic-ai/sdk",
    "razorpay",
    "pusher",
    "cloudinary",
    "nodemailer",
    "bcryptjs",
    "jose",
  ],
};

module.exports = nextConfig;
