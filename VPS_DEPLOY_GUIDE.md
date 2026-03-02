# Websevix — VPS Deployment Guide
**Server**: 4 vCPU · 8 GB RAM · 70 GB NVMe · Ubuntu 22.04 (recommended)

---

## STEP 1 — VPS Login

SSH se apne VPS mein login karo:
```bash
ssh root@YOUR_VPS_IP
```

---

## STEP 2 — System Setup (sirf pehli baar)

```bash
# System update
apt update && apt upgrade -y

# Node.js 20 install (LTS)
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Node version check (20.x hona chahiye)
node -v && npm -v

# Git install
apt install -y git

# Nginx install
apt install -y nginx

# PM2 (process manager — app ko alive rakhega)
npm install -g pm2

# PM2 auto-start on server reboot
pm2 startup systemd -u root --hp /root
# (jo command output mein aaye wo run karo, usually kuch aisa hoga:)
# systemctl enable pm2-root
```

---

## STEP 3 — App Folder Setup

```bash
# Folder banao
mkdir -p /var/www/websevix
mkdir -p /var/log/websevix

# GitHub se code clone karo
git clone -b main https://github.com/dev-bhanuyadav/websevix.git /var/www/websevix

cd /var/www/websevix
```

---

## STEP 4 — Environment Variables (.env.production)

```bash
# VPS pe .env.production file banao
nano /var/www/websevix/.env.production
```

**Yeh content paste karo** (apni actual values se replace karo):

```env
MONGODB_URI=mongodb+srv://businesskaushalyadav_db_user:tlqafgEYMmHqX79e@cluster0.rw1dxit.mongodb.net/websevix?retryWrites=true&w=majority&appName=Cluster0

JWT_SECRET=Websevix_JWT_Secret_Key_32chars_min_2024!
JWT_REFRESH_SECRET=Websevix_Refresh_Secret_Key_32chars_2024!

SMTP_HOST=mail.websevix.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=login@websevix.com
SMTP_PASS=Z&HzcZ4OaN#1WfY6
SMTP_FROM=Websevix <login@websevix.com>

NEXT_PUBLIC_APP_URL=https://websevix.com
OTP_EXPIRY_MINUTES=10

PHP_MAILER_URL=https://sendotp.websevix.com/send-otp.php

ANTHROPIC_API_KEY=your_anthropic_api_key_here

RAZORPAY_KEY_ID=rzp_live_SMFNkH3n145iyH
RAZORPAY_KEY_SECRET=kfhWN8simFTTU4DnynDQgv7C
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_SMFNkH3n145iyH

PUSHER_APP_ID=your_pusher_app_id
PUSHER_KEY=your_pusher_key
PUSHER_SECRET=your_pusher_secret
PUSHER_CLUSTER=ap2
NEXT_PUBLIC_PUSHER_KEY=your_pusher_key
NEXT_PUBLIC_PUSHER_CLUSTER=ap2

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

ADMIN_EMAIL=admin@websevix.com
ADMIN_PASSWORD=Admin@Websevix2024!
ADMIN_FIRST_NAME=Super
ADMIN_LAST_NAME=Admin
ADMIN_SETUP_KEY=websevix_admin_seed_key_2024

RAZORPAY_WEBHOOK_SECRET=your_razorpay_webhook_secret
CRON_SECRET=websevix_cron_secret_2024
```

> `Ctrl+O` → Enter → `Ctrl+X` (save karke bahar aao nano se)

---

## STEP 5 — Build & Start App

```bash
cd /var/www/websevix

# Dependencies install (production only)
npm ci --omit=dev

# Build karo
npm run build

# Standalone ke liye static assets copy karo (IMPORTANT!)
cp -r .next/static  .next/standalone/.next/static
cp -r public        .next/standalone/public

# PM2 se start karo
pm2 start ecosystem.config.js

# PM2 save karo (reboot ke baad bhi chale)
pm2 save

# Status check
pm2 status
pm2 logs websevix --lines 20
```

App ab **http://YOUR_VPS_IP:3000** pe chal raha hai.

---

## STEP 6 — Nginx Setup (Domain + HTTPS)

```bash
# Nginx config copy karo
cp /var/www/websevix/nginx.conf /etc/nginx/sites-available/websevix

# Enable karo
ln -s /etc/nginx/sites-available/websevix /etc/nginx/sites-enabled/

# Default site hata do (conflict avoid)
rm -f /etc/nginx/sites-enabled/default

# Pehle SSL ke bina test karo (comment out ssl lines temporarily)
nano /etc/nginx/sites-available/websevix
# SSL wala server block temporarily hata do, sirf HTTP block rakho
# Phir:
nginx -t && systemctl reload nginx
```

---

## STEP 7 — SSL/HTTPS (Free Let's Encrypt)

> **Pehle apne domain ka A record VPS IP pe point karo** (Cloudflare/DNS panel mein)  
> `websevix.com` → YOUR_VPS_IP  
> `www.websevix.com` → YOUR_VPS_IP  
> DNS propagate hone do (5–30 min)

```bash
# Certbot install
apt install -y certbot python3-certbot-nginx

# SSL certificate lo
certbot --nginx -d websevix.com -d www.websevix.com

# Email dalo jab puche, terms agree karo
# Certbot automatically nginx config update kar dega

# Nginx reload
systemctl reload nginx

# Auto-renewal test
certbot renew --dry-run
```

Ab **https://websevix.com** pe site live hai!

---

## STEP 8 — Admin Account Create

```bash
# Ek baar run karo admin account banane ke liye
curl -X POST https://websevix.com/api/admin/setup?key=websevix_admin_seed_key_2024
```

Admin panel: **https://websevix.com/admin/login**  
Email: `admin@websevix.com`  
Password: `Admin@Websevix2024!`

---

## FUTURE UPDATES — Code Update kaise karo

Jab bhi GitHub pe new code push karo, VPS pe ye run karo:

```bash
cd /var/www/websevix

# Latest code pull karo
git pull origin main

# Dependencies update (agar package.json change hua ho)
npm ci --omit=dev

# Rebuild
npm run build

# Static assets copy
cp -r .next/static  .next/standalone/.next/static
cp -r public        .next/standalone/public

# App restart
pm2 restart websevix

# Status check
pm2 status
```

---

## Useful Commands

```bash
pm2 status                    # App status
pm2 logs websevix             # Live logs
pm2 logs websevix --lines 50  # Last 50 lines
pm2 restart websevix          # Restart app
pm2 stop websevix             # Stop app
pm2 monit                     # Live CPU/RAM monitor

nginx -t                      # Nginx config test
systemctl reload nginx        # Nginx reload
systemctl status nginx        # Nginx status

# Disk space check
df -h

# RAM/CPU check
htop
```

---

## Firewall (Security)

```bash
ufw allow ssh
ufw allow 80
ufw allow 443
ufw enable
ufw status
```

---

## Summary

| Kya | Kahan |
|-----|-------|
| App code | `/var/www/websevix` |
| App logs | `/var/log/websevix/` |
| Nginx config | `/etc/nginx/sites-available/websevix` |
| SSL certs | `/etc/letsencrypt/live/websevix.com/` |
| Process manager | PM2 (4 cluster workers = 4 vCPU) |
| App port | 3000 (Nginx proxy karta hai 80/443 se) |
