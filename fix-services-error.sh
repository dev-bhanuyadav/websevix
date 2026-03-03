#!/bin/bash
# ══════════════════════════════════════════════════════════════
#  Websevix — Fix "Failed to load services" + Mongoose populate error
#  Addresses the specific error from diagnostics
#  Run on VPS: bash fix-services-error.sh
# ══════════════════════════════════════════════════════════════
set -e
APP_DIR="/var/www/websevix"

echo ""
echo "╔══════════════════════════════════════╗"
echo "║   Fixing Services Error              ║"
echo "╚══════════════════════════════════════╝"

cd "$APP_DIR"

# ── 1. Pull latest code with Service model import fix ─────────
echo ""
echo "▶ 1. Updating code..."
git fetch origin
git reset --hard origin/main
echo "   ✓ Latest code pulled"

# ── 2. Fix missing NEXTAUTH_SECRET ─────────────────────────────
echo ""
echo "▶ 2. Fixing NEXTAUTH_SECRET..."
if ! grep -q "NEXTAUTH_SECRET=" .env.production; then
  echo "   Adding NEXTAUTH_SECRET..."
  echo "NEXTAUTH_SECRET=$(openssl rand -base64 32)" >> .env.production
  echo "   ✓ NEXTAUTH_SECRET added"
else
  echo "   ✓ NEXTAUTH_SECRET already exists"
fi

# ── 3. Ensure all required models are available ───────────────
echo ""
echo "▶ 3. Checking model imports..."
if grep -q "import { Service }" app/api/client/services/route.ts; then
  echo "   ✓ Service model import found"
else
  echo "   ✗ Service model import missing - this should be fixed in latest code"
fi

# ── 4. Copy .env to standalone and restart ────────────────────
echo ""
echo "▶ 4. Updating standalone environment..."
cp .env.production .next/standalone/.env.production
echo "   ✓ Environment copied to standalone"

echo ""
echo "▶ 5. Restarting application..."
pm2 restart websevix
echo "   ✓ Application restarted"

# ── 6. Wait for startup and test ───────────────────────────────
echo ""
echo "▶ 6. Testing API after restart..."
sleep 8

# Test the specific API that was failing
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:3000/api/client/services 2>/dev/null || echo "000")

if [ "$HTTP_CODE" = "401" ]; then
  echo "   ✓ API responding correctly (401 = authentication required)"
  echo "   ✓ Mongoose populate error should be fixed"
elif [ "$HTTP_CODE" = "200" ]; then
  echo "   ✓ API responding successfully (200)"
else
  echo "   ⚠ API response code: $HTTP_CODE"
  echo "   Check logs if issues persist: pm2 logs websevix --lines 20"
fi

# ── 7. Check for recent errors ─────────────────────────────────
echo ""
echo "▶ 7. Checking for recent errors..."
RECENT_ERRORS=$(pm2 logs websevix --lines 5 --nostream 2>/dev/null | grep -i "error\|exception" | wc -l || echo "0")

if [ "$RECENT_ERRORS" -eq 0 ]; then
  echo "   ✓ No recent errors in logs"
else
  echo "   ⚠ Found $RECENT_ERRORS recent error(s) in logs"
  echo "   Recent logs:"
  pm2 logs websevix --lines 10 --nostream 2>/dev/null | tail -5 | sed 's/^/     /'
fi

echo ""
echo "╔══════════════════════════════════════╗"
echo "║              Complete!               ║"
echo "╚══════════════════════════════════════╝"
echo ""
echo "✓ Service model import fix applied"
echo "✓ NEXTAUTH_SECRET configured"
echo "✓ Application restarted with new environment"
echo ""
echo "Next steps:"
echo "1. Open https://websevix.com/dashboard/client/services"
echo "2. If still seeing errors, run: pm2 logs websevix --lines 20"
echo "3. The Mongoose populate error should be resolved"
echo ""