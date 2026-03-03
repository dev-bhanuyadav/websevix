#!/bin/bash
# ══════════════════════════════════════════════════════════════
#  Websevix — ONE-COMMAND FULL FIX
#  Fixes: CSS missing, JS 404, site not loading, broken spinner
#  Run on VPS as root: bash fixall.sh
# ══════════════════════════════════════════════════════════════
set -e
APP_DIR="/var/www/websevix"
NGINX_AVAILABLE="/etc/nginx/sites-available/websevix"
NGINX_ENABLED="/etc/nginx/sites-enabled/websevix"
REPO="https://github.com/dev-bhanuyadav/websevix.git"
BRANCH="main"

echo ""
echo "╔══════════════════════════════════════╗"
echo "║   Websevix — Full Fix + Redeploy     ║"
echo "╚══════════════════════════════════════╝"

# ── 1. Pull latest code ──────────────────────────────────────
echo ""
echo "▶ Step 1/6 — Pulling latest code..."
if [ -d "$APP_DIR/.git" ]; then
  cd "$APP_DIR"
  git fetch origin
  git reset --hard origin/$BRANCH
else
  git clone -b "$BRANCH" "$REPO" "$APP_DIR"
  cd "$APP_DIR"
fi
cd "$APP_DIR"

# ── 2. Check .env ────────────────────────────────────────────
echo "▶ Step 2/6 — Checking .env.production..."
if [ ! -f "$APP_DIR/.env.production" ]; then
  echo ""
  echo "✗ .env.production NOT FOUND at $APP_DIR/.env.production"
  echo "  Create it with all env vars and re-run this script."
  echo "  Minimum required vars:"
  echo "    MONGODB_URI=mongodb+srv://..."
  echo "    JWT_SECRET=some-long-secret"
  echo "    NEXTAUTH_SECRET=another-secret"
  echo "    NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_..."
  echo "    RAZORPAY_KEY_ID=rzp_live_..."
  echo "    RAZORPAY_KEY_SECRET=..."
  exit 1
fi
echo "  .env.production found ✓"

# ── 3. Install + Build ───────────────────────────────────────
echo "▶ Step 3/6 — Installing dependencies..."
npm ci --prefer-offline 2>/dev/null || npm install

echo "▶ Step 4/6 — Building Next.js (this takes ~2 min)..."
npm run build

# ── 4. Copy static assets ────────────────────────────────────
echo "▶ Step 4b — Copying static assets into standalone..."
rm -rf "$APP_DIR/.next/standalone/_next"
rm -rf "$APP_DIR/.next/standalone/public"
mkdir -p "$APP_DIR/.next/standalone/_next"
cp -r "$APP_DIR/.next/static"  "$APP_DIR/.next/standalone/_next/static"
cp -r "$APP_DIR/public"        "$APP_DIR/.next/standalone/public"

CSS_COUNT=$(ls "$APP_DIR/.next/standalone/_next/static/css/" 2>/dev/null | wc -l)
JS_COUNT=$(ls "$APP_DIR/.next/standalone/_next/static/chunks/" 2>/dev/null | wc -l)
echo "   CSS files:  $CSS_COUNT"
echo "   JS chunks:  $JS_COUNT"
if [ "$CSS_COUNT" -eq 0 ]; then
  echo "  ✗ NO CSS files found — build may have failed. Check output above."
  exit 1
fi

# ── 5. Copy .env into standalone ─────────────────────────────
cp "$APP_DIR/.env.production" "$APP_DIR/.next/standalone/.env.production"
echo "  .env.production copied to standalone ✓"

# ── 5. Nginx config ─────────────────────────────────────────
echo "▶ Step 5/6 — Applying Nginx config..."
cp "$APP_DIR/nginx.conf" "$NGINX_AVAILABLE"

# Enable site if not linked
if [ ! -L "$NGINX_ENABLED" ]; then
  ln -sf "$NGINX_AVAILABLE" "$NGINX_ENABLED"
  echo "  Nginx site enabled ✓"
fi

# Remove default site if it exists (it can block custom config)
if [ -L "/etc/nginx/sites-enabled/default" ]; then
  rm -f /etc/nginx/sites-enabled/default
  echo "  Removed default Nginx site ✓"
fi

nginx -t
systemctl reload nginx
echo "  Nginx reloaded ✓"

# ── 6. Restart PM2 ──────────────────────────────────────────
echo "▶ Step 6/6 — Restarting app with PM2..."
mkdir -p /var/log/websevix
pm2 delete websevix 2>/dev/null || true
pm2 start "$APP_DIR/ecosystem.config.js"
pm2 save
pm2 startup 2>/dev/null || true

# ── Final check ─────────────────────────────────────────────
sleep 3
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:3000 2>/dev/null || echo "000")
echo ""
echo "══════════════════════════════════════════"
echo "  App health check: localhost:3000 → $HTTP_CODE"
if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "304" ] || [ "$HTTP_CODE" = "308" ]; then
  echo "  ✓ App is running!"
else
  echo "  ✗ App may not be running (code: $HTTP_CODE)"
  echo "    Check logs: pm2 logs websevix --lines 50"
fi
echo ""
echo "  ✓ Full fix complete!"
echo "  Now open https://websevix.com in a new incognito window."
echo "  If CSS still missing: Ctrl+Shift+R (hard refresh)"
echo "══════════════════════════════════════════"
echo ""
