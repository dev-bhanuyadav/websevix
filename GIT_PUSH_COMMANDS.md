# Git pe push karne ki commands

Project folder kholo (PowerShell ya CMD), phir ye commands **order se** chalao:

---

## Pehli baar (repo abhi empty hai)

```bash
cd "c:\Users\Administrator\Downloads\My Projects\Websevix"

git init
git add .
git commit -m "Initial commit: Websevix landing page"
git branch -M main
git remote add origin https://github.com/dev-bhanuyadav/websevix.git
git push -u origin main
```

**Jab Username/Password puche:**
- Username: `dev-bhanuyadav`
- Password: **apna GitHub Personal Access Token** (account password nahi)

---

## Agar repo pehle se bhari hai (README etc.)

Pehle remote add karo, phir pull, phir push:

```bash
cd "c:\Users\Administrator\Downloads\My Projects\Websevix"

git init
git add .
git commit -m "Initial commit: Websevix landing page"
git branch -M main
git remote add origin https://github.com/dev-bhanuyadav/websevix.git
git pull origin main --allow-unrelated-histories
git push -u origin main
```

Conflict aaye to resolve karke phir:
```bash
git add .
git commit -m "Merge with remote"
git push -u origin main
```

---

## Baad mein (jab kuch change karo)

```bash
cd "c:\Users\Administrator\Downloads\My Projects\Websevix"

git add .
git commit -m "Jo change kiya short mein likho"
git push
```

---

## One-liner (copy-paste — pehli baar ke liye)

```bash
cd "c:\Users\Administrator\Downloads\My Projects\Websevix" && git init && git add . && git commit -m "Initial commit: Websevix" && git branch -M main && git remote add origin https://github.com/dev-bhanuyadav/websevix.git && git push -u origin main
```

Push par username + **token** daalna padega.
