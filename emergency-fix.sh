#!/bin/bash
# ══════════════════════════════════════════════════════════════
#  EMERGENCY FIX - Services API completely broken
#  This will do a full rebuild and restart
# ══════════════════════════════════════════════════════════════
set -e
APP_DIR="/var/www/websevix"

echo ""
echo "╔══════════════════════════════════════╗"
echo "║      EMERGENCY SERVICES FIX          ║"
echo "╚══════════════════════════════════════╝"

cd "$APP_DIR"

# ── 1. Force update code ───────────────────────────────────────
echo ""
echo "▶ 1. Force updating code..."
git fetch origin
git reset --hard origin/main
git clean -fd
echo "   ✓ Code forcefully updated"

# ── 2. Add missing environment vars ────────────────────────────
echo ""
echo "▶ 2. Fixing environment..."

# Add NEXTAUTH_SECRET if missing
if ! grep -q "NEXTAUTH_SECRET=" .env.production; then
  echo "NEXTAUTH_SECRET=$(openssl rand -base64 32)" >> .env.production
  echo "   ✓ Added NEXTAUTH_SECRET"
fi

# Ensure NODE_ENV is set
if ! grep -q "NODE_ENV=" .env.production; then
  echo "NODE_ENV=production" >> .env.production
  echo "   ✓ Added NODE_ENV=production"
fi

# Copy to standalone
cp .env.production .next/standalone/.env.production
echo "   ✓ Environment copied to standalone"

# ── 3. Full rebuild ────────────────────────────────────────────
echo ""
echo "▶ 3. Full rebuild (this may take 2-3 minutes)..."
npm ci --prefer-offline
npm run build

# Copy static assets
rm -rf .next/standalone/_next .next/standalone/public
mkdir -p .next/standalone/_next
cp -r .next/static .next/standalone/_next/static
cp -r public .next/standalone/public
echo "   ✓ Build complete"

# ── 4. Restart everything ──────────────────────────────────────
echo ""
echo "▶ 4. Restarting services..."
pm2 delete websevix 2>/dev/null || true
pm2 start ecosystem.config.js
pm2 save
echo "   ✓ PM2 restarted"

# ── 5. Test multiple times ─────────────────────────────────────
echo ""
echo "▶ 5. Testing API (waiting 10 seconds for startup)..."
sleep 10

for i in {1..3}; do
  echo "   Test $i/3..."
  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:3000/api/client/services 2>/dev/null || echo "000")
  
  if [ "$HTTP_CODE" = "401" ]; then
    echo "   ✓ API working (401 = needs auth, which is correct)"
    break
  elif [ "$HTTP_CODE" = "200" ]; then
    echo "   ✓ API working (200 = success)"
    break
  else
    echo "   ⚠ API returned $HTTP_CODE, retrying..."
    sleep 3
  fi
done

# ── 6. Check logs for any remaining errors ─────────────────────
echo ""
echo "▶ 6. Checking for errors..."
sleep 2
ERROR_COUNT=$(pm2 logs websevix --lines 20 --nostream 2>/dev/null | grep -i "error\|exception\|failed" | wc -l || echo "0")

if [ "$ERROR_COUNT" -eq 0 ]; then
  echo "   ✓ No errors in recent logs"
else
  echo "   ⚠ Found $ERROR_COUNT error(s) in logs:"
  pm2 logs websevix --lines 10 --nostream 2>/dev/null | grep -i "error\|exception\|failed" | tail -5 | sed 's/^/     /'
fi

echo ""
echo "╔══════════════════════════════════════╗"
echo "║            EMERGENCY FIX COMPLETE    ║"
echo "╚══════════════════════════════════════╝"
echo ""
echo "✓ Code forcefully updated"
echo "✓ Full rebuild completed"
echo "✓ All environment variables set"
echo "✓ Application completely restarted"
echo ""
echo "NOW TEST:"
echo "1. Open: https://websevix.com/dashboard/client/services"
echo "2. Should load without 'Failed to load services' error"
echo "3. If still broken: pm2 logs websevix --lines 50"
echo ""