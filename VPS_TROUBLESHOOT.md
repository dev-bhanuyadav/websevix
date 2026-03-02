# Websevix — "Refused to connect" Fix

Jab **websevix.com refused to connect** aaye, VPS pe SSH karke ye commands **order se** chalao:

---

## 1. App chal raha hai ya nahi

```bash
pm2 status
```

- **websevix** ka status **online** hona chahiye.
- Agar **stopped** ya **errored** hai to: `pm2 logs websevix --lines 50` — last 50 lines dekh kar error check karo.

---

## 2. Port 3000 pe kuch sun raha hai

```bash
curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:3000
```

- **200** ya **304** aana chahiye (matlab app theek chal raha hai).
- **000** ya connect error = app 3000 pe nahi chal raha.

---

## 3. Nginx chal raha hai

```bash
systemctl status nginx
```

- **active (running)** hona chahiye.  
- Agar inactive hai: `systemctl start nginx`

---

## 4. Nginx config sahi hai

```bash
nginx -t
```

- **syntax is ok** aur **test is successful** aana chahiye.  
- Error aaye to: `nano /etc/nginx/sites-available/websevix` se fix karo.

---

## 5. Firewall (80, 443 open)

```bash
ufw status
```

- **80** aur **443** allow hona chahiye.  
- Agar allow nahi hai:

```bash
ufw allow 80
ufw allow 443
ufw allow ssh
ufw enable
ufw status
```

---

## 6. Full fix — App + env + Nginx (sab ek saath)

Yeh sab run karo (copy-paste):

```bash
cd /var/www/websevix

# .env standalone folder mein (Next.js yahi se load karta hai)
cp .env.production .next/standalone/.env.production

# Purana process hatao, naya start karo
pm2 delete websevix 2>/dev/null || true
pm2 start ecosystem.config.js
pm2 save

# Nginx reload
nginx -t && systemctl reload nginx

# Check
pm2 status
curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:3000
```

- `pm2 status` mein websevix **online** dikhna chahiye.  
- `curl` ka output **200** ya **304** hona chahiye.

---

## 7. Agar ab bhi "refused" ho

**Logs dekh kar error dhoondo:**

```bash
pm2 logs websevix --lines 100
```

- **MongoDB connection error** → `.env.production` mein `MONGODB_URI` sahi hai na check karo.  
- **Port already in use** → `lsof -i :3000` ya `ss -tlnp | grep 3000` — koi aur process 3000 use to nahi kar raha.  
- **EADDRNOTAVAIL / HOSTNAME** → `.env.production` mein koi galat host/port to nahi.

**Nginx error log:**

```bash
tail -50 /var/log/nginx/error.log
```

---

## 8. Ecosystem config (standalone folder se run)

`ecosystem.config.js` mein ye hona chahiye:

- `cwd: "/var/www/websevix/.next/standalone"`
- `script: "server.js"`

Agar purana config hai (script: ".next/standalone/server.js", cwd: "/var/www/websevix") to **latest code pull karo** — repo mein ab sahi config hai. Phir:

```bash
cd /var/www/websevix
git pull origin main
pm2 delete websevix
pm2 start ecosystem.config.js
pm2 save
```

---

## Short checklist

| Check              | Command                          | Expected        |
|--------------------|-----------------------------------|-----------------|
| PM2 running        | `pm2 status`                      | websevix online |
| App on 3000        | `curl -I http://127.0.0.1:3000`   | HTTP 200/304    |
| Nginx running      | `systemctl status nginx`          | active (running)|
| Nginx config       | `nginx -t`                        | test successful |
| Ports open         | `ufw status`                      | 80, 443 allow   |
| .env in standalone | `ls /var/www/websevix/.next/standalone/.env.production` | file exists |

Sab green ho to browser se **https://websevix.com** dobara try karo.
