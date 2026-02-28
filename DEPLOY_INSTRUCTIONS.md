# Websevix — GitHub + Vercel Deploy Instructions

## ⚠️ Important Security Note
**Aapne apna password chat mein share kiya hai. Please turant GitHub par jaake password change kar dein.**  
GitHub Git push ke liye password nahi leta — **Personal Access Token (PAT)** use karna padta hai.

---

## Step 1: Git Install karein (agar nahi hai)
- Download: https://git-scm.com/download/win
- Install karein, "Git from the command line" option enable rakhein.

---

## Step 2: GitHub par Personal Access Token (PAT) banayein
1. GitHub.com par login karein (dev-bhanuyadav)
2. **Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)**
3. **Generate new token (classic)** par click karein
4. Note: `websevix-deploy`
5. Expiration: 90 days (ya aap choose karein)
6. Scope: **repo** (full control) check karein
7. **Generate token** → token copy karke safe jagah save karein (sirf ek baar dikhega)

---

## Step 3: Project folder mein Git setup + Push

**PowerShell ya Command Prompt** kholkar project folder mein jayein:

```powershell
cd "c:\Users\Administrator\Downloads\My Projects\Websevix"
```

Phir ye commands **ek-ek karke** chalaayein:

```bash
git init
git add .
git commit -m "Initial commit: Websevix landing page"
git branch -M main
git remote add origin https://github.com/dev-bhanuyadav/websevix.git
git push -u origin main
```

**Push par jab username/password puche:**
- **Username:** `dev-bhanuyadav`
- **Password:** yahan **apna GitHub PAT paste karein** (normal password nahi chalega)

---

## Step 4: Vercel par Deploy
1. https://vercel.com par jayein → **Sign Up** / **Login** (GitHub se login karein)
2. **Add New** → **Project**
3. **Import** → `dev-bhanuyadav/websevix` repo select karein
4. Framework: **Next.js** auto-detect ho jayega
5. **Deploy** par click karein
6. 1–2 minute baad site live ho jayegi, URL milega jaise: `websevix.vercel.app`

---

## Agar repo pehle se kuch content se bhari hai
Agar aapne GitHub par `websevix` repo pehle se bana rakhi hai aur usme readme etc. hai, to pehle pull karein:

```bash
git remote add origin https://github.com/dev-bhanuyadav/websevix.git
git pull origin main --allow-unrelated-histories
# Conflicts aaye to resolve karke:
git add .
git commit -m "Merge and add Websevix landing"
git push -u origin main
```

---

## Short summary
1. Git install → PAT banao → same folder mein `git init`, `add`, `commit`, `remote add`, `push`
2. Vercel.com → Import GitHub repo `websevix` → Deploy
3. **Password change karein** kyunki aapka password ab exposed ho chuka hai.
