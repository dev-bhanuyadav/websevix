#!/bin/bash
# Quick enable mock payments (no Razorpay keys needed)
cd /var/www/websevix
sed -i '/RAZORPAY_KEY_ID=/d' .env.production 2>/dev/null || true
sed -i '/RAZORPAY_KEY_SECRET=/d' .env.production 2>/dev/null || true  
sed -i '/NEXT_PUBLIC_RAZORPAY_KEY_ID=/d' .env.production 2>/dev/null || true
cp .env.production .next/standalone/.env.production
pm2 restart websevix
echo "✓ Mock payments enabled - no 'temporarily unavailable' errors"