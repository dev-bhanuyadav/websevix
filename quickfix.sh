#!/bin/bash
# ══════════════════════════════════════════════════════════════
#  Websevix — Quick Fix for "Failed to load services"
#  Fixes: Missing Service model import + NEXTAUTH_SECRET
#  Run on VPS: bash quickfix.sh
# ══════════════════════════════════════════════════════════════
set -e
APP_DIR="/var/www/websevix"

echo ""
echo "╔══════════════════════════════════════╗"
echo "║   Websevix Quick Fix                 ║"
echo "╚══════════════════════════════════════╝"

cd "$APP_DIR"

# ── 1. Pull latest code (has Service model import fix) ────────
echo ""
echo "▶ 1. Pulling latest code..."
git fetch origin
git reset --hard origin/main

# ── 2. Add missing NEXTAUTH_SECRET if not present ─────────────
echo "▶ 2. Checking NEXTAUTH_SECRET..."
if ! grep -q "NEXTAUTH_SECRET=" .env.production; then
  echo "   Adding NEXTAUTH_SECRET..."
  echo "NEXTAUTH_SECRET=$(openssl rand -base64 32)" >> .env.production
else
  echo "   NEXTAUTH_SECRET already exists ✓"
fi

# ── 3. Copy .env to standalone ─────────────────────────────────
echo "▶ 3. Copying .env to standalone..."
cp .env.production .next/standalone/.env.production

# ── 4. Restart app ─────────────────────────────────────────────
echo "▶ 4. Restarting app..."
pm2 restart websevix

# ── 5. Wait and test ───────────────────────────────────────────
echo "▶ 5. Testing..."
sleep 5

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:3000/api/client/services 2>/dev/null || echo "000")
if [ "$HTTP_CODE" = "401" ]; then
  echo "   ✓ API responding correctly (401 = needs auth)"
elif [ "$HTTP_CODE" = "200" ]; then
  echo "   ✓ API responding (200)"
else
  echo "   ⚠ API response: $HTTP_CODE (check logs if issues persist)"
fi

echo ""
echo "✓ Quick fix complete!"
echo "  Now try opening /dashboard/client/services in browser"
echo "  If still issues: pm2 logs websevix --lines 20"
echo ""