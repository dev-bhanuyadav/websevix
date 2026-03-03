#!/bin/bash
# ══════════════════════════════════════════════════════════════
#  Websevix — Quick Diagnostics
#  Run on VPS to check common "Failed to load services" issues
#  Usage: bash diagnose.sh
# ══════════════════════════════════════════════════════════════

APP_DIR="/var/www/websevix"
echo ""
echo "╔══════════════════════════════════════╗"
echo "║      Websevix Diagnostics            ║"
echo "╚══════════════════════════════════════╝"

# ── 1. App Status ──────────────────────────────────────────────
echo ""
echo "▶ 1. PM2 App Status"
PM2_STATUS=$(pm2 jlist 2>/dev/null | jq -r '.[] | select(.name=="websevix") | .pm2_env.status' 2>/dev/null || echo "not_found")
if [ "$PM2_STATUS" = "online" ]; then
  echo "  ✓ App is running (PM2 status: online)"
else
  echo "  ✗ App not running (PM2 status: $PM2_STATUS)"
  echo "    Fix: pm2 start ecosystem.config.js"
fi

# ── 2. Port 3000 Check ─────────────────────────────────────────
echo ""
echo "▶ 2. App Responding on Port 3000"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:3000 2>/dev/null || echo "000")
if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "304" ] || [ "$HTTP_CODE" = "308" ]; then
  echo "  ✓ App responding (HTTP $HTTP_CODE)"
else
  echo "  ✗ App not responding (HTTP $HTTP_CODE)"
  echo "    Check: pm2 logs websevix --lines 20"
fi

# ── 3. Environment Files ───────────────────────────────────────
echo ""
echo "▶ 3. Environment Configuration"
if [ -f "$APP_DIR/.env.production" ]; then
  echo "  ✓ .env.production exists"
  
  # Check key vars without showing values
  MONGODB_SET=$(grep -q "MONGODB_URI=" "$APP_DIR/.env.production" && echo "✓" || echo "✗")
  JWT_SET=$(grep -q "JWT_SECRET=" "$APP_DIR/.env.production" && echo "✓" || echo "✗")
  NEXTAUTH_SET=$(grep -q "NEXTAUTH_SECRET=" "$APP_DIR/.env.production" && echo "✓" || echo "✗")
  
  echo "    MONGODB_URI: $MONGODB_SET"
  echo "    JWT_SECRET: $JWT_SET"
  echo "    NEXTAUTH_SECRET: $NEXTAUTH_SET"
else
  echo "  ✗ .env.production missing"
  echo "    Create: nano $APP_DIR/.env.production"
fi

if [ -f "$APP_DIR/.next/standalone/.env.production" ]; then
  echo "  ✓ .env.production copied to standalone"
else
  echo "  ✗ .env.production not in standalone folder"
  echo "    Fix: cp $APP_DIR/.env.production $APP_DIR/.next/standalone/.env.production"
fi

# ── 4. Database Connection ─────────────────────────────────────
echo ""
echo "▶ 4. Database Connection Test"
if [ -f "$APP_DIR/.env.production" ]; then
  MONGODB_URI=$(grep "MONGODB_URI=" "$APP_DIR/.env.production" | cut -d'=' -f2- | tr -d '"' | tr -d "'")
  if [ -n "$MONGODB_URI" ]; then
    # Simple connection test (requires mongosh or mongo client)
    if command -v mongosh >/dev/null 2>&1; then
      if timeout 10s mongosh "$MONGODB_URI" --eval "db.runCommand('ping')" >/dev/null 2>&1; then
        echo "  ✓ MongoDB connection successful"
      else
        echo "  ✗ MongoDB connection failed"
        echo "    Check: MONGODB_URI in .env.production"
      fi
    else
      echo "  ? MongoDB connection test skipped (mongosh not installed)"
      echo "    Manual test: Check VPS can reach your MongoDB cluster"
    fi
  else
    echo "  ✗ MONGODB_URI not set in .env.production"
  fi
else
  echo "  ✗ Cannot test - .env.production missing"
fi

# ── 5. API Test ────────────────────────────────────────────────
echo ""
echo "▶ 5. Services API Test (without auth)"
API_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:3000/api/client/services 2>/dev/null || echo "000")
if [ "$API_CODE" = "401" ]; then
  echo "  ✓ API responding (401 = needs auth, which is correct)"
elif [ "$API_CODE" = "200" ]; then
  echo "  ✓ API responding (200 = working)"
else
  echo "  ✗ API not responding correctly (HTTP $API_CODE)"
  echo "    Check: pm2 logs websevix --lines 50"
fi

# ── 6. Recent Logs ─────────────────────────────────────────────
echo ""
echo "▶ 6. Recent Error Logs"
if pm2 list | grep -q websevix; then
  echo "  Last 10 lines from PM2 logs:"
  pm2 logs websevix --lines 10 --nostream 2>/dev/null | tail -10 | sed 's/^/    /'
else
  echo "  ✗ No PM2 process named 'websevix' found"
fi

# ── Summary ────────────────────────────────────────────────────
echo ""
echo "╔══════════════════════════════════════╗"
echo "║              Summary                 ║"
echo "╚══════════════════════════════════════╝"
echo ""
echo "Common fixes for 'Failed to load services':"
echo ""
echo "1. App not running:"
echo "   pm2 start $APP_DIR/ecosystem.config.js"
echo ""
echo "2. Missing .env in standalone:"
echo "   cp $APP_DIR/.env.production $APP_DIR/.next/standalone/.env.production"
echo "   pm2 restart websevix"
echo ""
echo "3. MongoDB connection issues:"
echo "   - Check MONGODB_URI in .env.production"
echo "   - Ensure VPS can reach MongoDB (firewall, network)"
echo "   - Verify MongoDB cluster is running"
echo ""
echo "4. Full redeploy:"
echo "   cd $APP_DIR && bash deploy.sh"
echo ""