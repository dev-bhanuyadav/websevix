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

# ── Update Nginx config ───────────────────────────────────────
NGINX_SITE="/etc/nginx/sites-available/websevix"
echo "→ Applying Nginx config..."
if [ -f "/etc/nginx/sites-available" ] || [ -d "/etc/nginx/sites-available" ]; then
  cp "$APP_DIR/nginx.conf" "$NGINX_SITE"
  if [ ! -L "/etc/nginx/sites-enabled/websevix" ]; then
    ln -sf "$NGINX_SITE" "/etc/nginx/sites-enabled/websevix"
  fi
  rm -f /etc/nginx/sites-enabled/default 2>/dev/null || true
  nginx -t && systemctl reload nginx && echo "   Nginx reloaded ✓"
fi

# ── Restart with PM2 ─────────────────────────────────────────
echo "→ Restarting PM2..."
mkdir -p /var/log/websevix
pm2 delete websevix 2>/dev/null || true
pm2 start ecosystem.config.js
pm2 save

sleep 3
HTTP=$(curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:3000 2>/dev/null || echo "000")

echo ""
echo "✓ Deploy complete!"
echo "  App health: localhost:3000 → $HTTP"
echo "  Open https://websevix.com in incognito (Ctrl+Shift+R to clear cache)"
echo ""
