# Build Notes

## "Attention: Next.js now collects anonymous telemetry..." — Ye ERROR nahi hai

Build ke dauran jo message aata hai:
```
Attention: Next.js now collects completely anonymous telemetry...
```
**Ye error nahi hai.** Next.js sirf bata raha hai ki wo anonymous usage data collect karta hai. Build iske baad bhi normally chalna chahiye.

### Telemetry band karna (optional)
- **Ek baar run karo:** `npx next telemetry disable`
- Ya **.env** / **.env.local** mein add karo: `NEXT_TELEMETRY_DISABLED=1`

---

## Agar build fail ho (actual error)

Agar **usse niche** koi red error dikhe (TypeScript, module not found, etc.) to:

1. **Poora error message** copy karke bhejo (last 20–30 lines).
2. Pehle ye try karo:
   ```bash
   rm -rf .next node_modules
   npm install
   npm run build
   ```
   (Windows pe `rm -rf` ki jagah `.next` aur `node_modules` manually delete karo, phir `npm install` + `npm run build`.)

---

## Build success ka matlab

Agar build **end tak** bina error chal jaye to aakhri lines aisi dikhengi:
```
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Collecting page data
✓ Generating static pages
✓ Finalizing page optimization
```
Iske baad koi error nahi aana chahiye.
# 1. System setup (sirf pehli baar)
apt update && apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && apt install -y nodejs git nginx
npm install -g pm2
pm2 startup systemd -u root --hp /root

# 2. Code clone
git clone -b main https://github.com/dev-bhanuyadav/websevix.git /var/www/websevix
cd /var/www/websevix

# 3. .env.production banao (apni values paste karo)
nano .env.production

# 4. Build karo
npm ci --omit=dev && npm run build
cp -r .next/static .next/standalone/.next/static
cp -r public .next/standalone/public

# 5. PM2 se start karo
pm2 start ecosystem.config.js && pm2 save

# 6. Nginx setup
cp nginx.conf /etc/nginx/sites-available/websevix
ln -s /etc/nginx/sites-available/websevix /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx

# 7. SSL (domain point karne ke baad)
apt install -y certbot python3-certbot-nginx
certbot --nginx -d websevix.com -d www.websevix.com