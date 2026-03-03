#!/bin/bash
# ══════════════════════════════════════════════════════════════
#  Fix Payment Gateway "temporarily unavailable" error
#  Adds Razorpay test keys or enables mock mode
# ══════════════════════════════════════════════════════════════
set -e
APP_DIR="/var/www/websevix"

echo ""
echo "╔══════════════════════════════════════╗"
echo "║      Payment Gateway Fix             ║"
echo "╚══════════════════════════════════════╝"

cd "$APP_DIR"

echo ""
echo "Choose payment gateway setup:"
echo "1) Add Razorpay TEST keys (safe for testing)"
echo "2) Use MOCK mode (no real payments, instant success)"
echo "3) Add your own Razorpay keys manually"
echo ""
read -p "Enter choice (1-3): " choice

case $choice in
  1)
    echo ""
    echo "▶ Setting up Razorpay TEST mode..."
    echo ""
    echo "You need to get TEST keys from https://dashboard.razorpay.com/"
    echo "1. Sign up/Login to Razorpay Dashboard"
    echo "2. Go to Settings → API Keys"
    echo "3. Generate Test Keys (they start with rzp_test_)"
    echo ""
    read -p "Enter your Razorpay TEST Key ID (rzp_test_...): " rzp_key_id
    read -p "Enter your Razorpay TEST Key Secret: " rzp_key_secret
    
    if [[ $rzp_key_id == rzp_test_* ]]; then
      # Remove existing Razorpay keys if present
      sed -i '/RAZORPAY_KEY_ID=/d' .env.production 2>/dev/null || true
      sed -i '/RAZORPAY_KEY_SECRET=/d' .env.production 2>/dev/null || true
      sed -i '/NEXT_PUBLIC_RAZORPAY_KEY_ID=/d' .env.production 2>/dev/null || true
      
      # Add new keys
      echo "RAZORPAY_KEY_ID=$rzp_key_id" >> .env.production
      echo "RAZORPAY_KEY_SECRET=$rzp_key_secret" >> .env.production
      echo "NEXT_PUBLIC_RAZORPAY_KEY_ID=$rzp_key_id" >> .env.production
      
      echo "   ✓ Razorpay TEST keys added"
    else
      echo "   ✗ Invalid key format. Test keys should start with 'rzp_test_'"
      exit 1
    fi
    ;;
    
  2)
    echo ""
    echo "▶ Setting up MOCK mode..."
    # Remove Razorpay keys to enable mock mode
    sed -i '/RAZORPAY_KEY_ID=/d' .env.production 2>/dev/null || true
    sed -i '/RAZORPAY_KEY_SECRET=/d' .env.production 2>/dev/null || true
    sed -i '/NEXT_PUBLIC_RAZORPAY_KEY_ID=/d' .env.production 2>/dev/null || true
    
    echo "   ✓ Mock mode enabled (no Razorpay keys = automatic mock)"
    echo "   ℹ Payments will show 'mock' and succeed instantly"
    ;;
    
  3)
    echo ""
    echo "▶ Manual setup..."
    echo "Edit the .env.production file manually:"
    echo "nano $APP_DIR/.env.production"
    echo ""
    echo "Add these lines:"
    echo "RAZORPAY_KEY_ID=your_key_here"
    echo "RAZORPAY_KEY_SECRET=your_secret_here"
    echo "NEXT_PUBLIC_RAZORPAY_KEY_ID=your_key_here"
    echo ""
    read -p "Press Enter when done..."
    ;;
    
  *)
    echo "Invalid choice. Exiting."
    exit 1
    ;;
esac

# Copy updated .env to standalone
echo ""
echo "▶ Updating environment..."
cp .env.production .next/standalone/.env.production
echo "   ✓ Environment copied to standalone"

# Restart app
echo ""
echo "▶ Restarting application..."
pm2 restart websevix
echo "   ✓ Application restarted"

# Test payment API
echo ""
echo "▶ Testing payment gateway..."
sleep 5

# Test the payment creation endpoint
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:3000/api/payment/create 2>/dev/null || echo "000")

if [ "$HTTP_CODE" = "401" ]; then
  echo "   ✓ Payment API responding (401 = needs auth, which is correct)"
elif [ "$HTTP_CODE" = "200" ]; then
  echo "   ✓ Payment API responding (200)"
else
  echo "   ⚠ Payment API response: $HTTP_CODE"
fi

echo ""
echo "╔══════════════════════════════════════╗"
echo "║         Payment Fix Complete         ║"
echo "╚══════════════════════════════════════╝"
echo ""

if [ "$choice" = "1" ]; then
  echo "✓ Razorpay TEST mode configured"
  echo "  - Use test cards from Razorpay docs"
  echo "  - No real money will be charged"
  echo "  - Payments will show Razorpay popup"
elif [ "$choice" = "2" ]; then
  echo "✓ MOCK mode enabled"
  echo "  - No Razorpay popup will appear"
  echo "  - Payments succeed instantly"
  echo "  - Services get activated immediately"
fi

echo ""
echo "NOW TEST:"
echo "1. Go to: https://websevix.com/dashboard/client/services"
echo "2. Click 'Pay ₹X for first month' on any service"
echo "3. Should NOT show 'Payment gateway temporarily unavailable'"
echo ""

if [ "$choice" = "1" ]; then
  echo "Expected: Razorpay popup opens with test payment form"
elif [ "$choice" = "2" ]; then
  echo "Expected: Payment succeeds immediately (mock mode)"
fi

echo ""