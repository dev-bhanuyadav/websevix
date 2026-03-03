#!/bin/bash
# ─────────────────────────────────────────────────────────────
#  Websevix — VPS Deployment Script
#  Run this on your VPS as root or sudo user
#  Usage: bash deploy.sh
# ─────────────────────────────────────────────────────────────
set -e

APP_DIR="/var/www/websevix"
REPO="https://github.com/dev-bhanuyadav/websevix.git"
BRANCH="main"

echo ""
echo "══════════════════════════════════════════"
echo "  Websevix VPS Deploy"
echo "══════════════════════════════════════════"

# ── Pull latest code ──────────────────────────────────────────
if [ -d "$APP_DIR/.git" ]; then
  echo "→ Pulling latest code..."
  cd "$APP_DIR"
  git pull origin "$BRANCH"
else
  echo "→ Cloning repo..."
  git clone -b "$BRANCH" "$REPO" "$APP_DIR"
  cd "$APP_DIR"
fi

# ── Copy .env.production if not present ──────────────────────
if [ ! -f "$APP_DIR/.env.production" ]; then
  echo ""
  echo "⚠  .env.production not found at $APP_DIR/.env.production"
  echo "   Please create it (see VPS_DEPLOY_GUIDE.md) and re-run."
  exit 1
fi

# ── Install dependencies (incl. dev — needed for Tailwind/build) ──
echo "→ Installing dependencies..."
npm ci

# ── Build ─────────────────────────────────────────────────────
echo "→ Building Next.js (standalone)..."
npm run build

# ── Copy static assets into standalone folder ────────────────
echo "→ Copying static assets..."
# _next/static = Nginx alias path (/_next/static/ → standalone/_next/static/)
rm -rf .next/standalone/_next
rm -rf .next/standalone/public
mkdir -p .next/standalone/_next
cp -r .next/static  .next/standalone/_next/static
cp -r public        .next/standalone/public
echo "   CSS files: $(ls .next/standalone/_next/static/css/ 2>/dev/null | wc -l)"
echo "   JS chunks: $(ls .next/standalone/_next/static/chunks/ 2>/dev/null | wc -l)"

# ── Copy .env so Next.js can load it (standalone runs from .next/standalone) ─
if [ -f "$APP_DIR/.env.production" ]; then
  cp "$APP_DIR/.env.production" "$APP_DIR/.next/standalone/.env.production"
  echo "→ Copied .env.production to standalone"
fi

# ── Create log dir ────────────────────────────────────────────
mkdir -p /var/log/websevix

# ── Restart with PM2 ─────────────────────────────────────────
echo "→ Restarting PM2..."
pm2 delete websevix 2>/dev/null || true
pm2 start ecosystem.config.js
pm2 save

echo ""
echo "✓ Deploy complete! App running on port 3000."
echo "  Nginx should proxy :80/:443 → localhost:3000"
echo ""
