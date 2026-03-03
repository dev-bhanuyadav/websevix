# Razorpay Payment Gateway Setup

## Current Issue
**"Payment gateway is temporarily unavailable. Try again in a moment."**

This happens when Razorpay keys are missing or invalid in `.env.production` on the VPS.

---

## Quick Fix (VPS)

**Step 1 — Get Razorpay Keys:**
1. Go to https://dashboard.razorpay.com/
2. Sign up/Login
3. Go to **Settings** → **API Keys**
4. Generate **Test Keys** (for now) or **Live Keys** (for production)
5. Copy:
   - **Key ID** (starts with `rzp_test_` or `rzp_live_`)
   - **Key Secret** (long random string)

**Step 2 — Add to VPS:**
```bash
# SSH to VPS, edit .env.production
nano /var/www/websevix/.env.production
```

Add these lines (replace with your actual keys):
```env
# Razorpay Payment Gateway
RAZORPAY_KEY_ID=rzp_test_1234567890abcdef
RAZORPAY_KEY_SECRET=your_secret_key_here_very_long_string
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_1234567890abcdef
```

**Step 3 — Restart App:**
```bash
cd /var/www/websevix
cp .env.production .next/standalone/.env.production
pm2 restart websevix
```

**Step 4 — Test:**
- Go to Services page
- Click "Pay ₹X for first month"
- Should open Razorpay popup (test mode) or show mock payment success

---

## Test vs Live Keys

### Test Mode (Safe for Development)
- **Key ID:** `rzp_test_...`
- **Key Secret:** Test secret
- **Payments:** Fake/simulated (no real money)
- **Cards:** Use test cards from Razorpay docs

### Live Mode (Real Payments)
- **Key ID:** `rzp_live_...`
- **Key Secret:** Live secret  
- **Payments:** Real money transactions
- **Setup:** Requires business verification on Razorpay

---

## Without Keys (Mock Mode)

If no keys are set, the app automatically uses **mock mode**:
- Payments show "mock" in console
- No Razorpay popup opens
- Services get activated immediately
- No real payment processing

This is fine for testing, but users won't see the real payment flow.

---

## Troubleshooting

### "Invalid Razorpay keys"
- Key format is wrong (should start with `rzp_test_` or `rzp_live_`)
- Secret doesn't match the Key ID
- Keys are from different Razorpay accounts

### "Payment gateway connection issue"
- Network/firewall blocking Razorpay API
- Razorpay servers temporarily down
- VPS can't reach external APIs

### Still getting "temporarily unavailable"
```bash
# Check if keys are loaded
cd /var/www/websevix
pm2 logs websevix --lines 50
# Look for "[payment/create] Razorpay error:" messages
```

---

## Production Checklist

- [ ] Razorpay account created & verified
- [ ] Live keys generated (after business verification)
- [ ] Keys added to `.env.production` on VPS
- [ ] Keys copied to `.next/standalone/.env.production`
- [ ] App restarted with `pm2 restart websevix`
- [ ] Test payment with real card (small amount)
- [ ] Webhook setup (for payment confirmations)

For now, **test keys** are enough to fix the "temporarily unavailable" error.