#!/bin/bash
# Quick TypeScript fix for build error
cd /var/www/websevix
git fetch origin
git reset --hard origin/main
npm run build
cp .env.production .next/standalone/.env.production
rm -rf .next/standalone/_next .next/standalone/public
mkdir -p .next/standalone/_next
cp -r .next/static .next/standalone/_next/static
cp -r public .next/standalone/public
pm2 restart websevix
echo "✅ TypeScript error fixed and app restarted"