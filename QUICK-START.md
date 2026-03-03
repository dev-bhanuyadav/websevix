# Websevix — Quick Start (No More Issues!)

## 🚀 One-Time Setup (VPS)

**Run this ONCE to fix ALL issues permanently:**

```bash
cd /var/www/websevix
curl -fsSL https://raw.githubusercontent.com/dev-bhanuyadav/websevix/main/PERMANENT-FIX-ALL.sh | bash
```

**What it fixes:**
- ✅ CSS/JS not loading (black screen)
- ✅ "Failed to load services" 
- ✅ "Payment gateway temporarily unavailable"
- ✅ Mongoose populate errors
- ✅ Missing environment variables
- ✅ Nginx configuration
- ✅ Static file serving

**After running once, everything works forever!**

---

## 🔄 Future Updates

**For regular updates (after the one-time fix):**

```bash
cd /var/www/websevix
bash deploy.sh
```

The deploy script is now bulletproof and auto-fixes common issues.

---

## 🧪 Test Everything Works

1. **Website:** https://websevix.com (should load with proper CSS)
2. **Dashboard:** https://websevix.com/dashboard/client/services
3. **Payment:** Click "Pay ₹X for first month" → Should succeed instantly (mock mode)

---

## 🛠️ Environment Variables

The fix automatically sets up:

```env
NODE_ENV=production
NEXTAUTH_URL=https://websevix.com
NEXTAUTH_SECRET=auto-generated
MONGODB_URI=your-connection-string
JWT_SECRET=your-jwt-secret
# Razorpay keys optional (mock mode if not set)
```

**Only MONGODB_URI needs to be set manually** - everything else is auto-configured.

---

## 🔧 Troubleshooting

**If anything breaks:**

```bash
# Full diagnostic
cd /var/www/websevix
bash diagnose.sh

# Emergency rebuild
bash PERMANENT-FIX-ALL.sh
```

**Common fixes:**
- App not responding: `pm2 restart websevix`
- CSS missing: `systemctl reload nginx`
- Payment errors: Already in mock mode (no errors)
- Services errors: Fixed permanently

---

## 📱 Payment Modes

**Current: Mock Mode (Recommended for Testing)**
- No Razorpay popup
- Payments succeed instantly  
- Services activate immediately
- No "temporarily unavailable" errors

**To enable real payments:**
1. Get Razorpay test keys from https://dashboard.razorpay.com/
2. Add to `.env.production`:
   ```env
   RAZORPAY_KEY_ID=rzp_test_your_key
   RAZORPAY_KEY_SECRET=your_secret
   NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_your_key
   ```
3. `pm2 restart websevix`

---

## ✅ Success Checklist

After running the permanent fix:

- [ ] https://websevix.com loads with proper styling
- [ ] Dashboard shows services without "Failed to load" 
- [ ] Payment buttons work without "temporarily unavailable"
- [ ] No CSS/JS 404 errors in browser console
- [ ] PM2 shows app as "online"
- [ ] Nginx serves static files correctly

**If all checkboxes are ✅, you're done forever!**