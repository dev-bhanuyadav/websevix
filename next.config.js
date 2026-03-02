/** @type {import('next').NextConfig} */
const nextConfig = {
  // Prevent heavy server-only packages from being bundled into every
  // serverless function separately (Next.js 14.x key; renamed in v15).
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
  },
};

module.exports = nextConfig;
